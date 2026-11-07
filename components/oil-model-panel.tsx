"use client";

import { useState } from "react";
import { LineChart } from "@/components/line-chart";
import { createBrowserStore } from "@/lib/browser-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatSigned } from "@/lib/format";
import { defaultOilForm, oilProfitCurve, type OilFormFields } from "@/lib/models/oil-exposure";
import { errorMap, evaluateOilForm } from "@/lib/models/parse";

const PRICE_STEPS = [-40, -30, -20, -10, 0, 10, 20, 30, 40];
const oilStore = createBrowserStore<Saved>("macro-atlas.oil-exposure.v1", parseSaved, { a: null, b: null });

type Saved = { a: OilFormFields | null; b: OilFormFields | null };

function isFields(value: unknown): value is OilFormFields {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const keys = [
    "horizonDays",
    "priceChangeUsdPerBarrel",
    "magnitudeBarrelsPerDay",
    "passThrough",
    "reportingCurrencyPerUsd",
    "currencyLabel",
    "extraCostsReporting",
  ] as const;
  return keys.every((key) => typeof record[key] === "string") && (record.position === "producer" || record.position === "consumer");
}

function parseSaved(value: unknown): Saved | null {
  if (!value || typeof value !== "object") return null;
  const record = value as { a?: unknown; b?: unknown };
  const a = isFields(record.a) ? record.a : null;
  const b = isFields(record.b) ? record.b : null;
  if (!a && !b) return null;
  return { a, b };
}

