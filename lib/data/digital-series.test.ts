import { describe, expect, it } from "vitest";
import {
  blendedTokenPrice,
  inferenceCostEndpoints,
  usDataCenterElectricity,
  worldDataCenterElectricity,
} from "@/lib/data/digital-series";

describe("data center electricity anchors", () => {
  it("keeps only the LBNL years the report states", () => {
    expect(usDataCenterElectricity.map((point) => point.yearLabel)).toEqual([
      "2014–2016",
      "2018",
      "2023",
      "2028 low",
      "2028 high",
    ]);
    expect(usDataCenterElectricity.map((point) => point.valueTwh)).toEqual([60, 76, 176, 325, 580]);
    expect(usDataCenterElectricity.filter((point) => point.status === "estimate")).toHaveLength(3);
    expect(usDataCenterElectricity.filter((point) => point.status === "scenario")).toHaveLength(2);
  });

  it("keeps IEA global anchors without inventing the years between them", () => {
    const years = worldDataCenterElectricity.map((point) => point.year);
    expect(years).toEqual([2024, 2030, 2035, 2035, 2035]);
    expect(worldDataCenterElectricity.find((point) => point.id === "iea-2024")?.valueTwh).toBe(415);
    expect(worldDataCenterElectricity.find((point) => point.id === "iea-2030-base")?.valueTwh).toBe(945);
    expect(worldDataCenterElectricity.find((point) => point.id === "iea-2035-liftoff")?.precision).toBe("exceeding");
    expect(years).not.toContain(2025);
    expect(years).not.toContain(2026);
  });
});

describe("inference cost endpoints", () => {
  it("uses the two published thresholds and does not mix them into one score", () => {
    const mmlu = inferenceCostEndpoints.filter((point) => point.benchmark === "MMLU");
    const gpqa = inferenceCostEndpoints.filter((point) => point.benchmark === "GPQA");
    expect(mmlu.map((point) => point.usdPerMillionTokens)).toEqual([20, 0.07]);
    expect(gpqa.map((point) => point.usdPerMillionTokens)).toEqual([15, 0.12]);
    expect(new Set(inferenceCostEndpoints.map((point) => point.benchmark)).size).toBe(2);
  });

  it("applies the stated 3:1 input-to-output blend", () => {
    expect(blendedTokenPrice(3, 7)).toBe(4);
    expect(blendedTokenPrice(0, 0)).toBe(0);
  });
});
