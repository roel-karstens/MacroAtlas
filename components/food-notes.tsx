export function FoodNotes() {
  return (
    <details className="mt-12 max-w-3xl border border-[#e4e6ea] p-4">
      <summary className="min-h-11 cursor-pointer text-sm font-medium">Notes on sources, coverage, and what is not claimed</summary>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#3f4651]">
        <p>
          Eurostat food is dataset prc_hicp_minr, food CP011, euro area changing composition (EA21 from 2026), index 2015 = 100, updated 4 November 2026. The annual rates are Eurostat’s own figures. The rise from January 2020 to September 2026 is a Macro Atlas ratio of two of those index points. Eurostat is not responsible for that ratio. Source: Eurostat, https://doi.org/10.2908/PRC_HICP_MINR, accessed 7 November 2026.
        </p>
        <p>
          The FAO table is a non-commercial copy of eight nominal months, © FAO, from https://www.fao.org/worldfoodsituation/foodpricesindex/en/. The index page states no licence. Database-term examples do not name this file, so it is not labelled CC BY 4.0. Website terms allow that kind of copy when FAO is acknowledged and endorsement is not implied, and they ask permission before an adaptation. There is no FAO chart here.
        </p>
        <p>
          Country tonnes are FAOSTAT, which is named in those database terms. FAO. 2025. FAOSTAT: Crops and livestock products. FAO. 2026. FAOSTAT: Trade — Crops and livestock products. Both accessed 7 November 2026. Licence: CC BY 4.0. That licence does not cover the Food Price Index. No FAO endorsement is implied.
        </p>
        <p>
          Map shares use the sum of countries in the file. Regions and the duplicate China total are excluded. A missing cell is not zero. States too small for the 1:110m map stay in that sum and in the table. France and Norway are joined on ISO_A3_EH because ISO_A3 is −99.
        </p>
        <p>
          Ukraine’s 2021 figures and its 2023 or 2024 figures are not a like-for-like territory. The bulk file does not state FAOSTAT’s exact treatment of occupied areas. Russia’s wheat production for 2023 and 2024 is flag X, unofficial. Its 2023 wheat export quantity is flag I, imputed. Ukraine’s 2023 crude sunflower oil is flag X, “Unofficial figure”.
        </p>
        <p>
          The UN’s Black Sea pages date the Joint Coordination Centre to 27 July 2022 and the end of the Initiative to 17 July 2023. A caption also says 22 July 2022, so this edition does not choose a signing day. They report over 32 million metric tons to 45 countries while the corridor ran, from Odesa, Chornomorsk and Yuzhny/Pivdennyi. That is not a FAOSTAT share and not a cause of the 17.9 percent. Shipping in November 2026 is not described.
        </p>
      </div>
    </details>
  );
}
