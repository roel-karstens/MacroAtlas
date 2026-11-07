import { describe, expect, it } from "vitest";
import { bondSensitivity, defaultBondForm, yieldShiftToDecimal } from "@/lib/models/bond-sensitivity";
import { defaultOilForm, oilExposure, signedBarrelsPerDay } from "@/lib/models/oil-exposure";
import { evaluateBondForm, evaluateOilForm, parseDecimal } from "@/lib/models/parse";

describe("oil exposure", () => {
  it("pays a producer when the price rises", () => {
    const computed = oilExposure({
      horizonDays: 10,
      priceChangeUsdPerBarrel: 10,
      unhedgedNetBarrelsPerDay: 1000,
      passThrough: 1,
      reportingCurrencyPerUsd: 1,
      extraCostsReporting: 0,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.operatingProfitChange).toBe(100_000);
  });

  it("charges a consumer when the price rises", () => {
    const computed = oilExposure({
      horizonDays: 10,
      priceChangeUsdPerBarrel: 10,
      unhedgedNetBarrelsPerDay: signedBarrelsPerDay(1000, "consumer"),
      passThrough: 1,
      reportingCurrencyPerUsd: 1,
      extraCostsReporting: 0,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.operatingProfitChange).toBe(-100_000);
  });

  it("reverses both signs when the price falls", () => {
    const producer = oilExposure({
      horizonDays: 10,
      priceChangeUsdPerBarrel: -10,
      unhedgedNetBarrelsPerDay: 1000,
      passThrough: 1,
      reportingCurrencyPerUsd: 1,
      extraCostsReporting: 0,
    });
    const consumer = oilExposure({
      horizonDays: 10,
      priceChangeUsdPerBarrel: -10,
      unhedgedNetBarrelsPerDay: -1000,
      passThrough: 1,
      reportingCurrencyPerUsd: 1,
      extraCostsReporting: 0,
    });
    expect(producer.ok && producer.result.operatingProfitChange).toBe(-100_000);
    expect(consumer.ok && consumer.result.operatingProfitChange).toBe(100_000);
  });

  it("maps 10,000 barrels a day for 90 days at +20 USD to 18 million", () => {
    const computed = oilExposure({
      horizonDays: 90,
      priceChangeUsdPerBarrel: 20,
      unhedgedNetBarrelsPerDay: signedBarrelsPerDay(10_000, "producer"),
      passThrough: 1,
      reportingCurrencyPerUsd: 1,
      extraCostsReporting: 0,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.operatingProfitChange).toBe(18_000_000);

    const fromDefaults = evaluateOilForm({ ...defaultOilForm, priceChangeUsdPerBarrel: "20" });
    expect(fromDefaults.ok).toBe(true);
    if (!fromDefaults.ok) return;
    expect(fromDefaults.result.operatingProfitChange).toBe(18_000_000);
  });

  it("scales pass-through, FX, and extra costs in that order", () => {
    const computed = oilExposure({
      horizonDays: 10,
      priceChangeUsdPerBarrel: 10,
      unhedgedNetBarrelsPerDay: 1000,
      passThrough: 0.25,
      reportingCurrencyPerUsd: 0.5,
      extraCostsReporting: 1000,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.usdEffectBeforeFx).toBe(25_000);
    expect(computed.result.translatedEffect).toBe(12_500);
    expect(computed.result.operatingProfitChange).toBe(11_500);
  });

  it("rejects empty, zero horizon, pass-through above 1, and non-positive FX", () => {
    expect(parseDecimal("").ok).toBe(false);
    expect(parseDecimal("  ").ok).toBe(false);
    expect(parseDecimal("1e2").ok).toBe(false);
    expect(parseDecimal("10.5").ok).toBe(true);

    const empty = evaluateOilForm({ ...defaultOilForm, horizonDays: "" });
    expect(empty.ok).toBe(false);

    const badHorizon = oilExposure({
      horizonDays: 0,
      priceChangeUsdPerBarrel: 10,
      unhedgedNetBarrelsPerDay: 1000,
      passThrough: 1,
      reportingCurrencyPerUsd: 1,
      extraCostsReporting: 0,
    });
    expect(badHorizon.ok).toBe(false);

    const badPass = oilExposure({
      horizonDays: 10,
      priceChangeUsdPerBarrel: 10,
      unhedgedNetBarrelsPerDay: 1000,
      passThrough: 1.5,
      reportingCurrencyPerUsd: 1,
      extraCostsReporting: 0,
    });
    expect(badPass.ok).toBe(false);

    const badFx = oilExposure({
      horizonDays: 10,
      priceChangeUsdPerBarrel: 10,
      unhedgedNetBarrelsPerDay: 1000,
      passThrough: 1,
      reportingCurrencyPerUsd: 0,
      extraCostsReporting: 0,
    });
    expect(badFx.ok).toBe(false);
  });
});

describe("bond sensitivity", () => {
  it("maps duration 7 and +100bp to a -7% price effect before carry and convexity", () => {
    expect(yieldShiftToDecimal(100, "bp")).toBe(0.01);
    expect(yieldShiftToDecimal(1, "pp")).toBe(0.01);
    const computed = bondSensitivity({
      annualYield: 0.03,
      modifiedDuration: 7,
      yieldShift: 0.01,
      horizonYears: 1,
      convexity: null,
      costs: 0,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.durationPriceEffect).toBeCloseTo(-0.07, 10);
    expect(computed.result.priceEffect).toBeCloseTo(-0.07, 10);
    expect(computed.result.carry).toBeCloseTo(0.03, 10);
    expect(computed.result.totalReturn).toBeCloseTo(-0.04, 10);
  });

  it("maps duration 8 and +100bp to a -8% price effect before carry and convexity", () => {
    const computed = bondSensitivity({
      annualYield: 0.03,
      modifiedDuration: 8,
      yieldShift: 0.01,
      horizonYears: 1,
      convexity: null,
      costs: 0,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.durationPriceEffect).toBeCloseTo(-0.08, 10);
    expect(computed.result.priceEffect).toBeCloseTo(-0.08, 10);
    expect(computed.result.convexityApplied).toBe(false);
  });

  it("treats percentage points and basis points as the same shift", () => {
    const fromBp = evaluateBondForm({ ...defaultBondForm, shiftUnit: "bp", shiftValue: "100" });
    const fromPp = evaluateBondForm({ ...defaultBondForm, shiftUnit: "pp", shiftValue: "1" });
    expect(fromBp.ok && fromPp.ok).toBe(true);
    if (!fromBp.ok || !fromPp.ok) return;
    expect(fromBp.inputs.yieldShift).toBeCloseTo(fromPp.inputs.yieldShift, 12);
    expect(fromBp.result.durationPriceEffect).toBeCloseTo(-0.07, 10);
  });

  it("adds the convexity term without changing the duration term", () => {
    const computed = bondSensitivity({
      annualYield: 0.03,
      modifiedDuration: 7,
      yieldShift: 0.01,
      horizonYears: 1,
      convexity: 60,
      costs: 0.002,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.durationPriceEffect).toBeCloseTo(-0.07, 10);
    expect(computed.result.convexityEffect).toBeCloseTo(0.003, 10);
    expect(computed.result.priceEffect).toBeCloseTo(-0.067, 10);
    expect(computed.result.totalReturn).toBeCloseTo(-0.039, 10);
  });

  it("rejects empty inputs and a yield shift entered as if 100 meant 100 percent", () => {
    const empty = evaluateBondForm({ ...defaultBondForm, modifiedDuration: "" });
    expect(empty.ok).toBe(false);
    const tooBig = evaluateBondForm({ ...defaultBondForm, shiftUnit: "pp", shiftValue: "100" });
    expect(tooBig.ok).toBe(false);
  });

  it("does not treat the form as a policy rate", () => {
    const computed = bondSensitivity({
      annualYield: 0.03,
      modifiedDuration: 7,
      yieldShift: 0.01,
      horizonYears: 1,
      convexity: null,
      costs: 0,
    });
    expect(computed.ok).toBe(true);
    if (!computed.ok) return;
    expect(computed.result.warnings.join(" ")).not.toMatch(/policy rate/i);
  });
});
