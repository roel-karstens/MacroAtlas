export type OilInputs = {
  horizonDays: number;
  priceChangeUsdPerBarrel: number;
  /** Positive: net producer / unhedged seller. Negative: net consumer / unhedged buyer. */
  unhedgedNetBarrelsPerDay: number;
  /** Share of the benchmark move that reaches operating profit. 0 to 1. */
  passThrough: number;
  /** Reporting-currency units per 1 USD. 1 when the books are in USD. */
  reportingCurrencyPerUsd: number;
  /** Positive numbers reduce operating profit. Reporting currency, over the horizon. */
  extraCostsReporting: number;
};

export type OilResult = {
  barrelsOverHorizon: number;
  usdEffectBeforeFx: number;
  translatedEffect: number;
  operatingProfitChange: number;
  warnings: string[];
};

export type FieldError = { field: string; message: string };

export type OilPosition = "producer" | "consumer";

export type OilFormFields = {
  horizonDays: string;
  priceChangeUsdPerBarrel: string;
  magnitudeBarrelsPerDay: string;
  position: OilPosition;
  passThrough: string;
  reportingCurrencyPerUsd: string;
  currencyLabel: string;
  extraCostsReporting: string;
};

export const defaultOilForm: OilFormFields = {
  horizonDays: "90",
  priceChangeUsdPerBarrel: "10",
  magnitudeBarrelsPerDay: "10000",
  position: "producer",
  passThrough: "1",
  reportingCurrencyPerUsd: "1",
  currencyLabel: "USD",
  extraCostsReporting: "0",
};

/**
 * Change in operating profit, not a share price.
 * barrels × days × price change × pass-through × FX − extra costs.
 * The price change is an assumption. It is not inferred from vessel counts.
 */
export function oilExposure(
  input: OilInputs,
): { ok: true; result: OilResult } | { ok: false; errors: FieldError[] } {
  const errors: FieldError[] = [];
  const requireFinite = (value: number, field: string, label: string) => {
    if (!Number.isFinite(value)) {
      errors.push({ field, message: `Enter a finite ${label}.` });
    }
  };

  requireFinite(input.horizonDays, "horizonDays", "horizon");
  requireFinite(input.priceChangeUsdPerBarrel, "priceChangeUsdPerBarrel", "price change");
  requireFinite(input.unhedgedNetBarrelsPerDay, "unhedgedNetBarrelsPerDay", "exposure");
  requireFinite(input.passThrough, "passThrough", "pass-through");
  requireFinite(input.reportingCurrencyPerUsd, "reportingCurrencyPerUsd", "exchange rate");
  requireFinite(input.extraCostsReporting, "extraCostsReporting", "extra costs");
  if (errors.length > 0) return { ok: false, errors };

  if (input.horizonDays <= 0 || input.horizonDays > 3650) {
    errors.push({
      field: "horizonDays",
      message: "Horizon must be greater than 0 and at most 3,650 days.",
    });
  }
  if (input.passThrough < 0 || input.passThrough > 1) {
    errors.push({
      field: "passThrough",
      message: "Pass-through must be between 0 and 1.",
    });
  }
  if (input.reportingCurrencyPerUsd <= 0) {
    errors.push({
      field: "reportingCurrencyPerUsd",
      message: "Reporting currency per 1 USD must be greater than 0.",
    });
  }
  if (Math.abs(input.priceChangeUsdPerBarrel) > 500) {
    errors.push({
      field: "priceChangeUsdPerBarrel",
      message: "Price change must stay within ±500 USD per barrel on this form.",
    });
  }
  if (Math.abs(input.unhedgedNetBarrelsPerDay) > 100_000_000) {
    errors.push({
      field: "unhedgedNetBarrelsPerDay",
      message: "Exposure must stay within ±100 million barrels per day on this form.",
    });
  }
  if (errors.length > 0) return { ok: false, errors };

  const barrelsOverHorizon = input.unhedgedNetBarrelsPerDay * input.horizonDays;
  const usdEffectBeforeFx =
    barrelsOverHorizon * input.priceChangeUsdPerBarrel * input.passThrough;
  const translatedEffect = usdEffectBeforeFx * input.reportingCurrencyPerUsd;
  const operatingProfitChange = translatedEffect - input.extraCostsReporting;

  const warnings: string[] = [];
  if (input.unhedgedNetBarrelsPerDay === 0) {
    warnings.push("No unhedged barrels. The result is only the extra cost.");
  }
  if (input.passThrough === 0) {
    warnings.push("Pass-through is zero, so the benchmark move does not change operating profit.");
  }
  if (Math.abs(input.priceChangeUsdPerBarrel) > 80) {
    warnings.push("This is a large price scenario. It is still an assumption you typed, not a forecast.");
  }
  if (input.horizonDays > 365) {
    warnings.push(
      "The horizon is longer than a year. Days multiply a per-day exposure, so check the barrel figure.",
    );
  }
  if (input.extraCostsReporting < 0) {
    warnings.push("A negative extra cost increases operating profit. Use a positive number for a cost.");
  }

  return {
    ok: true,
    result: {
      barrelsOverHorizon,
      usdEffectBeforeFx,
      translatedEffect,
      operatingProfitChange,
      warnings,
    },
  };
}

export function signedBarrelsPerDay(magnitude: number, position: OilPosition) {
  return position === "producer" ? magnitude : -magnitude;
}

export function oilProfitCurve(input: OilInputs, priceChanges: number[]) {
  return priceChanges.map((priceChangeUsdPerBarrel) => {
    const computed = oilExposure({ ...input, priceChangeUsdPerBarrel });
    return {
      priceChangeUsdPerBarrel,
      operatingProfitChange: computed.ok ? computed.result.operatingProfitChange : null,
    };
  });
}
