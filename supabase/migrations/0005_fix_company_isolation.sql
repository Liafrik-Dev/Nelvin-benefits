-- ============================================================================
-- 0005_fix_company_isolation.sql
--
-- Multi-tenant isolation gap: any signed-in user could change their own
-- company_id to any other company's id.
--
-- 18 RLS policies across employees, departments, teams, locations,
-- redemptions, benefits, allowances and claims all gate access on:
--
--     company_id = (select company_id from public.users where id = auth.uid())
--
-- but nothing stopped a user from running, straight from the browser
-- console (no app UI involved):
--
--     update public.users set company_id = '<target-company-uuid>' where id = auth.uid();
--
-- The 0002 trigger only guards role / is_suspended / status /
-- membership_status / email — company_id was never in that list — so the
-- statement above passes RLS ("users update own or admin") and every one of
-- those 18 policies then treats the caller as a real member of the target
-- company: full read (and in several cases write/delete) on that company's
-- entire employee roster, departments, teams, locations, benefits,
-- allowances and claims.
--
-- Two flows legitimately set company_id via a normal client-side update and
-- must keep working:
--   1. Self-serve corporate signup (CorporateSignup.jsx / AuthContext's
--      linkUserToCompany "create" path): a user sets their own company_id to
--      a company they just created (companies.created_by_id = auth.uid()).
--   2. Auto-join by email domain (AuthContext.linkUserToCompany): a user
--      joins an *approved* company whose email_domain matches their own
--      verified email's domain. That check currently only runs in the
--      browser, which is not a security boundary — it is re-verified here,
--      server-side, against auth.users' confirmed email (not the mutable
--      public.users.email), so it cannot be spoofed by editing local state
--      or calling the table directly with a different claimed domain.
--
-- Anything else changing company_id now requires is_admin() (evaluated
-- against the pre-update row, same pattern as 0002).
-- ============================================================================

begin;

create or replace function public.prevent_user_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_is_admin boolean;
  verified_email text;
  verified_domain text;
  target_company record;
begin
  -- Only these fields confer privilege, defeat account controls, or move a
  -- user between tenants.
  if new.role is distinct from old.role
     or new.is_suspended is distinct from old.is_suspended
     or new.status is distinct from old.status
     or new.membership_status is distinct from old.membership_status
     or new.email is distinct from old.email
  then
    if auth.uid() is not null then
      select public.is_admin() into caller_is_admin;
      if not coalesce(caller_is_admin, false) then
        raise exception 'Not permitted to change role or account status'
          using errcode = '42501';  -- insufficient_privilege
      end if;
    end if;
  end if;

  if new.company_id is distinct from old.company_id then
    if auth.uid() is not null then
      select public.is_admin() into caller_is_admin;

      if not coalesce(caller_is_admin, false) then
        -- Allow leaving a company (going back to null) — never allow
        -- self-assigning into one without one of the two checks below.
        if new.company_id is not null then
          select c.* into target_company from public.companies c where c.id = new.company_id;

          -- Use the confirmed email from auth.users, not public.users.email
          -- (the latter is client-writable state, not proof of ownership).
          select au.email into verified_email from auth.users au where au.id = auth.uid();
          verified_domain := lower(split_part(coalesce(verified_email, ''), '@', 2));

          if target_company.id is null then
            raise exception 'Company not found' using errcode = '42501';
          elsif target_company.created_by_id = auth.uid() then
            -- Founder joining the company they just created.
            null;
          elsif target_company.status = 'approved'
                and target_company.email_domain is not null
                and verified_domain <> ''
                and lower(target_company.email_domain) = verified_domain then
            -- Verified-domain auto-join, re-checked server-side.
            null;
          else
            raise exception 'Not permitted to join this company'
              using errcode = '42501';
          end if;
        end if;
      end if;
    end if;
  end if;

  return new;
end;
$$;

-- --------------------------------------------------------------------------
-- Verify by hand:
--   as user A (no company)  -> update public.users set company_id='<company B id>' where id=auth.uid();
--     => ERROR: Not permitted to join this company
--   as the founder of company C, right after creating it
--                            -> update public.users set company_id='<company C id>' where id=auth.uid();
--     => succeeds
--   as a user whose auth email's domain matches an approved company's email_domain
--                            -> update public.users set company_id='<that company id>' where id=auth.uid();
--     => succeeds
--   as an admin              -> any company_id change succeeds.
-- --------------------------------------------------------------------------

commit;
