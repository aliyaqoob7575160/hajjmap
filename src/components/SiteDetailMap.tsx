import { useMemo, useState } from "react";
import { Navigation } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { locations, type LocationId } from "@/data/hajj";
import { getSiteDetail } from "@/data/site-details";
import { Button } from "@/components/ui/button";
import { openMapsNavigation } from "@/lib/geo";
import { computeDetailLayout } from "@/lib/map-projection";

interface SiteDetailMapProps {
  siteId: LocationId;
  focusLandmarkId?: string | null;
  showSaiPath?: boolean;
  headerLabel?: string;
  headerTitle?: string;
}

export function SiteDetailMap({
  siteId,
  focusLandmarkId = null,
  showSaiPath = false,
  headerLabel = "Site detail",
  headerTitle,
}: SiteDetailMapProps) {
  const detail = getSiteDetail(siteId);
  const site = locations[siteId];
  const displayTitle = headerTitle ?? site.name;
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);

  const layout = useMemo(() => {
    const allCoords = [...detail.boundary, ...detail.landmarks.map((l) => l.coords)];
    return computeDetailLayout(allCoords);
  }, [detail]);

  const boundaryPath = useMemo(() => {
    return detail.boundary
      .map((c, i) => {
        const p = layout.projectCoords(c);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ");
  }, [detail.boundary, layout]);

  const saiPathD = useMemo(() => {
    if (!showSaiPath || !detail.saiPath?.length) return "";
    return detail.saiPath
      .map((c, i) => {
        const p = layout.projectCoords(c);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ");
  }, [showSaiPath, detail.saiPath, layout]);

  return (
    <div className="space-y-3">
      <div className="text-right">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{headerLabel}</p>
        <p className="font-semibold">{displayTitle}</p>
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

              <path
                d={`${boundaryPath} Z`}
                fill="color-mix(in oklab, var(--color-primary) 10%, transparent)"
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

              <g transform={`translate(${layout.viewW - 56} 56)`} aria-hidden="true">
                <circle r={18} fill="var(--color-card)" stroke="var(--color-border)" opacity={0.95} />
                <path d="M0 -11 L4 4 L0 1 L-4 4 Z" fill="var(--color-primary)" />
                <text y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--color-muted-foreground)">
                  N
                </text>
              </g>

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
                    {focused && <circle r={28} fill="url(#landmarkFocusGlow)" />}
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
            </svg>
          </TransformComponent>
        </TransformWrapper>

        <div className="pointer-events-none absolute bottom-3 left-4 right-4 text-xs text-muted-foreground">
          Dotted line = approximate boundary · tap a landmark for info below
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
    </div>
  );
}
