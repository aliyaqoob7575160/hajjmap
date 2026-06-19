import { useEffect, useMemo, useRef } from "react";
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { locations, type HajjDay, type LocationId } from "@/data/hajj";
import { usePrefersReducedMotion } from "@/hooks/use-theme";

const SITE_POS: Record<LocationId, { x: number; y: number }> = {
  haram: { x: 150, y: 135 },
  mina: { x: 445, y: 178 },
  muzdalifah: { x: 655, y: 325 },
  arafat: { x: 860, y: 472 },
};

const VIEW_W = 1000;
const VIEW_H = 600;

interface HajjMapProps {
  day: HajjDay;
  activeSite: LocationId | null;
  onSelectSite: (id: LocationId) => void;
}

export function HajjMap({ day, activeSite, onSelectSite }: HajjMapProps) {
  const ref = useRef<ReactZoomPanPinchRef | null>(null);
  const reduced = usePrefersReducedMotion();

  const focusSite = activeSite ?? day.camera.primary;

  // Animate camera to focus site
  useEffect(() => {
    if (!ref.current) return;
    const p = SITE_POS[focusSite];
    const targetScale = 1.55;
    // center of svg in displayed wrapper coordinates is approximate; use setTransform
    // wrapper sized to width 100%; we estimate by using percentage center
    const containerEl = (ref.current.instance as any)?.wrapperComponent as HTMLElement | undefined;
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const sx = rect.width / VIEW_W;
    const sy = rect.height / VIEW_H;
    const baseScale = Math.min(sx, sy);
    // svg is preserveAspectRatio meet centered; compute the rendered offset
    const renderedW = VIEW_W * baseScale;
    const renderedH = VIEW_H * baseScale;
    const offX = (rect.width - renderedW) / 2;
    const offY = (rect.height - renderedH) / 2;
    const pxX = offX + p.x * baseScale;
    const pxY = offY + p.y * baseScale;
    const positionX = rect.width / 2 - pxX * targetScale;
    const positionY = rect.height / 2 - pxY * targetScale;
    ref.current.setTransform(positionX, positionY, targetScale, reduced ? 0 : 600, "easeOut");
  }, [focusSite, reduced]);

  // Build the highlighted route through day's focus sites
  const routeD = useMemo(() => {
    const pts = day.camera.focus.map((id) => SITE_POS[id]);
    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [day.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
      <div className="arabesque-bg pointer-events-none absolute inset-0" />

      <TransformWrapper
        ref={ref}
        initialScale={1}
        minScale={0.8}
        maxScale={3.5}
        centerOnInit
        wheel={{ step: 0.12 }}
        doubleClick={{ step: 0.7 }}
        smooth
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full select-none"
          >
            <defs>
              <radialGradient id="terrain" cx="50%" cy="40%" r="75%">
                <stop offset="0%" stopColor="var(--color-card)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </radialGradient>
              <radialGradient id="siteGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
              </radialGradient>
              <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            <rect width={VIEW_W} height={VIEW_H} fill="url(#terrain)" />

            {/* Stylised terrain dunes */}
            <g opacity="0.35" fill="none" stroke="var(--color-muted-foreground)" strokeWidth="1">
              <path d="M0 420 Q 200 360 420 410 T 1000 380" />
              <path d="M0 470 Q 250 420 500 460 T 1000 440" />
              <path d="M0 520 Q 300 480 600 510 T 1000 500" />
            </g>

            {/* Faint base dotted path linking all sites */}
            <path
              d={`M ${SITE_POS.haram.x} ${SITE_POS.haram.y} L ${SITE_POS.mina.x} ${SITE_POS.mina.y} L ${SITE_POS.muzdalifah.x} ${SITE_POS.muzdalifah.y} L ${SITE_POS.arafat.x} ${SITE_POS.arafat.y}`}
              fill="none"
              stroke="var(--color-muted-foreground)"
              strokeWidth="1.5"
              strokeDasharray="2 8"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* Animated highlighted route for the active day */}
            <AnimatePresence mode="wait">
              {routeD && (
                <motion.path
                  key={day.id}
                  d={routeD}
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity: 1 }}
                  animate={reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0.3 : 1.1, ease: "easeInOut" }}
                  style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--color-gold) 55%, transparent))" }}
                />
              )}
            </AnimatePresence>

            {/* Sites */}
            {(Object.keys(SITE_POS) as LocationId[]).map((id) => {
              const p = SITE_POS[id];
              const loc = locations[id];
              const isActive = id === focusSite;
              const inFocus = day.camera.focus.includes(id);
              return (
                <g
                  key={id}
                  transform={`translate(${p.x} ${p.y})`}
                  className="cursor-pointer"
                  onClick={() => onSelectSite(id)}
                >
                  {/* glow */}
                  {(isActive || inFocus) && (
                    <circle r={isActive ? 46 : 30} fill="url(#siteGlow)" filter="url(#soft)" />
                  )}
                  {/* outer ring */}
                  <circle
                    r={isActive ? 16 : 12}
                    fill="var(--color-card)"
                    stroke={isActive ? "var(--color-gold)" : "var(--color-primary)"}
                    strokeWidth={isActive ? 3 : 2}
                  />
                  {/* inner dot */}
                  <circle r={isActive ? 6 : 5} fill={isActive ? "var(--color-gold)" : "var(--color-primary)"} />
                  {/* labels */}
                  <g transform="translate(0 -26)">
                    <rect
                      x={-loc.name.length * 4.2 - 10}
                      y={-16}
                      rx={9}
                      width={loc.name.length * 8.4 + 20}
                      height={22}
                      fill="var(--color-card)"
                      stroke="var(--color-border)"
                    />
                    <text
                      textAnchor="middle"
                      y={0}
                      fontSize={13}
                      fontWeight={600}
                      fill="var(--color-foreground)"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {loc.name}
                    </text>
                  </g>
                  <text
                    textAnchor="middle"
                    y={42}
                    fontSize={18}
                    fill="var(--color-muted-foreground)"
                    style={{ fontFamily: "var(--font-arabic)" }}
                  >
                    {loc.arabicName}
                  </text>
                </g>
              );
            })}
          </svg>
        </TransformComponent>
      </TransformWrapper>

      {/* Caption overlay */}
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 text-xs text-muted-foreground">
        <span>Tap a site to focus · pinch or scroll to zoom</span>
        <span className="hidden font-arabic text-base sm:inline">{locations[focusSite].arabicName}</span>
      </div>
    </div>
  );
}
