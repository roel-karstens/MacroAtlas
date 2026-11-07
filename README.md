# Macro Atlas

A November 2026 research prototype. It connects a Persian Gulf oil chain to scenarios you can calculate, and it includes one government-bond yield series with a sensitivity calculator. It is educational. It is not investment advice, not a forecast, and not a production publication.

The name is provisional. No domain or trademark is claimed.

## Run

```bash
npm install
npm test
npm run build
npm run start
```

The server listens on port **43123**. `npm run dev` is available for local editing. In some proxied environments the dev hot-reload socket fails and the page paints without attaching event handlers; `npm run start` after a build does not have that problem.

`npm run typecheck` and `npm run lint` are available. `npm test` covers the model formulas, content links, the absence of the Brent and ECB series, and the disabled newsletter.

No environment variables are required. The pages render checked-in text, cited anchors, and calculations you type.

## What is in the edition

- Home, atlas, three topics, four essays, two models.
- Topics: Energy (oil), Rates & inflation, Digital infrastructure, and Food & agriculture. The food essay plots the FAO nominal index on its own axis and Eurostat euro-area food prices on another. It does not claim a CC BY licence for the FAO file. Materials and currencies are not linked.
- Atlas: Gulf window, Natural Earth coastline, Wikipedia coordinates, schematic corridor and one schematic pipeline. No capacities, flows, or AIS.
- Oil model: operating-profit change from horizon, price change, signed unhedged barrels, pass-through, FX, and extra costs.
- Bond model: modified duration, basis points or percentage points, optional convexity, simple carry, and costs. Duration 7 and +100 basis points is a −7% price effect before carry and convexity.
- English only.

## Data, retrieved 7 November 2026

- Brent from the World Bank Pink Sheet is not included. The workbook column cites Bloomberg, EIG, OPEC and the World Bank, and its license is unconfirmed.
- The ECB series `FM.M.U2.EUR.4F.BB.U2_10Y.YLD` is not included. Its recorded source is ECB/FINANCIAL PROVIDERS, and the third-party exception is not closed.
- IEA Energy and AI, published 10 April 2025, states Licence CC BY 4.0. The world electricity chart is a derived plot of stated anchors, including a lift-off bound above 1,700 TWh. See Sources for the attribution and derivative disclaimer.
- LBNL-2001637 summary anchors are cited. The PDF is not included.
- Four Stanford 2025 AI Index endpoints are plotted separately. The report figure is not included, and no license for that report is claimed.
- Natural Earth 1:10m land, public domain under Natural Earth’s terms.
- Place descriptions paraphrased from Wikipedia, CC BY-SA 4.0, with links and a change note. Wikipedia is not used for oil volumes.
- Apache-2.0 in `LICENSE` covers original code. It does not cover the items above or the Barlow font. See `NOTICE`.

## Not connected

- **Supabase.** The only approved project is Macro Atlas, ref `worlgpganiczzjwmapjk`, region eu-west-1. Schema: `supabase/migrations/20261107120000_init.sql`. Seed: `supabase/seed.sql`. This app does not apply them and does not query the project. Public env names, left empty here: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Do not put a service-role key in the browser or in `NEXT_PUBLIC_` variables. Subscriber tables are in schema `private` with RLS and no anonymous policies. Exclude `private` from the Data API.
- **Resend.** No sender is approved. `puurwatt.nl` must not be used. Routes under `/api/newsletter` return “not configured” and do not read an address. No mail is sent.
- No deployment is configured by this repository.

## Authoring

See `docs/authoring.md`.
