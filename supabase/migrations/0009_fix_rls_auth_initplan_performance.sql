-- ============================================================================
-- 0009_fix_rls_auth_initplan_performance.sql
--
-- Applied live via the Supabase MCP connector; mirrored here.
--
-- Supabase's performance advisor flagged 66 RLS policies calling
-- auth.uid()/is_admin() directly (e.g. `auth.uid() = user_id`), which
-- Postgres re-evaluates for every row scanned instead of once per query.
-- Wrapping each call as `(select auth.uid())` / `(select is_admin())`
-- forces the planner to cache it as an InitPlan. Purely a rewrite of the
-- same boolean logic — every policy's semantics are unchanged, only how
-- often the underlying function gets called. Policies where the entire
-- USING/CHECK clause was already a single bare `is_admin()` call (no OR
-- with a row-dependent condition) were left alone; those are already
-- optimal and weren't flagged.
--
-- Also revokes direct PostgREST RPC access to bump_offer_redemption_count()
-- (added in 0008) — missed it when locking down the other trigger-only
-- functions in 0007.
-- ============================================================================

begin;

drop policy if exists "allowances insert own company or admin" on public.allowances;
create policy "allowances insert own company or admin" on public.allowances for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND ((created_by_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin())))
  );

drop policy if exists "allowances delete company or admin" on public.allowances;
create policy "allowances delete company or admin" on public.allowances for delete
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "allowances read company or admin" on public.allowances;
create policy "allowances read company or admin" on public.allowances for select
  using (
    ((company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "allowances update company or admin" on public.allowances;
create policy "allowances update company or admin" on public.allowances for update
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "analytics_events insert auth" on public.analytics_events;
create policy "analytics_events insert auth" on public.analytics_events for insert
  with check (
    ((select auth.uid()) IS NOT NULL)
  );

drop policy if exists "benefits insert own company or admin" on public.benefits;
create policy "benefits insert own company or admin" on public.benefits for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND ((created_by_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin())))
  );

drop policy if exists "benefits delete company or admin" on public.benefits;
create policy "benefits delete company or admin" on public.benefits for delete
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "benefits read company or admin" on public.benefits;
create policy "benefits read company or admin" on public.benefits for select
  using (
    ((company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "benefits update company or admin" on public.benefits;
create policy "benefits update company or admin" on public.benefits for update
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "campaigns owner write" on public.campaigns;
create policy "campaigns owner write" on public.campaigns for insert
  with check (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "campaigns owner delete" on public.campaigns;
create policy "campaigns owner delete" on public.campaigns for delete
  using (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "campaigns owner read" on public.campaigns;
create policy "campaigns owner read" on public.campaigns for select
  using (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "campaigns owner update" on public.campaigns;
create policy "campaigns owner update" on public.campaigns for update
  using (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  )
  with check (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "claims insert own company or admin" on public.claims;
create policy "claims insert own company or admin" on public.claims for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND ((employee_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin())))
  );

drop policy if exists "claims read company or admin" on public.claims;
create policy "claims read company or admin" on public.claims for select
  using (
    ((company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (employee_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "claims update company or admin" on public.claims;
create policy "claims update company or admin" on public.claims for update
  using (
    ((employee_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "companies insert auth" on public.companies;
create policy "companies insert auth" on public.companies for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND (((select auth.uid()) = created_by_id) OR (select is_admin())))
  );

drop policy if exists "companies public read approved" on public.companies;
create policy "companies public read approved" on public.companies for select
  using (
    ((status = 'approved'::text) OR ((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "companies update owner or admin" on public.companies;
create policy "companies update owner or admin" on public.companies for update
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "departments insert own company or admin" on public.departments;
create policy "departments insert own company or admin" on public.departments for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND ((created_by_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin())))
  );

drop policy if exists "departments delete company or admin" on public.departments;
create policy "departments delete company or admin" on public.departments for delete
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "departments read company or admin" on public.departments;
create policy "departments read company or admin" on public.departments for select
  using (
    ((company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()) OR ((select auth.uid()) = created_by_id))
  );

drop policy if exists "departments update company or admin" on public.departments;
create policy "departments update company or admin" on public.departments for update
  using (
    (((select auth.uid()) = created_by_id) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "employees insert auth" on public.employees;
create policy "employees insert auth" on public.employees for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND (((select auth.uid()) = created_by_id) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin())))
  );

drop policy if exists "employees delete company or admin" on public.employees;
create policy "employees delete company or admin" on public.employees for delete
  using (
    (((select auth.uid()) = created_by_id) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "employees read company or self" on public.employees;
create policy "employees read company or self" on public.employees for select
  using (
    (((select auth.uid()) = user_id) OR ((select auth.uid()) = created_by_id) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "employees update company or self" on public.employees;
create policy "employees update company or self" on public.employees for update
  using (
    (((select auth.uid()) = user_id) OR ((select auth.uid()) = created_by_id) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "favorites insert own" on public.favorites;
create policy "favorites insert own" on public.favorites for insert
  with check (
    ((user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "favorites delete own" on public.favorites;
create policy "favorites delete own" on public.favorites for delete
  using (
    ((user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "favorites read own" on public.favorites;
create policy "favorites read own" on public.favorites for select
  using (
    ((user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "locations insert own company or admin" on public.locations;
create policy "locations insert own company or admin" on public.locations for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND ((created_by_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin())))
  );

drop policy if exists "locations delete company or admin" on public.locations;
create policy "locations delete company or admin" on public.locations for delete
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "locations read company or admin" on public.locations;
create policy "locations read company or admin" on public.locations for select
  using (
    ((company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR ((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "locations update company or admin" on public.locations;
create policy "locations update company or admin" on public.locations for update
  using (
    (((select auth.uid()) = created_by_id) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "notifications insert auth" on public.notifications;
create policy "notifications insert auth" on public.notifications for insert
  with check (
    ((select auth.uid()) IS NOT NULL)
  );

drop policy if exists "notifications read recipient or admin" on public.notifications;
create policy "notifications read recipient or admin" on public.notifications for select
  using (
    ((target_user_id = (select auth.uid())) OR (recipient_email = ( SELECT users.email
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (target_company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (created_by_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "notifications update recipient or admin" on public.notifications;
create policy "notifications update recipient or admin" on public.notifications for update
  using (
    ((target_user_id = (select auth.uid())) OR (created_by_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "offers authenticated insert" on public.offers;
create policy "offers authenticated insert" on public.offers for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND (((select auth.uid()) = created_by_id) OR (select is_admin())))
  );

drop policy if exists "offers owner delete" on public.offers;
create policy "offers owner delete" on public.offers for delete
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "offers public read live" on public.offers;
create policy "offers public read live" on public.offers for select
  using (
    ((is_published = true) OR ((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "offers owner update" on public.offers;
create policy "offers owner update" on public.offers for update
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "payments insert own" on public.payments;
create policy "payments insert own" on public.payments for insert
  with check (
    ((user_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "payments read own or company" on public.payments;
create policy "payments read own or company" on public.payments for select
  using (
    ((user_id = (select auth.uid())) OR (user_email = ( SELECT users.email
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "promo_codes owner write" on public.promo_codes;
create policy "promo_codes owner write" on public.promo_codes for insert
  with check (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "promo_codes owner delete" on public.promo_codes;
create policy "promo_codes owner delete" on public.promo_codes for delete
  using (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "promo_codes owner read" on public.promo_codes;
create policy "promo_codes owner read" on public.promo_codes for select
  using (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "promo_codes owner update" on public.promo_codes;
create policy "promo_codes owner update" on public.promo_codes for update
  using (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  )
  with check (
    ((select is_admin()) OR (created_by_id = (select auth.uid())))
  );

drop policy if exists "redemptions read own or company" on public.redemptions;
create policy "redemptions read own or company" on public.redemptions for select
  using (
    ((user_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "redemptions update own or admin" on public.redemptions;
create policy "redemptions update own or admin" on public.redemptions for update
  using (
    ((user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "reviews insert own" on public.reviews;
create policy "reviews insert own" on public.reviews for insert
  with check (
    ((user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "reviews read approved or admin" on public.reviews;
create policy "reviews read approved or admin" on public.reviews for select
  using (
    ((is_approved = true) OR (user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "reviews update own or admin" on public.reviews;
create policy "reviews update own or admin" on public.reviews for update
  using (
    ((user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "tickets insert own" on public.support_tickets;
create policy "tickets insert own" on public.support_tickets for insert
  with check (
    ((user_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "tickets read own or assigned" on public.support_tickets;
create policy "tickets read own or assigned" on public.support_tickets for select
  using (
    ((user_id = (select auth.uid())) OR (assigned_to = (select auth.uid())) OR (user_email = ( SELECT users.email
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "tickets update own or assigned" on public.support_tickets;
create policy "tickets update own or assigned" on public.support_tickets for update
  using (
    ((user_id = (select auth.uid())) OR (assigned_to = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "teams insert own company or admin" on public.teams;
create policy "teams insert own company or admin" on public.teams for insert
  with check (
    (((select auth.uid()) IS NOT NULL) AND ((created_by_id = (select auth.uid())) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin())))
  );

drop policy if exists "teams delete company or admin" on public.teams;
create policy "teams delete company or admin" on public.teams for delete
  using (
    (((select auth.uid()) = created_by_id) OR (select is_admin()))
  );

drop policy if exists "teams read company or admin" on public.teams;
create policy "teams read company or admin" on public.teams for select
  using (
    ((company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()) OR ((select auth.uid()) = created_by_id))
  );

drop policy if exists "teams update company or admin" on public.teams;
create policy "teams update company or admin" on public.teams for update
  using (
    (((select auth.uid()) = created_by_id) OR (company_id = ( SELECT users.company_id
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "users insert self" on public.users;
create policy "users insert self" on public.users for insert
  with check (
    (((select auth.uid()) = id) OR (select is_admin()))
  );

drop policy if exists "users read own or admin" on public.users;
create policy "users read own or admin" on public.users for select
  using (
    (((select auth.uid()) = id) OR (select is_admin()))
  );

drop policy if exists "users update own or admin" on public.users;
create policy "users update own or admin" on public.users for update
  using (
    (((select auth.uid()) = id) OR (select is_admin()))
  );

drop policy if exists "vapps insert owner" on public.vendor_applications;
create policy "vapps insert owner" on public.vendor_applications for insert
  with check (
    ((owner_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "vapps read owner or admin" on public.vendor_applications;
create policy "vapps read owner or admin" on public.vendor_applications for select
  using (
    ((owner_id = (select auth.uid())) OR (email = ( SELECT users.email
   FROM users
  WHERE (users.id = (select auth.uid())))) OR (select is_admin()))
  );

drop policy if exists "vapps update owner or admin" on public.vendor_applications;
create policy "vapps update owner or admin" on public.vendor_applications for update
  using (
    ((owner_id = (select auth.uid())) OR (select is_admin()))
  );

drop policy if exists "redemptions insert own" on public.redemptions;
create policy "redemptions insert own" on public.redemptions for insert
  with check (
    ((((select auth.uid()) = user_id) OR (select is_admin())) AND ((select is_admin()) OR ((EXISTS ( SELECT 1
   FROM users u
  WHERE ((u.id = (select auth.uid())) AND ((u.company_id IS NOT NULL) OR ((u.membership_status = 'active'::text) AND (lower(COALESCE(u.membership_tier, 'free'::text)) <> 'free'::text)))))) AND (EXISTS ( SELECT 1
   FROM offers o
  WHERE ((o.id = redemptions.offer_id) AND (o.status = 'approved'::text) AND (o.is_published = true) AND (COALESCE(o.is_archived, false) = false) AND ((o.start_date IS NULL) OR (o.start_date <= CURRENT_DATE)) AND ((o.expires_date IS NULL) OR (o.expires_date >= CURRENT_DATE)) AND ((o.end_date IS NULL) OR (o.end_date >= CURRENT_DATE)) AND ((o.total_redemption_limit IS NULL) OR (COALESCE(o.total_redemptions_count, (0)::numeric) < o.total_redemption_limit))))) AND ((( SELECT count(*) AS count
   FROM redemptions r2
  WHERE ((r2.offer_id = redemptions.offer_id) AND (r2.user_id = (select auth.uid())))))::numeric < COALESCE(( SELECT offers.max_redemptions_per_user
   FROM offers
  WHERE (offers.id = redemptions.offer_id)), (1)::numeric)))))
  );

commit;

-- Also lock down bump_offer_redemption_count() (added in 0008) from the
-- public PostgREST RPC surface, same reasoning as the other trigger-only
-- functions in 0007 — missed it in that pass.
revoke execute on function public.bump_offer_redemption_count() from public, anon, authenticated;
