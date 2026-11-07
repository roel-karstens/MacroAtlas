"use client";

import { useState } from "react";
import { LineChart } from "@/components/line-chart";
import { Button } from "@/components/ui/button";
import { formatPeriod } from "@/lib/data/series";
import { formatNumber } from "@/lib/format";

type Point = { period: string; value: number };
type RangeKey = "5y" | "10y" | "all";

function rangesFor(points: Point[]): RangeKey[] {
  const ranges: RangeKey[] = [];
  if (points.length >= 60) ranges.push("5y");
  if (points.length >= 120) ranges.push("10y");
  ranges.push("all");
  return ranges;
}

const labels: Record<RangeKey, string> = {
  "5y": "5-year",
  "10y": "10-year",
  all: "Full excerpt",
};

export function ObservedChart({
  title,
  unit,
  points,
  digits,
  caption,
}: {
  title: string;
  unit: string;
  points: Point[];
  digits: number;
  caption: string;
}) {
  const ranges = rangesFor(points);
  const [range, setRange] = useState<RangeKey>(ranges.includes("10y") ? "10y" : "all");
  const active = ranges.includes(range) ? range : "all";
  const shown = active === "5y" ? points.slice(-60) : active === "10y" ? points.slice(-120) : points;
  const start = shown[0]?.period;
  const end = shown[shown.length - 1]?.period;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Date range">
        {ranges.map((item) => (
          <Button
            key={item}
            type="button"
            variant={item === active ? "default" : "outline"}
            className="h-11 rounded-none px-3"
            aria-pressed={item === active}
            onClick={() => setRange(item)}
          >
            {labels[item]}
          </Button>
        ))}
      </div>
      <LineChart
        title={title}
        unit={unit}
        xLabels={shown.map((point) => formatPeriod(point.period))}
        formatY={(value) => formatNumber(value, digits)}
        series={[
          {
            id: "observed",
            label: title,
            color: "#0072B2",
            pattern: "solid",
            marker: "circle",
            status: "Observed",
            points: shown.map((point, index) => ({ x: index, y: point.value })),
          },
        ]}
        caption={`${caption} Showing ${start ? formatPeriod(start) : "—"} to ${end ? formatPeriod(end) : "—"}. Solid line, circle marker. Not a forecast.`}
      />
    </div>
  );
}
