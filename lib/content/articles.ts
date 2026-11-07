export type ContentLink = { href: string; label: string };

export type ArticleSection = {
  id: string;
  kicker: string;
  heading: string;
  paragraphs: string[];
  links?: ContentLink[];
};

export type Article = {
  id: string;
  slug: string;
  topicId: "energy" | "rates-inflation" | "digital-infrastructure";
  title: string;
  deck: string;
  published: string;
  updated: string;
  imageId?: string;
  modelId?: string;
  locationIds: string[];
  sourceIds: string[];
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    id: "the-hormuz-question",
    slug: "the-hormuz-question",
    topicId: "energy",
    title: "The Hormuz question",
    deck: "Trace the exposure. Test the assumptions.",
    published: "2026-11-07",
    updated: "2026-11-07",
    imageId: "hormuz-tanker",
    modelId: "oil-exposure",
    locationIds: ["hormuz", "fujairah", "habshan", "abqaiq", "yanbu", "ras-tanura", "kharg", "abot"],
    sourceIds: ["wikipedia-hormuz", "wikipedia-adcop", "wikipedia-east-west", "wikipedia-places", "world-bank-pink-sheet", "eia-chokepoints-unquoted"],
    sections: [
      {
        id: "what-changes",
        kicker: "01",
        heading: "What changes",
        paragraphs: [
          "The Strait of Hormuz is the sea passage between the Persian Gulf and the Gulf of Oman. For geography, and only for geography, this edition uses the Wikipedia article retrieved on 7 November 2026. That article describes a waterway between Iran and the Musandam peninsula, about 167 kilometres long, narrowing to roughly 39 kilometres. The geography is a constraint on transport. It is not, by itself, a price.",
          "Three different counts get collapsed into one story. They should not. A vessel transit is a movement of a ship. The ship can be laden or in ballast. It can be a tanker, a dry-cargo ship, or something else. A transit table counts hulls passing a line. It does not count barrels.",
          "Tonnage is a measure of ship size or of cargo weight. Deadweight is not the oil on board. A tonne of cargo is not a barrel. A large ship in ballast can add tonnage to a transit statistic and add nothing to supply. Treating “more ships” or “more tonnes” as “less oil” skips the only step that would make the sentence true.",
          "An oil-volume estimate is that further step. Someone has to decide which ships were laden, what the cargo was, and how to convert it into barrels. The estimate has a source, a date, and a method. It is not the transit count, and it is not a forecast of the benchmark.",
          "This edition does not publish a transit series, a tonnage series, or a Hormuz volume series. There is no AIS feed and no live traffic layer. The U.S. Energy Information Administration keeps a chokepoint briefing. The page was requested for this build and the response did not include a statistical table, so no EIA volume, share, or ship count is quoted. Secondary write-ups sometimes attach a large share of seaborne oil to the strait. Those percentages are not reproduced here.",
          "What is published is a map of selected places, with coordinates taken from Wikipedia pages retrieved the same day, and a scenario model in which you type a price change in dollars per barrel. The model does not look at the map and decide the price. A disruption narrative and a price scenario are different objects. Keeping them apart is the point.",
        ],
      },
      {
        id: "who-is-exposed",
        kicker: "02",
        heading: "Who is exposed",
        paragraphs: [
          "Exposure in this edition means unhedged barrels, not a list of companies and not a target for a share price. A net producer or exporter who still has barrels to sell, and has not already fixed the price, gains operating profit if the realized price rises and loses it if the price falls. A net buyer has the opposite sign on those same barrels. The buyer might be a refiner, a power generator, a shipper of crude, or a state that imports. The sign is a choice you make in the model. It is not inferred from a headline.",
          "Pass-through is the share of the benchmark move that reaches that operating profit. A refiner that lifts product prices one-for-one with crude may show little margin change from the crude move itself. The shock then sits with whoever cannot pass it on. A buyer locked into a product price, with crude still open, absorbs more. Contracts, lags, and quality all sit inside the factor. This edition does not estimate it. You type a number between zero and one.",
          "Extra costs are a different channel. Insurance, a longer voyage, demurrage, and the financing of inventory can change profit even when the benchmark does not, and even when the barrel eventually arrives. The model subtracts an extra-cost amount you enter, in the reporting currency, after the price effect has been translated at an exchange rate you also enter. There is no live foreign-exchange rate. If the books are in dollars, the rate is 1.",
          "The places named here are the same records as on the atlas: Ras Tanura, Abqaiq, Al Başrah Oil Terminal, Kharg, Sirri, Ras Laffan, Habshan, the Port of Fujairah, Al Dhannah, and the strait. Roles overlap on purpose. A terminal can store and load. Habshan is both a field area and the reported start of a pipeline. Fujairah is a port on the Gulf of Oman and the reported end of that pipeline. Ras Laffan is an industrial port for gas, liquids, and refining, which is a reminder that not every hull in the Gulf is a crude tanker. None of the markers is a surveyed berth. None carries a capacity or a flow in this edition.",
        ],
        links: [
          { href: "/atlas", label: "Open the Gulf atlas" },
          { href: "/models/oil-exposure", label: "Open the oil exposure model" },
        ],
      },
      {
        id: "what-could-invalidate",
        kicker: "03",
        heading: "What could invalidate the thesis",
        paragraphs: [
          "The working hypothesis is narrow. A disruption story does not translate directly into a price forecast. Several facts would weaken even that caution, or would make a price you typed a poor description of the physical event.",
          "Bypass comes first. Wikipedia, retrieved 7 November 2026, describes the East–West pipeline, also called the Petroline, as running about 1,201 kilometres from the Abqaiq area to Yanbu on the Red Sea, so that some Saudi exports need not pass the strait. The same day’s reading of the Habshan–Fujairah article describes that line as running from the Habshan field to Fujairah on the Gulf of Oman. If those routes, and any others, had spare capacity large enough to move the barrels at risk, a closure of the sea passage would not be a loss of supply. This edition does not state those capacities and does not estimate the spare. A reader who has a sourced residual can type that residual as barrels per day. The model will not invent it, and it will not solve a network.",
          "Stocks and demand come next. Inventories can be drawn. Buyers can use less. Either one can offset a lost flow for a while. Neither is estimated here. Substitution is the same kind of gap: another grade, another product, or a draw on a different region is invisible in a single Brent scenario.",
          "Delay is not the same thing as loss. A slower transit, a queue, or a longer route can raise costs and still deliver the barrel. Treating every interrupted voyage as a destroyed barrel overstates the volume shock. The extra-cost input is there for the first case. The price input is not a substitute for a volume you have not established.",
          "The Brent series is not in this edition. The Pink Sheet workbook column cites Bloomberg, EIG, OPEC and the World Bank, and the license for that column is unconfirmed, so no monthly prices are shown and none are invented. It is not a Hormuz volume. The scenario fan on this page is a drawing with no numeric scale. It is not a price series and not a forecast.",
          "The arithmetic of the model can be right while the scenario is wrong. That is acceptable. What is not acceptable is a chart that pretends a ship count has already chosen the price.",
        ],
        links: [
          { href: "/topics/energy#track", label: "See why the Brent series is absent" },
          { href: "/sources#world-bank-pink-sheet", label: "Read the Brent source note" },
          { href: "/methodology", label: "Read the methodology" },
        ],
      },
    ],
  },
  {
    id: "from-barrel-to-margin",
    slug: "from-barrel-to-margin",
    topicId: "energy",
    title: "From barrel to margin",
    deck: "Follow a barrel through the chain, then into operating profit.",
    published: "2026-11-07",
    updated: "2026-11-07",
    imageId: "card-tanker",
    modelId: "oil-exposure",
    locationIds: ["kharg", "abqaiq", "ras-tanura", "hormuz", "fujairah", "al-dhannah", "habshan", "ras-laffan"],
    sourceIds: ["wikipedia-places", "wikipedia-adcop", "wikipedia-east-west", "world-bank-pink-sheet"],
    sections: [
      {
        id: "five-steps",
        kicker: "01",
        heading: "Five steps, and nodes that do more than one",
        paragraphs: [
          "The physical oil chain in this edition has five stages: production, processing, transport, storage, and use. A place can sit in more than one of them. That is the ordinary case, not an exception. A marine terminal stores, loads, and is itself a transport node. A refinery is processing and also a user of crude. A pipeline endpoint is transport infrastructure attached to whatever the place already does.",
          "Kharg, in this map, is an island coordinate used as an Iranian export terminal: storage and transport, not a claim that the wellhead is the marker. Abqaiq is a processing place and the eastern end of a pipeline that leaves the map toward Yanbu. Ras Tanura is a Gulf loading area. Al Dhannah, the industrial city formerly widely called Ruwais, stands in for refining and use, at the city coordinate rather than a jetty. Habshan is a field area and the reported start of the line to Fujairah. Fujairah is a port on the Gulf of Oman, outside the strait, and the reported end of that line. Ras Laffan is included because it is easy to misread every Gulf port as a crude terminal. Wikipedia describes it as Qatar’s main site for liquefied natural gas and gas-to-liquids, with a refinery and a port. The product on an edge is part of the record. “Oil” is not a good enough label when the cargo may be condensate, a product, or LNG.",
          "Electricity cables are a mode the data model allows, because a later edition may need them for power. No cable is drawn. A cable is not given oil-pipeline physics, and it is not used as a metaphor for a tanker route. If a connection is not in the registry, it is not on the map.",
        ],
        links: [{ href: "/atlas", label: "Select these places on the atlas" }],
      },
      {
        id: "edges",
        kicker: "02",
        heading: "What an edge is allowed to say",
        paragraphs: [
          "A connection in this edition can carry a mode, a product, a capacity, a flow, a source, an as-of date, and an estimate status. Most of those fields are intentionally empty. Empty is not the same as zero. Zero would be a claim. Empty means this edition will not state the number.",
          "Three connections are in the registry. The Habshan–Fujairah pipeline is mode pipeline, product crude oil, estimate status schematic. The line you see is straight between two Wikipedia coordinates. It is not a surveyed centerline. Capacity and flow are null. The Strait of Hormuz corridor is mode sea, product left as mixed cargo, geometry schematic. The bend is drawn by hand through the strait so the eye can find the passage. It is not a traffic scheme and not a count of ships. The East–West pipeline is in the registry and off the map: Wikipedia describes it as running about 1,201 kilometres from the Abqaiq area to Yanbu, and Yanbu has no coordinate in this window. Again, no capacity.",
          "Nothing on an edge is a forecast, and nothing updates itself. The as-of date is the day the description was retrieved, 7 November 2026, not the day a barrel moved. If a later edition adds a capacity, it has to name the source and the date in the same record the map reads. The article, the atlas, and the model are not allowed to invent a private version of the same fact.",
        ],
      },
      {
        id: "identity",
        kicker: "03",
        heading: "From a barrel to operating profit",
        paragraphs: [
          "The oil model does not price a company and it does not clear a market. It answers a smaller question: if this many unhedged barrels per day face this price change for this many days, and only this share of the change reaches the margin, what happens to operating profit after a currency translation and an extra cost?",
          "The identity is deliberate. Barrels over the horizon equal barrels per day times days. The dollar effect equals those barrels times the price change times the pass-through. The translated effect equals the dollar effect times reporting-currency units per one dollar. Operating profit changes by the translated effect minus extra costs. Positive barrels mean a net seller. Negative barrels mean a net buyer. A price increase is a positive price change. Extra costs are positive when they reduce profit.",
          "The price change is yours. It is not read off the Brent chart, even though that chart sits nearby so you can see the scale of past monthly averages. Past averages are not a distribution of future ones, and this page does not draw a probability band around a path. A band would be a claim about odds. There is no odds model here.",
          "Hedges are outside the identity because the barrel input is already net of them. If you type gross production, you have not described the unhedged position, and the sign will be too large. Taxes, royalties, volume responses, and quality discounts beyond the pass-through factor are also outside. Share prices are outside. The result is an operating-profit change in the currency you named.",
        ],
        links: [{ href: "/models/oil-exposure", label: "Use the oil exposure model" }],
      },
      {
        id: "example",
        kicker: "04",
        heading: "An example you can check",
        paragraphs: [
          "Take 1,000 barrels a day, for 10 days, and a price change of plus 10 dollars a barrel. Pass-through is 1, the books are in dollars, and extra costs are zero. A producer’s operating profit rises by 100,000 dollars. A consumer’s, with the same magnitude and the opposite sign, falls by 100,000 dollars. If the price change is minus 10 instead, the two signs flip. If pass-through is 0.25 and the exchange rate is 0.5 reporting-currency units per dollar, the producer’s translated effect is 12,500 before costs. Subtract 1,000 of extra costs and the change is 11,500. Those figures are the unit tests of this edition. They are arithmetic, not a market.",
          "Reset the model and you are back to a round illustration: 10,000 barrels a day, 90 days, plus 10 dollars, full pass-through, dollars. That default is not a recommendation and not a position. Saving a case stores it in this browser only if you ask it to. Nothing about the case is written to a server.",
        ],
        links: [
          { href: "/methodology", label: "Read the formula and its limits" },
          { href: "/topics/energy/the-hormuz-question", label: "Return to the Hormuz question" },
        ],
      },
    ],
  },
  {
    id: "when-yields-move",
    slug: "when-yields-move",
    topicId: "rates-inflation",
    title: "When yields move",
    deck: "A bond yield is not a policy rate. Duration is not a promise.",
    published: "2026-11-07",
    updated: "2026-11-07",
    modelId: "bond-sensitivity",
    locationIds: [],
    sourceIds: ["ecb-ea-10y"],
    sections: [
      {
        id: "not-the-policy-rate",
        kicker: "01",
        heading: "A yield is not a policy rate",
        paragraphs: [
          "The price of a plain bond is the discounted value of coupons and principal. The yield is the discount rate that sets that present value equal to the market price. A central bank’s policy rate is a different instrument: an administered rate on reserves or on a short operation. The two can move together, and they often do not match. Using the policy rate as if it were the yield on a ten-year bond will get the carrying income and the price sensitivity wrong at the same time.",
          "This edition does not include the euro area 10-year series FM.M.U2.EUR.4F.BB.U2_10Y.YLD. Its recorded source is ECB/FINANCIAL PROVIDERS, and the third-party exception is not closed, so the monthly history is not shown and no replacement yield is invented. The official series is a government benchmark bond yield, not the policy rate. The policy rate is not plotted, because plotting it beside a market yield would invite exactly the confusion this page is trying to avoid.",
          "The model starts from a round example, 3 percent, so the arithmetic is visible without a dated market print. There is no control that copies an official observation into the form. You can edit the example. Scenario paths on the model are dashed. They are not market history.",
        ],
        links: [
          { href: "/topics/rates-inflation#track", label: "See why the yield series is absent" },
          { href: "/sources#ecb-ea-10y", label: "Read the ECB source note" },
        ],
      },
      {
        id: "duration",
        kicker: "02",
        heading: "Duration, in one worked case",
        paragraphs: [
          "Modified duration is the local percentage sensitivity of the price to the yield. This form asks for modified duration, not Macaulay duration. For an annual-pay bond the two differ by a factor of one plus the yield, and this edition does not do that conversion in silence. If you paste a Macaulay number into the modified-duration box, you will not get the case below.",
          "The textbook check is duration 7 and a yield increase of 100 basis points. One hundred basis points is 1 percentage point, which is 0.01 in decimal. Minus 7 times 0.01 is minus 0.07. The price effect from duration alone is a fall of 7 percent. The same shift typed as “1” with the unit set to percentage points must produce the same 0.01. The same digits typed as “100” in percentage-point mode mean 100 percentage points, which this form rejects. The unit switch exists so that a decimal is not applied twice and a percent is not forgotten.",
          "Carry over a horizon is approximated as the annual starting yield times the horizon in years. At a 3 percent yield and a one-year horizon, carry is plus 3 percent. Add it to the duration price effect and, with no costs and no convexity, the total-return sketch is minus 4 percent. “Total return” here is that sum. It is not a promise, not a compounded path, and not a quote from a market.",
        ],
      },
      {
        id: "convexity-and-costs",
        kicker: "03",
        heading: "Convexity, carry, and costs",
        paragraphs: [
          "The second-order term is one half times convexity times the square of the yield shift, with the shift in decimal. Convexity of 60 and a shift of 0.01 give one half times 60 times 0.0001, which is 0.003, or 0.30 percentage points. Added to the duration effect of minus 7 percent, the price effect is minus 6.7 percent. The term is omitted until you turn it on. Omitted is not an estimate of zero convexity. The box says so.",
          "Vendor files do not all quote convexity in this scaling. Some quote a number that is already divided by 100. If your source does not satisfy the check above — 60 and 100 basis points making 0.30 percentage points — do not paste it unchanged. A factor-of-100 mistake dominates the duration term and looks like a precise answer.",
          "Costs are a drag on return, entered in basis points. Twenty basis points is 0.002 in decimal, not 0.20 and not 20 percent. They are subtracted after carry and the price effect. A negative cost is allowed and flagged, because a negative cost increases the sketched return and is easy to type by mistake.",
          "The default horizon is one year. Stretch it and the carry term scales in a straight line. That is a poor description of a long holding period: the bond rolls down, coupons are reinvested, and the duration you typed will not still be the duration at the end. Above three years the page warns you. Above thirty it refuses.",
        ],
        links: [{ href: "/models/bond-sensitivity", label: "Open the bond sensitivity model" }],
      },
      {
        id: "limits",
        kicker: "04",
        heading: "What the approximation leaves out",
        paragraphs: [
          "The formula is local. Large yield moves, even with the convexity term, are a sketch. Credit spreads are not in it. A benchmark yield and a corporate yield are not the same object, and this edition has no spread series. Currency is not in it. Taxes are not in it. Calls, defaults, and prepayment are not in it. Inflation enters only if you have already decided what it means for the yield you type. The model will not turn an inflation scenario into a yield for you.",
          "Nothing here is a recommendation to own or to sell a bond, and nothing is a forecast of the ECB. No official yield is copied into the calculator. If you want a downside case, type the shift. The chart will recompute. If you clear the form, the 7-year, 100-basis-point case is one control away, and it should still read minus 7 percent on the duration line before carry and convexity. Duration 8 with the same 100 basis point rise is minus 8 percent on that same line.",
        ],
        links: [
          { href: "/methodology", label: "Methodology and limits" },
          { href: "/topics/energy/the-hormuz-question", label: "The oil question is a different market" },
        ],
      },
    ],
  },
  {
    id: "the-physical-digital-chain",
    slug: "the-physical-digital-chain",
    topicId: "digital-infrastructure",
    title: "The physical digital chain",
    deck: "Five counts that do not collapse into one progress number.",
    imageId: "digital-hero",
    published: "2026-11-07",
    updated: "2026-11-07",
    locationIds: [],
    sourceIds: [
      "asml-quarterly",
      "tsmc-quarterly-2026-q3",
      "world-bank-internet-users",
      "iea-energy-and-ai",
      "lbnl-us-data-centers-2024",
      "epoch-notable-models",
      "mlperf-inference-datacenter",
      "stanford-ai-index",
      "artificial-analysis-methodology",
      "cloudflare-radar-not-used",
    ],
    sections: [
      {
        id: "chips",
        kicker: "01",
        heading: "Chips and hardware",
        paragraphs: [
          "A chip story usually mixes four different objects: bookings, revenue, machines or wafers, and finished chips that work. They move together only by assumption. This edition does not copy a quarterly table, so it does not print a current order number, a sales total, or a shipment count.",
          "ASML’s quarterly materials separate orders, revenue, and systems that were shipped or recognized as delivered. An order is a claim on a future machine. Revenue is an accounting total. A delivery is a physical system. The investor page for those materials is the quarterly-results index. Reading it is not the same as storing a quarter in this site.",
          "TSMC reports wafer shipments on a 12-inch-equivalent basis. That is an area of wafers, scaled to a 300 millimetre disk. It is not a count of good chips, and it is not sales in dollars. The English quarterly-results page for the third quarter of 2026 is the pointer used here. No row from it is in the snapshot.",
          "Trade-association sales, including a three-month moving average of semiconductor billings, are dollars. They are not volumes of chips. Memory contract prices are a further series, and they are not here: this edition has not reviewed a feed it is willing to republish. Silicon, copper, and process chemicals are materials inputs. Materials is not a published topic, so those prices are not invented beside the oil series.",
        ],
        links: [
          { href: "/sources#asml-quarterly", label: "ASML quarterly results, as a source note" },
          { href: "/sources#tsmc-quarterly-2026-q3", label: "TSMC Q3 2026 results page" },
        ],
      },
      {
        id: "data-centers",
        kicker: "02",
        heading: "Data centers and power",
        paragraphs: [
          "Nameplate power, IT load, and electricity consumed are not the same sentence. A hall rated for a round number of megawatts is a capacity: the kit it was built to hold. Utilization is how much of that rating is actually in use. Energy over a period is power times time, and only a meter or an explicit estimate is energy. A capacity figure used as if it were last year’s consumption overstates the electrons.",
          "The IEA report on energy and AI distinguishes estimated historical demand from scenario pathways. A scenario is a conditional path. An estimate of the past is still an estimate, not a meter this site collected. The chart marks only the years those pages state. The Brent series on the energy topic is a crude price. It is not a data-center load, and the oil calculator does not price a server hall.",
          "Cooling water, backup generation, and the grid connection are physical constraints. They belong next to power, not inside a chip-revenue line. This edition does not publish a global megawatt database.",
        ],
        links: [
          { href: "/sources#iea-energy-and-ai", label: "IEA Energy and AI" },
          { href: "/topics/energy", label: "Energy topic, which is oil, not server load" },
        ],
      },
      {
        id: "networks",
        kicker: "03",
        heading: "Networks and connectivity",
        paragraphs: [
          "A network count can be people, traffic, or the quality of a path. Internet users as a percent of population, World Bank indicator IT.NET.USER.ZS, is people. It is not bytes, not latency, and not the load on a data center. The indicator page is linked. The country series is not copied into a chart.",
          "Traffic needs a definition of what is counted and who operates the vantage point. Cloudflare Radar is a well-known traffic product. Its API is offered on non-commercial terms. A non-commercial feed is the wrong default for pages that may later be reused, so this edition does not draw it.",
          "Subsea cables and terrestrial fiber are transport edges, in the same family as a pipeline: a mode, a route, a capacity, and a flow, each of which can be blank. No cable is drawn on the Gulf atlas. An electricity cable is still not an oil pipeline, and a data cable is not a power line.",
        ],
        links: [
          { href: "/sources#world-bank-internet-users", label: "World Bank internet users indicator" },
          { href: "/sources#cloudflare-radar-not-used", label: "Why Radar is not used" },
          { href: "/atlas", label: "The atlas remains the oil map" },
        ],
      },
      {
        id: "activity",
        kicker: "04",
        heading: "Digital activity",
        paragraphs: [
          "Activity is whatever the chosen unit says it is. A user percentage, a request, a token, and a revenue line answer different questions. None of them is a wafer, and none of them is training compute. Collapsing them into “demand for AI” hides the unit.",
          "This section has no series. There is no live dashboard and no fabricated current KPI. If a later edition files a dated extract, the chart will say observed, estimate, or forecast in the caption, and the file will sit with the other snapshots. Until then the honest graphic is the absence of one.",
        ],
        links: [{ href: "/methodology", label: "How observed, estimate, and scenario are labeled" }],
      },
      {
        id: "capabilities",
        kicker: "05",
        heading: "AI capabilities and costs",
        paragraphs: [
          "A training-compute figure is an estimate of floating-point operations for a named run. Epoch compiles such estimates for notable models. They are not a meter this site has audited, and they are not a date by which a system does something else. This page states no percent of the way to a general system and no deadline.",
          "MLPerf Inference for the data center scores a fixed workload at a stated benchmark version. The result may be throughput, latency, or a power-related variant. A higher score on one version is not comparable to another version without saying so. It is not a single intelligence index.",
          "Stanford’s AI Index is an annual compilation across many measures. Artificial Analysis publishes a methodology for how it benchmarks models. A composite score mixes tasks. Cost and latency belong beside the score, for a named model and a named test. This edition does not reprint a leaderboard.",
          "A cloud price per hour means something only for an exact configuration: which chip, how many, how much memory, which region, and what commitment. A public page can be read. That reading is not a license to resell the vendor’s table. No hourly price is copied here.",
          "What would weaken the chain: using a scenario terawatt-hour path as if it were history, using wafer area as a chip count, using bookings as shipments, using dollar sales as volumes, or using one benchmark as progress. Financing a multi-year build is a yield question. The bond calculator is that sketch. It is not a valuation of a hall, and the yield it starts from is not a policy rate.",
        ],
        links: [
          { href: "/sources#epoch-notable-models", label: "Epoch notable models" },
          { href: "/sources#mlperf-inference-datacenter", label: "MLPerf Inference, data center" },
          { href: "/sources#stanford-ai-index", label: "Stanford AI Index" },
          { href: "/sources#artificial-analysis-methodology", label: "Artificial Analysis methodology" },
          { href: "/models/bond-sensitivity", label: "Bond sketch for a financing assumption" },
          { href: "/topics/rates-inflation", label: "Rates and inflation" },
        ],
      },
    ],
  },
];

export function articleBySlug(topicId: string, slug: string) {
  return articles.find((article) => article.topicId === topicId && article.slug === slug);
}

export function articlesForTopic(topicId: string) {
  return articles.filter((article) => article.topicId === topicId);
}

export function countWords(article: Article) {
  const text = [article.title, article.deck, ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
