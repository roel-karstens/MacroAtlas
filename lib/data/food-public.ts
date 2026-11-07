import eurostatFile from "@/data/food/eurostat-ea-food.json";

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
