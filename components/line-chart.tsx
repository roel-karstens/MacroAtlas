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

function ReadingPlot({
  summary,
  drawn,
  yTicks,
  xTickValues,
  xDomain,
  yDomain,
  yFormat,
  xFormat,
  annotations,
}: {
  summary: string;
  drawn: ChartSeries[];
  yTicks: number[];
  xTickValues: number[];
  xDomain: { min: number; max: number };
  yDomain: { min: number; max: number };
  yFormat: (value: number) => string;
  xFormat: (value: number) => string;
  annotations: { x: number; y: number; label: string }[];
}) {
  return (
    <div>
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
        <div className="relative h-72 md:h-80" aria-hidden="true">
          {yTicks.map((tick) => (
            <span
              key={tick}
              data-axis="y"
              className="absolute right-0 -translate-y-1/2 text-[12px] leading-none text-[#3f4651] tabular-nums md:text-[13px]"
              style={{ top: `${percentY(tick, yDomain)}%` }}
            >
              {yFormat(tick)}
            </span>
          ))}
        </div>
        <div>
          <div className="relative h-72 md:h-80">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={summary} className="absolute inset-0 h-full w-full">
              {yTicks.map((tick) => (
                <line key={tick} x1="0" x2="100" y1={percentY(tick, yDomain)} y2={percentY(tick, yDomain)} stroke="#e4e6ea" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              ))}
              {drawn.map((item) => {
                const d = item.points
                  .map((point, index) => `${index === 0 ? "M" : "L"}${percentX(point.x, xDomain).toFixed(2)} ${percentY(point.y, yDomain).toFixed(2)}`)
                  .join(" ");
                return (
                  <path
                    key={item.id}
                    d={d}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray={item.pattern === "dashed" ? "6 4" : undefined}
                  />
                );
              })}
            </svg>
            {annotations.map((note) => (
              <span
                key={note.label}
                className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#141414] bg-white"
                style={{ left: `${percentX(note.x, xDomain)}%`, top: `${percentY(note.y, yDomain)}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[12px] leading-none text-[#3f4651] md:text-[13px]">
            {xTickValues.map((tick) => (
              <span key={tick} data-axis="x">
                {xFormat(tick)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {annotations.map((note) => (
          <li key={note.label} data-annotation className="text-[14px] leading-snug text-[#141414] md:text-[15px]">
            {note.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const W = 720;
const H = 320;
const LEFT = 68;
const RIGHT = 128;
const TOP = 20;
const BOTTOM = 40;

function plotX(value: number, domain: { min: number; max: number }, left: number, right: number) {
  const span = domain.max - domain.min || 1;
  return left + ((value - domain.min) / span) * (right - left);
}

function plotY(value: number, domain: { min: number; max: number }, top: number, bottom: number) {
  const span = domain.max - domain.min || 1;
  return top + (1 - (value - domain.min) / span) * (bottom - top);
}

function percentX(value: number, domain: { min: number; max: number }) {
  const span = domain.max - domain.min || 1;
  return ((value - domain.min) / span) * 100;
}

function percentY(value: number, domain: { min: number; max: number }) {
  const span = domain.max - domain.min || 1;
  return (1 - (value - domain.min) / span) * 100;
}

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
      {emphasize ? (
        <ReadingPlot
          summary={summary}
          drawn={drawn}
          yTicks={yTicks}
          xTickValues={xTickValues}
          xDomain={xDomain}
          yDomain={yDomain}
          yFormat={yFormat}
          xFormat={xFormat}
          annotations={annotations}
        />
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="h-auto w-full">
          {yTicks.map((tick) => {
            const y = plotY(tick, yDomain, TOP, H - BOTTOM);
            return (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={y} y2={y} stroke="#e4e6ea" />
                <text x={LEFT - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#3f4651">
                  {yFormat(tick)}
                </text>
              </g>
            );
          })}
          {xTickValues.map((tick) => (
            <text key={tick} x={plotX(tick, xDomain, LEFT, W - RIGHT)} y={H - 12} textAnchor="middle" fontSize="11" fill="#3f4651">
              {xFormat(tick)}
            </text>
          ))}
          {drawn.map((item, seriesIndex) => {
            const d = item.points
              .map((point, index) => {
                const x = plotX(point.x, xDomain, LEFT, W - RIGHT);
                const y = plotY(point.y, yDomain, TOP, H - BOTTOM);
                return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
              })
              .join(" ");
            const last = item.points[item.points.length - 1];
            return (
              <g key={item.id}>
                <path d={d} fill="none" stroke={item.color} strokeWidth={2} strokeDasharray={item.pattern === "dashed" ? "7 5" : undefined} />
                <Marker x={plotX(last.x, xDomain, LEFT, W - RIGHT)} y={plotY(last.y, yDomain, TOP, H - BOTTOM)} kind={item.marker} color={item.color} />
                <text x={plotX(last.x, xDomain, LEFT, W - RIGHT) + 8} y={plotY(last.y, yDomain, TOP, H - BOTTOM) + seriesIndex * 14 - 6} fontSize="12" fill="#141414">
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
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
