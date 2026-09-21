// The platform role model, in one place.
//
// The role strings were repeated across the auth redirect, the portal guards,
// the RLS helpers and the admin role filter. Drift between those copies is how
// an admin ends up unable to see a role they can actually assign, so they all
// read from here now.
//
// `guard` records which portal guard admits the role, mirroring the checks in
// AdminLayout / BusinessLayout / CorporateDashboard and the RLS policies in
// supabase/migrations.

export const ROLES = [
  { value: "founder", label: "Founder", guard: "admin", protected: true },
  { value: "admin", label: "Admin", guard: "admin" },
  { value: "staff", label: "Staff", guard: "admin" },
  { value: "hr_admin", label: "HR admin", guard: "corporate" },
  { value: "corporate", label: "Corporate", guard: "corporate" },
  { value: "business", label: "Business", guard: "business" },
  { value: "partner", label: "Partner", guard: "business" },
  { value: "vendor", label: "Vendor", guard: "business" },
  { value: "subscriber", label: "Subscriber", guard: "member" },
];

/** Option list for <select> filters. */
export const ROLE_OPTIONS = ROLES.map((r) => ({ value: r.value, label: r.label }));

/** Human label for a role string, falling back to the raw value. */
export function roleLabel(value) {
  const r = ROLES.find((x) => x.value === String(value || "").toLowerCase());
  return r ? r.label : (value || "—");
}

/** Which portal a role belongs to: "admin" | "business" | "corporate" | "member". */
export function roleGuard(value) {
  const r = ROLES.find((x) => x.value === String(value || "").toLowerCase());
  return r ? r.guard : "member";
}

/** Whether a role is protected from demotion in the admin UI. */
export function isProtectedRole(value) {
  return !!ROLES.find((x) => x.value === String(value || "").toLowerCase())?.protected;
}
