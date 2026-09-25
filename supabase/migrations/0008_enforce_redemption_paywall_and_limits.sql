-- ============================================================================
-- 0008_enforce_redemption_paywall_and_limits.sql
--
-- Applied live via the Supabase MCP connector; mirrored here.
--
-- The redemptions insert policy only checked `auth.uid() = user_id`.
-- Nothing verified:
--   - the offer is actually approved/published/not archived/within its
--     start-end/expiry window
--   - max_redemptions_per_user (default 1) — a user could redeem the same
--     offer unlimited times
--   - total_redemption_limit — and nothing ever incremented
--     offers.total_redemptions_count in the first place, so this cap was
--     dead even in principle
--   - critically, per the platform's model: individuals pay for access;
--     employees are invited by their HR admin and are covered by their
--     employer's plan instead of paying themselves. Nothing enforced this —
--     an individual who never upgraded past the default 'Free' tier could
--     redeem any offer for free.
-- ============================================================================

begin;

create or replace function public.bump_offer_redemption_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.offers
    set total_redemptions_count = coalesce(total_redemptions_count, 0) + 1
    where id = new.offer_id;
  return new;
end;
$$;

drop trigger if exists redemptions_bump_offer_count on public.redemptions;
create trigger redemptions_bump_offer_count
  after insert on public.redemptions
  for each row execute function public.bump_offer_redemption_count();

drop policy if exists "redemptions insert own" on public.redemptions;
create policy "redemptions insert own" on public.redemptions for insert
  with check (
    (auth.uid() = user_id or public.is_admin())
    and (
      public.is_admin()
      or (
        -- Baseline paywall: employees are covered by their employer's plan;
        -- individuals must hold an active, non-Free membership.
        exists (
          select 1 from public.users u
          where u.id = auth.uid()
            and (
              u.company_id is not null
              or (u.membership_status = 'active' and lower(coalesce(u.membership_tier, 'free')) <> 'free')
            )
        )
        -- The offer must be live and within its window.
        and exists (
          select 1 from public.offers o
          where o.id = redemptions.offer_id
            and o.status = 'approved'
            and o.is_published = true
            and coalesce(o.is_archived, false) = false
            and (o.start_date is null or o.start_date <= current_date)
            and (o.expires_date is null or o.expires_date >= current_date)
            and (o.end_date is null or o.end_date >= current_date)
            and (o.total_redemption_limit is null or coalesce(o.total_redemptions_count, 0) < o.total_redemption_limit)
        )
        -- Per-user cap (defaults to 1 — no double-dipping the same offer).
        and (
          select count(*) from public.redemptions r2
          where r2.offer_id = redemptions.offer_id and r2.user_id = auth.uid()
        ) < coalesce((select max_redemptions_per_user from public.offers where id = redemptions.offer_id), 1)
      )
    )
  );

-- ----------------------------------------------------------------------------
-- Deliberately not enforced yet: offers.membership_requirement (e.g. an
-- offer marked 'Premium' vs 'VIP'-only). membership_plans has a
-- display_order column clearly meant to rank tiers, but the table has no
-- rows in production yet, so there is nothing to rank against. Add that
-- comparison once real plans exist — until then this only enforces the
-- baseline "paid or employee" gate plus the universal published/limit
-- checks above.
-- ----------------------------------------------------------------------------

commit;
