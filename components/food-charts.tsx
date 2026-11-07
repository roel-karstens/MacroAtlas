"use client";

import { useState } from "react";
import { LineChart } from "@/components/line-chart";
import { Button } from "@/components/ui/button";
import {
  eurostatFood,
  eurostatLevelChange,
  faoGroups,
  faoSlice,
  peakSince,
  type FaoKey,
} from "@/lib/data/food-public";
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

export function FaoPriceChart() {
  const [key, setKey] = useState<FaoKey>("ffpi");
  const [full, setFull] = useState(false);
  const from = full ? "1990-01" : "2020-01";
  const points = faoSlice(key, from);
  const labels = labelsFrom(from, monthIndex(points.at(-1)?.period ?? from, from) + 1);
  const peak = peakSince(points, from);
  const group = faoGroups.find((item) => item.id === key)!;

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="FAO nominal index">
        {faoGroups.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={key === item.id ? "default" : "outline"}
            className="h-11 rounded-none px-3"
            aria-pressed={key === item.id}
            onClick={() => setKey(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <Button type="button" variant="outline" className="mb-3 h-11 rounded-none px-3" aria-pressed={full} onClick={() => setFull((value) => !value)}>
        {full ? "Show January 2020–October 2026" : "Show the file from January 1990"}
      </Button>
      <LineChart
        title={group.label}
        unit="Index, 2014–2016 = 100. Nominal. Not euros."
        xLabels={labels}
        formatY={(value) => formatNumber(value, 1)}
        series={[
          {
            id: key,
            label: group.label,
            color: "#0072B2",
            pattern: "solid",
            marker: "circle",
            status: "FAO nominal value",
            points: points.map((point) => ({ x: monthIndex(point.period, from), y: point.value })),
          },
        ]}
        caption={`© FAO. Unmodified nominal values from the Food Price Index CSV, retrieved 7 November 2026. The page’s release date is 6 November 2026. Latest month in the file: ${formatPeriod(points.at(-1)?.period ?? "")}, ${formatNumber(points.at(-1)?.value ?? 0, 1)}. Highest in this view: ${formatNumber(peak.value, 1)} in ${formatPeriod(peak.period)}. Not a consumer price. Not rebased. Not labelled CC BY 4.0. The newest meat months mix projected and observed prices, so meat and the headline can be revised. ${full ? "Full file from January 1990." : "Months before January 2020 are in the file and are not drawn in this view."}`}
      />
    </div>
  );
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
        title="Euro area food price level"
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
        caption={`Source: Eurostat, prc_hicp_minr, ${eurostatFood.doi}, dataset updated 4 November 2026, accessed 7 November 2026. Food only, not food and non-alcoholic beverages, and not one national receipt. EA means the euro area’s changing composition, EA21 from 2026. Last food month in this extract: September 2026, 143.22. January 2020 was 107.2. The rise between those two published points is ${rise == null ? "unavailable" : formatNumber(rise, 1)} percent, a Macro Atlas ratio. Eurostat is not responsible for that ratio. The vertical comparison with the FAO index is not made: different basket, currency, and base.`}
      />
      <LineChart
        title="Euro area inflation rates"
        unit="Annual rate of change, percent. Eurostat RCH_A, not a Macro Atlas formula."
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
        caption={`Same geography and Eurostat’s own annual rate. Different baskets. All-items peaks at ${formatNumber(allPeak.value, 1)} percent in ${formatPeriod(allPeak.period)}. Food peaks at ${formatNumber(foodPeak.value, 1)} percent in ${formatPeriod(foodPeak.period)}. That order is not a measured delay from a world commodity price to the shelf. The last food rate in the file is ${formatNumber(foodLatest?.value ?? 0, 1)} percent in ${formatPeriod(foodLatest?.period ?? "")}, still above zero, so this rate does not say the price level fell. Food has no later month. All-items continues to ${formatPeriod(allLatest?.period ?? "")}, ${formatNumber(allLatest?.value ?? 0, 1)} percent. Food months below zero since January 2019: ${negative.map((point) => `${formatPeriod(point.period)} (${formatNumber(point.value, 1)} percent)`).join("; ") || "none"}. These rates are not recalculated here.`}
      />
    </div>
  );
}
