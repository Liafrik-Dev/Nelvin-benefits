-- ============================================================================
-- 0007_security_advisor_and_tenant_write_scoping.sql
--
-- Applied live to the project via the Supabase MCP connector; this file
-- mirrors that state in the repo so `supabase/migrations` matches reality.
-- (0006 had not actually been run against the live database yet either —
-- it was applied in the same session, before these.)
--
-- 1. Supabase's own security advisor flagged:
--    - touch_updated_at() had a mutable search_path.
--    - handle_created_by(), prevent_user_privilege_escalation() and
--      rls_auto_enable() are SECURITY DEFINER trigger functions that were
--      directly callable by anon/authenticated via PostgREST RPC
--      (/rest/v1/rpc/<fn>). They only need to run as triggers; revoke
--      EXECUTE (from PUBLIC — Postgres grants EXECUTE to PUBLIC by default
--      at creation time, so anon/authenticated inherit it unless revoked
--      from PUBLIC directly, not just from them).
--
-- 2. allowances/benefits/departments/claims/locations/teams could be
--    inserted by ANY authenticated user with an arbitrary company_id — only
--    employees already had the correct check. A subscriber with zero
--    relationship to a company could inject fake rows (fake claims, fake
--    benefits, etc.) into another company's HR data purely by knowing or
--    guessing its company_id.
--
-- 3. campaigns' read policy was `using (true)` — public, including
--    pending/rejected rows carrying internal admin review_notes. Scoped
--    like promo_codes (owner or admin); no page reads this table yet
--    (BusinessCampaigns / CampaignsPanel are still stubs), so this closes
--    the gap before it is ever exercised.
--
-- 4. 33 foreign-key columns had no covering index (own advisor finding) —
--    added, since tenant-isolation queries lean heavily on these joins.
-- ============================================================================

begin;

alter function public.touch_updated_at() set search_path = public;

revoke execute on function public.handle_created_by() from public, anon, authenticated;
revoke execute on function public.prevent_user_privilege_escalation() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

drop policy if exists "allowances insert auth" on public.allowances;
create policy "allowances insert own company or admin" on public.allowances for insert
  with check (
    auth.uid() is not null and (
      created_by_id = auth.uid()
      or company_id = (select company_id from public.users where id = auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "benefits insert auth" on public.benefits;
create policy "benefits insert own company or admin" on public.benefits for insert
  with check (
    auth.uid() is not null and (
      created_by_id = auth.uid()
      or company_id = (select company_id from public.users where id = auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "departments insert auth" on public.departments;
create policy "departments insert own company or admin" on public.departments for insert
  with check (
    auth.uid() is not null and (
      created_by_id = auth.uid()
      or company_id = (select company_id from public.users where id = auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "claims insert auth" on public.claims;
create policy "claims insert own company or admin" on public.claims for insert
  with check (
    auth.uid() is not null and (
      employee_id = auth.uid()
      or company_id = (select company_id from public.users where id = auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "locations insert auth" on public.locations;
create policy "locations insert own company or admin" on public.locations for insert
  with check (
    auth.uid() is not null and (
      created_by_id = auth.uid()
      or company_id = (select company_id from public.users where id = auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "teams insert auth" on public.teams;
create policy "teams insert own company or admin" on public.teams for insert
  with check (
    auth.uid() is not null and (
      created_by_id = auth.uid()
      or company_id = (select company_id from public.users where id = auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "campaigns owner read" on public.campaigns;
create policy "campaigns owner read" on public.campaigns for select
  using (public.is_admin() or created_by_id = auth.uid());

create index if not exists allowances_company_id_idx on public.allowances (company_id);
create index if not exists allowances_created_by_id_idx on public.allowances (created_by_id);
create index if not exists analytics_events_user_id_idx on public.analytics_events (user_id);
create index if not exists audit_logs_admin_id_idx on public.audit_logs (admin_id);
create index if not exists audit_logs_created_by_id_idx on public.audit_logs (created_by_id);
create index if not exists benefits_company_id_idx on public.benefits (company_id);
create index if not exists benefits_created_by_id_idx on public.benefits (created_by_id);
create index if not exists campaigns_created_by_id_idx on public.campaigns (created_by_id);
create index if not exists categories_created_by_id_idx on public.categories (created_by_id);
create index if not exists claims_company_id_idx on public.claims (company_id);
create index if not exists claims_created_by_id_idx on public.claims (created_by_id);
create index if not exists companies_created_by_id_idx on public.companies (created_by_id);
create index if not exists countries_created_by_id_idx on public.countries (created_by_id);
create index if not exists departments_created_by_id_idx on public.departments (created_by_id);
create index if not exists employees_created_by_id_idx on public.employees (created_by_id);
create index if not exists employees_user_id_idx on public.employees (user_id);
create index if not exists favorites_offer_id_idx on public.favorites (offer_id);
create index if not exists locations_company_id_idx on public.locations (company_id);
create index if not exists locations_created_by_id_idx on public.locations (created_by_id);
create index if not exists membership_plans_created_by_id_idx on public.membership_plans (created_by_id);
create index if not exists notifications_created_by_id_idx on public.notifications (created_by_id);
create index if not exists notifications_target_company_id_idx on public.notifications (target_company_id);
create index if not exists offers_created_by_id_idx on public.offers (created_by_id);
create index if not exists payments_created_by_id_idx on public.payments (created_by_id);
create index if not exists platform_settings_updated_by_id_idx on public.platform_settings (updated_by_id);
create index if not exists promo_codes_created_by_id_idx on public.promo_codes (created_by_id);
create index if not exists redemptions_created_by_id_idx on public.redemptions (created_by_id);
create index if not exists reviews_offer_id_idx on public.reviews (offer_id);
create index if not exists reviews_user_id_idx on public.reviews (user_id);
create index if not exists support_tickets_created_by_id_idx on public.support_tickets (created_by_id);
create index if not exists teams_created_by_id_idx on public.teams (created_by_id);
create index if not exists vendor_applications_created_by_id_idx on public.vendor_applications (created_by_id);
create index if not exists vendor_applications_owner_id_idx on public.vendor_applications (owner_id);

-- ----------------------------------------------------------------------------
-- Not fixed here, needs a manual dashboard toggle (no SQL/MCP control for it):
--   Authentication > Policies > Password Security > "Leaked password
--   protection" — currently disabled. Flagged by the security advisor;
--   checks new passwords against HaveIBeenPwned.org.
--
-- Noted but not changed: 66 RLS policies call auth.uid()/auth.<fn>()
-- directly instead of (select auth.<fn>()), which Postgres re-evaluates
-- per row instead of once per query (Supabase performance advisor,
-- "auth_rls_initplan"). Real at scale, but rewriting every policy is a
-- separate, larger pass — not bundled into this security fix.
-- ----------------------------------------------------------------------------

commit;
