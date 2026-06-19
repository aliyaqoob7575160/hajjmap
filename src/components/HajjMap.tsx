import { useEffect, useMemo, useRef, useState } from "react";
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Navigation } from "lucide-react";
import { locations, type HajjDay, type LocationId } from "@/data/hajj";
import { getSiteDetail } from "@/data/site-details";
import {
  computeSitePositions,
  formatDistanceKm,
  getSiteOverviewZone,
  getSiteZoomBounds,
  haversineKm,
  ROUTE_ORDER,
  type MapBounds,
} from "@/lib/map-projection";
import { usePrefersReducedMotion } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { openMapsNavigation } from "@/lib/geo";

const MAP_LAYOUT = computeSitePositions();
const {
  positions: SITE_POS,
  segments: ROUTE_SEGMENTS,
  viewW: VIEW_W,
  viewH: VIEW_H,
  project,
  projectCoords,
} = MAP_LAYOUT;

interface HajjMapProps {
  day: HajjDay;
  activeSite: LocationId | null;
  onSelectSite: (id: LocationId | null) => void;
}

function zoomToPoint(
  ref: ReactZoomPanPinchRef,
  cx: number,
  cy: number,
  targetScale: number,
  reduced: boolean,
  duration = 600,
) {
  const containerEl = (ref.instance as { wrapperComponent?: HTMLElement }).wrapperComponent;
  if (!containerEl) return;
  const rect = containerEl.getBoundingClientRect();
  const sx = rect.width / VIEW_W;
  const sy = rect.height / VIEW_H;
  const baseScale = Math.min(sx, sy);
  const renderedW = VIEW_W * baseScale;
  const renderedH = VIEW_H * baseScale;
  const offX = (rect.width - renderedW) / 2;
  const offY = (rect.height - renderedH) / 2;
  const pxX = offX + cx * baseScale;
  const pxY = offY + cy * baseScale;
  const positionX = rect.width / 2 - pxX * targetScale;
  const positionY = rect.height / 2 - pxY * targetScale;
  ref.setTransform(positionX, positionY, targetScale, reduced ? 0 : duration, "easeOut");
}

function zoomToBounds(
  ref: ReactZoomPanPinchRef,
  bounds: MapBounds,
  reduced: boolean,
  maxScale = 12,
) {
  const containerEl = (ref.instance as { wrapperComponent?: HTMLElement }).wrapperComponent;
  if (!containerEl) return;
  const rect = containerEl.getBoundingClientRect();
  const sx = rect.width / VIEW_W;
  const sy = rect.height / VIEW_H;
  const baseScale = Math.min(sx, sy);
  const scaleX = rect.width / (bounds.width * baseScale);
  const scaleY = rect.height / (bounds.height * baseScale);
  const targetScale = Math.min(scaleX, scaleY, maxScale) * 0.95;
  zoomToPoint(ref, bounds.cx, bounds.cy, targetScale, reduced, 700);
}


