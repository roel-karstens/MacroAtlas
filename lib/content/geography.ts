import type { MapFilterKey } from "@/lib/map/project";

export type Location = {
  id: string;
  name: string;
  country: string;
  lat: number | null;
  lon: number | null;
  coordinateStatus: "sourced_place" | "approximate_schematic" | "not_in_map";
  sourceId: string;
  sourceUrl: string;
  retrieved: string;
  roles: Array<"production" | "processing" | "transport" | "storage" | "use" | "terminal" | "pipeline_endpoint">;
  categories: MapFilterKey[];
  summary: string;
  capacityNote: string;
};

export type Connection = {
  id: string;
  name: string;
  fromId: string;
  toId: string | null;
  mode: "pipeline" | "sea";
  product: string;
  categories: MapFilterKey[];
  capacity: null;
  flow: null;
  sourceId: string;
  sourceUrl: string;
  retrieved: string;
  estimateStatus: "schematic_route" | "off_map";
  geometry: "straight" | "corridor" | "off_map";
  path?: Array<{ lat: number; lon: number }>;
  note: string;
};

const retrieved = "2026-11-07";

export const locations: Location[] = [
  {
    id: "ras-tanura",
    name: "Ras Tanura",
    country: "Saudi Arabia",
    lat: 26.70638889,
    lon: 50.05277778,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Ras_Tanura",
    retrieved,
    roles: ["terminal", "storage", "transport"],
    categories: ["terminal"],
    summary:
      "Wikipedia coordinate for the place Ras Tanura, a major Saudi export area on the Gulf. The marker is not a surveyed berth.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "abqaiq",
    name: "Abqaiq",
    country: "Saudi Arabia",
    lat: 25.935,
    lon: 49.66611111,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Abqaiq",
    retrieved,
    roles: ["processing", "pipeline_endpoint"],
    categories: ["processing", "pipeline"],
    summary:
      "Wikipedia coordinate for Abqaiq. The East–West pipeline article describes the eastern end as the Abqaiq area. Processing and pipeline endpoint are both fair descriptions. No capacity is stated here.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "abot",
    name: "Al Başrah Oil Terminal",
    country: "Iraq",
    lat: 29.78333333,
    lon: 48.80694444,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Al_Ba%C5%9Frah_Oil_Terminal",
    retrieved,
    roles: ["terminal", "transport"],
    categories: ["terminal"],
    summary:
      "Wikipedia coordinate from the terminal’s own page. Offshore loading terminal for Iraqi crude. Throughput is not stated in this edition.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "kharg",
    name: "Kharg Island",
    country: "Iran",
    lat: 29.245,
    lon: 50.31,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Kharg_Island",
    retrieved,
    roles: ["terminal", "storage", "transport"],
    categories: ["terminal"],
    summary:
      "Wikipedia coordinate for the island, not a specific jetty. Kharg is an Iranian crude export point. Loading capacity is not stated here.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "sirri",
    name: "Sirri Island",
    country: "Iran",
    lat: 25.90944444,
    lon: 54.53944444,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Sirri_Island",
    retrieved,
    roles: ["terminal", "transport"],
    categories: ["terminal"],
    summary: "Wikipedia coordinate for Sirri Island, an Iranian offshore export area. Not a surveyed berth, and no flow is stated.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "ras-laffan",
    name: "Ras Laffan Industrial City",
    country: "Qatar",
    lat: 25.8575,
    lon: 51.53888889,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Ras_Laffan_Industrial_City",
    retrieved,
    roles: ["processing", "terminal", "transport"],
    categories: ["terminal", "processing"],
    summary:
      "Wikipedia describes Ras Laffan as Qatar’s main site for liquefied natural gas and gas-to-liquids, with a refinery and a port. The marker is the industrial-city coordinate. This edition does not repeat an export-capacity figure.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "habshan",
    name: "Habshan",
    country: "United Arab Emirates",
    lat: 23.825,
    lon: 53.61666667,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Habshan",
    retrieved,
    roles: ["production", "processing", "pipeline_endpoint"],
    categories: ["pipeline", "processing"],
    summary:
      "Wikipedia coordinate for Habshan. The pipeline article describes the Habshan–Fujairah line as starting at the Habshan onshore field. The marker is the place, not a surveyed pipeline origin.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "fujairah",
    name: "Port of Fujairah",
    country: "United Arab Emirates",
    lat: 25.18805556,
    lon: 56.35972222,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Port_of_Fujairah",
    retrieved,
    roles: ["terminal", "storage", "transport", "pipeline_endpoint"],
    categories: ["terminal", "pipeline"],
    summary:
      "Wikipedia coordinate for the Port of Fujairah, on the Gulf of Oman outside the strait. The port page describes a deep port and bunkering hub. The pipeline page says the Habshan line runs to Fujairah. This marker is the port, not a surveyed landfall.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "al-dhannah",
    name: "Al Dhannah",
    country: "United Arab Emirates",
    lat: 24.10333333,
    lon: 52.58361111,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-places",
    sourceUrl: "https://en.wikipedia.org/wiki/Al_Dhannah",
    retrieved,
    roles: ["processing", "use"],
    categories: ["processing"],
    summary:
      "Wikipedia coordinate for Al Dhannah, formerly widely called Al Ruwais, an industrial city associated with the Ruwais refinery. The marker is the city, not a jetty.",
    capacityNote: "Not stated in this edition.",
  },
  {
    id: "hormuz",
    name: "Strait of Hormuz",
    country: "Iran / Oman",
    lat: 26.6,
    lon: 56.5,
    coordinateStatus: "sourced_place",
    sourceId: "wikipedia-hormuz",
    sourceUrl: "https://en.wikipedia.org/wiki/Strait_of_Hormuz",
    retrieved,
    roles: ["transport"],
    categories: ["corridor"],
    summary:
      "Wikipedia’s reference point for the strait, the sea passage between the Persian Gulf and the Gulf of Oman. The point is not a terminal. The corridor drawn through it is a separate schematic.",
    capacityNote: "Not stated in this edition. No transit, tonnage, or oil-volume series is published here.",
  },
  {
    id: "yanbu",
    name: "Yanbu",
    country: "Saudi Arabia",
    lat: null,
    lon: null,
    coordinateStatus: "not_in_map",
    sourceId: "wikipedia-east-west",
    sourceUrl: "https://en.wikipedia.org/wiki/East%E2%80%93West_Crude_Oil_Pipeline",
    retrieved,
    roles: ["terminal", "pipeline_endpoint"],
    categories: ["pipeline"],
    summary:
      "Named by Wikipedia as the Red Sea end of the East–West pipeline. It is outside this Gulf window, and this pass did not add a separate coordinate, so it is not plotted.",
    capacityNote: "Not stated in this edition.",
  },
];

