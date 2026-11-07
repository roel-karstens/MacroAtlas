export type FoodStepId = "production" | "exportable" | "routes" | "buffers" | "retail";

export type FoodStage = {
  id: FoodStepId;
  title: string;
  short: string;
  question: string;
  summary: string;
  notThis: string;
  links: { href: string; label: string }[];
};

/** Evergreen order. A new event is read by walking these steps, not by naming the event. */
export const foodMainSteps: FoodStepId[] = ["production", "exportable", "routes", "buffers", "retail"];

export const foodStages: FoodStage[] = [
  {
    id: "production",
    title: "Where it is grown",
    short: "Production",
    question: "Where is production concentrated, and in which year?",
    summary:
      "A harvest is tonnes in a place. Concentration matters because a drought or an input shock in a few countries can move a world price even when most countries are unchanged. The year has to be named. A map of production is not a map of what leaves the country.",
    notThis: "No country tonnes are in this commit. Missing is not zero.",
    links: [],
  },
  {
    id: "exportable",
    title: "What can leave",
    short: "Exportable supply",
    question: "How much of the crop is sold abroad, as distinct from what is eaten at home?",
    summary:
      "A large producer can export little. A smaller producer can ship most of the crop. An export ban cuts the second number and can leave the first untouched. Exportable supply is the quantity that can meet someone else’s import need.",
    notThis: "Not the same series as production, and not estimated here.",
    links: [],
  },
  {
    id: "routes",
    title: "Routes and importers",
    short: "Routes",
    question: "Which route carries it, and who depends on that route?",
    summary:
      "A port, a strait, or a railway is a way the exportable supply moves. Importers are exposed when they rely on that path. The Gulf atlas in this edition is an oil map. It is the same kind of question for grain, and it is not a grain track. No ship positions are drawn.",
    notThis: "Not AIS, and not a measured trade flow.",
    links: [{ href: "/atlas", label: "Oil atlas, same kind of question" }],
  },
  {
    id: "buffers",
    title: "Stocks, substitutes, next planting",
    short: "Buffers",
    question: "What can absorb the shock before the receipt moves?",
    summary:
      "Inventories, a different crop, a different supplier, or the next season’s planting can take up a gap. This page does not publish stock levels or a substitution rate. The bond sketch is only a way to price the financing of inventory you choose to assume.",
    notThis: "No stock-to-use ratio and no elasticity.",
    links: [{ href: "/models/bond-sensitivity", label: "Financing is a yield you type" }],
  },
  {
    id: "retail",
    title: "The bill, later",
    short: "The bill",
    question: "What still has to happen before the shop price moves, and does the level actually fall?",
    summary:
      "Processing, wages, packaging, and contracts already signed sit between a cargo price and a receipt. Eurostat’s food index is the shop-price object for the euro area. A slower inflation rate is not a lower price level.",
    notThis: "Not a pass-through coefficient.",
    links: [
      { href: "/sources#eurostat-hicp-food", label: "Eurostat food series" },
      { href: "/topics/rates-inflation", label: "Inflation is a rate" },
    ],
  },
];

export type FoodShock = {
  id: string;
  label: string;
  stepId: FoodStepId;
  summary: string;
};

/** Each shock opens one step. It is not a tonne and not a cause of every price move. */
export const foodShocks: FoodShock[] = [
  {
    id: "drought",
    label: "Drought",
    stepId: "production",
    summary:
      "Start with the harvest. Ask which countries and which year. A failed crop is not yet an export cut, and not yet the grocery bill.",
  },
  {
    id: "ban",
    label: "Export ban",
    stepId: "exportable",
    summary:
      "A ban can stop shipments while the grain is still in the country. Production and exports part company on purpose. Ask what was exportable, not only what was grown.",
  },
  {
    id: "energy",
    label: "Energy and inputs",
    stepId: "production",
    summary:
      "Fuel and fertilizer can change what is planted and what it costs. There is no licensed fertilizer price series here. The oil model is a barrel scenario you type. It does not price bread, and household energy inflation is not a fertilizer cost.",
  },
  {
    id: "route",
    label: "Closed route",
    stepId: "routes",
    summary:
      "A closed port or a longer voyage is a route fact. Ask who imported along that path. The oil atlas shows how this edition draws a corridor. It does not draw grain ships.",
  },
  {
    id: "conflict",
    label: "War",
    stepId: "routes",
    summary:
      "War can hit exportable supply and the route together. The worked example is the Black Sea after February 2022, when fighting involved Russia and Ukraine, both shippers of wheat and sunflower. This page does not give their tonnes, does not treat that war as the cause of all euro-area food inflation, and does not assert a blockade that is not dated in the file. The next war, drought, or ban uses the same five questions.",
  },
];

export function stageById(id: string) {
  return foodStages.find((stage) => stage.id === id);
}
