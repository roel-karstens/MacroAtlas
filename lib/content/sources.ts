export type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  retrieved: string;
  usedFor: string;
  rights: string;
};

export const sources: Source[] = [
  {
    id: "world-bank-pink-sheet",
    title: "World Bank Commodity Price Data (The Pink Sheet), monthly prices",
    publisher: "World Bank",
    url: "https://www.worldbank.org/en/research/commodity-markets",
    retrieved: "2026-11-07",
    usedFor:
      "Nominal monthly Crude oil, Brent (UK Brent 38° API, USD per barrel), January 2010 through October 2026. The workbook itself is marked updated on 3 November 2026. October 2026 in that file is 125.",
    rights:
      "File used: the November 2026 monthly historical workbook linked from the Commodity Markets page (CMO-Historical-Data-Monthly.xlsx). This edition copies one column, not the workbook. World Bank open-data summary terms describe a CC BY 4.0 license for Data Catalog datasets unless metadata says otherwise. This Pink Sheet file is distributed from the research page, and that CC BY statement was not confirmed for it. Site terms reviewed the same day ask for attribution and describe non-catalog materials as informational, with commercial republication requiring consent. Macro Atlas does not resell the series. For reuse, use the official workbook.",
  },
  {
    id: "ecb-ea-10y",
    title: "Euro area 10-year government benchmark bond yield",
    publisher: "European Central Bank",
    url: "https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.4F.BB.U2_10Y.YLD?format=csvdata&startPeriod=2014-01",
    retrieved: "2026-11-07",
    usedFor:
      "Series FM.M.U2.EUR.4F.BB.U2_10Y.YLD, monthly, percent per annum (unit PCPA). Metadata title: “Euro Area 10 Years Government Benchmark Bond - Yield”, euro area changing composition, provided by the ECB. January 2014 through October 2026, 154 observations, each with observation status A. October 2026 is 4.173827 percent. This is a bond yield, not the policy rate.",
    rights:
      "Retrieved from the public ECB Data Portal API. The ECB disclaimer and copyright page fetched the same day did not return a short machine-readable reproduction clause in the static HTML. This edition attributes the series to the ECB, does not imply ECB endorsement, and does not claim a resolved license for commercial redistribution. Use the ECB Data Portal for the authoritative series.",
  },
  {
    id: "natural-earth",
    title: "Natural Earth 1:10m land",
    publisher: "Natural Earth",
    url: "https://www.naturalearthdata.com/about/terms-of-use/",
    retrieved: "2026-11-07",
    usedFor:
      "Coastline clipped to the Gulf window. Public-domain vector land, simplified. Not a navigational chart.",
    rights:
      "Natural Earth’s terms page states that the raster and vector map data on the site are in the public domain and may be used for personal, educational, and commercial purposes without permission. Attribution is not required. This edition still credits Natural Earth.",
  },
  {
    id: "wikipedia-places",
    title: "Wikipedia place and port articles",
    publisher: "Wikimedia Foundation",
    url: "https://en.wikipedia.org/wiki/Ras_Tanura",
    retrieved: "2026-11-07",
    usedFor:
      "Coordinates and short place descriptions for Ras Tanura, Abqaiq, Kharg Island, Sirri Island, Habshan, Al Dhannah, Ras Laffan Industrial City, the Port of Fujairah, and Al Başrah Oil Terminal. Coordinates come from the MediaWiki coordinates property on those pages.",
    rights:
      "Wikipedia text is licensed CC BY-SA 4.0. This edition paraphrases short geographic descriptions and links each article. It does not copy article text in bulk. Coordinates are facts taken from those pages. Place pages are not used as sources for oil volumes or pipeline capacities.",
  },
  {
    id: "wikipedia-hormuz",
    title: "Strait of Hormuz",
    publisher: "Wikimedia Foundation",
    url: "https://en.wikipedia.org/wiki/Strait_of_Hormuz",
    retrieved: "2026-11-07",
    usedFor:
      "Geography only: the strait joins the Persian Gulf and the Gulf of Oman, between Iran and the Musandam peninsula, about 167 km long, with a width described as narrowing to about 39 km. Reference coordinate 26.6° N, 56.5° E. Volume shares and current-events claims on that page are not used.",
    rights:
      "CC BY-SA 4.0 for Wikipedia text. Paraphrase plus link. Not used as a source of oil volumes.",
  },
  {
    id: "wikipedia-adcop",
    title: "Habshan–Fujairah oil pipeline",
    publisher: "Wikimedia Foundation",
    url: "https://en.wikipedia.org/wiki/Habshan%E2%80%93Fujairah_oil_pipeline",
    retrieved: "2026-11-07",
    usedFor:
      "Existence and endpoints of ADCOP: Habshan onshore field to Fujairah on the Gulf of Oman. No capacity figure is taken from the page.",
    rights: "CC BY-SA 4.0. Paraphrase plus link. Capacity numbers, if present elsewhere on the page, are not reproduced.",
  },
  {
    id: "wikipedia-east-west",
    title: "East–West Crude Oil Pipeline",
    publisher: "Wikimedia Foundation",
    url: "https://en.wikipedia.org/wiki/East%E2%80%93West_Crude_Oil_Pipeline",
    retrieved: "2026-11-07",
    usedFor:
      "Route description: about 1,201 km from the Abqaiq area to Yanbu on the Red Sea, built so some Saudi exports need not pass the strait. The length is Wikipedia’s figure. No capacity is stated in this edition, and the route is not drawn.",
    rights: "CC BY-SA 4.0. Paraphrase plus link.",
  },
  {
    id: "eia-chokepoints-unquoted",
    title: "World Oil Transit Chokepoints",
    publisher: "U.S. Energy Information Administration",
    url: "https://www.eia.gov/international/analysis/special-topics/World_Oil_Transit_Chokepoints",
    retrieved: "2026-11-07",
    usedFor:
      "Not used for any figure. The page was requested and the response did not include a statistical table, so no EIA volume, share, or transit count is quoted.",
    rights:
      "EIA information is generally US government work, but this edition does not reproduce EIA statistics because none were extracted. The link is a pointer only.",
  },
  {
    id: "asml-quarterly",
    title: "ASML quarterly results",
    publisher: "ASML",
    url: "https://investor.asml.com/quarterly-results",
    retrieved: "2026-11-07",
    usedFor:
      "Pointer only. Orders, revenue, and systems delivered are different objects. No quarterly table is copied into this edition.",
    rights:
      "Company disclosure. Linked, not republished. This edition does not claim a license to reproduce ASML figures.",
  },
  {
    id: "tsmc-quarterly-2026-q3",
    title: "TSMC quarterly results, English index for Q3 2026",
    publisher: "TSMC",
    url: "https://investor.tsmc.com/english/quarterly-results/2026/q3",
    retrieved: "2026-11-07",
    usedFor:
      "Pointer only. Twelve-inch-equivalent wafer shipments are an area measure, not a count of good chips and not revenue. No table is stored.",
    rights: "Company disclosure. Linked, not republished.",
  },
  {
    id: "world-bank-internet-users",
    title: "Individuals using the Internet (% of population)",
    publisher: "World Bank",
    url: "https://data.worldbank.org/indicator/IT.NET.USER.ZS",
    retrieved: "2026-11-07",
    usedFor:
      "Definition of indicator IT.NET.USER.ZS: people online as a share of population. Not traffic, latency, or data-center load. The series is not copied.",
    rights:
      "World Bank open-data terms describe CC BY 4.0 for catalog datasets unless the metadata says otherwise. This edition links the indicator and does not redistribute the country series.",
  },
  {
    id: "iea-energy-and-ai",
    title: "Energy and AI, energy demand from AI",
    publisher: "International Energy Agency",
    url: "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai",
    retrieved: "2026-11-07",
    usedFor:
      "Global data-center electricity anchors stated on the public report page, retrieved 7 November 2026: around 415 TWh in 2024 (estimate); around 945 TWh in 2030 in the base case; around 700, around 970, and exceeding 1,700 TWh in 2035 for headwinds, high efficiency, and lift-off. No intervening years are plotted.",
    rights:
      "IEA publications have their own terms. These are the rounded figures stated in the public prose, cited with attribution. IEA charts are not reproduced, and this edition does not claim a license to redistribute the report.",
  },
  {
    id: "epoch-notable-models",
    title: "Notable AI models",
    publisher: "Epoch AI",
    url: "https://epoch.ai/data/notable-ai-models",
    retrieved: "2026-11-07",
    usedFor:
      "Pointer only. Training-compute figures there are estimates of FLOPs for named runs. They are not filed as observations here, and they are not a capability date.",
    rights: "Epoch’s dataset terms govern reuse. This edition links the page and does not copy the table.",
  },
  {
    id: "mlperf-inference-datacenter",
    title: "MLPerf Inference, data center",
    publisher: "MLCommons",
    url: "https://mlcommons.org/benchmarks/inference-datacenter/",
    retrieved: "2026-11-07",
    usedFor:
      "Definition of a fixed-workload inference benchmark. A score belongs to a benchmark version and can be throughput, latency, or a power-related result. No result table is stored.",
    rights: "MLCommons results are not reproduced. The link is a definition of the benchmark.",
  },
  {
    id: "stanford-ai-index",
    title: "Stanford HAI AI Index",
    publisher: "Stanford Institute for Human-Centered AI",
    url: "https://hai.stanford.edu/ai-index",
    retrieved: "2026-11-07",
    usedFor:
      "Four published inference-price endpoints from the 2025 AI Index, chapter 1: MMLU 64.8 threshold, 20 USD per million tokens in November 2022 and 0.07 in October 2024 (Gemini-1.5-Flash-8B); GPQA above 50 percent, 15 USD in May 2024 and 0.12 in December 2024 (Phi 4). The price is described as a 3:1 weighted average of input and output token prices. No other points from the figure are digitized.",
    rights: "Stanford’s report terms apply. This edition does not reproduce the report.",
  },
  {
    id: "artificial-analysis-methodology",
    title: "Artificial Analysis, intelligence benchmarking methodology",
    publisher: "Artificial Analysis",
    url: "https://artificialanalysis.ai/methodology/intelligence-benchmarking",
    retrieved: "2026-11-07",
    usedFor:
      "Pointer to a published methodology. A composite score is not reprinted. Cost and latency are discussed as separate fields, not taken from their tables.",
    rights:
      "Reading a public methodology page is not a license to reuse Artificial Analysis tables or leaderboards. None are copied.",
  },
  {
    id: "cloudflare-radar-not-used",
    title: "Cloudflare Radar",
    publisher: "Cloudflare",
    url: "https://radar.cloudflare.com/",
    retrieved: "2026-11-07",
    usedFor:
      "Not used. The Radar API is offered for non-commercial use. That is the wrong default for this edition, so no traffic chart is drawn.",
    rights: "Not reproduced. Non-commercial API terms are not treated as a right to embed the data.",
  },
  {
    id: "lbnl-us-data-centers-2024",
    title: "2024 United States Data Center Energy Usage Report",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/us_data_center_energy_usage_report_lbnl-2001637_0.pdf",
    retrieved: "2026-11-07",
    usedFor:
      "United States data-center electricity anchors from the executive summary of LBNL-2001637: about 60 TWh across 2014–2016 as one statement, about 76 TWh in 2018, 176 TWh in 2023, and a 2028 scenario range of roughly 325 to 580 TWh. No year between those statements is plotted.",
    rights:
      "Public report text, retrieved from the LBNL publications site. The PDF notes a retained US government license in the contractor terms. These summary figures are cited with attribution. This edition does not redistribute the PDF and does not claim a Creative Commons license for it.",
  },
  {
    id: "barlow-ofl",
    title: "Barlow and Barlow Condensed",
    publisher: "The Barlow Project Authors",
    url: "https://github.com/jpt/barlow",
    retrieved: "2026-11-07",
    usedFor: "Interface and headline type, loaded by next/font from the Google Fonts distribution.",
    rights:
      "SIL Open Font License 1.1. Copyright 2017 The Barlow Project Authors. The license text shipped with the family is in licenses/barlow-OFL.txt. The fonts are not sold by themselves.",
  },
  {
    id: "generated-illustrations",
    title: "Generated illustrations for this edition",
    publisher: "Macro Atlas",
    url: "/image-credits",
    retrieved: "2026-11-07",
    usedFor: "Three labeled illustrations: harbor, coastal tanker, and open-water tanker. Not photographs and not records of a place or voyage.",
    rights:
      "Original generated images made for this edition. No stock license and no photographer are claimed. Do not treat them as news photography.",
  },
];

export function sourceById(id: string) {
  return sources.find((source) => source.id === id);
}
