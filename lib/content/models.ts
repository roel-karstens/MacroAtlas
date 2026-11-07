export type ModelMeta = {
  id: "oil-exposure" | "bond-sensitivity";
  title: string;
  href: string;
  topicId: "energy" | "rates-inflation";
  version: string;
  summary: string;
  formula: string;
  persistence: string;
};

export const models: ModelMeta[] = [
  {
    id: "oil-exposure",
    title: "Oil exposure",
    href: "/models/oil-exposure",
    topicId: "energy",
    version: "1",
    summary: "Change in operating profit from an unhedged barrel position and a price change you type.",
    formula:
      "Operating-profit change = barrels per day × days × price change × pass-through × reporting currency per USD − extra costs.",
    persistence:
      "The calculation runs in this browser. A saved comparison stays on this device only if you turn remembering on. This edition has no account and writes no scenario to a server.",
  },
  {
    id: "bond-sensitivity",
    title: "Bond sensitivity",
    href: "/models/bond-sensitivity",
    topicId: "rates-inflation",
    version: "1",
    summary: "Approximate price effect and a simple total-return sketch from a yield shift you type.",
    formula:
      "Price effect ≈ −modified duration × Δy + ½ × convexity × (Δy)². Carry ≈ yield × years. Total-return sketch ≈ carry + price effect − costs.",
    persistence:
      "The calculation runs in this browser. A saved comparison stays on this device only if you turn remembering on. Nothing is written to a server.",
  },
];

export function modelById(id: string) {
  return models.find((model) => model.id === id);
}
