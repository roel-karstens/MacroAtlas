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

`npm run typecheck` and `npm run lint` are available. `npm test` covers the model formulas, content links, snapshot pins, and the disabled newsletter.

No environment variables are required. Checked-in snapshots are the data the pages render.

## What is in the edition

- Home, atlas, two topics, three essays, two models.
- Topics: Energy (oil) and Rates & inflation. Other subjects are not linked.
- Atlas: Gulf window, Natural Earth coastline, Wikipedia coordinates, schematic corridor and one schematic pipeline. No capacities, flows, or AIS.
- Oil model: operating-profit change from horizon, price change, signed unhedged barrels, pass-through, FX, and extra costs.
- Bond model: modified duration, basis points or percentage points, optional convexity, simple carry, and costs. Duration 7 and +100 basis points is a −7% price effect before carry and convexity.
- English only.

## Data, retrieved 7 November 2026

- Brent, World Bank Pink Sheet monthly workbook updated 3 November 2026. Excerpt January 2010–October 2026. October 2026 average in that file: 125 USD per barrel. Rights are not treated as a confirmed CC BY license for this workbook. See Sources.
- Euro area 10-year government benchmark bond yield, ECB series `FM.M.U2.EUR.4F.BB.U2_10Y.YLD`, January 2014–October 2026. October 2026: 4.173827 percent. Not the policy rate. Commercial redistribution is not claimed.
- Natural Earth 1:10m land, public domain.
- Place descriptions paraphrased from Wikipedia, CC BY-SA, with links. Wikipedia is not used for oil volumes.

## Not connected

- **Supabase.** The only approved project is Macro Atlas, ref `worlgpganiczzjwmapjk`, region eu-west-1. Schema: `supabase/migrations/20261107120000_init.sql`. Seed: `supabase/seed.sql`. This app does not apply them and does not query the project. Public env names, left empty here: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Do not put a service-role key in the browser or in `NEXT_PUBLIC_` variables. Subscriber tables are in schema `private` with RLS and no anonymous policies. Exclude `private` from the Data API.
- **Resend.** No sender is approved. `puurwatt.nl` must not be used. Routes under `/api/newsletter` return “not configured” and do not read an address. No mail is sent.
- No deployment is configured by this repository.

## Authoring

See `docs/authoring.md`.
