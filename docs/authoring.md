# Adding to this edition

English is the only locale. Identifiers stay stable so a later translation can reuse them. Do not add a language switch until a full locale exists, and do not add `hreflang` for a language that is not published.

## A topic

Add a record in `lib/content/topics.ts` only when it has prose, at least one essay, and a real destination for every link. Do not add an empty hub to the home page or the primary navigation.

Suggested sections, in this order: understand, explore, track, research, model, challenge. Skip a section rather than filling it with a placeholder. Rates does not get a fake map. The atlas is the oil geography.

Digital infrastructure uses five sections instead: chips, data centers and power, networks, digital activity, and AI capabilities and costs. Charts already in the edition use only stated anchors in `lib/data/digital-series.ts`. Do not add a year the report does not state. Do not plot orders as deliveries, wafer area as chip counts, dollar sales as volumes, nameplate megawatts as energy, or a benchmark score as a percent of general intelligence. Cloudflare Radar is not a default source. Memory prices and facilities databases stay out until their terms are reviewed.

## An article

Add an object to `lib/content/articles.ts`.

- `id` and `slug` are stable.
- `topicId` must be a published topic.
- `sourceIds` must exist in `lib/content/sources.ts`.
- `locationIds` must exist in `lib/content/geography.ts` when the piece is about places.
- `imageId`, if any, must exist in `lib/content/images.ts` with alt text, an on-image label, a credit, a license, and the placements.
- Say what would weaken the piece.
- Do not invent a price, a flow, a capacity, or a team.

The route is `/topics/{topicId}/{slug}`.

## A source

Add a record with publisher, URL, retrieval date, what the edition uses, and the rights position. If the license is unresolved, write that. Do not relabel an illustrative drawing as observed history.

## A place or connection

Use one id everywhere: atlas, essay, and model.

A connection may set `capacity` and `flow` only when a source states the number. Otherwise leave them null. `cable` is a reserved mode and must not be used as an oil pipeline. Schematic geometry has to say it is schematic.

## A model

Keep the formula in `lib/models` as a pure function with tests, including empty input and a known case. The page states the unit, the sign, and the limit. Defaults are examples, not the latest print. Persistence copy must say when something is only in the browser.

Register it in `lib/content/models.ts` and link it from the topic.

## Data

Snapshots live in `data/snapshots`. Pin the first and last observations in `lib/data/series.test.ts` when you replace a file. Record the retrieval date. Do not call the chart live.

## Database

Schema and seed for project `worlgpganiczzjwmapjk` live in `supabase/`. Apply them only to that project. The app renders the checked-in files until a deliberate read path is added. Public env names are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The service-role key is server-only and is not a `NEXT_PUBLIC_` variable.
