import { faoExcerpt } from "@/lib/data/fao-ffpi-excerpt";
import { formatPeriod } from "@/lib/data/series";

function faoNumber(value: number) {
  return new Intl.NumberFormat("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(value);
}

const columns = [
  ["ffpi", "Food"],
  ["cereals", "Cereals"],
  ["oils", "Oils"],
  ["dairy", "Dairy"],
  ["meat", "Meat"],
  ["sugar", "Sugar"],
] as const;

export function FaoExcerptTable() {
  return (
    <figure className="mt-6">
      <figcaption className="text-sm leading-relaxed text-[#3f4651]">
        © FAO. Eight months copied from the nominal Food Price Index, 2014–2016 = 100. Not a chart and not rescaled. The full monthly file is not in this site.{" "}
        <a className="underline underline-offset-4" href="https://www.fao.org/worldfoodsituation/foodpricesindex/en/">
          FAO Food Price Index
        </a>
        . Release dated 6 November 2026. Meat’s newest months mix projected and observed prices, so the headline can still be revised.
      </figcaption>
      <div className="mt-3 max-w-full min-w-0 overflow-x-auto border border-[#e4e6ea]">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Selected FAO Food Price Index values, nominal, 2014 to 2016 equals 100</caption>
          <thead>
            <tr className="border-b border-[#e4e6ea]">
              <th className="px-3 py-2 font-medium">Month</th>
              <th className="px-3 py-2 font-medium">Why it is here</th>
              {columns.map(([, label]) => (
                <th key={label} className="px-3 py-2 font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {faoExcerpt.map((row) => (
              <tr key={row.period} className="border-b border-[#e4e6ea]">
                <th scope="row" className="px-3 py-2 font-normal">{formatPeriod(row.period)}</th>
                <td className="px-3 py-2">{row.why}</td>
                {columns.map(([key]) => (
                  <td key={key} className="px-3 py-2 tabular-nums">{faoNumber(row[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
