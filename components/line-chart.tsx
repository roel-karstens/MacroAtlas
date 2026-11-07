"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { paddedDomain, ticks } from "@/lib/charts/scale";
import { formatNumber } from "@/lib/format";

export type ChartPoint = { x: number; y: number };
export type ChartSeries = {
  id: string;
  label: string;
  color: string;
  pattern: "solid" | "dashed";
  marker: "circle" | "square" | "diamond";
  status: string;
  points: ChartPoint[];
};

const W = 720;
const H = 320;
const LEFT = 68;
const RIGHT = 128;
const TOP = 20;
const BOTTOM = 40;

function Marker({ x, y, kind, color }: { x: number; y: number; kind: ChartSeries["marker"]; color: string }) {
  if (kind === "square") return <rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill={color} />;
  if (kind === "diamond") {
    return <polygon points={`${x},${y - 5} ${x + 4.5},${y} ${x},${y + 5} ${x - 4.5},${y}`} fill={color} />;
  }
  return <circle cx={x} cy={y} r={3.5} fill={color} />;
}

export function LineChart({
  title,
  unit,
  series,
  xLabels,
  formatX,
  formatY,
  caption,
}: {
  title: string;
  unit: string;
  series: ChartSeries[];
  xLabels?: string[];
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  caption: string;
}) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const yFormat = formatY ?? ((value: number) => formatNumber(value, 2));
  const xFormat =
    formatX ??
    ((value: number) => (xLabels ? (xLabels[Math.round(value)] ?? "") : formatNumber(value, 0)));
  const drawn = series.filter((item) => item.points.length > 0).slice(0, 4);
  const points = drawn.flatMap((item) => item.points);

  if (points.length === 0) {
    return (
      <figure>
        <figcaption className="text-sm text-[#3f4651]">{title}. No observations in this range.</figcaption>
      </figure>
    );
  }

  const xDomain = paddedDomain(points.map((point) => point.x));
  const yDomain = paddedDomain(points.map((point) => point.y));
  const yTicks = ticks(yDomain.min, yDomain.max, 4);
  const xTickValues = xLabels
    ? [0, Math.round((xLabels.length - 1) / 2), xLabels.length - 1].filter((value, index, all) => all.indexOf(value) === index)
    : ticks(xDomain.min, xDomain.max, 4);

  const xOf = (value: number) => {
    const span = xDomain.max - xDomain.min || 1;
    return LEFT + ((value - xDomain.min) / span) * (W - LEFT - RIGHT);
  };
  const yOf = (value: number) => {
    const span = yDomain.max - yDomain.min || 1;
    return TOP + (1 - (value - yDomain.min) / span) * (H - TOP - BOTTOM);
  };

  const summary = `${title}, ${unit}. ${drawn
    .map((item) => {
      const last = item.points[item.points.length - 1];
      return `${item.label}, ${item.pattern} ${item.marker}, ${item.status}, last ${yFormat(last.y)}`;
    })
    .join(". ")}`;

  const axisNote =
    yDomain.min === 0 && Math.min(...points.map((point) => point.y)) > 0
      ? "Vertical axis includes zero."
      : yDomain.min > 0
        ? `Vertical axis starts at ${yFormat(yDomain.min)}, not zero.`
        : "Vertical axis is padded around the values shown.";

  return (
    <figure className="min-w-0">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm text-[#3f4651]">{unit}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-none px-3"
          aria-expanded={showTable}
          aria-controls={tableId}
          onClick={() => setShowTable((value) => !value)}
        >
          {showTable ? "Hide table" : "Show table"}
        </Button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="h-auto w-full">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={LEFT} x2={W - RIGHT} y1={yOf(tick)} y2={yOf(tick)} stroke="#e4e6ea" />
            <text x={LEFT - 8} y={yOf(tick) + 4} textAnchor="end" fontSize="11" fill="#3f4651">
              {yFormat(tick)}
            </text>
          </g>
        ))}
        {xTickValues.map((tick) => (
          <text key={tick} x={xOf(tick)} y={H - 12} textAnchor="middle" fontSize="11" fill="#3f4651">
            {xFormat(tick)}
          </text>
        ))}
        {drawn.map((item, seriesIndex) => {
          const d = item.points
            .map((point, index) => `${index === 0 ? "M" : "L"}${xOf(point.x).toFixed(1)} ${yOf(point.y).toFixed(1)}`)
            .join(" ");
          const last = item.points[item.points.length - 1];
          return (
            <g key={item.id}>
              <path
                d={d}
                fill="none"
                stroke={item.color}
                strokeWidth={2}
                strokeDasharray={item.pattern === "dashed" ? "7 5" : undefined}
              />
              <Marker x={xOf(last.x)} y={yOf(last.y)} kind={item.marker} color={item.color} />
              <text x={xOf(last.x) + 8} y={yOf(last.y) + seriesIndex * 14 - 6} fontSize="12" fill="#141414">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {drawn.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <svg width="36" height="12" aria-hidden="true">
              <line
                x1="0"
                x2="28"
                y1="6"
                y2="6"
                stroke={item.color}
                strokeWidth="2"
                strokeDasharray={item.pattern === "dashed" ? "5 3" : undefined}
              />
              <Marker x={30} y={6} kind={item.marker} color={item.color} />
            </svg>
            <span>
              {item.label} · {item.pattern} · {item.marker} · {item.status}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 space-y-1 text-sm leading-relaxed text-[#3f4651]">
        <p>{caption}</p>
        <p>{axisNote}</p>
      </figcaption>
      <div id={tableId} hidden={!showTable} className="mt-4 max-h-80 overflow-auto border border-[#e4e6ea]">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            {title} values. {unit}.
          </caption>
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-[#e4e6ea]">
              <th scope="col" className="px-3 py-2 font-medium">
                Point
              </th>
              {drawn.map((item) => (
                <th key={item.id} scope="col" className="px-3 py-2 font-medium">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(...drawn.map((item) => item.points.length)) }, (_, index) => (
              <tr key={index} className="border-b border-[#e4e6ea]">
                <th scope="row" className="px-3 py-2 font-normal text-[#3f4651]">
                  {xFormat(drawn.find((item) => item.points[index])?.points[index]?.x ?? index)}
                </th>
                {drawn.map((item) => (
                  <td key={item.id} className="px-3 py-2 tabular-nums">
                    {item.points[index] ? yFormat(item.points[index].y) : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
