export type BondInputs = {
  /** Annual yield as a decimal. 0.03 means 3 percent. */
  annualYield: number;
  modifiedDuration: number;
  /** Yield shift as a decimal. 0.01 means 100 basis points. */
  yieldShift: number;
  horizonYears: number;
  /**
   * Convexity in the Taylor convention where 0.5 × C × (Δy)² is a decimal return.
   * Null omits the term. It does not estimate a value.
   */
  convexity: number | null;
  /** Return drag as a decimal. 0.002 means 20 basis points. */
  costs: number;
};

export type BondResult = {
  durationPriceEffect: number;
  convexityEffect: number;
  convexityApplied: boolean;
  priceEffect: number;
  carry: number;
  totalReturn: number;
  warnings: string[];
};

export type FieldError = { field: string; message: string };

export type BondShiftUnit = "bp" | "pp";

export type BondFormFields = {
  annualYieldPercent: string;
  modifiedDuration: string;
  shiftValue: string;
  shiftUnit: BondShiftUnit;
  horizonYears: string;
  costsBp: string;
  convexityEnabled: boolean;
  convexity: string;
};

export const defaultBondForm: BondFormFields = {
  annualYieldPercent: "3",
  modifiedDuration: "7",
  shiftValue: "100",
  shiftUnit: "bp",
  horizonYears: "1",
  costsBp: "0",
  convexityEnabled: false,
  convexity: "",
};

export function yieldShiftToDecimal(value: number, unit: BondShiftUnit) {
  return unit === "bp" ? value / 10_000 : value / 100;
}

export function percentToDecimal(percent: number) {
  return percent / 100;
}

export function basisPointsToDecimal(basisPoints: number) {
  return basisPoints / 10_000;
}

/**
 * Local bond approximation.
 * Price effect ≈ −modified duration × Δy + ½ × convexity × (Δy)².
 * Carry ≈ annual yield × horizon in years, simple, not compounded.
 * Total return ≈ carry + price effect − costs.
 * This is not a policy rate and not a forecast.
 */
export function bondSensitivity(
  input: BondInputs,
): { ok: true; result: BondResult } | { ok: false; errors: FieldError[] } {
  const errors: FieldError[] = [];
  const requireFinite = (value: number, field: string, label: string) => {
    if (!Number.isFinite(value)) errors.push({ field, message: `Enter a finite ${label}.` });
  };

  requireFinite(input.annualYield, "annualYield", "starting yield");
  requireFinite(input.modifiedDuration, "modifiedDuration", "modified duration");
  requireFinite(input.yieldShift, "yieldShift", "yield shift");
  requireFinite(input.horizonYears, "horizonYears", "horizon");
  requireFinite(input.costs, "costs", "costs");
  if (input.convexity != null) requireFinite(input.convexity, "convexity", "convexity");
  if (errors.length > 0) return { ok: false, errors };

  if (input.annualYield < -0.05 || input.annualYield > 0.4) {
    errors.push({
      field: "annualYield",
      message: "Starting yield must stay between −5% and 40% on this form.",
    });
  }
  if (input.modifiedDuration < 0 || input.modifiedDuration > 100) {
    errors.push({
      field: "modifiedDuration",
      message: "Modified duration must be between 0 and 100 years.",
    });
  }
  if (input.horizonYears <= 0 || input.horizonYears > 30) {
    errors.push({
      field: "horizonYears",
      message: "Horizon must be greater than 0 and at most 30 years.",
    });
  }
  if (Math.abs(input.yieldShift) > 0.2) {
    errors.push({
      field: "yieldShift",
      message: "Yield shift must stay within ±2,000 basis points on this form.",
    });
  }
  if (input.costs < -0.05 || input.costs > 0.1) {
    errors.push({
      field: "costs",
      message: "Costs must stay between −500 and 1,000 basis points on this form.",
    });
  }
  if (input.convexity != null && (input.convexity < -500 || input.convexity > 2_000)) {
    errors.push({
      field: "convexity",
      message: "Convexity must stay between −500 and 2,000 in this form’s units.",
    });
  }
  if (errors.length > 0) return { ok: false, errors };

  const durationPriceEffect = -input.modifiedDuration * input.yieldShift;
  const convexityApplied = input.convexity != null;
  const convexityEffect = convexityApplied ? 0.5 * (input.convexity as number) * input.yieldShift ** 2 : 0;
  const priceEffect = durationPriceEffect + convexityEffect;
  const carry = input.annualYield * input.horizonYears;
  const totalReturn = carry + priceEffect - input.costs;

  const warnings: string[] = [];
  if (Math.abs(input.yieldShift) > 0.02) {
    warnings.push(
      "Modified duration is a local approximation. A yield move this large is a rough sketch, even with the convexity term.",
    );
  }
  if (input.horizonYears > 3) {
    warnings.push(
      "Carry is annual yield times years. It is not a full horizon return, and it ignores pull-to-par and reinvestment.",
    );
  }
  if (input.convexity != null && input.convexity < 0) {
    warnings.push("Negative convexity is unusual for an option-free fixed-rate bond. Check the scaling.");
  }
  if (input.annualYield < 0) {
    warnings.push("The starting yield is negative. It is still a bond yield you typed, not a central-bank policy rate.");
  }
  if (!convexityApplied) {
    warnings.push("Convexity is omitted. The price effect is the duration term only.");
  }

  return {
    ok: true,
    result: {
      durationPriceEffect,
      convexityEffect,
      convexityApplied,
      priceEffect,
      carry,
      totalReturn,
      warnings,
    },
  };
}

export function bondPriceCurve(input: BondInputs, shifts: number[]) {
  return shifts.map((yieldShift) => {
    const computed = bondSensitivity({ ...input, yieldShift });
    return {
      yieldShift,
      durationPriceEffect: computed.ok ? computed.result.durationPriceEffect : null,
      priceEffect: computed.ok ? computed.result.priceEffect : null,
      totalReturn: computed.ok ? computed.result.totalReturn : null,
    };
  });
}
