"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  blendedTokenPrice,
  inferenceCostEndpoints,
  usDataCenterElectricity,
  worldDataCenterElectricity,
  type ElectricityPoint,
} from "@/lib/data/digital-series";
import { formatNumber } from "@/lib/format";

function AnchorChart({
  title,
  geography,
  points,
  caption,
}: {
  title: string;
  geography: string;
  points: ElectricityPoint[];
  caption: string;
}) {
  const [showTable, setShowTable] = useState(false);
  const [scenarios, setScenarios] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(points.filter((point) => point.scenario).map((point) => [point.id, true])),
  );
  const tableId = useId();
  const shown = points.filter((point) => point.status === "estimate" || scenarios[point.id]);
  const estimates = shown.filter((point) => point.status === "estimate");
  const futures = shown.filter((point) => point.status === "scenario");
  const width = 720;
  const height = 340;
  const left = 64;
  const right = 40;
  const top = 28;
  const bottom = 40;
  const years = [...new Set(shown.map((point) => point.year))].sort((a, b) => a - b);
  const max = Math.max(...shown.map((point) => point.valueTwh), 1);
  const xOf = (year: number, slot = 0, slots = 1) => {
    const index = years.indexOf(year);
    const span = Math.max(years.length - 1, 1);
    const base = left + (index / span) * (width - left - right);
    return base + (slot - (slots - 1) / 2) * 16;
  };
  const yOf = (value: number) => top + (1 - value / (max * 1.08)) * (height - top - bottom);
  const lastEstimate = estimates[estimates.length - 1];

  return (
    <figure>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm text-[#3f4651]">{geography} · TWh per year</p>
        </div>
        <Button type="button" variant="outline" className="h-11 rounded-none px-3" aria-expanded={showTable} aria-controls={tableId} onClick={() => setShowTable((value) => !value)}>
          {showTable ? "Hide table" : "Show table"}
        </Button>
      </div>
      {futures.length > 0 ? (
        <fieldset className="mb-3">
          <legend className="mb-1 text-sm font-medium">Scenario anchors</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {points
              .filter((point) => point.scenario)
              .map((point) => (
                <label key={point.id} className="inline-flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={scenarios[point.id] ?? false}
                    onChange={() => setScenarios((current) => ({ ...current, [point.id]: !current[point.id] }))}
                  />
                  {point.scenario}
                </label>
              ))}
          </div>
        </fieldset>
      ) : null}
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}. ${geography}. Only reported years are marked.`} className="block w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        {[0, max / 2, max].map((tick) => (
          <g key={tick}>
            <line x1={left} x2={width - right} y1={yOf(tick)} y2={yOf(tick)} stroke="#e4e6ea" />
            <text x={left - 8} y={yOf(tick) + 4} textAnchor="end" fontSize="11" fill="#3f4651">
              {formatNumber(tick, 0)}
            </text>
          </g>
        ))}
        {years.map((year) => {
          const estimate = estimates.find((point) => point.year === year);
          const axis = estimate && estimate.yearLabel !== String(year) ? estimate.yearLabel : String(year);
          return (
            <text key={year} x={xOf(year)} y={height - 12} textAnchor="middle" fontSize="11" fill="#3f4651">
              {axis}
            </text>
          );
        })}
        {lastEstimate
          ? futures.map((point) => {
              const sameYear = futures.filter((item) => item.year === point.year);
              const slot = sameYear.findIndex((item) => item.id === point.id);
              return (
                <line
                  key={point.id}
                  x1={xOf(lastEstimate.year)}
                  y1={yOf(lastEstimate.valueTwh)}
                  x2={xOf(point.year, slot, sameYear.length)}
                  y2={yOf(point.valueTwh)}
                  stroke={point.id.includes("high") || point.id.includes("liftoff") ? "#D55E00" : point.id.includes("head") ? "#8A5EA8" : "#009E73"}
                  strokeDasharray="7 5"
                  strokeWidth="2"
                />
              );
            })
          : null}
        {estimates.map((point) => (
          <g key={point.id}>
            <circle cx={xOf(point.year)} cy={yOf(point.valueTwh)} r="5" fill="#0072B2" />
            <text x={xOf(point.year)} y={yOf(point.valueTwh) - 12} textAnchor="middle" fontSize="12" fill="#141414">
              {formatNumber(point.valueTwh, 0)}
            </text>
          </g>
        ))}
        {futures.map((point) => {
          const sameYear = futures.filter((item) => item.year === point.year);
          const slot = sameYear.findIndex((item) => item.id === point.id);
          const x = xOf(point.year, slot, sameYear.length);
          const y = yOf(point.valueTwh);
          return (
            <g key={`${point.id}-mark`}>
              {point.precision === "exceeding" ? (
                <>
                  <line x1={x - 9} x2={x + 9} y1={y} y2={y} stroke="#D55E00" strokeWidth="1.75" />
                  <line x1={x} x2={x} y1={y} y2={y - 12} stroke="#D55E00" strokeWidth="1.5" />
                  <polyline points={`${x - 4},${y - 8} ${x},${y - 14} ${x + 4},${y - 8}`} fill="none" stroke="#D55E00" strokeWidth="1.5" />
                  <text x={x} y={y - 20} textAnchor="middle" fontSize="12" fill="#141414">
                    {`>${formatNumber(point.valueTwh, 0)}`}
                  </text>
                </>
              ) : (
                <>
                  <rect x={x - 5} y={y - 5} width="10" height="10" fill="none" stroke="#141414" strokeWidth="1.5" />
                  <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fill="#141414">
                    {formatNumber(point.valueTwh, 0)}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <li>Blue circle: estimate</li>
        <li>Open square: stated scenario level</li>
        {shown.some((point) => point.precision === "exceeding") ? (
          <li>Up arrow: lower bound. Lift-off is stated as exceeding 1,700 TWh, so the mark sits on that bound and is labeled &gt;1,700.</li>
        ) : null}
        <li>Dashed line: join from the last estimate to a scenario mark only</li>
      </ul>
      <figcaption className="mt-2 text-sm leading-relaxed text-[#3f4651]">{caption}</figcaption>
      <div id={tableId} hidden={!showTable} className="mt-4 overflow-auto border border-[#e4e6ea]">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{title} reported anchors</caption>
          <thead>
            <tr className="border-b border-[#e4e6ea]">
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">TWh / year</th>
              <th className="px-3 py-2 font-medium">How stated</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((point) => (
              <tr key={point.id} className="border-b border-[#e4e6ea]">
                <th scope="row" className="px-3 py-2 font-normal">{point.yearLabel}</th>
                <td className="px-3 py-2 tabular-nums">{point.precision === "exceeding" ? `>${formatNumber(point.valueTwh, 0)}` : point.valueTwh}</td>
                <td className="px-3 py-2">{point.precision}</td>
                <td className="px-3 py-2">{point.status}{point.scenario ? ` · ${point.scenario}` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function ElectricityCharts() {
  const [place, setPlace] = useState<"united-states" | "world">("world");
  const points = place === "world" ? worldDataCenterElectricity : usDataCenterElectricity;
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Geography">
        <Button type="button" variant={place === "world" ? "default" : "outline"} className="h-11 rounded-none px-3" aria-pressed={place === "world"} onClick={() => setPlace("world")}>
          World, IEA
        </Button>
        <Button type="button" variant={place === "united-states" ? "default" : "outline"} className="h-11 rounded-none px-3" aria-pressed={place === "united-states"} onClick={() => setPlace("united-states")}>
          United States, LBNL
        </Button>
      </div>
      <AnchorChart
        key={place}
        title="Data center electricity"
        geography={place === "world" ? "World" : "United States"}
        points={points}
        caption={
          place === "world"
            ? "IEA Energy and AI, public report page, retrieved 7 November 2026. 2024 is an estimate of about 415 TWh. 2030 and the 700 and 970 marks in 2035 are stated scenario levels. Dashed joins are not annual history. Lift-off is stated as exceeding 1,700 TWh: the arrow marks that lower bound and the label is >1,700, not a measured 1,700. No band. A redistribution license for the IEA report was not identified."
            : "LBNL-2001637 executive summary, 2024 United States Data Center Energy Usage Report, retrieved 7 November 2026. 2014–2016 is one statement, about 60 TWh, not three annual readings. 2018 is about 76 TWh. 2023 is 176 TWh. 2028 is a scenario range, roughly 325 to 580 TWh. Years between the marks are not in this chart."
        }
      />
    </div>
  );
}

export function InferenceCostChart() {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const series = [
    { id: "mmlu", label: "MMLU 64.8", color: "#0072B2", marker: "circle" as const },
    { id: "gpqa", label: "GPQA above 50%", color: "#D55E00", marker: "square" as const },
  ];
  const points = inferenceCostEndpoints.map((point) => ({
    ...point,
    series: point.benchmark === "MMLU" ? "mmlu" : "gpqa",
    t: point.period === "2022-11" ? 0 : point.period === "2024-05" ? 1.5 : point.period === "2024-10" ? 1.9 : 2.1,
  }));
  const width = 720;
  const height = 340;
  const left = 56;
  const right = 118;
  const top = 36;
  const bottom = 40;
  const log = (value: number) => Math.log10(value);
  const min = Math.min(...points.map((point) => log(point.usdPerMillionTokens)));
  const max = Math.max(...points.map((point) => log(point.usdPerMillionTokens)));
  const xOf = (t: number) => left + (t / 2.1) * (width - left - right);
  const yOf = (value: number) => top + (1 - (log(value) - min) / (max - min || 1)) * (height - top - bottom);

  return (
    <figure>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-medium">Inference price at a fixed threshold</h3>
          <p className="text-sm text-[#3f4651]">$ per million tokens, log scale. MMLU at the 64.8 threshold and GPQA above 50% are separate tests, not one intelligence scale.</p>
        </div>
        <Button type="button" variant="outline" className="h-11 rounded-none px-3" aria-expanded={showTable} aria-controls={tableId} onClick={() => setShowTable((value) => !value)}>
          {showTable ? "Hide table" : "Show table"}
        </Button>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Comparison of reported inference-price endpoints in dollars per million tokens. MMLU at the 64.8 threshold and GPQA above 50 percent are separate tests, not one intelligence scale. Dashed connectors compare the two reported endpoints of each threshold and are not an observed monthly path." className="block w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        {[0.1, 1, 10, 20].filter((tick) => tick >= 0.07 && tick <= 20).map((tick) => (
          <g key={tick}>
            <line x1={left} x2={width - right} y1={yOf(tick)} y2={yOf(tick)} stroke="#e4e6ea" />
            <text x={left - 8} y={yOf(tick) + 4} textAnchor="end" fontSize="11" fill="#3f4651">
              {tick}
            </text>
          </g>
        ))}
        {series.map((spec) => {
          const pair = points.filter((point) => point.series === spec.id);
          if (pair.length !== 2) return null;
          return (
            <line
              key={spec.id}
              x1={xOf(pair[0].t)}
              y1={yOf(pair[0].usdPerMillionTokens)}
              x2={xOf(pair[1].t)}
              y2={yOf(pair[1].usdPerMillionTokens)}
              stroke={spec.color}
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          );
        })}
        {points.map((point) => {
          const spec = series.find((item) => item.id === point.series)!;
          return (
            <g key={point.id}>
              {spec.marker === "circle" ? (
                <circle cx={xOf(point.t)} cy={yOf(point.usdPerMillionTokens)} r="5" fill={spec.color} />
              ) : (
                <rect x={xOf(point.t) - 5} y={yOf(point.usdPerMillionTokens) - 5} width="10" height="10" fill={spec.color} />
              )}
              <text
                x={xOf(point.t) + 10}
                y={yOf(point.usdPerMillionTokens) + ((point.usdPerMillionTokens >= 1 ? point.series === "mmlu" : point.series === "gpqa") ? (point.usdPerMillionTokens >= 10 ? -16 : -8) : 16)}
                fontSize="12"
                fill="#141414"
              >
                {point.period} · ${point.usdPerMillionTokens}
              </text>
            </g>
          );
        })}
        <text x={left} y={height - 12} fontSize="11" fill="#3f4651">Nov 2022</text>
        <text x={width - right - 40} y={height - 12} fontSize="11" fill="#3f4651">Dec 2024</text>
      </svg>
      <ul className="mt-2 flex flex-wrap gap-x-5 text-sm">
        <li>Blue circle: $ per million tokens at the MMLU 64.8 threshold</li>
        <li>Vermilion square: $ per million tokens to exceed 50% on GPQA</li>
        <li>Dashed connector: comparison of the two reported endpoints for that one threshold. Not an observed monthly price path.</li>
      </ul>
      <figcaption className="mt-2 text-sm leading-relaxed text-[#3f4651]">
        Stanford HAI, 2025 AI Index, chapter 1, retrieved 7 November 2026. Four published endpoints only. The dashed connectors compare those endpoints. They are not a monthly series, and the two thresholds are not one intelligence scale. The price is the Index’s 3:1 weighted average of input and output token prices, in $ per million tokens, not a paid invoice. A reuse license for the report was not confirmed, so the figure is not reproduced. Epoch and Artificial Analysis databases named by Stanford are not copied. The vertical axis is logarithmic. No forecast.
      </figcaption>
      <div id={tableId} hidden={!showTable} className="mt-4 overflow-auto border border-[#e4e6ea]">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Published inference price endpoints</caption>
          <thead>
            <tr className="border-b border-[#e4e6ea]">
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Threshold</th>
              <th className="px-3 py-2 font-medium">USD / million tokens</th>
              <th className="px-3 py-2 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {inferenceCostEndpoints.map((point) => (
              <tr key={point.id} className="border-b border-[#e4e6ea]">
                <th scope="row" className="px-3 py-2 font-normal">{point.period}</th>
                <td className="px-3 py-2">{point.threshold}</td>
                <td className="px-3 py-2 tabular-nums">{point.usdPerMillionTokens}</td>
                <td className="px-3 py-2">{point.modelNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function TokenMixCalculator() {
  const [inputPrice, setInputPrice] = useState("1");
  const [outputPrice, setOutputPrice] = useState("3");
  const input = Number(inputPrice);
  const output = Number(outputPrice);
  const valid = Number.isFinite(input) && Number.isFinite(output) && input >= 0 && output >= 0 && inputPrice.trim() !== "" && outputPrice.trim() !== "";
  const blend = valid ? blendedTokenPrice(input, output) : null;

  return (
    <form className="mt-6 border border-[#e4e6ea] p-4" onSubmit={(event) => event.preventDefault()}>
      <h3 className="text-base font-medium">What the 3:1 blend does</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#3f4651]">
        Illustrative arithmetic, not a price quote. Stanford describes the Index price as a 3:1 weighted average of input and output token prices. This box reads that as (3 × input + output) / 4. Type your own unit prices. Nothing here is an API transaction or a current market.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="input-price">Input price, USD per million tokens</Label>
          <Input id="input-price" inputMode="decimal" value={inputPrice} onChange={(event) => setInputPrice(event.target.value)} className="mt-2 h-11 rounded-none px-3 text-base md:text-base" />
        </div>
        <div>
          <Label htmlFor="output-price">Output price, USD per million tokens</Label>
          <Input id="output-price" inputMode="decimal" value={outputPrice} onChange={(event) => setOutputPrice(event.target.value)} className="mt-2 h-11 rounded-none px-3 text-base md:text-base" />
        </div>
      </div>
      <p className="mt-4 text-sm" aria-live="polite">
        {blend == null ? "Enter two non-negative numbers." : `Blended price: ${formatNumber(blend, 4)} USD per million tokens.`}
      </p>
    </form>
  );
}
