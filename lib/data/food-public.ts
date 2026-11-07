import faoFile from "@/data/food/fao-ffpi-monthly.json";
import eurostatFile from "@/data/food/eurostat-ea-food.json";

export type FaoKey = "ffpi" | "meat" | "dairy" | "cereals" | "oils" | "sugar";

export const faoGroups: { id: FaoKey; label: string }[] = [
  { id: "ffpi", label: "Food price index" },
  { id: "cereals", label: "Cereals" },
  { id: "oils", label: "Vegetable oils" },
  { id: "dairy", label: "Dairy" },
  { id: "meat", label: "Meat" },
  { id: "sugar", label: "Sugar" },
];

export const faoSeries = faoFile.points;
export const faoBase = faoFile.base;

/** Display window only. Values are the FAO nominal figures, not rescaled. */
export function faoSlice(key: FaoKey, from = "2020-01") {
  return faoSeries.filter((point) => point.period >= from).map((point) => ({
    period: point.period,
    value: point[key],
  }));
}

export function peakSince(points: { period: string; value: number }[], from: string) {
  const window = points.filter((point) => point.period >= from);
  return window.reduce((best, point) => (point.value > best.value ? point : best));
}

export const eurostatFood = eurostatFile;

export function eurostatLevelChange(fromPeriod: string, toPeriod: string) {
  const from = eurostatFood.foodIndex.find((point) => point.period === fromPeriod);
  const to = eurostatFood.foodIndex.find((point) => point.period === toPeriod);
  if (!from || !to || from.value === 0) return null;
  return (to.value / from.value - 1) * 100;
}
