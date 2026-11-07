import { describe, expect, it } from "vitest";
import { availableRanges, brentSeries, latestObservation, sliceSeries, yieldSeries } from "@/lib/data/series";

describe("verified snapshots", () => {
  it("keeps the Pink Sheet Brent excerpt pinned to the file we retrieved", () => {
    expect(brentSeries.points[0]).toEqual({ period: "2010-01", value: 76.4 });
    expect(brentSeries.points.find((point) => point.period === "2020-04")?.value).toBe(23.3);
    expect(latestObservation(brentSeries)).toEqual({ period: "2026-10", value: 125 });
    expect(brentSeries.points.every((point) => Number.isFinite(point.value))).toBe(true);
    expect(brentSeries.status).toBe("observed");
  });

  it("keeps the ECB 10-year yield pinned, including the October 2026 observation", () => {
    expect(yieldSeries.points[0]?.period).toBe("2014-01");
    expect(latestObservation(yieldSeries).period).toBe("2026-10");
    expect(latestObservation(yieldSeries).value).toBeCloseTo(4.173827, 6);
    expect(yieldSeries.points.every((point) => point.obsStatus === "A")).toBe(true);
    expect(yieldSeries.seriesKey).toBe("FM.M.U2.EUR.4F.BB.U2_10Y.YLD");
  });

  it("offers ranges only when the snapshot actually covers them", () => {
    expect(availableRanges(brentSeries)).toEqual(["5y", "10y", "all"]);
    expect(sliceSeries(brentSeries, "5y")).toHaveLength(60);
    expect(sliceSeries(brentSeries, "5y")[0]?.period).toBe("2021-11");
    expect(sliceSeries(brentSeries, "all")).toHaveLength(brentSeries.points.length);
  });
});
