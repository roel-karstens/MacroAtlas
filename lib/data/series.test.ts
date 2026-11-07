import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("omitted market series", () => {
  it("does not keep the Pink Sheet or ECB history in the current tree", () => {
    expect(existsSync("data/snapshots/brent-monthly.json")).toBe(false);
    expect(existsSync("data/snapshots/ea-10y-yield-monthly.json")).toBe(false);
    const seed = readFileSync("supabase/seed.sql", "utf8");
    expect(seed).not.toMatch(/insert into public\.observations/i);
    expect(seed).not.toContain("4.173827");
    expect(seed).not.toContain("125.0");
    const pages = [
      "app/page.tsx",
      "app/topics/[topic]/page.tsx",
      "app/models/bond-sensitivity/page.tsx",
      "components/bond-model-panel.tsx",
      "lib/content/articles.ts",
      "lib/content/sources.ts",
    ];
    for (const file of pages) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toContain("4.173827");
      expect(source, file).not.toContain("Copy October 2026 snapshot");
    }
  });
});
