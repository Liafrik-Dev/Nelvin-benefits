-- ============================================================================
-- 0006_fix_promo_codes_and_business_id.sql
--
-- Two more isolation gaps found alongside 0005's company_id fix.
--
-- 1. promo_codes had `using (true)` for select — literally anyone, including
--    an unauthenticated visitor, could read every business's promo codes
--    (the code string itself, discount value, usage limit...). Only
--    BusinessPromoCodes.jsx (the owning vendor's own management page) ever
--    reads this table client-side, so scope it to the creator + admin, the
--    same shape already used for its insert/update/delete policies.
--
-- 2. 0004 added public.users.business_id to scope store staff/cashiers to
--    their employer, "mirroring how company_id scopes corporate employees"
--    — but, unlike company_id, it was never added to the privilege trigger.
--    No RLS policy reads it yet and no client code sets it today, so this
--    is not currently exploitable, but it is the same shape of hole as the
--    one 0005 fixed and would silently become one the moment a policy
--    starts consuming it. There is no legitimate self-serve path for it
--    (offers.business_id is the owner's own user id, set on their own
--    offers — never on another user's row), so non-admins are simply
--    blocked from changing it until a real assignment flow exists.
-- ============================================================================

begin;

drop policy if exists "promo_codes owner read" on public.promo_codes;
create policy "promo_codes owner read" on public.promo_codes for select
  using (public.is_admin() or created_by_id = auth.uid());

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
          using errcode = '42501';
      end if;
    end if;
  end if;

  if new.company_id is distinct from old.company_id then
    if auth.uid() is not null then
      select public.is_admin() into caller_is_admin;
      if not coalesce(caller_is_admin, false) then
        if new.company_id is not null then
          select c.* into target_company from public.companies c where c.id = new.company_id;
          select au.email into verified_email from auth.users au where au.id = auth.uid();
          verified_domain := lower(split_part(coalesce(verified_email, ''), '@', 2));

          if target_company.id is null then
            raise exception 'Company not found' using errcode = '42501';
          elsif target_company.created_by_id = auth.uid() then
            null;
          elsif target_company.status = 'approved'
                and target_company.email_domain is not null
                and verified_domain <> ''
                and lower(target_company.email_domain) = verified_domain then
            null;
          else
            raise exception 'Not permitted to join this company'
              using errcode = '42501';
          end if;
        end if;
      end if;
    end if;
  end if;

  -- No client flow assigns business_id to anyone's own row yet (a store
  -- owner's offers reference their own user id directly; there is no
  -- "join this store as staff" action) — so until one exists, only an
  -- admin may set or change it.
  if new.business_id is distinct from old.business_id then
    if auth.uid() is not null then
      select public.is_admin() into caller_is_admin;
      if not coalesce(caller_is_admin, false) then
        raise exception 'Not permitted to change business_id'
          using errcode = '42501';
      end if;
    end if;
  end if;

  return new;
end;
$$;

commit;
