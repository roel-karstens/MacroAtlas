import cropsFile from "@/data/food/faostat-crops.json";
import worldFile from "@/data/geo/world-110m.json";

export type CropItem = "wheat" | "maize" | "sunflower-seed" | "sunflower-oil";
export type CropElement = "production" | "export-quantity" | "export-value";

export type CropRow = {
  iso3: string;
  area: string;
  item: CropItem;
  element: CropElement;
  year: number;
  value: number | null;
  flag: string;
  note: string;
  unit: string;
  source: string;
};

export const cropRows = cropsFile.rows as CropRow[];

export const cropItems: { id: CropItem; label: string; productNote: string }[] = [
  { id: "wheat", label: "Wheat", productNote: "Grain, tonnes." },
  { id: "maize", label: "Maize", productNote: "Grain, tonnes. Not wheat." },
  { id: "sunflower-seed", label: "Sunflower seed", productNote: "Oilseed, tonnes of seed. Not the oil." },
  { id: "sunflower-oil", label: "Sunflower oil, crude", productNote: "Processed oil, tonnes of oil. Never add this to seed." },
];

export const cropElements: { id: CropElement; label: string; unit: string }[] = [
  { id: "production", label: "Production", unit: "tonnes" },
  { id: "export-quantity", label: "Export quantity", unit: "tonnes" },
  { id: "export-value", label: "Export value", unit: "thousand US dollars" },
];

export const worldFeatures = worldFile.features;
export const mappedIso = new Set(worldFeatures.map((feature) => feature.iso3));

export function yearsFor(item: CropItem, element: CropElement) {
  const years = new Set<number>();
  for (const row of cropRows) {
    if (row.item === item && row.element === element) years.add(row.year);
  }
  return [...years].sort((a, b) => a - b);
}

export function sliceRows(item: CropItem, element: CropElement, year: number) {
  return cropRows.filter((row) => row.item === item && row.element === element && row.year === year);
}

/** Sum of reported numbers only. Null is missing and is left out. Zero counts. */
export function countrySum(rows: CropRow[]) {
  return rows.reduce((sum, row) => (row.value == null ? sum : sum + row.value), 0);
}

export function sharePercent(value: number | null, total: number) {
  if (value == null || !(total > 0)) return null;
  return (value / total) * 100;
}

export function rowStatus(row: CropRow | undefined): "missing" | "zero" | "reported" {
  if (!row || row.value == null) return "missing";
  if (row.value === 0) return "zero";
  return "reported";
}

export function isOnMap(iso3: string) {
  return mappedIso.has(iso3);
}
