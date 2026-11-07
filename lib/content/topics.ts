import type { ContentLink } from "@/lib/content/articles";

export type TopicSection = {
  id: string;
  kicker: string;
  heading: string;
  paragraphs: string[];
  links?: ContentLink[];
};

export type Topic = {
  id: "energy" | "rates-inflation" | "digital-infrastructure";
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
        links: [
          { href: "/topics/energy/the-hormuz-question", label: "Read the Hormuz question" },
          { href: "/topics/digital-infrastructure", label: "Server power is a different topic" },
        ],
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
        links: [
          { href: "/topics/rates-inflation/when-yields-move#limits", label: "Read the limits" },
          { href: "/topics/digital-infrastructure", label: "A data center is not this yield" },
        ],
      },
    ],
  },
  {
    id: "digital-infrastructure",
    title: "Digital infrastructure",
    navLabel: "Digital infrastructure",
    kicker: "Chips, power, networks, use, and tests",
    deck: "A physical chain for computing. Definitions and source limits. No live series in this edition.",
    sections: [
      {
        id: "chips",
        kicker: "Chips and hardware",
        heading: "Orders, revenue, wafers, and working chips are different counts",
        paragraphs: [
          "ASML’s quarterly materials separate bookings, revenue, and systems delivered. TSMC’s 12-inch-equivalent wafer shipments are an area of wafers, not a count of good chips and not a dollar total. Industry sales, including a three-month moving average, are billings. Memory prices are not in this edition.",
        ],
        links: [
          { href: "/topics/digital-infrastructure/the-physical-digital-chain#chips", label: "Read the hardware section" },
          { href: "/sources#asml-quarterly", label: "ASML source note" },
          { href: "/sources#tsmc-quarterly-2026-q3", label: "TSMC source note" },
        ],
      },
      {
        id: "data-centers",
        kicker: "Data centers and power",
        heading: "Capacity is not utilization, and neither is energy",
        paragraphs: [
          "Nameplate megawatts are what a site was built to hold. Utilization is the share in use. Energy is power times time, metered or explicitly estimated. The IEA separates estimated historical demand from scenarios. None of those paths is plotted here. The oil topic’s Brent series is not a server-load series.",
        ],
        links: [
          { href: "/topics/energy", label: "Energy, which stays the oil chain" },
          { href: "/sources#iea-energy-and-ai", label: "IEA Energy and AI" },
        ],
      },
      {
        id: "networks",
        kicker: "Networks and connectivity",
        heading: "People online are not traffic",
        paragraphs: [
          "World Bank indicator IT.NET.USER.ZS is the share of people using the internet. It is not bytes and not latency. The country series is not copied. Cloudflare Radar is not used, because its API is non-commercial. No cable is added to the oil map.",
        ],
        links: [
          { href: "/sources#world-bank-internet-users", label: "Internet users indicator" },
          { href: "/atlas", label: "Atlas, still the Gulf oil map" },
        ],
      },
      {
        id: "activity",
        kicker: "Digital activity",
        heading: "Name the unit before calling it demand",
        paragraphs: [
          "Users, requests, tokens, and revenue answer different questions. This edition has no activity series and no live dashboard. A later chart would have to say whether the line is observed, an estimate, or a forecast.",
        ],
        links: [{ href: "/methodology", label: "Labels for observed, estimate, and scenario" }],
      },
      {
        id: "capabilities",
        kicker: "AI capabilities and costs",
        heading: "A benchmark is a test, a version, a cost, and a latency",
        paragraphs: [
          "Epoch’s training-compute figures are estimates of operations for a named run. MLPerf scores a fixed workload at a benchmark version. Stanford’s AI Index and Artificial Analysis’s methodology are compilations and methods, not a single progress percent. This page states no share of the way to a general system and no deadline. A cloud hourly price is meaningful only for an exact configuration, and none is copied. Paying for a multi-year hall is a financing question; the bond sketch is that tool, not a valuation.",
        ],
        links: [
          { href: "/topics/digital-infrastructure/the-physical-digital-chain#capabilities", label: "Read the capabilities section" },
          { href: "/models/bond-sensitivity", label: "Bond sensitivity, a financing sketch" },
          { href: "/topics/rates-inflation", label: "Rates and inflation" },
        ],
      },
    ],
  },
];

export function topicById(id: string) {
  return topics.find((topic) => topic.id === id);
}
