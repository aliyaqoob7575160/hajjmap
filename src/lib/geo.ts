/** Lat/lon pair: [latitude, longitude]. */
export type Coords = [number, number];

/** Human-readable distance for camp / live location UI. */
export function formatDistanceAway(km: number): string {
  if (km < 0.05) return "You are here";
  if (km < 1) return `~${Math.round(km * 1000)} m away`;
  return `~${km < 10 ? (Math.round(km * 10) / 10).toFixed(1) : Math.round(km)} km away`;
}

/** Ray-casting point-in-polygon (flat lat/lon — fine at Hajj-site scale). */
export function pointInPolygon(point: Coords, polygon: Coords[]): boolean {
  const [y, x] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [yi, xi] = polygon[i];
    const [yj, xj] = polygon[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function openMapsNavigation(lat: number, lon: number): void {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=walking`;
  window.open(url, "_blank", "noopener,noreferrer");
}
