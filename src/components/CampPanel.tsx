import { LocateFixed, MapPin, Navigation, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LivePosition } from "@/hooks/use-live-location";
import type { CampPin } from "@/hooks/use-camp-pin";
import { formatDistanceAway, openMapsNavigation } from "@/lib/geo";
import { haversineKm } from "@/lib/map-projection";

interface CampPanelProps {
  camp: CampPin | null;
  draftLabel: string;
  onLabelChange: (v: string) => void;
  livePosition: LivePosition | null;
  locationError: string | null;
  onSetCamp: () => void;
  onClearCamp: () => void;
  canSetCamp: boolean;
  locationEnabled: boolean;
  onEnableLocation: () => void;
}

export function CampPanel({
  camp,
  draftLabel,
  onLabelChange,
  livePosition,
  locationError,
  onSetCamp,
  onClearCamp,
  canSetCamp,
  locationEnabled,
  onEnableLocation,
}: CampPanelProps) {
  const distanceToCamp =
    camp && livePosition
      ? formatDistanceAway(haversineKm([livePosition.lat, livePosition.lon], [camp.lat, camp.lon]))
      : null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Tent className="h-4 w-4 text-gold" />
        Camp pin
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Save your tent location so you can find your way back after exploring.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder='Label e.g. "Camp 42" or group name'
          value={draftLabel}
          onChange={(e) => onLabelChange(e.target.value)}
          className="rounded-full sm:max-w-xs"
          aria-label="Camp label"
        />
        {locationEnabled ? (
          <Button
            type="button"
            size="sm"
            className="rounded-full"
            disabled={!canSetCamp}
            onClick={onSetCamp}
          >
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            {camp ? "Update camp here" : "Set camp here"}
          </Button>
        ) : (
          <Button type="button" size="sm" className="rounded-full" onClick={onEnableLocation}>
            <LocateFixed className="mr-1.5 h-3.5 w-3.5" />
            Use my location
          </Button>
        )}
        {camp && (
          <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={onClearCamp}>
            Clear
          </Button>
        )}
      </div>

      {locationError && <p className="mt-2 text-xs text-destructive">{locationError}</p>}

      {camp && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-gold/10 px-3 py-1 text-gold-foreground">
            Saved: <strong>{camp.label}</strong>
          </span>
          {distanceToCamp && (
            <span className="text-muted-foreground">{distanceToCamp} from camp</span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => openMapsNavigation(camp.lat, camp.lon)}
          >
            <Navigation className="mr-1.5 h-3.5 w-3.5" />
            Navigate to camp
          </Button>
        </div>
      )}

      {!locationEnabled && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tap “Use my location” to show where you are and measure the walk back to camp. Your location stays on
          your device.
        </p>
      )}
      {locationEnabled && !livePosition && !locationError && (
        <p className="mt-2 text-xs text-muted-foreground">Locating you… allow location access when prompted.</p>
      )}
    </div>
  );
}
