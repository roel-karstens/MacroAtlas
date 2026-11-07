export type ImageAsset = {
  id: string;
  src: string;
  alt: string;
  label: string;
  credit: string;
  license: string;
  placements: string[];
};

const credit =
  "Generated for the Macro Atlas design concept on 7 November 2026. Not a photograph. Not a record of a specific port, strait, vessel, cargo, or date. Funnel marks and shoreline details are not identifiable owners or places.";

export const images: ImageAsset[] = [
  {
    id: "hero-harbor",
    src: "/images/hero-harbor.jpg",
    alt: "Generated illustration of a tanker in an industrial harbor at low sun. Not a photograph of a specific port.",
    label: "AI illustration",
    credit,
    license: "Original generated illustration for this edition. No third-party stock license.",
    placements: ["Home, hero"],
  },
  {
    id: "hormuz-tanker",
    src: "/images/hormuz-tanker.jpg",
    alt: "Generated illustration of a tanker on calm water with arid hills behind it. Not a photograph of the Strait of Hormuz.",
    label: "AI illustration",
    credit,
    license: "Original generated illustration for this edition. No third-party stock license.",
    placements: ["The Hormuz question, lead image", "Home, research card"],
  },
  {
    id: "card-tanker",
    src: "/images/card-tanker.jpg",
    alt: "Generated illustration of a tanker on open water, seen from above. Not a photograph of a specific voyage.",
    label: "AI illustration",
    credit,
    license: "Original generated illustration for this edition. No third-party stock license.",
    placements: ["From barrel to margin, lead image", "Home, research card"],
  },
];

export function imageById(id: string) {
  return images.find((image) => image.id === id);
}
