"use client";

import { useState } from "react";
import { ChoroplethMap, type MapFrame } from "@/components/choropleth-map";
import {
  countrySum,
  cropElements,
  cropItems,
  isOnMap,
  sharePercent,
  sliceRows,
  yearsFor,
  type CropElement,
  type CropItem,
  type CropRow,
} from "@/lib/data/crop-atlas";
import { formatNumber } from "@/lib/format";

export function CropAtlas() {
  const [item, setItem] = useState<CropItem>("wheat");
  const [element, setElement] = useState<CropElement>("production");
  const [year, setYear] = useState(2024);
  const [selectedIso, setSelectedIso] = useState("UKR");
  const [frame, setFrame] = useState<MapFrame>("world");
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
        The first view is the whole world, so a country is small on a phone. Use Europe and Africa, Asia, or the Americas for a closer frame, or choose the country from the list. The shapes are a guide, not a precise tap target.
      </p>
      <label className="mt-3 block max-w-md text-sm font-medium">
        Country
        <select
          className="mt-1 h-11 w-full border border-[#c5cad3] bg-white px-3 text-base"
          value={rows.some((row) => row.iso3 === selectedIso) ? selectedIso : ""}
          onChange={(event) => setSelectedIso(event.target.value)}
        >
          <option value="" disabled>
            Choose a country
          </option>
          {ranked.map((row) => (
            <option key={row.iso3} value={row.iso3}>
              {row.area}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#3f4651]">
        {itemMeta.productNote} {elementMeta.label} in {elementMeta.unit}, {activeYear}.{" "}
        {item === "sunflower-oil" && element === "production"
          ? "Crude sunflower oil production in this file stops at 2023. 2024 is not shown because it is absent, not because it is zero."
          : "The year is the one selected. Production and exports are separate series."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Map frame">
        {(
          [
            ["world", "Whole world"],
            ["americas", "Americas"],
            ["europe-africa", "Europe and Africa"],
            ["asia", "Asia"],
          ] as const
        ).map(([id, label]) => (
          <Choice key={id} pressed={frame === id} onClick={() => setFrame(id)} label={label} />
        ))}
      </div>
      <div className="mt-3 min-w-0 max-w-full border border-[#d9d3c6] bg-white">
        <ChoroplethMap
          rows={rows}
          total={total}
          frame={frame}
          selectedIso={selectedIso}
          onSelect={setSelectedIso}
          unit={elementMeta.unit}
          label={`World map of ${itemMeta.label} ${elementMeta.label} in ${activeYear}. Equirectangular. Not equal-area. The frame buttons move between the whole world, the Americas, Europe and Africa, and Asia. A country list below selects precisely.`}
        />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#3f4651]">
        <li className="flex items-center gap-2"><span className="inline-block size-3 border border-[#d9d3c6] bg-[#efece6]" /> No figure</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 border border-[#d9d3c6] bg-white" /> Zero</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#d9e7f1]" /> Under 1% of the country sum</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#9fc3de]" /> 1% to under 3%</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#4f8bb8]" /> 3% to under 8%</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#1f5582]" /> 8% to under 15%</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 bg-[#0b2a4a]" /> 15% or more</li>
        <li className="flex items-center gap-2"><span className="inline-block size-3 border-2 border-[#c8461f] bg-white" /> Selected country</li>
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
        <details className="border border-[#e4e6ea] p-3">
          <summary className="min-h-11 cursor-pointer text-sm font-medium">All countries in this file</summary>
          <div className="mt-3 max-h-80 overflow-auto border border-[#e4e6ea]">
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
                <tr key={row.iso3} data-iso={row.iso3} className={row.iso3 === selectedIso ? "border-b border-[#141414] bg-[#141414] text-white" : "border-b border-[#e4e6ea]"}>
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
        </details>
      </div>
      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-[#3f4651]">
        <p>
          Colour is the share of countries in this file. A blank cell is “No figure”, not zero. Ukraine is not the same territory in 2021 as in 2023 or 2024, and this file does not say how FAOSTAT drew that line.
        </p>
        {russia && russia.flag !== "A" ? (
          <p>Russia in this view: flag {russia.flag}{russia.note ? `, ${russia.note}` : ""}.</p>
        ) : null}
        {item === "sunflower-oil" && ukraine ? (
          <p>Ukraine crude sunflower oil: flag {ukraine.flag}{ukraine.note ? `, ${ukraine.note}` : ""}.</p>
        ) : null}
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
