-- ============================================================================
-- 0010_create_partner_logos_table.sql
--
-- Applied live via the Supabase MCP connector; mirrored here.
--
-- Backs the new Admin > Partner Logos CMS page and the public "Trusted by"
-- marquee (TrustedBrands.jsx): the marquee shows Nelvin's own category list
-- until at least one row here is is_active = true, at which point it
-- switches to scrolling real partner logos instead.
-- ============================================================================

begin;

create table if not exists public.partner_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  display_order numeric default 0,
  is_active boolean default true,
  created_by_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger partner_logos_set_meta before insert on public.partner_logos
  for each row execute function public.handle_created_by();
create trigger partner_logos_touch before update on public.partner_logos
  for each row execute function public.touch_updated_at();

alter table public.partner_logos enable row level security;

-- Public marquee needs to read active logos (anon + authenticated); admins
-- manage everything including inactive/draft entries.
create policy "partner_logos public read active" on public.partner_logos for select
  using (is_active = true or (select public.is_admin()));

create policy "partner_logos admin write" on public.partner_logos for insert
  with check ((select public.is_admin()));

create policy "partner_logos admin update" on public.partner_logos for update
  using ((select public.is_admin()));

create policy "partner_logos admin delete" on public.partner_logos for delete
  using ((select public.is_admin()));

create index if not exists partner_logos_created_by_id_idx on public.partner_logos (created_by_id);
create index if not exists partner_logos_display_order_idx on public.partner_logos (display_order);

commit;
