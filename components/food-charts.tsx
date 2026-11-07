"use client";

import { LineChart } from "@/components/line-chart";
import { eurostatFood, eurostatLevelChange, peakSince } from "@/lib/data/food-public";
import { formatPeriod } from "@/lib/data/series";
import { formatNumber } from "@/lib/format";

function monthIndex(period: string, origin: string) {
  const [year, month] = period.split("-").map(Number);
  const [originYear, originMonth] = origin.split("-").map(Number);
  return (year - originYear) * 12 + (month - originMonth);
}

function labelsFrom(origin: string, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const month = ((Number(origin.slice(5)) - 1 + index) % 12) + 1;
    const year = Number(origin.slice(0, 4)) + Math.floor((Number(origin.slice(5)) - 1 + index) / 12);
    return `${year}-${String(month).padStart(2, "0")}`;
  });
}

export function EurostatFoodCharts() {
  const index = eurostatFood.foodIndex.filter((point) => point.period >= "2020-01");
  const foodRate = eurostatFood.foodAnnualRate.filter((point) => point.period >= "2020-01");
  const allRate = eurostatFood.allItemsAnnualRate.filter((point) => point.period >= "2020-01");
  const origin = "2020-01";
  const last = allRate.at(-1)?.period ?? origin;
  const labels = labelsFrom(origin, monthIndex(last, origin) + 1);
  const rise = eurostatLevelChange("2020-01", "2026-09");
  const foodPeak = peakSince(eurostatFood.foodAnnualRate, "2019-01");
  const allPeak = peakSince(eurostatFood.allItemsAnnualRate, "2019-01");
  const foodLatest = eurostatFood.foodAnnualRate.at(-1);
  const allLatest = eurostatFood.allItemsAnnualRate.at(-1);
  const negative = eurostatFood.foodAnnualRate.filter((point) => point.value < 0);

  return (
    <div className="mt-8 space-y-8">
      <LineChart
        emphasize
        annotations={[
          { x: monthIndex("2020-01", origin), y: index[0]?.value ?? 107.2, label: "Jan 2020 · 107.2" },
          {
            x: monthIndex(index.at(-1)?.period ?? "2026-09", origin),
            y: index.at(-1)?.value ?? 143.22,
            label: "Sep 2026 · 143.2",
          },
        ]}
        title="The grocery price level kept rising"
        unit="Index, 2015 = 100. Eurostat food (CP011). Euro area, changing composition."
        xLabels={labels}
        formatY={(value) => formatNumber(value, 1)}
        series={[
          {
            id: "level",
            label: "Food price level",
            color: "#D55E00",
            pattern: "solid",
            marker: "square",
            status: "Eurostat index",
            points: index.map((point) => ({ x: monthIndex(point.period, origin), y: point.value })),
          },
        ]}
        caption={`Euro area food, CP011, 2015 = 100. Changing composition, EA21 from 2026. Last month in this extract: September 2026. January 2020 was 107.2. From there to September 2026 the level is ${rise == null ? "unavailable" : `up ${formatNumber(rise, 1)} percent`}, our ratio of those two points. Not a Dutch receipt, and not the world commodity index.`}
      />
      <LineChart
        emphasize
        annotations={[
          {
            x: monthIndex(allPeak.period, origin),
            y: allPeak.value,
            label: `All-items peak · ${formatNumber(allPeak.value, 1)}%`,
          },
          {
            x: monthIndex(foodPeak.period, origin),
            y: foodPeak.value,
            label: `Food peak · ${formatNumber(foodPeak.value, 1)}%`,
          },
          {
            x: monthIndex(foodLatest?.period ?? foodPeak.period, origin),
            y: foodLatest?.value ?? foodPeak.value,
            label: `Latest food rate · ${formatNumber(foodLatest?.value ?? 0, 1)}%`,
          },
        ]}
        title="Inflation slowed. The price level did not fall."
        unit="Annual rate of change, percent. Eurostat’s published rate."
        xLabels={labels}
        formatY={(value) => formatNumber(value, 1)}
        series={[
          {
            id: "food-rate",
            label: "Food",
            color: "#D55E00",
            pattern: "solid",
            marker: "square",
            status: "Eurostat annual rate",
            points: foodRate.map((point) => ({ x: monthIndex(point.period, origin), y: point.value })),
          },
          {
            id: "all-rate",
            label: "All items",
            color: "#0072B2",
            pattern: "dashed",
            marker: "circle",
            status: "Eurostat annual rate",
            points: allRate.map((point) => ({ x: monthIndex(point.period, origin), y: point.value })),
          },
        ]}
        caption={`Same euro area, two baskets. All-items peaks at ${formatNumber(allPeak.value, 1)} percent in ${formatPeriod(allPeak.period)}. Food peaks at ${formatNumber(foodPeak.value, 1)} percent in ${formatPeriod(foodPeak.period)}. Food’s last rate is ${formatNumber(foodLatest?.value ?? 0, 1)} percent in ${formatPeriod(foodLatest?.period ?? "")}. All-items continues to ${formatPeriod(allLatest?.period ?? "")} at ${formatNumber(allLatest?.value ?? 0, 1)} percent. The only negative food month since January 2019 is ${negative.map((point) => `${formatPeriod(point.period)}, ${formatNumber(point.value, 1)} percent`).join("; ") || "none"}. The world-price high in March 2022 and this food-rate high are not a measured lag.`}
      />
    </div>
  );
}
