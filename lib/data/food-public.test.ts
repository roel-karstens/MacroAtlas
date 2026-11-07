import { describe, expect, it } from "vitest";
import faoFile from "@/data/food/fao-ffpi-monthly.json";
import eurostatFile from "@/data/food/eurostat-ea-food.json";
import { eurostatLevelChange, faoSlice, peakSince } from "@/lib/data/food-public";

describe("published food series", () => {
  it("keeps FAO nominal values unmodified through October 2026", () => {
    expect(faoFile.base).toBe("2014-2016=100");
    expect(faoFile.points[0]).toMatchObject({ period: "1990-01", ffpi: 64.4 });
    const oct = faoFile.points.at(-1);
    expect(oct).toMatchObject({ period: "2026-10", ffpi: 133.9, meat: 125.5, dairy: 117.8, cereals: 116.8, oils: 199.2, sugar: 121.3 });
    const shown = faoSlice("ffpi", "2020-01");
    expect(shown[0]).toEqual({ period: "2020-01", value: 102.5 });
    expect(shown.at(-1)).toEqual({ period: "2026-10", value: 133.9 });
    expect(peakSince(shown, "2020-01")).toEqual({ period: "2022-03", value: 160.2 });
    for (const point of shown) {
      const source = faoFile.points.find((row) => row.period === point.period);
      expect(point.value).toBe(source?.ffpi);
    }
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
    expect(JSON.stringify(eurostatFile.foodIndex)).not.toContain("EU27");
    expect(eurostatFile.geoLabel).toContain("EA20-2023");
  });

  it("states the shop-price level rise as a ratio of two Eurostat index points", () => {
    const change = eurostatLevelChange("2020-01", "2026-09");
    expect(change).toBeCloseTo(33.60074626865672, 8);
  });
});
