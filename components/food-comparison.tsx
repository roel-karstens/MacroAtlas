const columns = [
  {
    id: "commodity",
    kicker: "World commodity index",
    title: "The cargo",
    rows: [
      ["What it prices", "International prices of food commodities"],
      ["Basket", "Five groups: cereals, vegetable oils, dairy, meat, sugar"],
      ["Weights", "Average export shares, 2014–2016"],
      ["Geography", "Traded supply, not one country’s shops"],
      ["A fall means", "That export basket got cheaper. Not your receipt."],
    ],
  },
  {
    id: "retail",
    kicker: "Consumer food prices",
    title: "The bill",
    rows: [
      ["What it prices", "Food households actually buy"],
      ["Basket", "A consumption basket, not the export basket"],
      ["Weights", "What people buy, in that geography"],
      ["Geography", "A country or a currency area, not the world"],
      ["A fall means", "The shop basket got cheaper. A slower rise does not."],
    ],
  },
] as const;

export function FoodComparison() {
  return (
    <figure className="mt-6">
      <div className="grid gap-px border border-[#e4e6ea] bg-[#e4e6ea] md:grid-cols-2">
        {columns.map((column) => (
          <div key={column.id} className="bg-white p-5">
            <p className="text-sm text-[#3f4651]">{column.kicker}</p>
            <h3 className="mt-1 font-display text-4xl leading-none font-semibold">{column.title}</h3>
            <dl className="mt-4 space-y-3">
              {column.rows.map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-sm font-medium">{term}</dt>
                  <dd className="text-sm leading-relaxed text-[#3f4651]">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-[#3f4651]">
        Two objects. Left: FAO Food Price Index, nominal, 2014–2016 = 100. Right: Eurostat food HICP, euro area, 2015 = 100. The charts that follow keep those axes apart.
      </figcaption>
    </figure>
  );
}
