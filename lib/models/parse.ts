import {
  bondSensitivity,
  percentToDecimal,
  yieldShiftToDecimal,
  type BondFormFields,
  type BondInputs,
} from "@/lib/models/bond-sensitivity";
import {
  oilExposure,
  signedBarrelsPerDay,
  type OilFormFields,
  type OilInputs,
} from "@/lib/models/oil-exposure";

export type FieldError = { field: string; message: string };

const DECIMAL = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;

export function parseDecimal(raw: string): { ok: true; value: number } | { ok: false; message: string } {
  if (typeof raw !== "string") return { ok: false, message: "Enter a number." };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, message: "Enter a number." };
  if (!DECIMAL.test(trimmed)) {
    return { ok: false, message: "Use a plain decimal, without commas or a percent sign." };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { ok: false, message: "Enter a finite number." };
  return { ok: true, value };
}

export function evaluateOilForm(fields: OilFormFields):
  | { ok: true; inputs: OilInputs; result: Extract<ReturnType<typeof oilExposure>, { ok: true }>["result"] }
  | { ok: false; errors: FieldError[] } {
  const errors: FieldError[] = [];
  const take = (raw: string, field: string) => {
    const parsed = parseDecimal(raw);
    if (!parsed.ok) {
      errors.push({ field, message: parsed.message });
      return null;
    }
    return parsed.value;
  };

  const horizonDays = take(fields.horizonDays, "horizonDays");
  const priceChangeUsdPerBarrel = take(fields.priceChangeUsdPerBarrel, "priceChangeUsdPerBarrel");
  const magnitude = take(fields.magnitudeBarrelsPerDay, "magnitudeBarrelsPerDay");
  const passThrough = take(fields.passThrough, "passThrough");
  const reportingCurrencyPerUsd = take(fields.reportingCurrencyPerUsd, "reportingCurrencyPerUsd");
  const extraCostsReporting = take(fields.extraCostsReporting, "extraCostsReporting");
  const currencyLabel = fields.currencyLabel.trim();
  if (!currencyLabel) {
    errors.push({ field: "currencyLabel", message: "Name the reporting currency, for example USD." });
  } else if (currencyLabel.length > 16) {
    errors.push({ field: "currencyLabel", message: "Use a short currency label." });
  }
  if (fields.position !== "producer" && fields.position !== "consumer") {
    errors.push({ field: "position", message: "Choose producer or consumer." });
  }
  if (magnitude != null && magnitude < 0) {
    errors.push({
      field: "magnitudeBarrelsPerDay",
      message: "Enter exposure as a positive number of barrels per day. The producer or consumer choice sets the sign.",
    });
  }
  if (
    horizonDays == null ||
    priceChangeUsdPerBarrel == null ||
    magnitude == null ||
    passThrough == null ||
    reportingCurrencyPerUsd == null ||
    extraCostsReporting == null ||
    errors.length > 0
  ) {
    return { ok: false, errors };
  }

  const inputs: OilInputs = {
    horizonDays,
    priceChangeUsdPerBarrel,
    unhedgedNetBarrelsPerDay: signedBarrelsPerDay(magnitude, fields.position),
    passThrough,
    reportingCurrencyPerUsd,
    extraCostsReporting,
  };
  const computed = oilExposure(inputs);
  if (!computed.ok) return computed;
  return { ok: true, inputs, result: computed.result };
}

export function evaluateBondForm(fields: BondFormFields):
  | { ok: true; inputs: BondInputs; result: Extract<ReturnType<typeof bondSensitivity>, { ok: true }>["result"] }
  | { ok: false; errors: FieldError[] } {
  const errors: FieldError[] = [];
  const take = (raw: string, field: string) => {
    const parsed = parseDecimal(raw);
    if (!parsed.ok) {
      errors.push({ field, message: parsed.message });
      return null;
    }
    return parsed.value;
  };

  const annualYieldPercent = take(fields.annualYieldPercent, "annualYield");
  const modifiedDuration = take(fields.modifiedDuration, "modifiedDuration");
  const shiftValue = take(fields.shiftValue, "yieldShift");
  const horizonYears = take(fields.horizonYears, "horizonYears");
  const costsBp = take(fields.costsBp, "costs");
  let convexity: number | null = null;
  if (fields.convexityEnabled) {
    const parsed = take(fields.convexity, "convexity");
    convexity = parsed;
  }
  if (fields.shiftUnit !== "bp" && fields.shiftUnit !== "pp") {
    errors.push({ field: "yieldShift", message: "Choose basis points or percentage points." });
  }
  if (
    annualYieldPercent == null ||
    modifiedDuration == null ||
    shiftValue == null ||
    horizonYears == null ||
    costsBp == null ||
    (fields.convexityEnabled && convexity == null) ||
    errors.length > 0
  ) {
    return { ok: false, errors };
  }

  const inputs: BondInputs = {
    annualYield: percentToDecimal(annualYieldPercent),
    modifiedDuration,
    yieldShift: yieldShiftToDecimal(shiftValue, fields.shiftUnit),
    horizonYears,
    convexity: fields.convexityEnabled ? convexity : null,
    costs: costsBp / 10_000,
  };
  const computed = bondSensitivity(inputs);
  if (!computed.ok) return computed;
  return { ok: true, inputs, result: computed.result };
}

export function errorMap(errors: FieldError[]) {
  return Object.fromEntries(errors.map((error) => [error.field, error.message]));
}
