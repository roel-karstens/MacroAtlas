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
  annotations = [],
  emphasize = false,
}: {
  title: string;
  unit: string;
  series: ChartSeries[];
  xLabels?: string[];
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  caption: string;
  annotations?: { x: number; y: number; label: string }[];
  /** Larger type and a taller frame on small screens. Desktop size stays a full reading chart. */
  emphasize?: boolean;
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
      {(emphasize
        ? [
            { id: "phone", className: "h-auto w-full md:hidden", W: 520, H: 560, LEFT: 92, RIGHT: 28, TOP: 48, BOTTOM: 72, font: 22 },
            { id: "desk", className: "hidden h-auto w-full md:block", W: 720, H: 360, LEFT: 78, RIGHT: 36, TOP: 36, BOTTOM: 52, font: 15 },
          ]
        : [{ id: "one", className: "h-auto w-full", W, H, LEFT, RIGHT, TOP, BOTTOM, font: 11 }]
      ).map((layout) => {
        const xOfLayout = (value: number) => {
          const span = xDomain.max - xDomain.min || 1;
          return layout.LEFT + ((value - xDomain.min) / span) * (layout.W - layout.LEFT - layout.RIGHT);
        };
        const yOfLayout = (value: number) => {
          const span = yDomain.max - yDomain.min || 1;
          return layout.TOP + (1 - (value - yDomain.min) / span) * (layout.H - layout.TOP - layout.BOTTOM);
        };
        return (
          <svg key={layout.id} viewBox={`0 0 ${layout.W} ${layout.H}`} role="img" aria-label={summary} className={layout.className}>
            {yTicks.map((tick) => (
              <g key={tick}>
                <line x1={layout.LEFT} x2={layout.W - layout.RIGHT} y1={yOfLayout(tick)} y2={yOfLayout(tick)} stroke="#e4e6ea" />
                <text x={layout.LEFT - 10} y={yOfLayout(tick) + layout.font * 0.35} textAnchor="end" fontSize={layout.font} fill="#3f4651">
                  {yFormat(tick)}
                </text>
              </g>
            ))}
            {xTickValues.map((tick) => (
              <text key={tick} x={xOfLayout(tick)} y={layout.H - 16} textAnchor="middle" fontSize={layout.font} fill="#3f4651">
                {xFormat(tick)}
              </text>
            ))}
            {drawn.map((item) => {
              const d = item.points
                .map((point, index) => `${index === 0 ? "M" : "L"}${xOfLayout(point.x).toFixed(1)} ${yOfLayout(point.y).toFixed(1)}`)
                .join(" ");
              const last = item.points[item.points.length - 1];
              return (
                <g key={item.id}>
                  <path d={d} fill="none" stroke={item.color} strokeWidth={emphasize ? 3 : 2} strokeDasharray={item.pattern === "dashed" ? "7 5" : undefined} />
                  <Marker x={xOfLayout(last.x)} y={yOfLayout(last.y)} kind={item.marker} color={item.color} />
                </g>
              );
            })}
            {annotations.map((note) => (
              <g key={note.label}>
                <circle cx={xOfLayout(note.x)} cy={yOfLayout(note.y)} r={emphasize ? 7 : 4} fill="#fff" stroke="#141414" strokeWidth={emphasize ? 2 : 1.25} />
                <text x={xOfLayout(note.x) + 10} y={yOfLayout(note.y) - 8} fontSize={layout.font} fontWeight={600} fill="#141414">
                  {note.label}
                </text>
              </g>
            ))}
          </svg>
        );
      })}
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
