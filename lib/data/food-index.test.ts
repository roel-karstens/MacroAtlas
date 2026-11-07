import { describe, expect, it } from "vitest";
import { rebaseToMean, successiveLevels, yearOverYear } from "@/lib/data/food-index";

describe("food index transformations", () => {
  it("leaves a missing observation missing and does not bridge the gap", () => {
    const result = yearOverYear([
      { period: "2023-01", value: 100 },
      { period: "2024-01", value: null },
      { period: "2025-01", value: 110 },
    ]);
    expect(result).toEqual([
      { period: "2023-01", value: null },
      { period: "2024-01", value: null },
      { period: "2025-01", value: null },
    ]);
  });

  it("computes a same-month change only when both observations exist", () => {
    const result = yearOverYear([
      { period: "2023-06", value: 80 },
      { period: "2024-06", value: 100 },
    ]);
    expect(result[1]?.value).toBeCloseTo(25, 10);
    expect(result[0]?.value).toBeNull();
  });

  it("refuses a rebase when a base month is missing instead of skipping it", () => {
    const points = [
      { period: "2014-01", value: 90 },
      { period: "2015-01", value: null },
      { period: "2016-01", value: 110 },
    ];
    expect(rebaseToMean(points, ["2014-01", "2015-01", "2016-01"]).ok).toBe(false);
    expect(rebaseToMean(points, []).ok).toBe(false);
    expect(rebaseToMean([{ period: "2014-01", value: 0 }], ["2014-01"]).ok).toBe(false);
  });

  it("rebases to 100 at the mean of the stated base and keeps other gaps", () => {
    const result = rebaseToMean(
      [
        { period: "2014-01", value: 40 },
        { period: "2015-01", value: 60 },
        { period: "2016-03", value: null },
        { period: "2020-01", value: 150 },
      ],
      ["2014-01", "2015-01"],
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.baseMean).toBe(50);
    expect(result.points[0]?.value).toBeCloseTo(80, 10);
    expect(result.points[1]?.value).toBeCloseTo(120, 10);
    expect(result.points[2]?.value).toBeNull();
    expect(result.points[3]?.value).toBeCloseTo(300, 10);
  });

  it("shows a slower positive change as a higher level, not a fall", () => {
    const levels = successiveLevels(100, [10, 2]);
    expect(levels[0]).toBe(100);
    expect(levels[1]).toBeCloseTo(110, 10);
    expect(levels[2]).toBeCloseTo(112.2, 10);
    expect(levels[2]).toBeGreaterThan(levels[0]);
  });

  it("lowers the level only when a change is negative", () => {
    const levels = successiveLevels(100, [10, -5]);
    expect(levels[2]).toBeCloseTo(104.5, 10);
    expect(levels[2]).toBeLessThan(levels[1]);
  });
});
