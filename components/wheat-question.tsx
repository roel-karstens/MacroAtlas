import { ChoroplethMap } from "@/components/choropleth-map";
import { sliceRows } from "@/lib/data/crop-atlas";
import { wheatTradeFacts, type WheatTradeFacts } from "@/lib/data/wheat-story";
import { formatNumber } from "@/lib/format";

function millions(value: number) {
  return formatNumber(value / 1_000_000, 1);
}

function ShareLegend() {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] leading-snug text-[#3f4651]">
      <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#d9e7f1]" /> under 1%</li>
      <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#9fc3de]" /> 1–3%</li>
      <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#4f8bb8]" /> 3–8%</li>
      <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#1f5582]" /> 8–15%</li>
      <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#0b2a4a]" /> 15% or more</li>
      <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#efece6]" /> no figure</li>
      <li className="flex items-center gap-1"><span className="inline-block size-3 border-2 border-[#c8461f] bg-white" /> Russia, Ukraine outlined</li>
    </ul>
  );
}

function YearMap({ year, facts }: { year: 2021 | 2024; facts: WheatTradeFacts }) {
  const rows = sliceRows("wheat", "export-quantity", year);
  const total = year === 2021 ? facts.sum2021 : facts.sum2024;
  return (
    <figure className="min-w-0 border border-[#d9d3c6] bg-white p-3">
      <figcaption className="text-sm font-medium">
        {year}
        <span className="mt-1 block font-normal text-[#3f4651]">
          {year === 2021 ? "Before the full-scale invasion" : "Latest complete FAOSTAT year in this file"}
        </span>
      </figcaption>
      <ChoroplethMap
        rows={rows}
        total={total}
        outlineIsos={["RUS", "UKR"]}
        unit="tonnes"
        label={`Share of reported wheat export tonnes, ${year}. Equirectangular Natural Earth map. Not equal-area.`}
      />
      <ShareLegend />
    </figure>
  );
}

export function WheatMaps() {
  const facts = wheatTradeFacts();
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <YearMap year={2021} facts={facts} />
      <YearMap year={2024} facts={facts} />
    </div>
  );
}

export function WheatExporterTable() {
  const facts = wheatTradeFacts();
  return (
    <div className="mt-4 max-w-full overflow-x-auto border border-[#d9d3c6] bg-white">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <caption className="sr-only">
          Six largest reported wheat exporters in 2024, with 2021 tonnes and shares of the reported-country sum
        </caption>
        <thead>
          <tr className="border-b border-[#d9d3c6]">
            <th className="px-3 py-2 font-medium">Exporter</th>
            <th className="px-3 py-2 font-medium">2021 Mt</th>
            <th className="px-3 py-2 font-medium">2024 Mt</th>
            <th className="px-3 py-2 font-medium">2021 share</th>
            <th className="px-3 py-2 font-medium">2024 share</th>
          </tr>
        </thead>
        <tbody>
          {facts.exporters.map((row) => (
            <tr key={row.iso3} className="border-b border-[#d9d3c6]">
              <th scope="row" className="px-3 py-2 font-normal">
                {row.area}
                {row.flag2024 !== "A" ? "*" : ""}
              </th>
              <td className="px-3 py-2 tabular-nums">{millions(row.export2021)}</td>
              <td className="px-3 py-2 tabular-nums">{millions(row.export2024)}</td>
              <td className="px-3 py-2 tabular-nums">{formatNumber(row.share2021, 1)}%</td>
              <td className="px-3 py-2 tabular-nums">{formatNumber(row.share2024, 1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3 py-2 text-[12px] leading-snug text-[#3f4651]">
        * Russia 2024 export quantity: FAO flag {facts.exporters[0].flag2024}. {facts.exporters[0].note2024}. Shares use the sum of reported country exports ({millions(facts.sum2024)} million tonnes in 2024). That sum can include re-exports.
      </p>
    </div>
  );
}

function Bar({ label, value, max, note }: { label: string; value: number; max: number; note?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="tabular-nums">{millions(value)} Mt</span>
      </div>
      <div className="mt-1 h-3 bg-[#efece6]">
        <div className="h-3 bg-[#1f5582]" style={{ width: `${(value / max) * 100}%` }} />
      </div>
      {note ? <p className="mt-1 text-[12px] text-[#3f4651]">{note}</p> : null}
    </div>
  );
}

export function WheatHarvest() {
  const facts = wheatTradeFacts();
  const russiaExport = facts.exporters[0];
  const ukraineExport = facts.exporters.find((row) => row.iso3 === "UKR")!;
  const max = Math.max(facts.russiaProduction2024.value!, ukraineExport.export2024, facts.ukraineProduction2024.value!);
  return (
    <div className="mt-4 grid gap-6 border border-[#d9d3c6] bg-white p-4 sm:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Russia, 2024</h3>
        <Bar
          label="Harvested"
          value={facts.russiaProduction2024.value!}
          max={max}
          note={`Flag ${facts.russiaProduction2024.flag}. ${facts.russiaProduction2024.note}`}
        />
        <Bar label="Exported" value={russiaExport.export2024} max={max} note={`Flag ${russiaExport.flag2024}. ${russiaExport.note2024}`} />
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Ukraine, 2024</h3>
        <Bar label="Harvested" value={facts.ukraineProduction2024.value!} max={max} note={`Flag ${facts.ukraineProduction2024.flag}.`} />
        <Bar label="Exported" value={ukraineExport.export2024} max={max} note={`Flag ${ukraineExport.flag2024}.`} />
      </div>
      <p className="text-[12px] text-[#3f4651] sm:col-span-2">Bars on one scale. Light comparison only: harvest and exports are different elements. Ukraine’s two years are not a like-for-like territory.</p>
    </div>
  );
}

export function WheatTimeline() {
  const events = [
    ["24 Feb 2022", "Full-scale invasion of Ukraine. Context for the maps, not a measured cause of a price."],
    ["27 Jul 2022", "United Nations: the Joint Coordination Centre is established in Istanbul."],
    ["17 Jul 2023", "United Nations: the Initiative is not renewed. While it ran, over 32 million metric tons of grain and foodstuffs went to 45 countries, from Odesa, Chornomorsk and Yuzhny/Pivdennyi. Context for the maps, not a measured cause of a price."],
  ];
  return (
    <ol className="mt-4 space-y-4 border border-[#d9d3c6] bg-white p-4">
      {events.map(([when, what]) => (
        <li key={when} className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <p className="text-sm font-medium">{when}</p>
          <p className="text-sm leading-relaxed text-[#3f4651]">{what}</p>
        </li>
      ))}
    </ol>
  );
}

