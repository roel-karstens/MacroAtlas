import brentJson from "@/data/snapshots/brent-monthly.json";
import yieldJson from "@/data/snapshots/ea-10y-yield-monthly.json";

export type Observation = {
  period: string;
  value: number;
  obsStatus?: string;
};

export type ObservedSeries = {
  id: string;
  title: string;
  definition: string;
  unit: string;
  frequency: "monthly";
  status: "observed";
  retrieved: string;
  sourceUrl: string;
  points: Observation[];
};

export const brentSeries = brentJson as ObservedSeries & {
  publisher: string;
  dataset: string;
  workbookUpdated: string;
  excerpt: string;
  fileUrl: string;
};

export const yieldSeries = yieldJson as ObservedSeries & {
  seriesKey: string;
  unitCode: string;
  provider: string;
  note: string;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatPeriod(period: string) {
  const [year, month] = period.split("-");
  const name = MONTHS[Number(month) - 1] ?? month;
  return `${name} ${year}`;
}

export function latestObservation(series: { points: Observation[] }) {
  return series.points[series.points.length - 1];
}

export type RangeKey = "5y" | "10y" | "all";

export function availableRanges(series: { points: Observation[] }): RangeKey[] {
  const ranges: RangeKey[] = ["all"];
  if (series.points.length >= 120) ranges.unshift("10y");
  if (series.points.length >= 60) ranges.unshift("5y");
  return ranges;
}

export function sliceSeries<T extends { points: Observation[] }>(series: T, range: RangeKey) {
  if (!availableRanges(series).includes(range)) {
    return series.points;
  }
  if (range === "5y") return series.points.slice(-60);
  if (range === "10y") return series.points.slice(-120);
  return series.points;
}
