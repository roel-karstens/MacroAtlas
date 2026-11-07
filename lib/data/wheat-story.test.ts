import { describe, expect, it } from "vitest";
import { wheatShortAnswer, wheatTradeFacts } from "@/lib/data/wheat-story";

describe("wheat trade facts", () => {
  const facts = wheatTradeFacts();

  it("matches the checked FAOSTAT export snapshot", () => {
    expect(facts.sum2024 / 1e6).toBeCloseTo(202.676, 2);
    expect(facts.top6Share2024).toBeCloseTo(66.83, 1);
    const [russia, canada, unitedStates, ukraine, australia, france] = facts.exporters;
    expect(russia.share2021).toBeCloseTo(13.609, 2);
    expect(russia.share2024).toBeCloseTo(16.127, 2);
    expect(russia.export2024 / 1e6).toBeCloseTo(32.686, 2);
    expect(russia.flag2024).toBe("X");
    expect(russia.note2024).toMatch(/trading partners/i);
    expect(canada.share2024).toBeCloseTo(12.606, 2);
    expect(unitedStates.share2024).toBeCloseTo(10.758, 2);
    expect(ukraine.share2021).toBeCloseTo(9.645, 2);
    expect(ukraine.share2024).toBeCloseTo(10.196, 2);
    expect(ukraine.export2024 / 1e6).toBeCloseTo(20.665, 2);
    expect(australia.share2024).toBeCloseTo(9.709, 2);
    expect(france.share2024).toBeCloseTo(7.433, 2);
    expect(facts.russiaProduction2024.value! / 1e6).toBeCloseTo(82.588, 2);
    expect(facts.russiaProduction2024.flag).toBe("X");
    expect(facts.russiaProduction2024.note).toMatch(/Unofficial/);
    expect(facts.ukraineProduction2024.value! / 1e6).toBeCloseTo(22.441, 2);
  });

  it("writes a dated short answer from those shares", () => {
    const answer = wheatShortAnswer(facts);
    expect(answer).toContain("66.8%");
    expect(answer).toContain("13.6%");
    expect(answer).toContain("16.1%");
    expect(answer).toContain("9.6%");
    expect(answer).toContain("10.2%");
    expect(answer).toContain("7 November 2026");
    expect(answer).toContain("re-exports");
    expect(answer.split(/\s+/).length).toBeLessThanOrEqual(60);
  });
});
