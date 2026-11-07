/** Reported anchors only. No year between these points is filled in. */

export type Precision = "stated" | "about" | "around" | "roughly" | "exceeding";

export type ElectricityPoint = {
  id: string;
  geography: "united-states" | "world";
  year: number;
  yearLabel: string;
  valueTwh: number;
  precision: Precision;
  status: "estimate" | "scenario";
  scenario: string | null;
};

export const usDataCenterElectricity: ElectricityPoint[] = [
  {
    id: "lbnl-2014-2016",
    geography: "united-states",
    year: 2014,
    yearLabel: "2014–2016",
    valueTwh: 60,
    precision: "about",
    status: "estimate",
    scenario: null,
  },
  {
    id: "lbnl-2018",
    geography: "united-states",
    year: 2018,
    yearLabel: "2018",
    valueTwh: 76,
    precision: "about",
    status: "estimate",
    scenario: null,
  },
  {
    id: "lbnl-2023",
    geography: "united-states",
    year: 2023,
    yearLabel: "2023",
    valueTwh: 176,
    precision: "stated",
    status: "estimate",
    scenario: null,
  },
  {
    id: "lbnl-2028-low",
    geography: "united-states",
    year: 2028,
    yearLabel: "2028 low",
    valueTwh: 325,
    precision: "roughly",
    status: "scenario",
    scenario: "Low end of the reported range",
  },
  {
    id: "lbnl-2028-high",
    geography: "united-states",
    year: 2028,
    yearLabel: "2028 high",
    valueTwh: 580,
    precision: "roughly",
    status: "scenario",
    scenario: "High end of the reported range",
  },
];

export const worldDataCenterElectricity: ElectricityPoint[] = [
  {
    id: "iea-2024",
    geography: "world",
    year: 2024,
    yearLabel: "2024",
    valueTwh: 415,
    precision: "around",
    status: "estimate",
    scenario: null,
  },
  {
    id: "iea-2030-base",
    geography: "world",
    year: 2030,
    yearLabel: "2030 base",
    valueTwh: 945,
    precision: "around",
    status: "scenario",
    scenario: "Base case",
  },
  {
    id: "iea-2035-headwinds",
    geography: "world",
    year: 2035,
    yearLabel: "2035 headwinds",
    valueTwh: 700,
    precision: "around",
    status: "scenario",
    scenario: "Headwinds",
  },
  {
    id: "iea-2035-efficiency",
    geography: "world",
    year: 2035,
    yearLabel: "2035 high efficiency",
    valueTwh: 970,
    precision: "around",
    status: "scenario",
    scenario: "High efficiency",
  },
  {
    id: "iea-2035-liftoff",
    geography: "world",
    year: 2035,
    yearLabel: "2035 lift-off",
    valueTwh: 1700,
    precision: "exceeding",
    status: "scenario",
    scenario: "Lift-off",
  },
];

export type InferenceEndpoint = {
  id: string;
  threshold: string;
  benchmark: string;
  period: string;
  usdPerMillionTokens: number;
  modelNote: string;
};

/** Only the endpoints Stanford states in the 2025 AI Index. Not a monthly series. */
export const inferenceCostEndpoints: InferenceEndpoint[] = [
  {
    id: "mmlu-2022-11",
    threshold: "GPT-3.5 level on MMLU (64.8)",
    benchmark: "MMLU",
    period: "2022-11",
    usdPerMillionTokens: 20,
    modelNote: "Threshold stated as GPT-3.5 level",
  },
  {
    id: "mmlu-2024-10",
    threshold: "GPT-3.5 level on MMLU (64.8)",
    benchmark: "MMLU",
    period: "2024-10",
    usdPerMillionTokens: 0.07,
    modelNote: "Gemini-1.5-Flash-8B, as named by Stanford",
  },
  {
    id: "gpqa-2024-05",
    threshold: "Above 50% on GPQA",
    benchmark: "GPQA",
    period: "2024-05",
    usdPerMillionTokens: 15,
    modelNote: "Threshold stated as above 50% on GPQA",
  },
  {
    id: "gpqa-2024-12",
    threshold: "Above 50% on GPQA",
    benchmark: "GPQA",
    period: "2024-12",
    usdPerMillionTokens: 0.12,
    modelNote: "Phi 4, as named by Stanford",
  },
];

/** Stanford’s phrase is a 3:1 weighted average of input and output prices. This uses (3×input + output) / 4. */
export function blendedTokenPrice(inputUsd: number, outputUsd: number) {
  return (3 * inputUsd + outputUsd) / 4;
}
