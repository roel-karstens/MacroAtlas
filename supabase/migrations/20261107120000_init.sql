-- Macro Atlas reference schema.
-- Apply only to Supabase project worlgpganiczzjwmapjk (Macro Atlas, eu-west-1).
-- Do not apply this file to any other project.
-- The website does not run this migration. A coordinator applies it.
-- Service-role keys bypass RLS and must never be placed in the browser.
-- Exclude schema private from the Data API exposed schemas.

create schema if not exists private;

create table if not exists public.sources (
  id text primary key,
  title text not null,
  publisher text not null,
  url text,
  retrieved_on date,
  rights_note text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.series (
  id text primary key,
  source_id text not null references public.sources (id),
  title text not null,
  unit text not null,
  frequency text not null,
  status text not null check (status in ('observed', 'estimate', 'illustrative')),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.observations (
  series_id text not null references public.series (id) on delete cascade,
  vintage_date date not null,
  period_date date not null,
  value numeric not null,
  obs_status text,
  primary key (series_id, vintage_date, period_date)
);

create table if not exists public.locations (
  id text primary key,
  name text not null,
  country text,
  roles text[] not null default '{}',
  lat double precision,
  lon double precision,
  coordinate_status text not null,
  source_id text references public.sources (id),
  summary text,
  capacity_note text,
  published boolean not null default false
);

create table if not exists public.connections (
  id text primary key,
  name text not null,
  from_location_id text references public.locations (id),
  to_location_id text references public.locations (id),
  mode text not null check (mode in ('pipeline', 'sea', 'cable', 'other')),
  product text,
  capacity_value numeric,
  capacity_unit text,
  flow_value numeric,
  flow_unit text,
  source_id text references public.sources (id),
  as_of date,
  estimate_status text not null,
  note text,
  published boolean not null default false,
  constraint connections_no_unsourced_capacity check (capacity_value is null or source_id is not null)
);

create table if not exists public.articles (
  id text primary key,
  topic_id text not null,
  slug text not null,
  locale text not null default 'en',
  title text not null,
  deck text,
  published_on date,
  published boolean not null default false,
  unique (locale, topic_id, slug)
);

create table if not exists public.article_references (
  article_id text not null references public.articles (id) on delete cascade,
  source_id text not null references public.sources (id),
  primary key (article_id, source_id)
);

create table if not exists public.model_versions (
  id text primary key,
  model_id text not null,
  version text not null,
  formula_note text not null,
  published boolean not null default false
);

create table if not exists private.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null check (status in ('pending', 'confirmed', 'unsubscribed')),
  created_at timestamptz not null default now()
);

create table if not exists private.subscriber_consents (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references private.subscribers (id) on delete cascade,
  purpose text not null,
  status text not null,
  requested_at timestamptz,
  confirmed_at timestamptz,
  withdrawn_at timestamptz,
  source text not null,
  proof_note text
);

create table if not exists private.newsletter_send_attempts (
  idempotency_key text primary key,
  purpose text not null,
  created_at timestamptz not null default now(),
  provider_message_id text,
  error text
);

alter table public.sources enable row level security;
alter table public.series enable row level security;
alter table public.observations enable row level security;
alter table public.locations enable row level security;
alter table public.connections enable row level security;
alter table public.articles enable row level security;
alter table public.article_references enable row level security;
alter table public.model_versions enable row level security;
alter table private.subscribers enable row level security;
alter table private.subscriber_consents enable row level security;
alter table private.newsletter_send_attempts enable row level security;

drop policy if exists sources_select_published on public.sources;
create policy sources_select_published on public.sources
  for select to anon, authenticated using (published = true);

drop policy if exists series_select_published on public.series;
create policy series_select_published on public.series
  for select to anon, authenticated using (published = true);

drop policy if exists observations_select_published on public.observations;
create policy observations_select_published on public.observations
  for select to anon, authenticated using (
    exists (
      select 1 from public.series
      where series.id = observations.series_id and series.published = true
    )
  );

drop policy if exists locations_select_published on public.locations;
create policy locations_select_published on public.locations
  for select to anon, authenticated using (published = true);

drop policy if exists connections_select_published on public.connections;
create policy connections_select_published on public.connections
  for select to anon, authenticated using (published = true);

drop policy if exists articles_select_published on public.articles;
create policy articles_select_published on public.articles
  for select to anon, authenticated using (published = true);

drop policy if exists article_references_select_published on public.article_references;
create policy article_references_select_published on public.article_references
  for select to anon, authenticated using (
    exists (
      select 1 from public.articles
      where articles.id = article_references.article_id and articles.published = true
    )
  );

drop policy if exists model_versions_select_published on public.model_versions;
create policy model_versions_select_published on public.model_versions
  for select to anon, authenticated using (published = true);

-- No policies on private tables: default deny for anon and authenticated.
-- Do not add a select policy for subscribers.

revoke all on table public.sources from anon, authenticated;
revoke all on table public.series from anon, authenticated;
revoke all on table public.observations from anon, authenticated;
revoke all on table public.locations from anon, authenticated;
revoke all on table public.connections from anon, authenticated;
revoke all on table public.articles from anon, authenticated;
revoke all on table public.article_references from anon, authenticated;
revoke all on table public.model_versions from anon, authenticated;
grant select on table public.sources to anon, authenticated;
grant select on table public.series to anon, authenticated;
grant select on table public.observations to anon, authenticated;
grant select on table public.locations to anon, authenticated;
grant select on table public.connections to anon, authenticated;
grant select on table public.articles to anon, authenticated;
grant select on table public.article_references to anon, authenticated;
grant select on table public.model_versions to anon, authenticated;

create or replace view public.published_series
with (security_invoker = true) as
select id, source_id, title, unit, frequency, status
from public.series
where published = true;

create or replace view public.published_observations
with (security_invoker = true) as
select observations.series_id, observations.vintage_date, observations.period_date, observations.value, observations.obs_status
from public.observations
join public.series on series.id = observations.series_id
where series.published = true;

create or replace view public.published_locations
with (security_invoker = true) as
select id, name, country, roles, lat, lon, coordinate_status, summary, capacity_note
from public.locations
where published = true;

create or replace view public.published_connections
with (security_invoker = true) as
select id, name, from_location_id, to_location_id, mode, product, capacity_value, capacity_unit, flow_value, flow_unit, as_of, estimate_status, note
from public.connections
where published = true;

grant select on public.published_series to anon, authenticated;
grant select on public.published_observations to anon, authenticated;
grant select on public.published_locations to anon, authenticated;
grant select on public.published_connections to anon, authenticated;

revoke all on schema private from public;
revoke all on all tables in schema private from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on schema private from anon';
    execute 'revoke all on all tables in schema private from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on schema private from authenticated';
    execute 'revoke all on all tables in schema private from authenticated';
  end if;
end $$;

comment on schema private is 'Consent and send attempts for Macro Atlas only. Do not expose this schema in the Data API. No anonymous read.';
comment on table private.subscribers is 'Private. No anon select. Service role must stay off the client.';
