import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import eurostatFile from "@/data/food/eurostat-ea-food.json";
import { faoExcerpt } from "@/lib/data/fao-ffpi-excerpt";
import { eurostatLevelChange } from "@/lib/data/food-public";

describe("published food series", () => {
  it("quotes eight FAO months and does not ship the monthly file", () => {
    expect(existsSync("data/food/fao-ffpi-monthly.json")).toBe(false);
    expect(faoExcerpt).toHaveLength(8);
    expect(faoExcerpt.find((row) => row.period === "2020-01")?.ffpi).toBe(102.5);
    expect(faoExcerpt.find((row) => row.period === "2022-03")).toMatchObject({ ffpi: 160.2, oils: 251.8 });
    expect(faoExcerpt.find((row) => row.period === "2022-05")?.cereals).toBe(173.5);
    expect(faoExcerpt.find((row) => row.period === "2022-06")?.dairy).toBe(158.2);
    expect(faoExcerpt.find((row) => row.period === "2023-09")?.sugar).toBe(162.7);
    expect(faoExcerpt.find((row) => row.period === "2026-05")?.meat).toBe(131.3);
    expect(faoExcerpt.find((row) => row.period === "2026-10")).toMatchObject({
      ffpi: 133.9,
      meat: 125.5,
      dairy: 117.8,
      cereals: 116.8,
      oils: 199.2,
      sugar: 121.3,
    });
    expect(faoExcerpt.find((row) => row.period === "2025-10")?.ffpi).toBe(126.4);
  });

  it("uses euro-area food only, with the API spot checks", () => {
    expect(eurostatFile.geo).toBe("EA");
    expect(eurostatFile.geoLabel).toContain("EA21-2026");
    expect(eurostatFile.food.coicop).toBe("CP011");
    expect(eurostatFile.food.label).toBe("Food");
    expect(eurostatFile.food.indexBase).toBe("2015=100");
    expect(eurostatFile.updated).toBe("2026-11-04T11:00:00+0100");
    const index = eurostatFile.foodIndex;
    const rate = eurostatFile.foodAnnualRate;
    expect(index.at(-1)).toEqual({ period: "2026-09", value: 143.22 });
    expect(index.find((point) => point.period === "2020-01")?.value).toBe(107.2);
    expect(rate.find((point) => point.period === "2023-03")?.value).toBe(17.9);
    expect(rate.at(-1)).toEqual({ period: "2026-09", value: 1.1 });
    expect(index.some((point) => point.period === "2026-10")).toBe(false);
    expect(eurostatFile.allItemsAnnualRate.find((point) => point.period === "2022-10")?.value).toBe(10.6);
    expect(eurostatFile.allItemsAnnualRate.at(-1)).toEqual({ period: "2026-10", value: 4 });
    expect(eurostatFile.geo).toBe("EA");
    expect(eurostatFile.geoLabel).toContain("EA20-2023");
  });

  it("states the shop-price level rise as a ratio of two Eurostat index points", () => {
    const change = eurostatLevelChange("2020-01", "2026-09");
    expect(change).toBeCloseTo(33.60074626865672, 8);
  });
});
