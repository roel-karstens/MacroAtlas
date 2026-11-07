import { describe, expect, it } from "vitest";
import { worldFeatures } from "@/lib/data/crop-atlas";
import {
  countrySum,
  cropRows,
  isOnMap,
  rowStatus,
  sharePercent,
  sliceRows,
  yearsFor,
} from "@/lib/data/crop-atlas";

describe("FAOSTAT crop atlas", () => {
  it("keeps crude oil production off 2024 and does not treat seed as oil", () => {
    expect(yearsFor("sunflower-oil", "production")).toEqual([2021, 2023]);
    expect(yearsFor("sunflower-seed", "production")).toEqual([2021, 2023, 2024]);
    expect(yearsFor("wheat", "export-quantity")).toEqual([2021, 2023, 2024]);
    const oil = sliceRows("sunflower-oil", "production", 2024);
    expect(oil).toHaveLength(0);
  });

  it("matches the country-sum denominator and leaves gaps out of it", () => {
    const wheat = sliceRows("wheat", "production", 2024);
    expect(countrySum(wheat)).toBeCloseTo(798455265.4, 0);
    const missing = wheat.find((row) => row.iso3 === "ARE");
    expect(rowStatus(missing)).toBe("missing");
    expect(missing?.value).toBeNull();
    expect(countrySum(wheat)).toBe(countrySum(wheat.filter((row) => row.value != null)));
  });

  it("puts small unmapped states in the total", () => {
    const maize = sliceRows("maize", "export-quantity", 2024);
    const singapore = maize.find((row) => row.iso3 === "SGP");
    expect(singapore?.value).not.toBeNull();
    expect(isOnMap("SGP")).toBe(false);
    const withGap = countrySum(maize);
    const dropped = countrySum(maize.filter((row) => isOnMap(row.iso3)));
    expect(withGap).toBeGreaterThan(dropped);
    expect(sharePercent(singapore?.value ?? null, withGap)).not.toBeNull();
  });

  it("joins France and Norway, and shows Russia and Ukraine oil flags", () => {
    expect(worldFeatures.some((feature) => feature.iso3 === "FRA")).toBe(true);
    expect(worldFeatures.some((feature) => feature.iso3 === "NOR")).toBe(true);
    const russia = sliceRows("wheat", "production", 2024).find((row) => row.iso3 === "RUS");
    expect(russia?.flag).toBe("X");
    expect(russia?.note).toMatch(/Unofficial/);
    const russiaExport = sliceRows("wheat", "export-quantity", 2023).find((row) => row.iso3 === "RUS");
    expect(russiaExport?.flag).toBe("I");
    const ukraineOil = sliceRows("sunflower-oil", "production", 2023).find((row) => row.iso3 === "UKR");
    expect(ukraineOil?.flag).toBe("X");
    expect(ukraineOil?.note).toBe("Unofficial figure");
  });

  it("keeps Türkiye and Côte d'Ivoire as Unicode, not mojibake", () => {
    const names = new Set(cropRows.map((row) => row.area));
    expect(names.has("Türkiye")).toBe(true);
    expect(names.has("Côte d'Ivoire")).toBe(true);
    expect([...names].some((name) => name.includes("Ã"))).toBe(false);
  });

  it("does not include a regional aggregate or the duplicate China code", () => {
    expect(cropRows.some((row) => row.area.includes("World"))).toBe(false);
    expect(cropRows.some((row) => row.area === "China")).toBe(false);
  });
});
