export type ChainStage = {
  id: string;
  title: string;
  short: string;
  kind: "dependency" | "stage" | "complement";
  summary: string;
  notThis: string;
  links: { href: string; label: string }[];
};

export const chainStages: ChainStage[] = [
  {
    id: "materials-power",
    title: "Materials and power",
    short: "Materials and power",
    kind: "dependency",
    summary:
      "Silicon, metals, water, and electricity sit under the chain. They are dependencies of fabs and of operating halls. This edition does not publish a materials price or a power-flow number.",
    notThis: "Not a directed circuit and not the Brent series.",
    links: [
      { href: "/topics/energy", label: "Energy topic" },
      { href: "/topics/digital-infrastructure#data-centers", label: "Power section" },
    ],
  },
  {
    id: "networks",
    title: "Networks and telecom",
    short: "Networks",
    kind: "dependency",
    summary:
      "Fiber, switching, and the public network are how a hall is reached. They are not the electricity, and they are not a user-percentage.",
    notThis: "Not drawn on the Gulf oil atlas, and not a Cloudflare series.",
    links: [{ href: "/topics/digital-infrastructure#networks", label: "Networks section" }],
  },
  {
    id: "fabs",
    title: "Fabrication equipment and fabs",
    short: "Fabs",
    kind: "stage",
    summary:
      "Tools and the buildings that run them. An order for a tool is not a delivered system, and a delivered system is not a wafer.",
    notThis: "Not ASML revenue and not a count of finished chips.",
    links: [{ href: "/sources#asml-quarterly", label: "ASML source note" }],
  },
  {
    id: "wafers",
    title: "Wafers, chips, and memory",
    short: "Wafers and chips",
    kind: "complement",
    summary:
      "Logic and memory are complements on the same substrate story. A 12-inch-equivalent wafer shipment is an area. Memory is not priced in this edition.",
    notThis: "Not a good-die count and not a sales total.",
    links: [{ href: "/sources#tsmc-quarterly-2026-q3", label: "TSMC source note" }],
  },
  {
    id: "servers",
    title: "Servers and racks",
    short: "Servers",
    kind: "stage",
    summary: "Boards, accelerators, and the racks that hold them. A rack is a piece of equipment, not the electricity it will draw once it is on.",
    notThis: "Not nameplate megawatts and not a benchmark score.",
    links: [{ href: "/topics/digital-infrastructure#chips", label: "Hardware section" }],
  },
  {
    id: "operations",
    title: "Operating the hall",
    short: "Hall operations",
    kind: "stage",
    summary:
      "Power, cooling, and the network connection meet here. Capacity is the rating. Utilization is the share in use. Energy is what is consumed over time.",
    notThis: "Not a single arrow of electricity from the mine to the model.",
    links: [
      { href: "/sources#lbnl-us-data-centers-2024", label: "US electricity anchors" },
      { href: "/sources#iea-energy-and-ai", label: "IEA global anchors" },
    ],
  },
  {
    id: "use",
    title: "Useful compute",
    short: "Useful compute",
    kind: "stage",
    summary:
      "Training and inference people actually run. A benchmark score, a price per token, and a latency are three readings of that use. They are not a percent of a general system.",
    notThis: "Not an AGI meter and not a delivery date.",
    links: [{ href: "/topics/digital-infrastructure#capabilities", label: "Capabilities section" }],
  },
];

export const chainDependencies: { from: string; to: string; label: string }[] = [
  { from: "materials-power", to: "fabs", label: "Depends on" },
  { from: "materials-power", to: "wafers", label: "Depends on" },
  { from: "materials-power", to: "operations", label: "Depends on" },
  { from: "networks", to: "operations", label: "Depends on" },
  { from: "networks", to: "use", label: "Depends on" },
];
