-- ============================================================================
-- Nelvin Benefits — initial schema
--
-- Tables mirror src/entities/*.jsonc. Camel-cased entity names map to
-- snake_case table names (User -> users, VendorApplication -> vendor_applications).
--
-- Convention:
--   * Primary key: uuid, client-generated or DEFAULT gen_random_uuid().
--   * created_at / updated_at: timestamptz, server-managed.
--   * created_by_id: auth.uid() captured by a BEFORE INSERT trigger when the
--     caller provides no value (used by the HR dashboard "created_by_id" check).
--   * RLS: public read for catalog tables; authenticated users can read/write
--     rows they own; admins can moderate.
--
-- Apply with:  supabase db push   (or paste into the SQL editor)
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Helper: set created_by_id + created_at defaults
-- ----------------------------------------------------------------------------

create or replace function public.handle_created_by()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.id is null then
    new.id := gen_random_uuid();
  end if;
  if new.created_by_id is null and auth.uid() is not null then
    new.created_by_id := auth.uid();
  end if;
  if new.created_at is null then
    new.created_at := now();
  end if;
  return new;
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- users
-- ----------------------------------------------------------------------------

create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  full_name text,
  first_name text,
  last_name text,
  phone text,
  photo_url text,
  role text not null default 'subscriber',   -- subscriber | user | vendor | business | partner | hr_admin | staff | admin | founder
  account_type text default 'individual',     -- individual | corporate
  company_id uuid,
  subscriber_id text,
  plan_tier text default 'Free',
  membership_tier text default 'Free',
  membership_plan_id text,
  membership_status text default 'active',
  membership_start_date date,
  country text,
  city text,
  is_suspended boolean not null default false,
  status text default 'active',             -- active | suspended | pending
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);
create index if not exists users_role_idx on public.users (role);

-- ----------------------------------------------------------------------------
-- companies
-- ----------------------------------------------------------------------------

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  billing_contact_name text,
  billing_contact_email text,
  billing_contact_phone text,
  country text,
  city text,
  address text,
  phone text,
  website text,
  logo_url text,
  email_domain text,
  employee_count numeric default 0,
  is_corporate_lead boolean not null default false,
  lead_status text default 'pending',
  membership_plan_id uuid,
  membership_tier text,
  branding_logo_url text,
  branding_primary_color text,
  branding_welcome_message text,
  support_email text,
  sso_provider text default 'none',
  sso_tenant_id text,
  sso_client_id text,
  sso_status text default 'disabled',
  seats_purchased numeric default 0,
  seats_used numeric default 0,
  status text default 'pending',          -- pending | approved | suspended | rejected | deleted
  dashboard_access boolean not null default false,
  activation_type text default 'self_serve',
  application_status text default 'pending_approval',
  invoice_number text,
  payment_link_url text,
  custom_pricing_quote_amount numeric,
  custom_pricing_notes text,
  rejection_reason text,
  billing_start_date date,
  billing_end_date date,
  next_renewal_date date,
  billing_period text,
  billing_method text default 'card',
  subscription_status text default 'pending',
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger companies_set_meta before insert on public.companies
  for each row execute function public.handle_created_by();
create trigger companies_touch before update on public.companies
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon text,
  display_order numeric default 0,
  is_active boolean not null default true,
  is_enabled boolean not null default true,
  is_hidden boolean not null default false,
  is_featured boolean not null default false,
  accent_color text,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_meta before insert on public.categories
  for each row execute function public.handle_created_by();
create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- countries
-- ----------------------------------------------------------------------------

create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  flag text,
  image_url text,
  is_active boolean not null default true,
  display_order numeric default 0,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger countries_set_meta before insert on public.countries
  for each row execute function public.handle_created_by();
create trigger countries_touch before update on public.countries
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- membership_plans
-- ----------------------------------------------------------------------------

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text,
  price_monthly numeric default 0,
  price_yearly numeric default 0,
  currency text default 'USD',
  description text,
  benefits text,
  features text,
  max_redemptions_per_day numeric default 0,
  is_corporate boolean not null default false,
  seats_included numeric default 0,
  is_active boolean not null default true,
  display_order numeric default 0,
  color text,
  icon text,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger membership_plans_set_meta before insert on public.membership_plans
  for each row execute function public.handle_created_by();
create trigger membership_plans_touch before update on public.membership_plans
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- offers
-- ----------------------------------------------------------------------------

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  business_name text not null,
  business_id uuid,
  description text,
  image_url text,
  gallery_urls jsonb default '[]',
  discount_label text,
  category text,
  country text,
  city text,
  rating numeric,
  reviews numeric default 0,
  original_price numeric,
  discount_price numeric,
  savings_amount numeric,
  expires_date date,
  start_date date,
  end_date date,
  tag text,
  status text default 'pending',        -- active | inactive | pending | rejected | archived | hidden
  is_featured boolean not null default false,
  is_published boolean not null default false,
  is_archived boolean not null default false,
  membership_requirement text default 'All',
  max_redemptions_per_user numeric default 1,
  total_redemption_limit numeric,
  total_redemptions_count numeric default 0,
  rejection_reason text,
  review_notes text,
  submitted_date date,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists offers_status_idx on public.offers (status, is_published);
create index if not exists offers_category_idx on public.offers (category);
create index if not exists offers_country_idx on public.offers (country);
create index if not exists offers_created_idx on public.offers (created_at desc);

create trigger offers_set_meta before insert on public.offers
  for each row execute function public.handle_created_by();
create trigger offers_touch before update on public.offers
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- employees
-- ----------------------------------------------------------------------------

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  user_email text,
  user_name text,
  photo_url text,
  company_id uuid references public.companies(id) on delete cascade,
  company_name text,
  department text,
  department_id uuid,
  office text,
  manager_id uuid,
  manager_name text,
  role text default 'member',           -- member | admin
  subscriber_id text,
  employee_id text,
  country text,
  membership_tier text,
  total_savings numeric default 0,
  redemptions_count numeric default 0,
  favorite_categories jsonb default '[]',
  last_login timestamptz,
  status text default 'invited',        -- invited | active | suspended | removed
  joined_date date,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employees_company_idx on public.employees (company_id);
create index if not exists employees_email_idx on public.employees (user_email);

create trigger employees_set_meta before insert on public.employees
  for each row execute function public.handle_created_by();
create trigger employees_touch before update on public.employees
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- departments / teams / locations
-- ----------------------------------------------------------------------------

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  name text not null,
  head_name text,
  budget numeric default 0,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists departments_company_idx on public.departments (company_id);
create trigger departments_set_meta before insert on public.departments
  for each row execute function public.handle_created_by();
create trigger departments_touch before update on public.departments
  for each row execute function public.touch_updated_at();

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  name text not null,
  description text,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists teams_company_idx on public.teams (company_id);
create trigger teams_set_meta before insert on public.teams
  for each row execute function public.handle_created_by();
create trigger teams_touch before update on public.teams
  for each row execute function public.touch_updated_at();

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  business_id uuid,
  name text not null,
  address text,
  city text,
  country text,
  phone text,
  latitude numeric,
  longitude numeric,
  is_primary boolean not null default false,
  status text default 'active',
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger locations_set_meta before insert on public.locations
  for each row execute function public.handle_created_by();
create trigger locations_touch before update on public.locations
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- redemptions
-- ----------------------------------------------------------------------------

create table if not exists public.redemptions (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.offers(id) on delete set null,
  offer_title text,
  business_name text,
  business_id uuid,
  savings_amount numeric,
  country text,
  user_id uuid references public.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  redemption_code text,
  code_used boolean not null default false,
  redeemed_at timestamptz,
  used_at timestamptz,
  status text default 'issued',          -- issued | used | expired | cancelled
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists redemptions_user_idx on public.redemptions (user_id);
create index if not exists redemptions_offer_idx on public.redemptions (offer_id);
create index if not exists redemptions_company_idx on public.redemptions (company_id);
create index if not exists redemptions_created_idx on public.redemptions (created_at desc);

create trigger redemptions_set_meta before insert on public.redemptions
  for each row execute function public.handle_created_by();
create trigger redemptions_touch before update on public.redemptions
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- favorites
-- ----------------------------------------------------------------------------

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  offer_id uuid references public.offers(id) on delete cascade,
  offer_title text,
  business_name text,
  created_at timestamptz not null default now()
);
create unique index if not exists favorites_user_offer_idx on public.favorites (user_id, offer_id);
create trigger favorites_set_meta before insert on public.favorites
  for each row execute function public.handle_created_by();

-- ----------------------------------------------------------------------------
-- reviews
-- ----------------------------------------------------------------------------

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.offers(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  rating numeric default 5,
  comment text,
  is_approved boolean not null default false,
  is_hidden boolean not null default false,
  status text default 'pending',         -- pending | approved | hidden | rejected
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger reviews_set_meta before insert on public.reviews
  for each row execute function public.handle_created_by();
create trigger reviews_touch before update on public.reviews
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------------------

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  type text default 'system',           -- offer | system | vendor | company | payment | membership
  channel text default 'system',        -- email | system
  audience text default 'all',          -- all | specific_users | businesses | countries | membership | companies
  target_user_id uuid references public.users(id) on delete cascade,
  target_company_id uuid references public.companies(id) on delete cascade,
  target_country text,
  target_membership_plan text,
  recipient_email text,
  read boolean not null default false,
  sent_by_admin boolean not null default false,
  admin_id uuid,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (target_user_id, read);
create index if not exists notifications_created_idx on public.notifications (created_at desc);
create trigger notifications_set_meta before insert on public.notifications
  for each row execute function public.handle_created_by();
create trigger notifications_touch before update on public.notifications
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- support_tickets
-- ----------------------------------------------------------------------------

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text,
  user_id uuid references public.users(id) on delete cascade,
  user_name text,
  user_email text,
  category text,
  priority text default 'medium',       -- low | medium | high | urgent
  status text default 'open',           -- open | in_progress | resolved | closed | archived
  assigned_to uuid,
  assigned_name text,
  last_reply text,
  replies jsonb default '[]',
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists support_tickets_user_idx on public.support_tickets (user_id);
create trigger support_tickets_set_meta before insert on public.support_tickets
  for each row execute function public.handle_created_by();
create trigger support_tickets_touch before update on public.support_tickets
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- payments
-- ----------------------------------------------------------------------------

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  type text default 'membership',       -- membership | business | refund
  account_type text,                    -- individual | corporate | business
  user_id uuid references public.users(id) on delete set null,
  user_name text,
  user_email text,
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  business_id uuid,
  business_name text,
  amount numeric,
  currency text default 'USD',
  payment_method text,
  reference text,
  invoice_number text,
  receipt_url text,
  description text,
  membership_plan_id uuid,
  membership_plan_name text,
  seats numeric,
  status text default 'pending',        -- pending | completed | failed | refunded | cancelled
  refund_amount numeric,
  refund_reason text,
  billing_period_start date,
  billing_period_end date,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payments_user_idx on public.payments (user_id);
create index if not exists payments_company_idx on public.payments (company_id);
create index if not exists payments_created_idx on public.payments (created_at desc);
create trigger payments_set_meta before insert on public.payments
  for each row execute function public.handle_created_by();
create trigger payments_touch before update on public.payments
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- audit_logs
-- ----------------------------------------------------------------------------

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.users(id) on delete set null,
  admin_name text,
  action text not null,                 -- create | update | delete | approve | reject ...
  entity_type text,
  entity_id text,
  entity_name text,
  description text,
  metadata jsonb default '{}',
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create trigger audit_logs_set_meta before insert on public.audit_logs
  for each row execute function public.handle_created_by();

-- ----------------------------------------------------------------------------
-- vendor_applications
-- ----------------------------------------------------------------------------

create table if not exists public.vendor_applications (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text,
  owner_id uuid references public.users(id) on delete set null,
  email text not null,
  phone text,
  category text not null,
  country text not null,
  city text,
  business_address text,
  website text,
  description text,
  business_image_urls jsonb default '[]',
  document_type text,
  document_url text,
  id_document_url text,
  logo_url text,
  selfie_url text,
  authorized_confirmation boolean not null default false,
  status text default 'pending',        -- pending | approved | rejected
  published_offer_id uuid,
  rejection_reason text,
  is_featured boolean not null default false,
  is_suspended boolean not null default false,
  verification_status text default 'unverified',
  membership_type text,
  review_notes text,
  requested_changes text,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists vendor_applications_status_idx on public.vendor_applications (status);
create trigger vendor_applications_set_meta before insert on public.vendor_applications
  for each row execute function public.handle_created_by();
create trigger vendor_applications_touch before update on public.vendor_applications
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- analytics_events / benefits / allowances / claims
-- ----------------------------------------------------------------------------

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  user_id uuid references public.users(id) on delete cascade,
  company_id uuid,
  business_id uuid,
  offer_id uuid,
  metadata jsonb default '{}',
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_id uuid references public.companies(id) on delete cascade,
  category text,
  description text,
  monthly_allowance numeric default 0,
  currency text default 'USD',
  status text default 'active',
  eligibility_rules text,
  icon text,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger benefits_set_meta before insert on public.benefits
  for each row execute function public.handle_created_by();
create trigger benefits_touch before update on public.benefits
  for each row execute function public.touch_updated_at();

create table if not exists public.allowances (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  name text not null,
  category text,
  amount numeric default 0,
  frequency text default 'monthly',
  eligible_departments jsonb default '[]',
  auto_refill boolean not null default true,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger allowances_set_meta before insert on public.allowances
  for each row execute function public.handle_created_by();
create trigger allowances_touch before update on public.allowances
  for each row execute function public.touch_updated_at();

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  employee_id uuid,
  employee_name text,
  category text,
  amount numeric,
  currency text default 'USD',
  merchant_name text,
  expense_date date,
  receipt_url text,
  description text,
  status text default 'pending',
  rejection_reason text,
  reviewed_by uuid,
  created_by_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger claims_set_meta before insert on public.claims
  for each row execute function public.handle_created_by();
create trigger claims_touch before update on public.claims
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.users enable row level security;
alter table public.companies enable row level security;
alter table public.categories enable row level security;
alter table public.countries enable row level security;
alter table public.membership_plans enable row level security;
alter table public.offers enable row level security;
alter table public.employees enable row level security;
alter table public.departments enable row level security;
alter table public.teams enable row level security;
alter table public.locations enable row level security;
alter table public.redemptions enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.payments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.vendor_applications enable row level security;
alter table public.analytics_events enable row level security;
alter table public.benefits enable row level security;
alter table public.allowances enable row level security;
alter table public.claims enable row level security;

-- Admin helper: users with these roles can bypass ownership checks.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
      and role in ('admin', 'founder', 'staff')
  );
$$;

-- ------------------------------ users -----------------------------------
create policy "users read own or admin" on public.users for select
  using (auth.uid() = id or public.is_admin());
create policy "users insert self" on public.users for insert
  with check (auth.uid() = id or public.is_admin());
create policy "users update own or admin" on public.users for update
  using (auth.uid() = id or public.is_admin());
create policy "users delete admin only" on public.users for delete
  using (public.is_admin());

-- ---------------------------- companies ---------------------------------
create policy "companies public read approved" on public.companies for select
  using (status = 'approved' or auth.uid() = created_by_id or public.is_admin());
create policy "companies insert auth" on public.companies for insert
  with check (auth.uid() is not null and (auth.uid() = created_by_id or public.is_admin()));
create policy "companies update owner or admin" on public.companies for update
  using (auth.uid() = created_by_id or public.is_admin());
create policy "companies delete admin" on public.companies for delete
  using (public.is_admin());

-- ---------------------------- categories ---------------------------------
create policy "categories public read" on public.categories for select
  using (true);
create policy "categories admin write" on public.categories for insert
  with check (public.is_admin());
create policy "categories admin update" on public.categories for update
  using (public.is_admin());
create policy "categories admin delete" on public.categories for delete
  using (public.is_admin());

-- ---------------------------- countries ---------------------------------
create policy "countries public read" on public.countries for select
  using (true);
create policy "countries admin write" on public.countries for insert
  with check (public.is_admin());
create policy "countries admin update" on public.countries for update
  using (public.is_admin());
create policy "countries admin delete" on public.countries for delete
  using (public.is_admin());

-- --------------------------- membership_plans ----------------------------
create policy "plans public read" on public.membership_plans for select
  using (true);
create policy "plans admin write" on public.membership_plans for insert
  with check (public.is_admin());
create policy "plans admin update" on public.membership_plans for update
  using (public.is_admin());
create policy "plans admin delete" on public.membership_plans for delete
  using (public.is_admin());

-- ------------------------------ offers ----------------------------------
create policy "offers public read live" on public.offers for select
  using (is_published = true or auth.uid() = created_by_id or public.is_admin());
create policy "offers authenticated insert" on public.offers for insert
  with check (auth.uid() is not null and (auth.uid() = created_by_id or public.is_admin()));
create policy "offers owner update" on public.offers for update
  using (auth.uid() = created_by_id or public.is_admin());
create policy "offers owner delete" on public.offers for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- ----------------------------- employees ---------------------------------
create policy "employees read company or self" on public.employees for select
  using (
    auth.uid() = user_id or
    auth.uid() = created_by_id or
    company_id = (select company_id from public.users where id = auth.uid()) or
    public.is_admin()
  );
create policy "employees insert auth" on public.employees for insert
  with check (
    auth.uid() is not null and (
      auth.uid() = created_by_id or
      company_id = (select company_id from public.users where id = auth.uid()) or
      public.is_admin()
    )
  );
create policy "employees update company or self" on public.employees for update
  using (
    auth.uid() = user_id or
    auth.uid() = created_by_id or
    company_id = (select company_id from public.users where id = auth.uid()) or
    public.is_admin()
  );
create policy "employees delete company or admin" on public.employees for delete
  using (
    auth.uid() = created_by_id or
    company_id = (select company_id from public.users where id = auth.uid()) or
    public.is_admin()
  );

-- ----------------------------- departments -------------------------------
create policy "departments read company or admin" on public.departments for select
  using (company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin() or auth.uid() = created_by_id);
create policy "departments insert auth" on public.departments for insert
  with check (auth.uid() is not null);
create policy "departments update company or admin" on public.departments for update
  using (auth.uid() = created_by_id or company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "departments delete company or admin" on public.departments for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- ------------------------------- teams -----------------------------------
create policy "teams read company or admin" on public.teams for select
  using (company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin() or auth.uid() = created_by_id);
create policy "teams insert auth" on public.teams for insert
  with check (auth.uid() is not null);
create policy "teams update company or admin" on public.teams for update
  using (auth.uid() = created_by_id or company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "teams delete company or admin" on public.teams for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- ----------------------------- locations ---------------------------------
create policy "locations read company or admin" on public.locations for select
  using (company_id = (select company_id from public.users where id = auth.uid()) or auth.uid() = created_by_id or public.is_admin());
create policy "locations insert auth" on public.locations for insert
  with check (auth.uid() is not null);
create policy "locations update company or admin" on public.locations for update
  using (auth.uid() = created_by_id or company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "locations delete company or admin" on public.locations for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- ---------------------------- redemptions --------------------------------
create policy "redemptions read own or company" on public.redemptions for select
  using (user_id = auth.uid() or company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "redemptions insert own" on public.redemptions for insert
  with check (auth.uid() = user_id or public.is_admin());
create policy "redemptions update own or admin" on public.redemptions for update
  using (user_id = auth.uid() or public.is_admin());
create policy "redemptions delete admin" on public.redemptions for delete
  using (public.is_admin());

-- ------------------------------ favorites --------------------------------
create policy "favorites read own" on public.favorites for select
  using (user_id = auth.uid() or public.is_admin());
create policy "favorites insert own" on public.favorites for insert
  with check (user_id = auth.uid() or public.is_admin());
create policy "favorites delete own" on public.favorites for delete
  using (user_id = auth.uid() or public.is_admin());

-- ------------------------------- reviews ---------------------------------
create policy "reviews read approved or admin" on public.reviews for select
  using (is_approved = true or user_id = auth.uid() or public.is_admin());
create policy "reviews insert own" on public.reviews for insert
  with check (user_id = auth.uid() or public.is_admin());
create policy "reviews update own or admin" on public.reviews for update
  using (user_id = auth.uid() or public.is_admin());
create policy "reviews delete admin" on public.reviews for delete
  using (public.is_admin());

-- ---------------------------- notifications ------------------------------
create policy "notifications read recipient or admin" on public.notifications for select
  using (
    target_user_id = auth.uid() or
    recipient_email = (select email from public.users where id = auth.uid()) or
    target_company_id = (select company_id from public.users where id = auth.uid()) or
    created_by_id = auth.uid() or
    public.is_admin()
  );
create policy "notifications insert auth" on public.notifications for insert
  with check (auth.uid() is not null);
create policy "notifications update recipient or admin" on public.notifications for update
  using (target_user_id = auth.uid() or created_by_id = auth.uid() or public.is_admin());
create policy "notifications delete admin" on public.notifications for delete
  using (public.is_admin());

-- --------------------------- support_tickets -----------------------------
create policy "tickets read own or assigned" on public.support_tickets for select
  using (
    user_id = auth.uid() or
    assigned_to = auth.uid() or
    user_email = (select email from public.users where id = auth.uid()) or
    public.is_admin()
  );
create policy "tickets insert own" on public.support_tickets for insert
  with check (user_id = auth.uid() or public.is_admin());
create policy "tickets update own or assigned" on public.support_tickets for update
  using (user_id = auth.uid() or assigned_to = auth.uid() or public.is_admin());
create policy "tickets delete admin" on public.support_tickets for delete
  using (public.is_admin());

-- ------------------------------ payments ---------------------------------
create policy "payments read own or company" on public.payments for select
  using (
    user_id = auth.uid() or
    user_email = (select email from public.users where id = auth.uid()) or
    company_id = (select company_id from public.users where id = auth.uid()) or
    public.is_admin()
  );
create policy "payments insert own" on public.payments for insert
  with check (user_id = auth.uid() or company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "payments update admin" on public.payments for update
  using (public.is_admin());
create policy "payments delete admin" on public.payments for delete
  using (public.is_admin());

-- ----------------------------- audit_logs --------------------------------
create policy "audit_logs admin read" on public.audit_logs for select
  using (public.is_admin());
create policy "audit_logs admin insert" on public.audit_logs for insert
  with check (public.is_admin());
create policy "audit_logs admin write" on public.audit_logs for update
  using (public.is_admin());
create policy "audit_logs admin delete" on public.audit_logs for delete
  using (public.is_admin());

-- ------------------------- vendor_applications ---------------------------
create policy "vapps read owner or admin" on public.vendor_applications for select
  using (
    owner_id = auth.uid() or
    email = (select email from public.users where id = auth.uid()) or
    public.is_admin()
  );
create policy "vapps insert owner" on public.vendor_applications for insert
  with check (owner_id = auth.uid() or public.is_admin());
create policy "vapps update owner or admin" on public.vendor_applications for update
  using (owner_id = auth.uid() or public.is_admin());
create policy "vapps delete admin" on public.vendor_applications for delete
  using (public.is_admin());

-- --------------------------- analytics_events ----------------------------
create policy "analytics_events admin read" on public.analytics_events for select
  using (public.is_admin());
create policy "analytics_events insert auth" on public.analytics_events for insert
  with check (auth.uid() is not null);

-- ------------------------------ benefits ---------------------------------
create policy "benefits read company or admin" on public.benefits for select
  using (company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "benefits insert auth" on public.benefits for insert
  with check (auth.uid() is not null);
create policy "benefits update company or admin" on public.benefits for update
  using (auth.uid() = created_by_id or public.is_admin());
create policy "benefits delete company or admin" on public.benefits for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- ------------------------------ allowances -------------------------------
create policy "allowances read company or admin" on public.allowances for select
  using (company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "allowances insert auth" on public.allowances for insert
  with check (auth.uid() is not null);
create policy "allowances update company or admin" on public.allowances for update
  using (auth.uid() = created_by_id or public.is_admin());
create policy "allowances delete company or admin" on public.allowances for delete
  using (auth.uid() = created_by_id or public.is_admin());

-- -------------------------------- claims ---------------------------------
create policy "claims read company or admin" on public.claims for select
  using (company_id = (select company_id from public.users where id = auth.uid()) or employee_id = auth.uid() or public.is_admin());
create policy "claims insert auth" on public.claims for insert
  with check (auth.uid() is not null);
create policy "claims update company or admin" on public.claims for update
  using (employee_id = auth.uid() or company_id = (select company_id from public.users where id = auth.uid()) or public.is_admin());
create policy "claims delete admin" on public.claims for delete
  using (public.is_admin());

-- ============================================================================
-- Storage: nelvin-public bucket (offer images, business docs, avatars)
-- ============================================================================

insert into storage.buckets (id, name, public)
  values ('nelvin-public', 'nelvin-public', true)
  on conflict (id) do nothing;

create policy "nelvin-public read" on storage.objects for select
  using (bucket_id = 'nelvin-public');
create policy "nelvin-public insert" on storage.objects for insert
  with check (bucket_id = 'nelvin-public' and auth.role() = 'authenticated');
create policy "nelvin-public update" on storage.objects for update
  using (bucket_id = 'nelvin-public' and auth.role() = 'authenticated');
create policy "nelvin-public delete" on storage.objects for delete
  using (bucket_id = 'nelvin-public' and auth.role() = 'authenticated');