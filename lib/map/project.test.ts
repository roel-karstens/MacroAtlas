import { describe, expect, it } from "vitest";
import { entityVisible, project } from "@/lib/map/project";

describe("gulf projection", () => {
  it("places Fujairah east of Ras Tanura and Kharg north of Al Dhannah", () => {
    const rasTanura = project(50.05277778, 26.70638889);
    const fujairah = project(56.35972222, 25.18805556);
    const kharg = project(50.31, 29.245);
    const dhannah = project(52.58361111, 24.10333333);
    expect(fujairah.x).toBeGreaterThan(rasTanura.x);
    expect(kharg.y).toBeLessThan(dhannah.y);
  });

  it("keeps a reference point inside the map frame", () => {
    const hormuz = project(56.5, 26.6);
    expect(hormuz.x).toBeGreaterThan(0);
    expect(hormuz.x).toBeLessThan(1000);
    expect(hormuz.y).toBeGreaterThan(0);
    expect(hormuz.y).toBeLessThan(760);
  });
});

describe("map filters", () => {
  it("shows an entity when any of its categories is on", () => {
    const filters = { terminal: false, pipeline: true, processing: false, corridor: false };
    expect(entityVisible(["terminal", "pipeline"], filters)).toBe(true);
    expect(entityVisible(["terminal"], filters)).toBe(false);
    expect(entityVisible(["corridor"], { ...filters, corridor: true })).toBe(true);
  });
});
