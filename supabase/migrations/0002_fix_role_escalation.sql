-- ============================================================================
-- 0002_fix_role_escalation.sql
--
-- Privilege escalation: any signed-in user could make themselves an admin.
--
-- The `users` policy from 0001 is `using (auth.uid() = id or public.is_admin())`
-- with no column restriction, so a subscriber could run:
--
--     update public.users set role = 'admin' where id = auth.uid();
--
-- The policy's USING clause is evaluated against the *existing* row, so the
-- ownership branch matches and the write goes through. Worse, the change then
-- satisfies public.is_admin() itself — the helper reads the row the caller just
-- modified, so it self-authorises. Every admin policy in 0001 (categories,
-- plans, payouts, audit logs…) and the /admin route are gated on that helper,
-- so the entire backend opened up.
--
-- Fix: a BEFORE UPDATE trigger that refuses privilege-bearing changes unless the
-- caller already passes is_admin() *as of the old row*. Because it runs before
-- the write, is_admin() still sees the caller's real role, so the self-reference
-- cannot be exploited.
--
-- Deliberately NOT using column-level revokes: the admin panel legitimately
-- writes role/is_suspended/status through the authenticated client
-- (AdminUsers.jsx), and column grants cannot be conditioned on the caller's
-- role. The trigger preserves that flow while blocking the escalation.
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
begin
  -- Only these fields confer privilege or defeat account controls.
  if new.role is distinct from old.role
     or new.is_suspended is distinct from old.is_suspended
     or new.status is distinct from old.status
     or new.membership_status is distinct from old.membership_status
     or new.email is distinct from old.email
  then
    -- auth.uid() is null for service_role and for migrations/direct SQL: the
    -- trusted backend path (e.g. db.auth.inviteUser, which uses the service
    -- key). Let those through.
    if auth.uid() is not null then
      -- Evaluated against the pre-update row, so a caller cannot bootstrap
      -- admin by naming themselves admin in the same statement.
      select public.is_admin() into caller_is_admin;
      if not coalesce(caller_is_admin, false) then
        raise exception 'Not permitted to change role or account status'
          using errcode = '42501';  -- insufficient_privilege
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists users_prevent_privilege_escalation on public.users;
create trigger users_prevent_privilege_escalation
  before update on public.users
  for each row
  execute function public.prevent_user_privilege_escalation();

-- --------------------------------------------------------------------------
-- Harden the admin helper: pin search_path and ignore suspended accounts.
-- --------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
      and coalesce(is_suspended, false) = false
      and role in ('admin', 'founder', 'staff')
  );
$$;

commit;

-- --------------------------------------------------------------------------
-- Verify by hand:
--   as a subscriber -> update public.users set role='admin' where id=auth.uid();
--     => ERROR: Not permitted to change role or account status
--   as an admin     -> the same statement succeeds.
-- --------------------------------------------------------------------------