-- ----------------------------------------------------------------------------
-- 0003 platform_settings
--
-- The admin Settings page stored its configuration in localStorage, so every
-- setting was per-browser and invisible to the next admin. This gives it a real
-- home. One row per key keeps the shape open: adding a setting needs no DDL.
-- ----------------------------------------------------------------------------

create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb default '{}',
  updated_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_settings_key_idx on public.platform_settings (key);

drop trigger if exists platform_settings_set_updated on public.platform_settings;
create trigger platform_settings_set_updated before update on public.platform_settings
  for each row execute function public.touch_updated_at();

alter table public.platform_settings enable row level security;

-- Public read: the storefront needs site identity, SEO title, support email and
-- the social links to render. Nothing secret belongs in this table; SMTP
-- credentials do not go here (they are server-side configuration).
create policy "platform_settings public read" on public.platform_settings for select
  using (true);

create policy "platform_settings admin insert" on public.platform_settings for insert
  with check (public.is_admin());

create policy "platform_settings admin write" on public.platform_settings for update
  using (public.is_admin()) with check (public.is_admin());

create policy "platform_settings admin delete" on public.platform_settings for delete
  using (public.is_admin());
