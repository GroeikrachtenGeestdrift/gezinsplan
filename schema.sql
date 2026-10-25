-- Gezinsplan: database-opzet. Plak dit in Supabase → SQL Editor en klik Run.
-- Vul eerst bij STAP 1 jullie twee e-mailadressen in (kleine letters).

-- STAP 1: wie mag erin
create table if not exists public.leden (email text primary key);
insert into public.leden (email) values
  ('info@groeikrachtengeestdrift.nl'),
  ('pentermanlaura@gmail.com')
on conflict do nothing;

-- STAP 2: één tabel voor alle gegevens van de app
create table if not exists public.docs (
  path text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- STAP 3: alleen ingelogde gezinsleden mogen lezen en schrijven
create or replace function public.is_lid() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.leden where email = lower(auth.jwt() ->> 'email'));
$$;

alter table public.leden enable row level security;
alter table public.docs enable row level security;

drop policy if exists "lid ziet zichzelf" on public.leden;
create policy "lid ziet zichzelf" on public.leden for select to authenticated using (email = lower(auth.jwt() ->> 'email'));

drop policy if exists "gezin leest" on public.docs;
drop policy if exists "gezin maakt" on public.docs;
drop policy if exists "gezin wijzigt" on public.docs;
drop policy if exists "gezin verwijdert" on public.docs;
create policy "gezin leest" on public.docs for select to authenticated using (public.is_lid());
create policy "gezin maakt" on public.docs for insert to authenticated with check (public.is_lid());
create policy "gezin wijzigt" on public.docs for update to authenticated using (public.is_lid()) with check (public.is_lid());
create policy "gezin verwijdert" on public.docs for delete to authenticated using (public.is_lid());

-- STAP 4: live bijwerken tussen jullie telefoons
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;
