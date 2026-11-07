"use client";

import { useState } from "react";
import { worldFeatures } from "@/lib/data/crop-atlas";
import {
  countrySum,
  cropElements,
  cropItems,
  isOnMap,
  rowStatus,
  sharePercent,
  sliceRows,
  yearsFor,
  type CropElement,
  type CropItem,
  type CropRow,
} from "@/lib/data/crop-atlas";
import { formatNumber } from "@/lib/format";

const WIDTH = 960;
const HEIGHT = 460;
const NORTH = 84;
const SOUTH = -58;

function project(lon: number, lat: number) {
  const x = ((lon + 180) / 360) * WIDTH;
  const y = ((NORTH - lat) / (NORTH - SOUTH)) * HEIGHT;
  return { x, y };
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

function fillFor(status: "missing" | "zero" | "reported", share: number | null) {
  if (status === "missing") return "#f3f4f6";
  if (status === "zero") return "#ffffff";
  const value = share ?? 0;
  if (value >= 15) return "#08306b";
  if (value >= 8) return "#08519c";
  if (value >= 3) return "#2171b5";
  if (value >= 1) return "#6baed6";
  return "#c6dbef";
}

export function CropAtlas() {
  const [item, setItem] = useState<CropItem>("wheat");
  const [element, setElement] = useState<CropElement>("production");
  const [year, setYear] = useState(2024);
  const [selectedIso, setSelectedIso] = useState("UKR");
  const years = yearsFor(item, element);
  const activeYear = years.includes(year) ? year : years[years.length - 1];
  const rows = sliceRows(item, element, activeYear);
  const total = countrySum(rows);
  const byIso = new Map(rows.map((row) => [row.iso3, row]));
  const elementMeta = cropElements.find((entry) => entry.id === element)!;
  const itemMeta = cropItems.find((entry) => entry.id === item)!;
  const ranked = [...rows].sort((a, b) => (b.value ?? -1) - (a.value ?? -1));
  const selected = byIso.get(selectedIso);
  const valueRow = sliceRows(item, "export-value", activeYear).find((row) => row.iso3 === selectedIso);
  const russia = byIso.get("RUS");
  const ukraine = byIso.get("UKR");
  const top = ranked.filter((row) => row.value != null && row.value > 0).slice(0, 8);
  const max = top[0]?.value ?? 1;

  return (
    <div className="mt-6 min-w-0">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Commodity">
        {cropItems.map((entry) => (
          <Choice key={entry.id} pressed={item === entry.id} onClick={() => setItem(entry.id)} label={entry.label} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Measure">
        {cropElements.filter((entry) => entry.id !== "export-value").map((entry) => (
          <Choice key={entry.id} pressed={element === entry.id} onClick={() => setElement(entry.id)} label={entry.label} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Year">
        {years.map((entry) => (
          <Choice key={entry} pressed={activeYear === entry} onClick={() => setYear(entry)} label={String(entry)} />
        ))}
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#3f4651]">
        {itemMeta.productNote} {elementMeta.label} in {elementMeta.unit}, {activeYear}.{" "}
        {item === "sunflower-oil" && element === "production"
          ? "Crude sunflower oil production in this file stops at 2023. 2024 is not shown because it is absent, not because it is zero."
          : "The year is the one selected. Production and exports are separate series."}
      </p>
      <div className="mt-4 min-w-0 overflow-x-auto border border-[#e4e6ea]">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`World map of ${itemMeta.label} ${elementMeta.label} in ${activeYear}. Equirectangular. Not equal-area.`} className="h-auto min-w-[640px]">
          <rect width={WIDTH} height={HEIGHT} fill="#f7f8f9" />
          {worldFeatures.map((feature) => {
            const row = byIso.get(feature.iso3);
            const status = rowStatus(row);
            const share = sharePercent(row?.value ?? null, total);
            const active = feature.iso3 === selectedIso;
            return (
              <path
                key={feature.iso3}
                d={pathFor(feature.rings)}
                fill={fillFor(status, share)}
                stroke={active ? "#141414" : "#ffffff"}
                strokeWidth={active ? 1.4 : 0.4}
                onClick={() => setSelectedIso(feature.iso3)}
              >
                <title>
                  {feature.name}. {status === "missing" ? "No figure" : status === "zero" ? "Zero" : `${formatNumber(row?.value ?? 0, 0)} ${elementMeta.unit}`}
                </title>
              </path>
            );
          })}
        </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#3f4651]">
        <li className="flex items-center gap-2"><span className="inline-block size-3 border border-[#e4e6ea] bg-[#f3f4f6]" /> No figure</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 border border-[#c5cad3] bg-white" /> Zero</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#c6dbef]" /> Under 1% of the country sum</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#2171b5]" /> 3% to under 8%</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#08306b]" /> 15% or more</li>
      </ul>
      <p className="mt-2 text-sm leading-relaxed text-[#3f4651]">
        Equirectangular frame from 84°N to 58°S. Area is not true. Natural Earth 1:110m, public domain. Boundaries do not imply endorsement. The join uses ISO_A3_EH, or ADM0_A3 when ISO_A3 is −99, which is how France and Norway match. Small states omitted by this scale stay in the total and in the table.
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <h3 className="text-base font-medium">Largest reported figures</h3>
          <ul className="mt-3 space-y-2">
            {top.map((row) => (
              <li key={row.iso3}>
                <button type="button" className="flex min-h-11 w-full items-center gap-3 text-left text-sm" onClick={() => setSelectedIso(row.iso3)} aria-pressed={selectedIso === row.iso3}>
                  <span className="w-28 shrink-0">{row.area}</span>
                  <span className="h-2 flex-1 bg-[#f3f4f6]">
                    <span className="block h-2 bg-[#0072B2]" style={{ width: `${Math.max(4, (row.value! / max) * 100)}%` }} />
                  </span>
                  <span className="w-24 shrink-0 text-right tabular-nums">{formatNumber(row.value ?? 0, 0)}</span>
                </button>
              </li>
            ))}
          </ul>
          <CountryNote row={selected} elementLabel={elementMeta.label} unit={elementMeta.unit} total={total} valueRow={element === "export-value" ? undefined : valueRow} />
        </div>
        <div className="max-h-80 overflow-auto border border-[#e4e6ea]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{itemMeta.label} {elementMeta.label} {activeYear}, every country in the file</caption>
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-[#e4e6ea]">
                <th className="px-3 py-2 font-medium">Country</th>
                <th className="px-3 py-2 font-medium">{elementMeta.unit}</th>
                <th className="px-3 py-2 font-medium">Share</th>
                <th className="px-3 py-2 font-medium">Flag</th>
                <th className="px-3 py-2 font-medium">On map</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((row) => (
                <tr key={row.iso3} className="border-b border-[#e4e6ea]">
                  <th scope="row" className="px-3 py-2 font-normal">
                    <button type="button" className="min-h-11 text-left underline-offset-4 hover:underline" onClick={() => setSelectedIso(row.iso3)}>
                      {row.area}
                    </button>
                  </th>
                  <td className="px-3 py-2 tabular-nums">{row.value == null ? "No figure" : formatNumber(row.value, 0)}</td>
                  <td className="px-3 py-2 tabular-nums">{sharePercent(row.value, total) == null ? "—" : `${formatNumber(sharePercent(row.value, total)!, 1)}%`}</td>
                  <td className="px-3 py-2">{row.flag}{row.note ? ` · ${row.note}` : ""}</td>
                  <td className="px-3 py-2">{isOnMap(row.iso3) ? "Yes" : "No, still in the total"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-[#3f4651]">
        <p>
          Shares use the sum of country figures in this file for this item, measure, and year. Regional aggregates and the duplicate China total are not in the file, so they are not in the denominator. A blank FAO cell stays “No figure”. It is not drawn as zero.
        </p>
        {russia ? (
          <p>
            Russia in this view: flag {russia.flag}{russia.note ? `, ${russia.note}` : ""}. Flag X here is an unofficial or external figure. Flag I is imputed.
          </p>
        ) : null}
        {item === "sunflower-oil" && ukraine ? (
          <p>Ukraine crude sunflower oil in this view: flag {ukraine.flag}{ukraine.note ? `, ${ukraine.note}` : ""}.</p>
        ) : null}
        <p>
          Ukraine’s tonnes are not a like-for-like territory from 2021 to 2023 or 2024. This bulk file does not state FAOSTAT’s exact treatment of occupied areas, so a change in the number is not presented as a change on an unchanged map.
        </p>
        <p>
          Historical only. On the UN’s Black Sea Grain Initiative pages, the Joint Coordination Centre is dated 27 July 2022 in Istanbul, while a photo caption on the same site says a signing ceremony on 22 July 2022 and another paragraph says 27 July. This page does not pick a signing day. The pages do say the corridor ran from Odesa, Chornomorsk and Yuzhny/Pivdennyi, and that the Initiative was not renewed after 17 July 2023. They also say that, while it ran, over 32 million metric tons of grain and foodstuffs went to 45 countries. That is a UN total for the corridor, not a FAOSTAT share, and not proof that one exporter replaced another or that the war caused euro-area food inflation. Black Sea shipping in 2026 is not described here.
        </p>
        <p>
          FAO. 2025. FAOSTAT: Crops and livestock products. Accessed 7 November 2026. https://www.fao.org/faostat/en/#data/QCL Licence: CC BY 4.0. FAO. 2026. FAOSTAT: Trade — Crops and livestock products. Accessed 7 November 2026. https://www.fao.org/faostat/en/#data/TCL Licence: CC BY 4.0. This licence is for FAOSTAT. It is not a licence for the Food Price Index.
        </p>
      </div>
    </div>
  );
}

function Choice({ pressed, onClick, label }: { pressed: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center border px-3 text-sm ${pressed ? "border-[#141414] bg-[#141414] text-white" : "border-[#c5cad3] bg-white"}`}
    >
      {label}
    </button>
  );
}

function CountryNote({
  row,
  elementLabel,
  unit,
  total,
  valueRow,
}: {
  row: CropRow | undefined;
  elementLabel: string;
  unit: string;
  total: number;
  valueRow?: CropRow;
}) {
  if (!row) {
    return <p className="mt-4 text-sm text-[#3f4651]">Select a country. If it has no row, this measure was not reported.</p>;
  }
  const share = sharePercent(row.value, total);
  return (
    <div className="mt-4 border border-[#e4e6ea] p-4 text-sm leading-relaxed">
      <p className="font-medium">{row.area}</p>
      <p className="mt-1">
        {elementLabel}: {row.value == null ? "No figure" : `${formatNumber(row.value, 0)} ${unit}`}
        {share == null ? "" : ` · ${formatNumber(share, 1)}% of the country sum`}
      </p>
      <p className="mt-1 text-[#3f4651]">Flag {row.flag || "—"}{row.note ? `. ${row.note}` : ""}.</p>
      {valueRow ? (
        <p className="mt-1 text-[#3f4651]">
          Export value, same item and year, is a different measure: {valueRow.value == null ? "no figure" : `${formatNumber(valueRow.value, 0)} thousand US dollars`}. Not tonnes.
        </p>
      ) : null}
    </div>
  );
}
