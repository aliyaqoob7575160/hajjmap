import { locations, type LocationId } from "@/data/hajj";

/** Pilgrimage route order (Makkah → Mina → Muzdalifah → Arafat). */
export const ROUTE_ORDER: LocationId[] = ["haram", "mina", "muzdalifah", "arafat"];

export interface MapPoint {
  x: number;
  y: number;
}

export interface RouteSegment {
  from: LocationId;
  to: LocationId;
  km: number;
  label: string;
  midX: number;
  midY: number;
  angleDeg: number;
}

export interface MapLayout {
  positions: Record<LocationId, MapPoint>;
  segments: RouteSegment[];
  viewW: number;
  viewH: number;
}

/** Great-circle distance in kilometres. */
export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const [lat1, lon1] = a.map((d) => (d * Math.PI) / 180) as [number, number];
  const [lat2, lon2] = b.map((d) => (d * Math.PI) / 180) as [number, number];
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Round to nearest whole km for display (≥ 5 km) or one decimal below. */
export function formatDistanceKm(km: number): string {
  if (km >= 5) return `${Math.round(km)} km`;
  return `${Math.round(km * 10) / 10} km`;
}

/**
 * Local equirectangular projection anchored at Haram.
 * North = screen up, east = screen right (standard north-up map).
 */
export function toLocalKm(lat: number, lon: number, origin: [number, number]): MapPoint {
  const latKm = (lat - origin[0]) * 111.32;
  const lonKm = (lon - origin[1]) * 111.32 * Math.cos((origin[0] * Math.PI) / 180);
  return { x: lonKm, y: -latKm };
}

export interface DetailMapLayout {
  viewW: number;
  viewH: number;
  origin: [number, number];
  project: (lat: number, lon: number) => MapPoint;
  projectCoords: (coords: [number, number]) => MapPoint;
}

/** Fit a set of lat/lon points into a detail viewBox (north-up). */
export function computeDetailLayout(
  coordsList: [number, number][],
  viewW = 1000,
  viewH = 600,
  margin = 72,
): DetailMapLayout {
  const origin: [number, number] = [
    coordsList.reduce((s, c) => s + c[0], 0) / coordsList.length,
    coordsList.reduce((s, c) => s + c[1], 0) / coordsList.length,
  ];

  const local = coordsList.map(([lat, lon]) => toLocalKm(lat, lon, origin));
  const minX = Math.min(...local.map((p) => p.x));
  const maxX = Math.max(...local.map((p) => p.x));
  const minY = Math.min(...local.map((p) => p.y));
  const maxY = Math.max(...local.map((p) => p.y));
  const spanX = maxX - minX || 0.5;
  const spanY = maxY - minY || 0.5;
  const innerW = viewW - margin * 2;
  const innerH = viewH - margin * 2;
  const scale = Math.min(innerW / spanX, innerH / spanY);

  const project = (lat: number, lon: number): MapPoint => {
    const p = toLocalKm(lat, lon, origin);
    return {
      x: margin + (p.x - minX) * scale,
      y: margin + (p.y - minY) * scale,
    };
  };

  return {
    viewW,
    viewH,
    origin,
    project,
    projectCoords: (coords) => project(coords[0], coords[1]),
  };
}

function fitToViewBox(
  points: Record<LocationId, MapPoint>,
  viewW: number,
  viewH: number,
  margin: number,
): Record<LocationId, MapPoint> {
  const vals = Object.values(points);
  const minX = Math.min(...vals.map((p) => p.x));
  const maxX = Math.max(...vals.map((p) => p.x));
  const minY = Math.min(...vals.map((p) => p.y));
  const maxY = Math.max(...vals.map((p) => p.y));

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const innerW = viewW - margin * 2;
  const innerH = viewH - margin * 2;
  const scale = Math.min(innerW / spanX, innerH / spanY);

  const out = {} as Record<LocationId, MapPoint>;
  for (const id of ROUTE_ORDER) {
    const p = points[id];
    out[id] = {
      x: margin + (p.x - minX) * scale,
      y: margin + (p.y - minY) * scale,
    };
  }
  return out;
}

export function computeSitePositions(
  viewW = 1000,
  viewH = 600,
  margin = 100,
): MapLayout {
  const origin = locations.haram.coords;

  const localKm = {} as Record<LocationId, MapPoint>;
  for (const id of ROUTE_ORDER) {
    const [lat, lon] = locations[id].coords;
    localKm[id] = toLocalKm(lat, lon, origin);
  }

  const positions = fitToViewBox(localKm, viewW, viewH, margin);

  const segments: RouteSegment[] = [];
  for (let i = 0; i < ROUTE_ORDER.length - 1; i++) {
    const from = ROUTE_ORDER[i];
    const to = ROUTE_ORDER[i + 1];
    const km = haversineKm(locations[from].coords, locations[to].coords);
    const a = positions[from];
    const b = positions[to];
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const angleDeg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    segments.push({ from, to, km, label: formatDistanceKm(km), midX, midY, angleDeg });
  }

  return { positions, segments, viewW, viewH };
}
