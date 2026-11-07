"use client";

import { worldFeatures } from "@/lib/data/crop-atlas";
import { rowStatus, sharePercent, type CropRow } from "@/lib/data/crop-atlas";
import { formatNumber } from "@/lib/format";

const WIDTH = 960;
const HEIGHT = 460;
const NORTH = 84;
const SOUTH = -58;

export type MapFrame = "world" | "americas" | "europe-africa" | "asia";

function project(lon: number, lat: number) {
  const x = ((lon + 180) / 360) * WIDTH;
  const y = ((NORTH - lat) / (NORTH - SOUTH)) * HEIGHT;
  return { x, y };
}

export function frameBox(frame: MapFrame) {
  const windows = {
    world: [-180, 180, 84, -58],
    americas: [-168, -28, 78, -56],
    "europe-africa": [-28, 62, 72, -36],
    asia: [55, 180, 75, -12],
  } as const;
  const [west, east, north, south] = windows[frame];
  const a = project(west, north);
  const b = project(east, south);
  return `${a.x} ${a.y} ${Math.max(b.x - a.x, 1)} ${Math.max(b.y - a.y, 1)}`;
}

function pathFor(rings: number[][][]) {
  return rings
    .map((ring) =>
      ring
        .map((pair, index) => {
          const point = project(pair[0], pair[1]);
          return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
        })
        .join(" "),
    )
    .join(" ");
}

export function fillFor(status: "missing" | "zero" | "reported", share: number | null) {
  if (status === "missing") return "#efece6";
  if (status === "zero") return "#ffffff";
  const value = share ?? 0;
  if (value >= 15) return "#0b2a4a";
  if (value >= 8) return "#1f5582";
  if (value >= 3) return "#4f8bb8";
  if (value >= 1) return "#9fc3de";
  return "#d9e7f1";
}

export function ChoroplethMap({
  rows,
  total,
  frame = "world",
  selectedIso,
  outlineIsos = [],
  onSelect,
  label,
  unit = "tonnes",
}: {
  rows: CropRow[];
  total: number;
  frame?: MapFrame;
  selectedIso?: string;
  outlineIsos?: string[];
  onSelect?: (iso3: string) => void;
  label: string;
  unit?: string;
}) {
  const byIso = new Map(rows.map((row) => [row.iso3, row]));
  return (
    <svg viewBox={frameBox(frame)} role="img" aria-label={label} className="h-auto w-full bg-white">
      <rect width={WIDTH} height={HEIGHT} fill="#f7f6f2" />
      {worldFeatures.map((feature) => {
        const row = byIso.get(feature.iso3);
        const status = rowStatus(row);
        const share = sharePercent(row?.value ?? null, total);
        const outlined = feature.iso3 === selectedIso || outlineIsos.includes(feature.iso3);
        return (
          <path
            key={feature.iso3}
            d={pathFor(feature.rings)}
            fill={fillFor(status, share)}
            stroke={outlined ? "#c8461f" : "#ffffff"}
            strokeWidth={feature.iso3 === selectedIso ? 3.5 : outlined ? 2.2 : 0.4}
            onClick={onSelect ? () => onSelect(feature.iso3) : undefined}
          >
            <title>
              {feature.name}. {status === "missing" ? "No figure" : status === "zero" ? "Zero" : `${formatNumber(row?.value ?? 0, 0)} ${unit}`}
            </title>
          </path>
        );
      })}
    </svg>
  );
}
