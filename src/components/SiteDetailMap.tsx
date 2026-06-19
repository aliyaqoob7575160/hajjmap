import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Navigation } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { locations, type LocationId } from "@/data/hajj";
import { getSiteDetail } from "@/data/site-details";
import { CampPanel } from "@/components/CampPanel";
import { useCampPin } from "@/hooks/use-camp-pin";
import { useLiveLocation } from "@/hooks/use-live-location";
import { usePrefersReducedMotion } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { openMapsNavigation, pointInPolygon } from "@/lib/geo";
import { computeDetailLayout } from "@/lib/map-projection";

interface SiteDetailMapProps {
  siteId: LocationId;
  onBack?: () => void;
  focusLandmarkId?: string | null;
  showSaiPath?: boolean;
  headerLabel?: string;
  headerTitle?: string;
}

export function SiteDetailMap({
  siteId,
  onBack,
  focusLandmarkId = null,
  showSaiPath = false,
  headerLabel = "Site detail",
  headerTitle,
}: SiteDetailMapProps) {
  const detail = getSiteDetail(siteId);
  const site = locations[siteId];
  const displayTitle = headerTitle ?? site.name;
  const reduced = usePrefersReducedMotion();
  const { camp, draftLabel, setDraftLabel, saveCamp, clearCamp } = useCampPin(siteId);
  const [locationOn, setLocationOn] = useState(false);
  const { position, error } = useLiveLocation(locationOn);
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);

  // Layout is fitted only from stable points (boundary, landmarks, saved camp).
  // Live position is intentionally excluded so landmarks don't jump/rescale as the pilgrim walks.
  const layout = useMemo(() => {
    const allCoords = [
      ...detail.boundary,
      ...detail.landmarks.map((l) => l.coords),
      ...(camp ? ([[camp.lat, camp.lon]] as [number, number][]) : []),
    ];
    return computeDetailLayout(allCoords);
  }, [detail, camp]);

  const boundaryPath = useMemo(() => {
    return detail.boundary
      .map((c, i) => {
        const p = layout.projectCoords(c);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ");
  }, [detail.boundary, layout]);

  const insideBoundary =
    position != null ? pointInPolygon([position.lat, position.lon], detail.boundary) : null;

  // Project the live position onto the fixed layout, clamping to the viewBox so the
  // "You" marker stays visible even when the pilgrim is just outside the mapped area.
  const PAD = 18;
  const rawUser = position ? layout.project(position.lat, position.lon) : null;
  const userOffArea =
    rawUser != null &&
    (rawUser.x < PAD ||
      rawUser.x > layout.viewW - PAD ||
      rawUser.y < PAD ||
      rawUser.y > layout.viewH - PAD);
  const userPoint = rawUser
    ? {
        x: Math.max(PAD, Math.min(layout.viewW - PAD, rawUser.x)),
        y: Math.max(PAD, Math.min(layout.viewH - PAD, rawUser.y)),
      }
    : null;
  const campPoint = camp ? layout.project(camp.lat, camp.lon) : null;

  const saiPathD = useMemo(() => {
    if (!showSaiPath || !detail.saiPath?.length) return "";
    return detail.saiPath
      .map((c, i) => {
        const p = layout.projectCoords(c);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ");
  }, [showSaiPath, detail.saiPath, layout]);

  const handleSetCamp = () => {
    if (!position) return;
    saveCamp(position.lat, position.lon, draftLabel);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {onBack ? (
          <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={onBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Route map
          </Button>
        ) : (
          <div />
        )}
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{headerLabel}</p>
          <p className="font-semibold">{displayTitle}</p>
        </div>
      </div>

      <CampPanel
        camp={camp}
        draftLabel={draftLabel}
        onLabelChange={setDraftLabel}
        livePosition={position}
        locationError={error}
        onSetCamp={handleSetCamp}
        onClearCamp={clearCamp}
        canSetCamp={!!position}
        locationEnabled={locationOn}
        onEnableLocation={() => setLocationOn(true)}
      />

      {/* Status strip */}
      <div className="flex flex-wrap gap-2 text-xs">
        {insideBoundary === true && (
          <span className="rounded-full bg-primary/15 px-3 py-1 font-medium text-primary">
            Inside {detail.boundaryLabel}
          </span>
        )}
        {insideBoundary === false && (
          <span className="rounded-full bg-gold/15 px-3 py-1 font-medium text-gold-foreground">
            Outside {detail.boundaryLabel} — check with your group
          </span>
        )}
        {position && (
          <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
            GPS ±{Math.round(position.accuracy)} m
          </span>
        )}
      </div>

      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
        <TransformWrapper initialScale={1} minScale={0.6} maxScale={4} centerOnInit wheel={{ step: 0.12 }} smooth>
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
            <svg
              viewBox={`0 0 ${layout.viewW} ${layout.viewH}`}
              preserveAspectRatio="xMidYMid meet"
              className="h-full w-full select-none"
            >
              <defs>
                <radialGradient id="detailTerrain" cx="50%" cy="45%" r="70%">
                  <stop offset="0%" stopColor="var(--color-card)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </radialGradient>
                <radialGradient id="landmarkFocusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width={layout.viewW} height={layout.viewH} fill="url(#detailTerrain)" />

              {/* Ritual boundary */}
              <path
                d={`${boundaryPath} Z`}
                fill={insideBoundary ? "color-mix(in oklab, var(--color-primary) 12%, transparent)" : "color-mix(in oklab, var(--color-gold) 8%, transparent)"}
                stroke="var(--color-primary)"
                strokeWidth={2}
                strokeDasharray="8 6"
                strokeLinejoin="round"
              />

              {saiPathD && (
                <path
                  d={saiPathD}
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  opacity={0.75}
                />
              )}

              {/* North compass */}
              <g transform={`translate(${layout.viewW - 56} 56)`} aria-hidden="true">
                <circle r={18} fill="var(--color-card)" stroke="var(--color-border)" opacity={0.95} />
                <path d="M0 -11 L4 4 L0 1 L-4 4 Z" fill="var(--color-primary)" />
                <text y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--color-muted-foreground)">
                  N
                </text>
              </g>

              {/* Landmarks */}
              {detail.landmarks.map((lm) => {
                const p = layout.projectCoords(lm.coords);
                const selected = selectedLandmark === lm.id;
                const focused = focusLandmarkId === lm.id;
                return (
                  <g
                    key={lm.id}
                    transform={`translate(${p.x} ${p.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedLandmark(selected ? null : lm.id)}
                  >
                    {focused && (
                      <circle r={28} fill="url(#landmarkFocusGlow)" />
                    )}
                    <circle
                      r={focused ? 14 : selected ? 14 : 10}
                      fill="var(--color-card)"
                      stroke={focused ? "var(--color-primary)" : "var(--color-gold)"}
                      strokeWidth={focused ? 3 : 2}
                    />
                    <circle r={4} fill={focused ? "var(--color-primary)" : "var(--color-gold)"} />
                    <text y={-16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-foreground)">
                      {lm.name}
                    </text>
                  </g>
                );
              })}

              {/* Camp pin */}
              {campPoint && camp && (
                <g
                  transform={`translate(${campPoint.x} ${campPoint.y})`}
                  className="cursor-pointer"
                  onClick={() => openMapsNavigation(camp.lat, camp.lon)}
                >
                  <circle r={22} fill="color-mix(in oklab, var(--color-gold) 25%, transparent)" />
                  <circle r={12} fill="var(--color-card)" stroke="var(--color-gold)" strokeWidth={2.5} />
                  <text y={4} textAnchor="middle" fontSize={14} fill="var(--color-gold)">
                    ⛺
                  </text>
                  <text y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-foreground)">
                    {camp.label}
                  </text>
                  <title>Tap to open walking directions in Google Maps</title>
                </g>
              )}

              {/* Live user position */}
              {userPoint && (
                <motion.g
                  animate={{ x: userPoint.x, y: userPoint.y, scale: reduced ? 1 : [1, 1.06, 1] }}
                  transition={{
                    x: { type: "spring", stiffness: 90, damping: 18 },
                    y: { type: "spring", stiffness: 90, damping: 18 },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <circle r={20} fill="color-mix(in oklab, var(--color-primary) 20%, transparent)" />
                  <circle r={11} fill="var(--color-primary)" stroke="var(--color-card)" strokeWidth={2} />
                  <circle r={4} fill="var(--color-primary-foreground)" />
                  <text y={26} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--color-primary)">
                    {userOffArea ? "You (nearby)" : "You"}
                  </text>
                </motion.g>
              )}
            </svg>
          </TransformComponent>
        </TransformWrapper>

        <div className="pointer-events-none absolute bottom-3 left-4 right-4 text-xs text-muted-foreground">
          Dotted line = approximate boundary · tap camp pin for Google Maps · tap ⛺ landmark for info below
        </div>
      </div>

      {selectedLandmark && (
        <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm shadow-[var(--shadow-soft)]">
          {(() => {
            const lm = detail.landmarks.find((l) => l.id === selectedLandmark);
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

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Boundaries are approximate guides only — not official survey lines. GPS accuracy in tent cities is often
        10–50 m. Always follow your mutawwif and on-site signage.
      </p>
    </div>
  );
}
