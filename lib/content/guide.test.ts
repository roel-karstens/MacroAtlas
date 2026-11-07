import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { articles } from "@/lib/content/articles";
import { footerNav, primaryNav, site } from "@/lib/content/registry";
import { wheatShortAnswer } from "@/lib/data/wheat-story";

describe("question-led guide", () => {
  it("points the header at questions, atlas, tools, sources and about", () => {
    expect(primaryNav.map((item) => item.label)).toEqual(["Questions", "Atlas", "Tools", "Sources", "About"]);
    expect(primaryNav.map((item) => item.href)).toEqual(["/topics", "/atlas", "/models", "/sources", "/about"]);
    expect(footerNav.map((item) => item.href)).toContain("/newsletter");
    expect(primaryNav.map((item) => item.href)).not.toContain("/newsletter");
  });

  it("does not promise a removed chart or an investment opportunity on the home page", () => {
    const home = readFileSync("app/page.tsx", "utf8");
    const header = readFileSync("components/site-header.tsx", "utf8");
    const barrel = articles.find((article) => article.slug === "from-barrel-to-margin");
    const rates = readFileSync("lib/content/topics.ts", "utf8");
    expect(home).not.toMatch(/Test the opportunity/);
    expect(home).not.toMatch(/Brent series not included/);
    expect(header).not.toMatch(/href="\/newsletter"/);
    expect(JSON.stringify(barrel)).not.toMatch(/chart sits nearby/);
    expect(rates).not.toMatch(/shows one observed long-term government yield/);
    expect(site.description.toLowerCase()).toMatch(/wheat/);
  });

  it("keeps the wheat question on its own URL with a short dated answer", () => {
    const article = articles.find((item) => item.slug === "where-wheat-comes-from");
    expect(article?.topicId).toBe("food-agriculture");
    const answer = wheatShortAnswer();
    expect(answer.length).toBeGreaterThan(40);
    expect(answer.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(60);
    const page = readFileSync("app/topics/[topic]/[article]/page.tsx", "utf8");
    expect(page).toContain("WheatMaps");
    expect(page).not.toContain("CropAtlas");
  });

  it("resets the Gulf map as a whole and closes the menu on Escape", () => {
    const map = readFileSync("components/atlas-map.tsx", "utf8");
    const header = readFileSync("components/site-header.tsx", "utf8");
    expect(map).toMatch(/function resetMap/);
    expect(map).toMatch(/setFilters\(\{ \.\.\.filtersDefault \}\)/);
    expect(map).toMatch(/setSelectedId\(null\)/);
    expect(map).toMatch(/current === id \? null/);
    expect(header).toMatch(/Escape/);
    expect(header).toMatch(/menuButton\.current\?\.focus/);
  });
});
