import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { articles, countWords } from "@/lib/content/articles";
import { connections, locations } from "@/lib/content/geography";
import { imageById, images } from "@/lib/content/images";
import { models } from "@/lib/content/models";
import { allInternalHrefs, pageFiles, site } from "@/lib/content/registry";
import { sourceById } from "@/lib/content/sources";
import { topicById, topics } from "@/lib/content/topics";

const knownPaths = new Set<string>([
  "/",
  "/atlas",
  "/topics",
  "/models",
  "/methodology",
  "/sources",
  "/about",
  "/image-credits",
  "/privacy",
  "/newsletter",
  "/models/oil-exposure",
  "/models/bond-sensitivity",
  ...topics.map((topic) => `/topics/${topic.id}`),
  ...articles.map((article) => `/topics/${article.topicId}/${article.slug}`),
]);

describe("content graph", () => {
  it("publishes two energy essays and one rates explainer, each substantive", () => {
    expect(articles.map((article) => article.slug)).toEqual([
      "the-hormuz-question",
      "from-barrel-to-margin",
      "when-yields-move",
      "the-physical-digital-chain",
    ]);
    for (const article of articles) {
      expect(countWords(article)).toBeGreaterThan(700);
      expect(topicById(article.topicId)).toBeTruthy();
      expect(article.published).toBe("2026-11-07");
    }
  });

  it("resolves internal links, sources, images, and model ids", () => {
    for (const href of allInternalHrefs()) {
      if (href.startsWith("/images/")) {
        expect(images.some((image) => image.src === href)).toBe(true);
        continue;
      }
      expect(knownPaths.has(href), href).toBe(true);
    }
    for (const article of articles) {
      for (const sourceId of article.sourceIds) expect(sourceById(sourceId)?.title).toBeTruthy();
      for (const locationId of article.locationIds) {
        expect(locations.some((location) => location.id === locationId)).toBe(true);
      }
      if (article.imageId) {
        const image = imageById(article.imageId);
        expect(image?.credit).toBeTruthy();
        expect(image?.license).toBeTruthy();
        expect(image?.label).toMatch(/AI illustration/);
      }
      if (article.modelId) expect(models.some((model) => model.id === article.modelId)).toBe(true);
    }
  });

  it("does not invent pipeline capacities or pretend other languages exist", () => {
    expect(site.availableLocales).toEqual(["en"]);
    for (const connection of connections) {
      expect(connection.capacity).toBeNull();
      expect(connection.flow).toBeNull();
    }
    const blob = JSON.stringify({ articles, topics });
    expect(blob).not.toMatch(/lorem ipsum/i);
    expect(blob).not.toMatch(/guaranteed return/i);
    const digital = topicById("digital-infrastructure");
    expect(digital?.sections.map((section) => section.id)).toEqual([
      "chips",
      "data-centers",
      "networks",
      "activity",
      "capabilities",
    ]);
    const dossier = articles.find((article) => article.slug === "the-physical-digital-chain");
    expect(dossier?.imageId).toBe("digital-hero");
    const hero = imageById("digital-hero");
    expect(hero?.caption).toMatch(/conceptual data center infrastructure/);
    expect(hero?.credit).toMatch(/GenerateImage/);
    expect(hero?.credit.toLowerCase()).toMatch(/no stock photographer/);
    expect(hero?.credit.toLowerCase()).not.toMatch(/getty|shutterstock/);
    expect(JSON.stringify(dossier)).not.toMatch(/Cloudflare Radar API/);
    expect(dossier?.sourceIds).toContain("cloudflare-radar-not-used");
    expect(sourceById("asml-quarterly")?.url).toBe("https://investor.asml.com/quarterly-results");
    expect(sourceById("tsmc-quarterly-2026-q3")?.url).toBe(
      "https://investor.tsmc.com/english/quarterly-results/2026/q3",
    );
    expect(sourceById("world-bank-internet-users")?.url).toBe(
      "https://data.worldbank.org/indicator/IT.NET.USER.ZS",
    );
    expect(sourceById("iea-energy-and-ai")?.url).toBe(
      "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai",
    );
  });

  it("has a page file for every routed surface", () => {
    for (const file of pageFiles) expect(existsSync(file), file).toBe(true);
  });

  it("does not collect an email address in the newsletter page", () => {
    const page = readFileSync("app/newsletter/page.tsx", "utf8");
    expect(page).not.toMatch(/type=["']email["']/);
    expect(page).toMatch(/not open|not available|not configured/i);
  });
});
