/**
 * Verbatim cells from the FAO nominal Food Price Index CSV retrieved 7 November 2026.
 * Eight named months, not the monthly file. Not rescaled. Not a licence claim.
 * © FAO. https://www.fao.org/worldfoodsituation/foodpricesindex/en/
 */
export type FaoExcerptRow = {
  period: string;
  why: string;
  ffpi: number;
  meat: number;
  dairy: number;
  cereals: number;
  oils: number;
  sugar: number;
};

export const faoExcerpt: FaoExcerptRow[] = [
  { period: "2020-01", why: "Start of the recent episode", ffpi: 102.5, meat: 103.5, dairy: 103.8, cereals: 100.7, oils: 108.73, sugar: 87.5 },
  { period: "2022-03", why: "Headline high from 2020 through October 2026", ffpi: 160.2, meat: 119.3, dairy: 149.6, cereals: 170.1, oils: 251.8, sugar: 117.9 },
  { period: "2022-05", why: "Cereals high in that window", ffpi: 158.7, meat: 122.5, dairy: 149.7, cereals: 173.5, oils: 229.2, sugar: 120.4 },
  { period: "2022-06", why: "Dairy high in that window", ffpi: 155.7, meat: 125.4, dairy: 158.2, cereals: 166.3, oils: 211.8, sugar: 117.3 },
  { period: "2023-09", why: "Sugar high in that window", ffpi: 121.7, meat: 113.4, dairy: 112.0, cereals: 126.3, oils: 120.9, sugar: 162.7 },
  { period: "2026-05", why: "Meat high in that window", ffpi: 131.0, meat: 131.3, dairy: 119.1, cereals: 114.2, oils: 185.0, sugar: 95.1 },
  { period: "2025-10", why: "A year before the latest month", ffpi: 126.4, meat: 125.0, dairy: 141.7, cereals: 103.8, oils: 169.4, sugar: 94.1 },
  { period: "2026-10", why: "Latest month in the 6 November 2026 release", ffpi: 133.9, meat: 125.5, dairy: 117.8, cereals: 116.8, oils: 199.2, sugar: 121.3 },
];
