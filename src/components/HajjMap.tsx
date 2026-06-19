import { useEffect, useMemo, useRef } from "react";
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { locations, type HajjDay, type LocationId } from "@/data/hajj";
import { computeSitePositions, ROUTE_ORDER } from "@/lib/map-projection";
import { usePrefersReducedMotion } from "@/hooks/use-theme";
import { SiteDetailMap } from "@/components/SiteDetailMap";

const MAP_LAYOUT = computeSitePositions();
const { positions: SITE_POS, segments: ROUTE_SEGMENTS, viewW: VIEW_W, viewH: VIEW_H } = MAP_LAYOUT;

interface HajjMapProps {
  day: HajjDay;
  activeSite: LocationId | null;
  onSelectSite: (id: LocationId | null) => void;
}

export function HajjMap({ day, activeSite, onSelectSite }: HajjMapProps) {
  if (activeSite) {
    return <SiteDetailMap siteId={activeSite} onBack={() => onSelectSite(null)} />;
  }
  return <OverviewRouteMap day={day} onSelectSite={onSelectSite} />;
}

function OverviewRouteMap({
  day,
  onSelectSite,
}: {
  day: HajjDay;
  onSelectSite: (id: LocationId) => void;
}) {
  const ref = useRef<ReactZoomPanPinchRef | null>(null);
  const reduced = usePrefersReducedMotion();

  const focusSite = day.camera.primary;

  useEffect(() => {
    if (!ref.current) return;
    const p = SITE_POS[focusSite];
    const targetScale = 1.55;
    const containerEl = (ref.current.instance as { wrapperComponent?: HTMLElement }).wrapperComponent;
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const sx = rect.width / VIEW_W;
    const sy = rect.height / VIEW_H;
    const baseScale = Math.min(sx, sy);
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

  const routeD = useMemo(() => {
    const pts = day.camera.focus.map((id) => SITE_POS[id]);
    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [day.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const baseRouteD = ROUTE_ORDER.map((id, i) => {
    const p = SITE_POS[id];
    return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }).join(" ");

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

            <g opacity="0.35" fill="none" stroke="var(--color-muted-foreground)" strokeWidth="1">
              <path d="M0 420 Q 200 360 420 410 T 1000 380" />
              <path d="M0 470 Q 250 420 500 460 T 1000 440" />
              <path d="M0 520 Q 300 480 600 510 T 1000 500" />
            </g>

            <path
              d={baseRouteD}
              fill="none"
              stroke="var(--color-muted-foreground)"
              strokeWidth="1.5"
              strokeDasharray="2 8"
              strokeLinecap="round"
              opacity="0.55"
            />

            {ROUTE_SEGMENTS.map((seg) => (
              <g
                key={`${seg.from}-${seg.to}`}
                transform={`translate(${seg.midX} ${seg.midY}) rotate(${seg.angleDeg})`}
              >
                <rect
                  x={-22}
                  y={-10}
                  width={44}
                  height={18}
                  rx={9}
                  fill="var(--color-card)"
                  stroke="var(--color-border)"
                  opacity={0.92}
                />
                <text
                  textAnchor="middle"
                  y={4}
                  fontSize={10}
                  fontWeight={600}
                  letterSpacing="0.06em"
                  fill="var(--color-muted-foreground)"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {seg.label}
                </text>
              </g>
            ))}

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

            {/* North-up compass (projection uses geographic north = screen up) */}
            <g transform="translate(56 56)" aria-hidden="true">
              <circle r={18} fill="var(--color-card)" stroke="var(--color-border)" opacity={0.95} />
              <path d="M0 -11 L4 4 L0 1 L-4 4 Z" fill="var(--color-primary)" />
              <text y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--color-muted-foreground)">
                N
              </text>
            </g>

            {ROUTE_ORDER.map((id) => {
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
                  {(isActive || inFocus) && (
                    <circle r={isActive ? 46 : 30} fill="url(#siteGlow)" filter="url(#soft)" />
                  )}
                  <circle
                    r={isActive ? 16 : 12}
                    fill="var(--color-card)"
                    stroke={isActive ? "var(--color-gold)" : "var(--color-primary)"}
                    strokeWidth={isActive ? 3 : 2}
                  />
                  <circle r={isActive ? 6 : 5} fill={isActive ? "var(--color-gold)" : "var(--color-primary)"} />
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

      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 text-xs text-muted-foreground">
        <span>Distances approximate · tap a site for landmarks & camp pin</span>
        <span className="hidden font-arabic text-base sm:inline">{locations[focusSite].arabicName}</span>
      </div>
    </div>
  );
}
