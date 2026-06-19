import { useCallback, useEffect, useState } from "react";
import type { LocationId } from "@/data/hajj";

export interface CampPin {
  siteId: LocationId;
  label: string;
  lat: number;
  lon: number;
  updatedAt: string;
}

const STORAGE_KEY = "labbayk-camp-pins-v1";

function readAll(): Partial<Record<LocationId, CampPin>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Record<LocationId, CampPin>>;
  } catch {
    return {};
  }
}

function writeAll(data: Partial<Record<LocationId, CampPin>>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function useCampPin(siteId: LocationId) {
  const [camp, setCamp] = useState<CampPin | null>(null);
  const [draftLabel, setDraftLabel] = useState("");

  useEffect(() => {
    const all = readAll();
    const pin = all[siteId] ?? null;
    setCamp(pin);
    setDraftLabel(pin?.label ?? "");
  }, [siteId]);

  const saveCamp = useCallback(
    (lat: number, lon: number, label: string) => {
      const trimmed = label.trim() || "My camp";
      const pin: CampPin = {
        siteId,
        label: trimmed,
        lat,
        lon,
        updatedAt: new Date().toISOString(),
      };
      const all = readAll();
      all[siteId] = pin;
      writeAll(all);
      setCamp(pin);
      setDraftLabel(trimmed);
      return pin;
    },
    [siteId],
  );

  const clearCamp = useCallback(() => {
    const all = readAll();
    delete all[siteId];
    writeAll(all);
    setCamp(null);
    setDraftLabel("");
  }, [siteId]);

  return { camp, draftLabel, setDraftLabel, saveCamp, clearCamp };
}
