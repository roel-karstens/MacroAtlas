import type { ContentLink } from "@/lib/content/articles";

export type TopicSection = {
  id: string;
  kicker: string;
  heading: string;
  paragraphs: string[];
  links?: ContentLink[];
};

export type Topic = {
  id: "energy" | "rates-inflation";
  title: string;
  navLabel: string;
  kicker: string;
  deck: string;
  sections: TopicSection[];
};

export const topics: Topic[] = [
  {
    id: "energy",
    title: "Energy",
    navLabel: "Energy",
    kicker: "Oil",
    deck: "One chain, from the Gulf to a margin. Oil is the only energy subject in this edition.",
    sections: [
      {
        id: "understand",
        kicker: "Understand",
        heading: "A barrel is a physical object before it is a price",
        paragraphs: [
          "This topic follows crude and related liquids through production, processing, transport, storage, and use. The worked geography is the Persian Gulf and the Gulf of Oman approach, because that is where the Hormuz passage sits. The question is not “what will Brent do”. It is which count you are looking at, who is unhedged, and which assumptions would make the story fail.",
        ],
        links: [{ href: "/topics/energy/the-hormuz-question", label: "Read the Hormuz question" }],
      },
      {
        id: "explore",
        kicker: "Explore",
        heading: "The atlas is this topic, drawn",
        paragraphs: [
          "The atlas uses the same place and connection records as the articles. Terminals, pipeline endpoints, and the Hormuz corridor can be filtered and selected. Capacities and flows are blank on purpose. The coastline is Natural Earth, clipped and simplified. It is not a chart for navigation, and there is no live traffic.",
        ],
        links: [{ href: "/atlas", label: "Open the atlas" }],
      },
      {
        id: "track",
        kicker: "Track",
        heading: "One observed benchmark",
        paragraphs: [
          "The series below is the World Bank Pink Sheet monthly average for Brent, nominal dollars per barrel, January 2010 through October 2026. It is context for the size of past moves. It is not a Hormuz volume and not an input to the model unless you choose to type a number yourself.",
        ],
      },
      {
        id: "research",
        kicker: "Research",
        heading: "Two essays, one chain",
        paragraphs: [
          "The Hormuz question separates vessel passage, tonnage, and estimated oil volume, and lists what would invalidate a direct jump to price. From barrel to margin walks the same places into the operating-profit identity, with a numerical example that matches the tests.",
        ],
      },
      {
        id: "model",
        kicker: "Model",
        heading: "Type the price. Do not infer it.",
        paragraphs: [
          "The oil exposure model takes a horizon, a price change, an unhedged barrel position, a pass-through factor, an exchange rate, and extra costs. It returns a change in operating profit. Positive barrels are a net producer. Negative barrels are a net consumer.",
        ],
        links: [{ href: "/models/oil-exposure", label: "Open the oil model" }],
      },
      {
        id: "challenge",
        kicker: "Challenge",
        heading: "Spare capacity, stocks, delay, and hedges",
        paragraphs: [
          "A bypass with real spare capacity, a stock draw, or a demand response can offset a lost flow. A delay can raise costs without destroying the barrel. Hedges mean the unhedged volume is smaller than production. None of those offsets is estimated in this edition. The way to challenge the thesis is to bring a sourced number, or to refuse the price scenario until you have one.",
        ],
        links: [{ href: "/topics/energy/the-hormuz-question#what-could-invalidate", label: "Read the invalidation section" }],
      },
    ],
  },
  {
    id: "rates-inflation",
    title: "Rates and inflation",
    navLabel: "Rates & inflation",
    kicker: "Bond yields",
    deck: "A limited file: one government yield series, one explainer, and a sensitivity calculator.",
    sections: [
      {
        id: "understand",
        kicker: "Understand",
        heading: "Start from the bond, not the central bank",
        paragraphs: [
          "Inflation matters for bonds because it is one reason yields move, not because a policy announcement is itself the market yield. This edition does not publish a consumer-price series and does not convert an inflation guess into a yield. It shows one observed long-term government yield and a calculator for a yield shift you choose.",
        ],
      },
      {
        id: "explore",
        kicker: "Explore",
        heading: "There is no rates atlas",
        paragraphs: [
          "The atlas in this edition is the Gulf oil map. Yields do not have a geography here. The thing to explore is the definition of the series: euro area 10-year government benchmark bond yield, monthly, percent per annum, from the ECB, distinct from the policy rate.",
        ],
        links: [{ href: "/sources#ecb-ea-10y", label: "Open the series note" }],
      },
      {
        id: "track",
        kicker: "Track",
        heading: "The benchmark yield we actually retrieved",
        paragraphs: [
          "January 2014 through October 2026. The latest month in the snapshot is October 2026. The line is solid because it is observed. It is not a forecast, and the axis label says the unit.",
        ],
      },
      {
        id: "research",
        kicker: "Research",
        heading: "One explainer",
        paragraphs: [
          "When yields move walks through modified duration, the minus 7 percent case, convexity scaling, simple carry, and the list of things the approximation ignores.",
        ],
        links: [{ href: "/topics/rates-inflation/when-yields-move", label: "Read when yields move" }],
      },
      {
        id: "model",
        kicker: "Model",
        heading: "A scenario, not a quote",
        paragraphs: [
          "You set the starting yield, modified duration, the shift in basis points or percentage points, the horizon, costs, and optional convexity. The page recomputes the duration effect, the price effect, carry, and a total-return sketch. Defaults are an example. They are not the latest print.",
        ],
        links: [{ href: "/models/bond-sensitivity", label: "Open the bond model" }],
      },
      {
        id: "challenge",
        kicker: "Challenge",
        heading: "Where the sketch fails",
        paragraphs: [
          "Large moves, the wrong convexity units, a Macaulay number used as modified duration, a credit spread ignored, or a policy rate typed in as the yield. Any of those breaks the interpretation even when the arithmetic is internally consistent.",
        ],
        links: [{ href: "/topics/rates-inflation/when-yields-move#limits", label: "Read the limits" }],
      },
    ],
  },
];

export function topicById(id: string) {
  return topics.find((topic) => topic.id === id);
}
