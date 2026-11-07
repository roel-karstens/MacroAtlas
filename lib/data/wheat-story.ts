import { countrySum, sharePercent, sliceRows, type CropRow } from "@/lib/data/crop-atlas";

const EXPORTERS = ["RUS", "CAN", "USA", "UKR", "AUS", "FRA"] as const;

export type WheatExporter = {
  iso3: string;
  area: string;
  export2021: number;
  export2024: number;
  share2021: number;
  share2024: number;
  flag2024: string;
  note2024: string;
};

export type WheatTradeFacts = {
  sum2021: number;
  sum2024: number;
  top6Share2021: number;
  top6Share2024: number;
  exporters: WheatExporter[];
  russiaProduction2024: CropRow;
  ukraineProduction2024: CropRow;
};

function row(iso3: string, element: "production" | "export-quantity", year: number) {
  const found = sliceRows("wheat", element, year).find((entry) => entry.iso3 === iso3);
  if (!found || found.value == null) {
    throw new Error(`Missing wheat ${element} ${year} for ${iso3}`);
  }
  return found;
}

export function wheatTradeFacts(): WheatTradeFacts {
  const exp2021 = sliceRows("wheat", "export-quantity", 2021);
  const exp2024 = sliceRows("wheat", "export-quantity", 2024);
  const sum2021 = countrySum(exp2021);
  const sum2024 = countrySum(exp2024);
  const exporters = EXPORTERS.map((iso3) => {
    const earlier = row(iso3, "export-quantity", 2021);
    const later = row(iso3, "export-quantity", 2024);
    return {
      iso3,
      area: later.area,
      export2021: earlier.value as number,
      export2024: later.value as number,
      share2021: sharePercent(earlier.value, sum2021) as number,
      share2024: sharePercent(later.value, sum2024) as number,
      flag2024: later.flag,
      note2024: later.note,
    };
  });
  const top6Share = (rows: WheatExporter[], key: "export2021" | "export2024", total: number) =>
    (rows.reduce((sum, entry) => sum + entry[key], 0) / total) * 100;
  return {
    sum2021,
    sum2024,
    top6Share2021: top6Share(exporters, "export2021", sum2021),
    top6Share2024: top6Share(exporters, "export2024", sum2024),
    exporters,
    russiaProduction2024: row("RUS", "production", 2024),
    ukraineProduction2024: row("UKR", "production", 2024),
  };
}

export function wheatShortAnswer(facts: WheatTradeFacts = wheatTradeFacts()) {
  const russia = facts.exporters[0];
  const ukraine = facts.exporters.find((entry) => entry.iso3 === "UKR");
  if (!ukraine) throw new Error("Ukraine missing from wheat exporters");
  return `Six exporters accounted for ${facts.top6Share2024.toFixed(1)}% of reported wheat export tonnes in 2024. Russia’s share rose from ${russia.share2021.toFixed(1)}% in 2021 to ${russia.share2024.toFixed(1)}%; Ukraine’s from ${ukraine.share2021.toFixed(1)}% to ${ukraine.share2024.toFixed(1)}%. Shares use the sum of reported exports and can include re-exports. FAOSTAT, retrieved 7 November 2026. Latest complete year: 2024.`;
}
