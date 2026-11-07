export function SeriesNotice({
  title,
  detail,
  href,
  linkLabel,
}: {
  title: string;
  detail: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <aside className="border border-[#e4e6ea] p-5">
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#3f4651]">{detail}</p>
      <p className="mt-3 text-sm">
        <a className="underline underline-offset-4 break-all" href={href}>
          {linkLabel}
        </a>
      </p>
    </aside>
  );
}

export const brentUnavailable = {
  title: "Brent series not included",
  detail:
    "This edition does not include the World Bank Pink Sheet Brent column. That workbook cites Bloomberg, EIG, OPEC and the World Bank, and the license for the column is unconfirmed. No replacement prices are shown.",
  href: "https://www.worldbank.org/en/research/commodity-markets",
  linkLabel: "World Bank Commodity Markets",
};

export const yieldUnavailable = {
  title: "Euro area 10-year yield not included",
  detail:
    "This edition does not include ECB series FM.M.U2.EUR.4F.BB.U2_10Y.YLD. The recorded source is ECB/FINANCIAL PROVIDERS, and the third-party exception is not closed. No replacement yields are shown. This is a bond yield, not the policy rate.",
  href: "https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.4F.BB.U2_10Y.YLD?format=csvdata&startPeriod=2014-01",
  linkLabel: "ECB Data Portal series",
};
