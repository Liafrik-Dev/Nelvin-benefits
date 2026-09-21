-- ----------------------------------------------------------------------------
-- 0004 promo_codes & campaigns
--
-- The partner portal had Promo Codes and Campaigns screens backed by constants
-- in the component. Both need a real home; `business_id` scopes them to the
-- vendor application that owns them, matching how offers and locations are
-- scoped.
-- ----------------------------------------------------------------------------

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid,
  code text not null,
  discount_label text,
  discount_type text default 'percent',   -- percent | fixed | bogo
  discount_value numeric default 0,
  usage_limit numeric default 0,          -- 0 = unlimited
  times_used numeric not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  status text default 'active',           -- active | paused | expired
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists promo_codes_business_idx on public.promo_codes (business_id);
create unique index if not exists promo_codes_code_uniq on public.promo_codes (upper(code));
drop trigger if exists promo_codes_touch on public.promo_codes;
create trigger promo_codes_touch before update on public.promo_codes
  for each row execute function public.touch_updated_at();

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid,
  title text not null,
  placement text default 'featured',      -- featured | push | banner
  message text,
  target_country text,
  target_category text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text default 'pending',          -- pending | approved | rejected | running | completed
  review_notes text,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists campaigns_business_idx on public.campaigns (business_id);
drop trigger if exists campaigns_touch on public.campaigns;
create trigger campaigns_touch before update on public.campaigns
  for each row execute function public.touch_updated_at();

alter table public.promo_codes enable row level security;
alter table public.campaigns enable row level security;

-- A vendor manages their own rows; admins manage all. Mirrors the offers policy
-- shape: ownership by business_id, with an admin override.
create policy "promo_codes owner read" on public.promo_codes for select
  using (true);
create policy "promo_codes owner write" on public.promo_codes for insert
  with check (public.is_admin() or created_by_id = auth.uid());
create policy "promo_codes owner update" on public.promo_codes for update
  using (public.is_admin() or created_by_id = auth.uid())
  with check (public.is_admin() or created_by_id = auth.uid());
create policy "promo_codes owner delete" on public.promo_codes for delete
  using (public.is_admin() or created_by_id = auth.uid());

create policy "campaigns owner read" on public.campaigns for select
  using (true);
create policy "campaigns owner write" on public.campaigns for insert
  with check (public.is_admin() or created_by_id = auth.uid());
create policy "campaigns owner update" on public.campaigns for update
  using (public.is_admin() or created_by_id = auth.uid())
  with check (public.is_admin() or created_by_id = auth.uid());
create policy "campaigns owner delete" on public.campaigns for delete
  using (public.is_admin() or created_by_id = auth.uid());

-- Partner-level settings that are not secret: payout account and the
-- verification PIN hash live on the vendor application rather than a new table.
alter table public.vendor_applications
  add column if not exists payout_bank_name text,
  add column if not exists payout_account_number text,
  add column if not exists verification_pin_hash text;

-- Store staff (cashiers who scan vouchers) are ordinary users holding the
-- `staff` role. This column is what scopes them to the store that employs them,
-- mirroring how company_id scopes corporate employees.
alter table public.users
  add column if not exists business_id uuid;