export function HajjMap({ day, activeSite, onSelectSite }: HajjMapProps) {
  const ref = useRef<ReactZoomPanPinchRef | null>(null);
  const reduced = usePrefersReducedMotion();
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);

  const focusSite = day.camera.primary;
  const zoomedDetail = activeSite ? getSiteDetail(activeSite) : null;

  useEffect(() => {
    setSelectedLandmark(null);
  }, [activeSite]);

  // Smooth zoom: landmark → tight zoom; site detail → fit bounds; overview → day focus
  useEffect(() => {
    if (!ref.current) return;
    if (activeSite && selectedLandmark && zoomedDetail) {
      const lm = zoomedDetail.landmarks.find((l) => l.id === selectedLandmark);
      if (lm) {
        const p = projectCoords(lm.coords);
        zoomToPoint(ref.current, p.x, p.y, 11, reduced, 600);
        return;
      }
    }
    if (activeSite) {
      const bounds = getSiteZoomBounds(activeSite, project);
      zoomToBounds(ref.current, bounds, reduced);
      return;
    }
    const p = SITE_POS[focusSite];
    zoomToPoint(ref.current, p.x, p.y, 1.55, reduced);
  }, [activeSite, focusSite, reduced, selectedLandmark, zoomedDetail]);


  const routeD = useMemo(() => {
    const pts = day.camera.focus.map((id) => SITE_POS[id]);
    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [day.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const routeTotalKm = useMemo(() => {
    const focus = day.camera.focus;
    let total = 0;
    for (let i = 0; i < focus.length - 1; i++) {
      total += haversineKm(locations[focus[i]].coords, locations[focus[i + 1]].coords);
    }
    return total;
  }, [day.camera.focus]); // eslint-disable-line react-hooks/exhaustive-deps



  const baseRouteD = ROUTE_ORDER.map((id, i) => {
    const p = SITE_POS[id];
    return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }).join(" ");

  const zoomedBoundaryPath = useMemo(() => {
    if (!zoomedDetail) return "";
    return zoomedDetail.boundary
      .map((c, i) => {
        const p = projectCoords(c);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ");
  }, [zoomedDetail]);

  return (
    <div className="space-y-3">
      {activeSite && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => onSelectSite(null)}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Zoom out
          </Button>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Site detail</p>
            <p className="font-semibold">{locations[activeSite].name}</p>
          </div>
        </div>
      )}

      <div className={activeSite ? "grid gap-3 lg:grid-cols-[1fr_240px]" : ""}>
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
        <div className="arabesque-bg pointer-events-none absolute inset-0" />

        <TransformWrapper
          ref={ref}
          initialScale={1}
          minScale={0.8}
          maxScale={14}
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
                <radialGradient id="landmarkFocusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
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

              {routeD && (() => {
                const looped = day.camera.focus.length === 2;
                return (
                  <motion.path
                    key={`${day.id}-${day.camera.focus.join("-")}`}
                    d={routeD}
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduced ? { opacity: 0 } : { pathLength: 0, opacity: 1 }}
                    animate={
                      reduced
                        ? { opacity: 1 }
                        : looped
                          ? { pathLength: [0, 1], opacity: [0.35, 1, 1] }
                          : { pathLength: 1, opacity: 1 }
                    }
                    transition={
                      reduced
                        ? { duration: 0.3 }
                        : looped
                          ? { duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6, times: [0, 0.85, 1] }
                          : { duration: 1.1, ease: "easeInOut" }
                    }
                    style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--color-gold) 55%, transparent))" }}
                  />
                );
              })()}



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
                    opacity={0.98}
                  />
                  <text
                    textAnchor="middle"
                    y={4}
                    fontSize={10}
                    fontWeight={600}
                    letterSpacing="0.06em"
                    fill="var(--color-muted-foreground)"
                    style={{ fontFamily: "var(--font-sans)" }}
                    transform={seg.angleDeg > 90 || seg.angleDeg < -90 ? "rotate(180)" : undefined}
                  >
                    {seg.label}
                  </text>
                </g>
              ))}


              {/* Overview tap zones — dashed boxes around each site (visible when not zoomed) */}
              {!activeSite &&
                ROUTE_ORDER.map((id) => {
                  const zone = getSiteOverviewZone(id, SITE_POS);
                  const isActive = id === focusSite;
                  const inFocus = day.camera.focus.includes(id);
                  return (
                    <rect
                      key={`zone-${id}`}
                      x={zone.minX}
                      y={zone.minY}
                      width={zone.width}
                      height={zone.height}
                      rx={12}
                      fill={
                        isActive || inFocus
                          ? "color-mix(in oklab, var(--color-gold) 6%, transparent)"
                          : "transparent"
                      }
                      stroke={isActive ? "var(--color-gold)" : "var(--color-primary)"}
                      strokeWidth={isActive ? 2 : 1.5}
                      strokeDasharray="8 5"
                      opacity={isActive ? 0.95 : 0.65}
                      className="cursor-pointer"
                      onClick={() => onSelectSite(id)}
                    />
                  );
                })}

              {/* Zoomed-in ritual boundary */}
              {activeSite && zoomedBoundaryPath && (
                <path
                  d={`${zoomedBoundaryPath} Z`}
                  fill="color-mix(in oklab, var(--color-primary) 10%, transparent)"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  strokeDasharray="8 6"
                  strokeLinejoin="round"
                  pointerEvents="none"
                />
              )}

              {/* Landmarks when zoomed into a site */}
              {activeSite &&
                zoomedDetail?.landmarks.map((lm) => {
                  const p = projectCoords(lm.coords);
                  const selected = selectedLandmark === lm.id;
                  return (
                    <g
                      key={lm.id}
                      transform={`translate(${p.x} ${p.y})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLandmark(selected ? null : lm.id);
                      }}
                    >
                      <circle
                        r={selected ? 14 : 10}
                        fill="var(--color-card)"
                        stroke="var(--color-gold)"
                        strokeWidth={selected ? 3 : 2}
                      />
                      <circle r={4} fill="var(--color-gold)" />
                      <text y={-16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-foreground)">
                        {lm.name}
                      </text>
                    </g>
                  );
                })}

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
                const isActive = id === (activeSite ?? focusSite);
                const inFocus = day.camera.focus.includes(id);
                const dimmed = activeSite != null && activeSite !== id;
                return (
                  <g
                    key={id}
                    transform={`translate(${p.x} ${p.y})`}
                    className="cursor-pointer"
                    opacity={dimmed ? 0.35 : 1}
                    onClick={() => onSelectSite(activeSite === id ? null : id)}
                  >
                    {(isActive || inFocus) && !activeSite && (
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
          <span>
            {activeSite
              ? "Dotted line = approximate boundary · tap a landmark for details"
              : "Distances approximate · tap a site box to zoom in"}
          </span>
          {!activeSite && routeTotalKm > 0 && (
            <span className="pointer-events-auto rounded-full border border-gold/50 bg-card/90 px-3 py-1 font-semibold text-gold shadow-sm">
              Route · {formatDistanceKm(routeTotalKm)}
            </span>
          )}
          <span className="hidden font-arabic text-base sm:inline">
            {locations[activeSite ?? focusSite].arabicName}
          </span>
        </div>
        </div>


        {activeSite && zoomedDetail && (
          <aside className="rounded-3xl border border-border/60 bg-card p-3 shadow-[var(--shadow-soft)] lg:max-h-[55vh] lg:overflow-y-auto">
            <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Landmarks
            </p>
            <ul className="space-y-1">
              {zoomedDetail.landmarks.map((lm) => {
                const selected = selectedLandmark === lm.id;
                return (
                  <li key={lm.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedLandmark(selected ? null : lm.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                        selected
                          ? "border-gold bg-gold/10"
                          : "border-transparent hover:border-border hover:bg-secondary/40"
                      }`}
                    >
                      <p className="text-sm font-semibold leading-tight">{lm.name}</p>
                      <p className="font-arabic text-base leading-tight text-muted-foreground">
                        {lm.arabicName}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-muted-foreground">{lm.blurb}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
            {selectedLandmark && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 w-full rounded-full"
                onClick={() => setSelectedLandmark(null)}
              >
                Fit boundary
              </Button>
            )}
          </aside>
        )}
      </div>


      {activeSite && selectedLandmark && zoomedDetail && (
        <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm shadow-[var(--shadow-soft)]">
          {(() => {
            const lm = zoomedDetail.landmarks.find((l) => l.id === selectedLandmark);
            if (!lm) return null;
            return (
              <>
                <p className="font-semibold">{lm.name}</p>
                <p className="font-arabic text-lg text-muted-foreground">{lm.arabicName}</p>
                <p className="mt-2 text-muted-foreground">{lm.blurb}</p>
                <p className="mt-2 text-foreground">{lm.pilgrimNote}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-full"
                  onClick={() => openMapsNavigation(lm.coords[0], lm.coords[1])}
                >
                  <Navigation className="mr-1.5 h-3.5 w-3.5" />
                  Open in Google Maps
                </Button>
              </>
            );
          })()}
        </div>
      )}

      {activeSite && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Boundaries are approximate guides only — not official survey lines. Always follow your mutawwif and on-site
          signage.
        </p>
      )}
    </div>
  );
}
