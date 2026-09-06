// Persist the user's selected membership plan across the auth + checkout flow.
// Survives OAuth redirects (localStorage) and page refreshes (URL ?plan=).
const KEY = "nelvin_pending_plan";

export const PAID_PLANS = ["premium", "vip"];

export function setPendingPlan(slug) {
  if (!slug) return;
  try { localStorage.setItem(KEY, slug); } catch { /* ignore */ }
}

// URL ?plan= wins (and re-syncs localStorage) so OAuth round-trips keep it.
export function getPendingPlan() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("plan");
    if (fromUrl) { localStorage.setItem(KEY, fromUrl); return fromUrl; }
    return localStorage.getItem(KEY);
  } catch { return null; }
}

export function clearPendingPlan() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// Where to send the user after a successful auth, based on the persisted plan.
export function resolvePostAuthPath() {
  const plan = getPendingPlan();
  if (plan && PAID_PLANS.includes(plan)) return `/checkout?plan=${plan}`;
  return "/dashboard";
}