function Field({
  id,
  label,
  hint,
  error,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <p id={`${id}-hint`} className="mt-1 text-sm text-[#3f4651]">
        {hint}
      </p>
      <Input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-hint ${id}-error` : `${id}-hint`}
        className="mt-2 h-11 rounded-none px-3 text-base md:text-base"
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-[#7a2e0e]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function OilModelPanel() {
  const [fields, setFields] = useState<OilFormFields>(defaultOilForm);
  const snap = oilStore.useSnap();
  const saved = snap.value;
  const remember = snap.remember;
  const evaluation = evaluateOilForm(fields);
  const errors = evaluation.ok ? {} : errorMap(evaluation.errors);

  function update<K extends keyof OilFormFields>(key: K, value: OilFormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function curveFor(form: OilFormFields, id: string, label: string, color: string, marker: "square" | "circle" | "diamond") {
    const run = evaluateOilForm(form);
    if (!run.ok) return null;
    return {
      id,
      label,
      color,
      pattern: "dashed" as const,
      marker,
      status: "Scenario",
      points: oilProfitCurve(run.inputs, PRICE_STEPS).map((point) => ({
        x: point.priceChangeUsdPerBarrel,
        y: point.operatingProfitChange ?? 0,
      })),
    };
  }

  const series = [
    curveFor(fields, "current", "This scenario", "#0072B2", "square"),
    saved.a ? curveFor(saved.a, "a", "Scenario A", "#009E73", "circle") : null,
    saved.b ? curveFor(saved.b, "b", "Scenario B", "#D55E00", "diamond") : null,
  ].filter((item) => item !== null);

  const currency = fields.currencyLabel.trim() || "currency";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <p className="text-sm leading-relaxed text-[#3f4651]">
          Positive barrels are a net producer: a higher price raises operating profit. Negative barrels are a net consumer: a higher price lowers it. The price change is yours. It is not read from ship counts or from the Brent series.
        </p>
        <fieldset>
          <legend className="text-sm font-medium">Position</legend>
          <div className="mt-2 flex flex-col gap-2">
            {(
              [
                ["producer", "Net producer, unhedged seller"],
                ["consumer", "Net consumer, unhedged buyer"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="position"
                  value={value}
                  checked={fields.position === value}
                  onChange={() => update("position", value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <Field id="horizon" label="Time horizon (days)" hint="Exposure is an average per day, so days multiply it." error={errors.horizonDays} value={fields.horizonDays} onChange={(value) => update("horizonDays", value)} />
        <Field id="price" label="Price change (USD per barrel)" hint="A scenario you choose. Positive means the benchmark rises." error={errors.priceChangeUsdPerBarrel} value={fields.priceChangeUsdPerBarrel} onChange={(value) => update("priceChangeUsdPerBarrel", value)} />
        <Field id="barrels" label="Unhedged net exposure (barrels per day)" hint="Enter the magnitude. The position choice sets the sign." error={errors.magnitudeBarrelsPerDay || errors.unhedgedNetBarrelsPerDay} value={fields.magnitudeBarrelsPerDay} onChange={(value) => update("magnitudeBarrelsPerDay", value)} />
        <Field id="pass" label="Pass-through (0 to 1)" hint="Share of the benchmark move that reaches operating profit." error={errors.passThrough} value={fields.passThrough} onChange={(value) => update("passThrough", value)} />
        <Field id="fx" label="Reporting currency per 1 USD" hint="Use 1 when the result should stay in US dollars." error={errors.reportingCurrencyPerUsd} value={fields.reportingCurrencyPerUsd} onChange={(value) => update("reportingCurrencyPerUsd", value)} />
        <Field id="currency" label="Currency label" hint="A name for the result. It does not fetch an exchange rate." error={errors.currencyLabel} value={fields.currencyLabel} onChange={(value) => update("currencyLabel", value)} />
        <Field id="costs" label={`Extra costs (${currency})`} hint="Positive numbers reduce operating profit over the whole horizon." error={errors.extraCostsReporting} value={fields.extraCostsReporting} onChange={(value) => update("extraCostsReporting", value)} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-11 rounded-none px-4" onClick={() => evaluation.ok && oilStore.update({ ...saved, a: fields })} disabled={!evaluation.ok}>
            Save as A
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-none px-4" onClick={() => evaluation.ok && oilStore.update({ ...saved, b: fields })} disabled={!evaluation.ok}>
            Save as B
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-none px-4" onClick={() => setFields(defaultOilForm)}>
            Reset inputs
          </Button>
          <Button type="button" variant="ghost" className="h-11 rounded-none px-4" onClick={() => oilStore.update({ a: null, b: null })}>
            Clear comparison
          </Button>
        </div>
        <label className="flex min-h-11 items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" checked={remember} onChange={(event) => oilStore.setRemember(event.target.checked)} />
          <span>Remember comparisons on this device. Saved scenarios stay in this browser only. They are not stored on a server.</span>
        </label>
        {remember ? <p className="text-sm text-[#3f4651]">Stored locally in this browser. Not saved on a server.</p> : null}
      </form>
      <div aria-live="polite">
        <p className="text-sm text-[#3f4651]">02 · Result</p>
        {evaluation.ok ? (
          <>
            <p className="mt-2 font-display text-5xl leading-none font-semibold tracking-[-0.03em] md:text-6xl">
              {formatSigned(evaluation.result.operatingProfitChange, 0)}
              <span className="ml-2 font-sans text-lg font-normal tracking-normal">{currency}</span>
            </p>
            <p className="mt-3 text-sm text-[#3f4651]">
              Change in operating profit. Treated as {formatSigned(evaluation.inputs.unhedgedNetBarrelsPerDay, 0)} barrels per day
              ({fields.position === "producer" ? "net producer" : "net consumer"}).
            </p>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-[#3f4651]">Barrels over the horizon</dt>
              <dd className="tabular-nums">{formatSigned(evaluation.result.barrelsOverHorizon, 0)}</dd>
              <dt className="text-[#3f4651]">Effect before FX</dt>
              <dd className="tabular-nums">{formatSigned(evaluation.result.usdEffectBeforeFx, 0)} USD</dd>
              <dt className="text-[#3f4651]">After FX</dt>
              <dd className="tabular-nums">{formatSigned(evaluation.result.translatedEffect, 0)} {currency}</dd>
              <dt className="text-[#3f4651]">Extra costs</dt>
              <dd className="tabular-nums">{formatSigned(Number(fields.extraCostsReporting), 0)} {currency}</dd>
            </dl>
            <p className="mt-4 text-sm leading-relaxed">
              {formatSigned(evaluation.inputs.unhedgedNetBarrelsPerDay, 0)} × {fields.horizonDays} × {fields.priceChangeUsdPerBarrel} × {fields.passThrough} × {fields.reportingCurrencyPerUsd} − {fields.extraCostsReporting} = {formatSigned(evaluation.result.operatingProfitChange, 2)} {currency}.
            </p>
            {evaluation.result.warnings.length > 0 ? (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#3f4651]">
                {evaluation.result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-sm">Enter a valid scenario to calculate. Nothing is inferred.</p>
        )}
        <div className="mt-8">
          <LineChart
            title="Operating profit across price changes"
            unit={`${currency} over the horizon`}
            formatX={(value) => formatSigned(value, 0)}
            formatY={(value) => formatSigned(value, 0)}
            series={series}
            caption="Dashed lines are model scenarios, not history. The horizontal axis is the price change you could type, holding the other assumptions fixed. Not a forecast and not a share price."
          />
        </div>
      </div>
    </div>
  );
}
