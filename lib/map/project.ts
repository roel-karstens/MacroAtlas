export const GULF_BOUNDS = {
  minLon: 46.6,
  minLat: 22.7,
  maxLon: 57.8,
  maxLat: 30.9,
} as const;

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 760;

const MID_LAT = ((GULF_BOUNDS.minLat + GULF_BOUNDS.maxLat) / 2) * (Math.PI / 180);
const X_SPAN = (GULF_BOUNDS.maxLon - GULF_BOUNDS.minLon) * Math.cos(MID_LAT);
const Y_SPAN = GULF_BOUNDS.maxLat - GULF_BOUNDS.minLat;

/** Equirectangular projection with a cosine correction. Not a navigational chart. */
export function project(lon: number, lat: number) {
  const x = ((lon - GULF_BOUNDS.minLon) * Math.cos(MID_LAT) / X_SPAN) * MAP_WIDTH;
  const y = ((GULF_BOUNDS.maxLat - lat) / Y_SPAN) * MAP_HEIGHT;
  return { x, y };
}

export type MapFilterKey = "terminal" | "pipeline" | "processing" | "corridor";

export function entityVisible(categories: MapFilterKey[], filters: Record<MapFilterKey, boolean>) {
  return categories.some((category) => filters[category]);
}
