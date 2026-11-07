import { ieaEnergyAndAi, wikipediaAdaptation } from "@/lib/content/rights";

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
      "Not included. The monthly Pink Sheet workbook is the official Brent file. This edition stores no Brent values.",
    rights:
      "The Brent column cites Bloomberg, EIG, OPEC and the World Bank. The license for that column is unconfirmed. General World Bank catalog terms are not treated as permission for the workbook. No monthly prices are copied, and no replacement series is invented. Use the official workbook.",
  },
  {
    id: "ecb-ea-10y",
    title: "Euro area 10-year government benchmark bond yield",
    publisher: "European Central Bank",
    url: "https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.4F.BB.U2_10Y.YLD?format=csvdata&startPeriod=2014-01",
    retrieved: "2026-11-07",
    usedFor:
      "Not included. Series FM.M.U2.EUR.4F.BB.U2_10Y.YLD is a euro area government benchmark bond yield, not the policy rate. No observations are stored.",
    rights:
      "The recorded source is ECB/FINANCIAL PROVIDERS, and the third-party exception is not closed. This edition does not republish the monthly history and does not invent a replacement. Use the ECB Data Portal for the authoritative series.",
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
    rights: `Wikipedia contributors, CC BY-SA 4.0 (${wikipediaAdaptation.licenseUrl}). ${wikipediaAdaptation.changeNote} Place pages are not used as sources for oil volumes or pipeline capacities.`,
  },
  {
    id: "wikipedia-hormuz",
    title: "Strait of Hormuz",
    publisher: "Wikimedia Foundation",
    url: "https://en.wikipedia.org/wiki/Strait_of_Hormuz",
    retrieved: "2026-11-07",
    usedFor:
      "Geography only: the strait joins the Persian Gulf and the Gulf of Oman, between Iran and the Musandam peninsula, about 167 km long, with a width described as narrowing to about 39 km. Reference coordinate 26.6° N, 56.5° E. Volume shares and current-events claims on that page are not used.",
    rights: `Wikipedia contributors, CC BY-SA 4.0 (${wikipediaAdaptation.licenseUrl}). ${wikipediaAdaptation.changeNote} Not used as a source of oil volumes.`,
  },
  {
    id: "wikipedia-adcop",
    title: "Habshan–Fujairah oil pipeline",
    publisher: "Wikimedia Foundation",
    url: "https://en.wikipedia.org/wiki/Habshan%E2%80%93Fujairah_oil_pipeline",
    retrieved: "2026-11-07",
    usedFor:
      "Existence and endpoints of ADCOP: Habshan onshore field to Fujairah on the Gulf of Oman. No capacity figure is taken from the page.",
    rights: `Wikipedia contributors, CC BY-SA 4.0 (${wikipediaAdaptation.licenseUrl}). ${wikipediaAdaptation.changeNote} Capacity numbers, if present on the page, are not reproduced.`,
  },
  {
    id: "wikipedia-east-west",
    title: "East–West Crude Oil Pipeline",
    publisher: "Wikimedia Foundation",
    url: "https://en.wikipedia.org/wiki/East%E2%80%93West_Crude_Oil_Pipeline",
    retrieved: "2026-11-07",
    usedFor:
      "Route description: about 1,201 km from the Abqaiq area to Yanbu on the Red Sea, built so some Saudi exports need not pass the strait. The length is Wikipedia’s figure. No capacity is stated in this edition, and the route is not drawn.",
    rights: `Wikipedia contributors, CC BY-SA 4.0 (${wikipediaAdaptation.licenseUrl}). ${wikipediaAdaptation.changeNote}`,
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
      "Global data-center electricity anchors stated on the public report page, retrieved 7 November 2026: around 415 TWh in 2024 (estimate); around 945 TWh in 2030 in the base case; around 700 and around 970 TWh in 2035 for headwinds and high efficiency. Lift-off is stated as exceeding 1,700 TWh and is plotted as that lower bound, labeled >1,700, not as a measured 1,700. No intervening years are plotted.",
    rights: `${ieaEnergyAndAi.attribution}. The report page states Licence CC BY 4.0 (${ieaEnergyAndAi.licenseUrl}). Additional IEA terms: ${ieaEnergyAndAi.termsUrl}. The chart uses stated anchors from the report prose, including the lift-off lower bound above 1,700 TWh. It does not reproduce an IEA graphic, logo, photograph, or standalone dataset. ${ieaEnergyAndAi.derivativeDisclaimer}`,
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
    rights:
      "Four stated endpoints are plotted separately, in $ per million tokens, for two thresholds. The report figure is not reproduced, and the Epoch and Artificial Analysis databases named by Stanford are not copied. Plotting those cited endpoints is not presented as a settled license. No reuse right beyond this citation is claimed.",
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
      "Public report text, retrieved from the LBNL publications site. The PDF notes a retained US government license in the contractor terms. These summary figures are cited with attribution. The chart and its anchor list are this edition’s plot of those cited figures. They are not a copy of an LBNL figure, table, or database. This edition does not redistribute the PDF and does not claim a Creative Commons license for it.",
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
    id: "faostat-qcl",
    title: "FAOSTAT crops and livestock production",
    publisher: "Food and Agriculture Organization of the United Nations",
    url: "https://www.fao.org/faostat/en/#data/QCL",
    retrieved: "2026-11-07",
    usedFor:
      "Country production in tonnes for wheat, maize, sunflower seed, and crude sunflower oil, years 2021, 2023, and 2024 where the bulk file has them. Crude sunflower oil production stops at 2023. FAOSTAT is named in Annex 1 of the statistical-database terms. This is not the Food Price Index.",
    rights:
      "FAO. 2025. FAOSTAT: Crops and livestock products. Accessed on 7 November 2026. https://www.fao.org/faostat/en/#data/QCL Licence: CC BY 4.0. Database terms also say not to imply FAO endorsement, not to misrepresent the figures, and not to use the dataset to promote a commercial product. Macro Atlas is a non-commercial research edition. No endorsement is implied.",
  },
  {
    id: "faostat-tcl",
    title: "FAOSTAT trade in crops and livestock products",
    publisher: "Food and Agriculture Organization of the United Nations",
    url: "https://www.fao.org/faostat/en/#data/TCL",
    retrieved: "2026-11-07",
    usedFor:
      "Export quantity in tonnes and export value in thousand US dollars, for the same four products, 2021, 2023, and 2024. Quantity and value are separate. Reporter-based figures can carry estimate or external flags.",
    rights:
      "FAO. 2026. FAOSTAT: Trade — Crops and livestock products. Accessed on 7 November 2026. https://www.fao.org/faostat/en/#data/TCL Licence: CC BY 4.0. Same database terms as the production domain. This licence does not cover the Food Price Index.",
  },
  {
    id: "un-black-sea-grain-initiative",
    title: "Black Sea Grain Initiative",
    publisher: "United Nations",
    url: "https://www.un.org/en/black-sea-grain-initiative",
    retrieved: "2026-11-07",
    usedFor:
      "Context dates only: the Joint Coordination Centre on 27 July 2022, and the Initiative not renewed after 17 July 2023. The pages report over 32 million metric tons to 45 countries from Odesa, Chornomorsk and Yuzhny/Pivdennyi while the corridor ran. Not a price, not a FAOSTAT share, and not a description of shipping in 2026.",
    rights:
      "United Nations public pages, linked on 7 November 2026. https://www.un.org/en/black-sea-grain-initiative",
  },
  {
    id: "fao-food-price-index",
    title: "FAO Food Price Index",
    publisher: "Food and Agriculture Organization of the United Nations",
    url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/",
    retrieved: "2026-11-07",
    usedFor:
      "Eight named months from the nominal index, 2014–2016 = 100, copied as a table. Not the monthly file, not a chart, and not rescaled. Newest meat months mix projected and observed prices.",
    rights:
      "Checked 7 November 2026 at https://www.fao.org/contact-us/terms/en/ and https://www.fao.org/contact-us/terms/db-terms-of-use/en/. The index page states no licence, and Annex 1 of the database terms does not name this file, so it is not labelled CC BY 4.0. Website terms allow other content to be copied for a non-commercial product if FAO is acknowledged as source and copyright holder and endorsement is not implied. They ask permission before an adaptation. This edition copies eight original values in a table and does not replot them. © FAO. No endorsement.",
  },
  {
    id: "eurostat-hicp-food",
    title: "Eurostat harmonised index of consumer prices, food",
    publisher: "Eurostat",
    url: "https://doi.org/10.2908/PRC_HICP_MINR",
    retrieved: "2026-11-07",
    usedFor:
      "Euro area (changing composition, EA21 from 2026), food CP011, index 2015=100 and Eurostat’s annual rate of change. Dataset prc_hicp_minr, updated 4 November 2026. Last food month in the extract: September 2026. All-items annual rate is shown only as a separate basket. Not EU-27 and not a national receipt.",
    rights:
      "Eurostat’s copyright notice (https://ec.europa.eu/eurostat/help/copyright-notice), read 7 November 2026, authorises reuse of its statistical data if the source is acknowledged. Modifications must be stated, with a disclaimer that Eurostat is not responsible. The index points and annual rates drawn are Eurostat’s figures. The percent rise between January 2020 and September 2026 is a Macro Atlas ratio of two of those points. Eurostat is not responsible for that ratio. Source: Eurostat, prc_hicp_minr, https://doi.org/10.2908/PRC_HICP_MINR, accessed 7 November 2026.",
  },
  {
    id: "generated-illustrations",
    title: "Generated illustrations for this edition",
    publisher: "Macro Atlas",
    url: "/image-credits",
    retrieved: "2026-11-07",
    usedFor: "Labeled illustrations: harbor, coastal tanker, open-water tanker, and a conceptual server aisle. Not photographs and not records of a place, voyage, or facility.",
    rights:
      "Original generated images made for this edition. No stock license and no photographer are claimed. Do not treat them as news photography.",
  },
];

export function sourceById(id: string) {
  return sources.find((source) => source.id === id);
}
