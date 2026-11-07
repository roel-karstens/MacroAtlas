"use client";

import { useState } from "react";
import { LineChart } from "@/components/line-chart";
import { createBrowserStore } from "@/lib/browser-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPercentFromDecimal, formatSigned } from "@/lib/format";
import { bondPriceCurve, defaultBondForm, yieldShiftToDecimal, type BondFormFields } from "@/lib/models/bond-sensitivity";
import { errorMap, evaluateBondForm, parseDecimal } from "@/lib/models/parse";

const SHIFTS = [-0.02, -0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02];
const bondStore = createBrowserStore<Saved>("macro-atlas.bond-sensitivity.v1", parseSaved, { a: null, b: null });

type Saved = { a: BondFormFields | null; b: BondFormFields | null };

function isFields(value: unknown): value is BondFormFields {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const keys = ["annualYieldPercent", "modifiedDuration", "shiftValue", "horizonYears", "costsBp", "convexity"] as const;
  return (
    keys.every((key) => typeof record[key] === "string") &&
    (record.shiftUnit === "bp" || record.shiftUnit === "pp") &&
    typeof record.convexityEnabled === "boolean"
  );
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

export function BondModelPanel() {
  const [fields, setFields] = useState<BondFormFields>(defaultBondForm);
  const snap = bondStore.useSnap();
  const saved = snap.value;
  const remember = snap.remember;
  const evaluation = evaluateBondForm(fields);
  const errors = evaluation.ok ? {} : errorMap(evaluation.errors);
  const parsedShift = parseDecimal(fields.shiftValue);

  function update<K extends keyof BondFormFields>(key: K, value: BondFormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function curveFor(form: BondFormFields, id: string, label: string, color: string, marker: "square" | "circle" | "diamond") {
    const run = evaluateBondForm(form);
    if (!run.ok) return null;
    return {
      id,
      label,
      color,
      pattern: "dashed" as const,
      marker,
      status: "Model",
      points: bondPriceCurve(run.inputs, SHIFTS).flatMap((point) =>
        point.priceEffect == null ? [] : [{ x: point.yieldShift * 10_000, y: point.priceEffect * 100 }],
      ),
    };
  }

  const series = [
    curveFor(fields, "current", "This scenario", "#0072B2", "square"),
    saved.a ? curveFor(saved.a, "a", "Scenario A", "#009E73", "circle") : null,
    saved.b ? curveFor(saved.b, "b", "Scenario B", "#D55E00", "diamond") : null,
  ].filter((item) => item !== null);

  const shiftSentence = parsedShift.ok
    ? `${parsedShift.value} ${fields.shiftUnit === "bp" ? "basis points" : "percentage points"} = ${formatSigned(yieldShiftToDecimal(parsedShift.value, fields.shiftUnit) * 10_000, 1)} bp = ${formatSigned(yieldShiftToDecimal(parsedShift.value, fields.shiftUnit) * 100, 2)} percentage points = ${yieldShiftToDecimal(parsedShift.value, fields.shiftUnit).toFixed(4)} decimal.`
    : "Enter a yield shift to see the conversion.";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form
        className="space-y-5"
        onSubmit={(event) => event.preventDefault()}
      >
        <p className="border border-[#e4e6ea] p-4 text-sm leading-relaxed">
          The starting yield is a bond-market yield you type. It is not the central-bank policy rate, and it is not copied from an official series. The default, 3 percent, is an illustration.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="horizon" label="Horizon (years)" hint="0.25 is one quarter. Carry is yield × years." error={errors.horizonYears} value={fields.horizonYears} onChange={(value) => update("horizonYears", value)} />
          <Field id="shift" label="Bond yield change" hint={fields.shiftUnit === "bp" ? "Basis points. 100 means 1 percentage point." : "Percentage points. 1 means 100 basis points."} error={errors.yieldShift} value={fields.shiftValue} onChange={(value) => update("shiftValue", value)} />
          <Field id="duration" label="Modified duration (years)" hint="Not Macaulay duration. The form does not convert." error={errors.modifiedDuration} value={fields.modifiedDuration} onChange={(value) => update("modifiedDuration", value)} />
        </div>
        <fieldset>
          <legend className="text-sm font-medium">Yield-shift unit</legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
            {(
              [
                ["bp", "Basis points"],
                ["pp", "Percentage points"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex min-h-11 items-center gap-2 text-sm">
                <input type="radio" name="shift-unit" checked={fields.shiftUnit === value} onChange={() => update("shiftUnit", value)} />
                {label}
              </label>
            ))}
          </div>
          <p className="text-sm text-[#3f4651]">{shiftSentence}</p>
        </fieldset>
        <Field id="yield" label="Annual starting yield (%)" hint="Type 3 for 3%, which is 0.03 in decimal. This example is not the latest print." error={errors.annualYield} value={fields.annualYieldPercent} onChange={(value) => update("annualYieldPercent", value)} />
        <Field id="costs" label="Costs (basis points of return)" hint="20 means 20 basis points, or 0.002 in decimal return. Not 20 percent." error={errors.costs} value={fields.costsBp} onChange={(value) => update("costsBp", value)} />
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={fields.convexityEnabled} onChange={(event) => update("convexityEnabled", event.target.checked)} />
          Include convexity
        </label>
        {fields.convexityEnabled ? (
          <Field id="convexity" label="Convexity" hint="Units where 60 and a 100bp move add 0.30 percentage points. Do not paste a differently scaled vendor number." error={errors.convexity} value={fields.convexity} onChange={(value) => update("convexity", value)} />
        ) : (
          <p className="text-sm text-[#3f4651]">Convexity is omitted, not estimated as zero.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-11 rounded-none px-4" disabled={!evaluation.ok} onClick={() => evaluation.ok && bondStore.update({ ...saved, a: fields })}>
            Compare scenarios
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-none px-4" disabled={!evaluation.ok} onClick={() => evaluation.ok && bondStore.update({ ...saved, b: fields })}>
            Save as B
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-none px-4" onClick={() => setFields(defaultBondForm)}>
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-none px-4"
            onClick={() =>
              setFields({
                annualYieldPercent: "3",
                modifiedDuration: "7",
                shiftValue: "100",
                shiftUnit: "bp",
                horizonYears: "1",
                costsBp: "0",
                convexityEnabled: false,
                convexity: "",
              })
            }
          >
            Textbook case
          </Button>
        </div>
        <label className="flex min-h-11 items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" checked={remember} onChange={(event) => bondStore.setRemember(event.target.checked)} />
          <span>Remember comparisons on this device. Not stored on a server.</span>
        </label>
        {remember ? <p className="text-sm text-[#3f4651]">Stored locally in this browser. Not saved on a server.</p> : null}
      </form>
      <div aria-live="polite">
        <p className="text-sm text-[#3f4651]">02 · Scenario sketch</p>
        {evaluation.ok ? (
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="text-sm text-[#3f4651]">Duration price effect, before carry and convexity</dt>
              <dd className="font-display text-5xl leading-none font-semibold">{formatPercentFromDecimal(evaluation.result.durationPriceEffect)}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[#3f4651]">Convexity</dt>
                <dd>{evaluation.result.convexityApplied ? formatPercentFromDecimal(evaluation.result.convexityEffect) : "Omitted"}</dd>
              </div>
              <div>
                <dt className="text-[#3f4651]">Price effect</dt>
                <dd>{formatPercentFromDecimal(evaluation.result.priceEffect)}</dd>
              </div>
              <div>
                <dt className="text-[#3f4651]">Carry</dt>
                <dd>{formatPercentFromDecimal(evaluation.result.carry)}</dd>
              </div>
              <div>
                <dt className="text-[#3f4651]">Total-return sketch</dt>
                <dd>{formatPercentFromDecimal(evaluation.result.totalReturn)}</dd>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#3f4651]">
              Carry {formatPercentFromDecimal(evaluation.result.carry)} + price effect {formatPercentFromDecimal(evaluation.result.priceEffect)} − costs {formatPercentFromDecimal(evaluation.inputs.costs)} = {formatPercentFromDecimal(evaluation.result.totalReturn)}. Simple carry is annual yield times years. It is not compounded.
            </p>
            {evaluation.result.warnings.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#3f4651]">
                {evaluation.result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}
          </dl>
        ) : (
          <p className="mt-3 text-sm">Enter a valid scenario. The sketch updates only from these inputs.</p>
        )}
        <div className="mt-6">
          <LineChart
            title="Approximate price effect"
            unit="Percent"
            formatX={(value) => `${formatSigned(value, 0)} bp`}
            formatY={(value) => `${formatSigned(value, 1)}%`}
            series={series}
            caption="Dashed lines are the model, not market history. Conceptual sensitivity, not a forecast. Color is paired with a dash pattern, a marker, and a direct label."
          />
        </div>
      </div>
    </div>
  );
}