export const connections: Connection[] = [
  {
    id: "adcop",
    name: "Habshan–Fujairah oil pipeline",
    fromId: "habshan",
    toId: "fujairah",
    mode: "pipeline",
    product: "crude oil",
    categories: ["pipeline"],
    capacity: null,
    flow: null,
    sourceId: "wikipedia-adcop",
    sourceUrl: "https://en.wikipedia.org/wiki/Habshan%E2%80%93Fujairah_oil_pipeline",
    retrieved,
    estimateStatus: "schematic_route",
    geometry: "straight",
    note:
      "Wikipedia describes ADCOP as running from Habshan to Fujairah, which lets some Abu Dhabi crude reach the Gulf of Oman without the strait. The line on the map is straight between the two place coordinates. It is not a surveyed centerline, and no capacity or flow is stated.",
  },
  {
    id: "hormuz-corridor",
    name: "Strait of Hormuz sea passage",
    fromId: "hormuz",
    toId: "hormuz",
    mode: "sea",
    product: "mixed cargo, not separated into oil volume",
    categories: ["corridor"],
    capacity: null,
    flow: null,
    sourceId: "wikipedia-hormuz",
    sourceUrl: "https://en.wikipedia.org/wiki/Strait_of_Hormuz",
    retrieved,
    estimateStatus: "schematic_route",
    geometry: "corridor",
    path: [
      { lat: 26.9, lon: 55.35 },
      { lat: 26.6, lon: 56.25 },
      { lat: 26.35, lon: 56.95 },
    ],
    note:
      "Approximate schematic of the sea passage through the strait. Not a traffic-separation scheme, not AIS, and not a measured flow. Vessel counts are not drawn.",
  },
  {
    id: "east-west",
    name: "East–West crude oil pipeline",
    fromId: "abqaiq",
    toId: "yanbu",
    mode: "pipeline",
    product: "crude oil",
    categories: ["pipeline"],
    capacity: null,
    flow: null,
    sourceId: "wikipedia-east-west",
    sourceUrl: "https://en.wikipedia.org/wiki/East%E2%80%93West_Crude_Oil_Pipeline",
    retrieved,
    estimateStatus: "off_map",
    geometry: "off_map",
    note:
      "Wikipedia describes the Petroline as running about 1,201 km from the Abqaiq area to Yanbu on the Red Sea, so some Saudi exports need not pass the strait. It is not drawn. Yanbu is outside this window, and no capacity is stated.",
  },
];

export function locationById(id: string) {
  return locations.find((location) => location.id === id);
}

export function connectionsFor(id: string) {
  return connections.filter((connection) => connection.fromId === id || connection.toId === id);
}
