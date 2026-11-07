import { describe, expect, it } from "vitest";
import { paddedDomain } from "@/lib/charts/scale";

describe("chart domain", () => {
  it("pads a range and does not invent a negative axis for positive data", () => {
    expect(paddedDomain([20, 40, 80]).min).toBeGreaterThan(0);
    expect(paddedDomain([0, 10]).min).toBe(0);
    expect(paddedDomain([20, 40, 80]).max).toBeGreaterThan(80);
  });

  it("returns an empty domain without throwing", () => {
    expect(paddedDomain([])).toEqual({ min: 0, max: 1 });
  });
});
