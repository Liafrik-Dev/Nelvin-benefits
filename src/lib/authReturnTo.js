// Shared by the auth pages (Login, Register, and any page that resumes a flow
// after sign-in, e.g. the MCP OAuth consent page). Keep the redirect
// validation in one place — it is security-sensitive and easy to drift.

// Resolve ?returnTo= to a safe same-origin path, else "/".
//
// The same-origin check alone is not enough: a value like /.//evil.com or
// /\evil.com parses same-origin but normalizes to a protocol-relative
// //evil.com when assigned to location.href — an open redirect. So require the
// resolved path to be exactly one leading slash (no "//" prefix, no backslash).
export function safeReturnTo() {
  const raw = new URLSearchParams(window.location.search).get("returnTo");
  if (!raw) return "/";
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return "/";
    // Strip app-bootstrap params: app-params.js persists these from the URL into
    // localStorage before the SDK initializes, so a crafted returnTo could
    // otherwise poison the freshly issued session — repointing the app at an
    // attacker's backend (app_base_url/app_id/functions_version) or overwriting
    // the token. Normal app-flow params (e.g. the OAuth consent ctx) are kept.
    // The full app-params.js bootstrap set (src/lib/app-params.js) — any of
    // these in a crafted returnTo would be persisted at next load.
    for (const p of ["access_token", "clear_access_token", "app_id", "app_base_url", "functions_version", "from_url"]) {
      url.searchParams.delete(p);
    }
    const path = url.pathname + url.search;
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return "/";
    return path;
  } catch {
    return "/";
  }
}

/**
 * Same validation as safeReturnTo, but returns `null` when no returnTo was
 * supplied. Callers that need to tell "the visitor asked for nothing" apart
 * from "the visitor asked for the home page" (post-login routing, where the
 * default is a portal rather than "/") must use this one.
 */
export function requestedReturnTo() {
  const raw = new URLSearchParams(window.location.search).get("returnTo");
  if (!raw) return null;
  const path = safeReturnTo();
  return path === "/" ? null : path;
}

// Portal routes and the roles allowed to reach them, mirroring the guards in
// BusinessLayout / AdminLayout / CorporateDashboard. Used to keep a returnTo
// from dropping a signed-in user onto a portal they would only be refused.
const PORTAL_ACCESS = [
  { prefix: "/admin", roles: ["admin", "founder", "staff"] },
  { prefix: "/business", roles: ["business", "partner", "vendor", "admin", "founder", "staff"] },
  { prefix: "/corporate-dashboard", roles: ["hr_admin", "corporate", "admin", "founder"] },
];

/** Whether `path` is reachable by `role` (unknown/absent roles may use member pages). */
export function canAccessPath(role, path) {
  const r = String(role || "").toLowerCase();
  const portal = PORTAL_ACCESS.find((p) => path === p.prefix || path.startsWith(`${p.prefix}/`));
  if (!portal) return true;
  return portal.roles.includes(r);
}

/**
 * The /login URL for the page the visitor is currently on, with `returnTo` set
 * so login can hand them back afterwards. Used by the auth guard and the SDK's
 * redirectToLogin. Returns a bare "/login" when there is nowhere meaningful to
 * return to (the visitor is already on an auth page) — otherwise signing in
 * would bounce them straight back to the login form.
 */
export function loginUrlWithReturnTo() {
  if (typeof window === "undefined") return "/login";
  const { pathname, search } = window.location;
  const target = `${pathname}${search}`;
  if (!target || target === "/" || target === "/login" || target === "/register") return "/login";
  return `/login?returnTo=${encodeURIComponent(target)}`;
}
