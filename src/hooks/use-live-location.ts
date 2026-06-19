import { useCallback, useEffect, useRef, useState } from "react";

export interface LivePosition {
  lat: number;
  lon: number;
  accuracy: number;
  heading: number | null;
  timestamp: number;
}

export function useLiveLocation(enabled: boolean) {
  const [position, setPosition] = useState<LivePosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const watchId = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchId.current != null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setWatching(false);
  }, []);

  const start = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Location is not available in this browser.");
      return;
    }
    stop();
    setError(null);
    setWatching(true);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Location permission denied. Enable it in your browser settings."
            : "Could not get your location. Try moving outdoors.",
        );
        setWatching(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }, [stop]);

  useEffect(() => {
    if (enabled) start();
    else stop();
    return stop;
  }, [enabled, start, stop]);

  return { position, error, watching, start, stop };
}
