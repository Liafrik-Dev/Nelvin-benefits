/**
 * Central access point for the Nelvin data layer (auth + entities + integrations).
 *
 * This module is the SINGLE seam between the application and its data backend.
 * It resolves the database client in this priority order:
 *
 *   1. A real Supabase project, when `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
 *      are configured (production). We map the entity API below onto the Supabase
 *      PostgREST + Auth + Storage APIs.
 *   2. The Base44 runtime SDK injected by the Base44 platform on `globalThis.__B44_DB__`.
 *   3. A local in-memory fallback (development/demo) so the UI stays renderable outside
 *      a host, with seeded content.
 *
 * IMPORTANT: All application code MUST import `db` from this module instead of touching
 * backends directly. See docs/BASE44_DEPENDENCIES.md.
 */

import { loginUrlWithReturnTo } from "@/lib/authReturnTo";
import { sha256HexAsync, toHex } from "@/lib/sha256";

const LOCAL_TOKEN_KEY = "nv_auth_token";

const hasSupabaseConfig = () =>
  !!import.meta.env?.VITE_SUPABASE_URL &&
  !!import.meta.env?.VITE_SUPABASE_ANON_KEY;

let _supabaseClient = null;
async function getSupabase() {
  if (_supabaseClient) return _supabaseClient;
  try {
    const mod = await import("@supabase/supabase-js");
    _supabaseClient = mod.createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "nelvin_supabase_auth",
        },
      }
    );
    return _supabaseClient;
  } catch (err) {
    console.error("Failed to initialise Supabase client:", err);
    return null;
  }
}

function toSupabaseOrder(sort) {
  if (!sort) return { by: "created_at", dir: "desc" };
  const s = String(sort);
  const desc = s.startsWith("-");
  return { by: desc ? s.slice(1) : s, dir: desc ? "desc" : "asc" };
}

function toLabel(entity) {
  return (entity || "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

// Postgres tables are plural, the entity names are singular: `User` lives in
// `users`, not `user`. Deriving the table with toLabel therefore pointed every
// query at a table that does not exist, and the missing-table fallback quietly
// served the demo seed instead — so real Supabase rows were never read.
// Listed explicitly rather than pluralised with rules: the y -> ies cases
// (company/category/country) are easy to get subtly wrong, and a wrong guess
// here fails silently in exactly the same way.
const TABLES = {
  user: "users",
  company: "companies",
  offer: "offers",
  category: "categories",
  country: "countries",
  membershipplan: "membership_plans",
  employee: "employees",
  department: "departments",
  team: "teams",
  location: "locations",
  redemption: "redemptions",
  favorite: "favorites",
  review: "reviews",
  notification: "notifications",
  supportticket: "support_tickets",
  payment: "payments",
  auditlog: "audit_logs",
  vendorapplication: "vendor_applications",
  analyticsevent: "analytics_events",
  benefit: "benefits",
  allowance: "allowances",
  claim: "claims",
  platformsetting: "platform_settings",
  promocode: "promo_codes",
  campaign: "campaigns",
};

/**
 * The Supabase/Postgres table backing an entity. Falls back to the naive
 * singular name so an entity missing from TABLES is obvious rather than silent.
 */
function supabaseTable(entity) {
  return TABLES[toLabel(entity).replace(/_/g, "")] || toLabel(entity);
}

function hydrateRow(row) {
  if (!row) return row;
  const out = { ...row };
  for (const key of Object.keys(row)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (camel !== key && out[camel] === undefined) out[camel] = row[key];
  }
  if (out.created_at && out.created_date === undefined) out.created_date = out.created_at;
  if (out.updated_at && out.updated_date === undefined) out.updated_date = out.updated_at;
  return out;
}

function rowsOrError(data, error, fallback = []) {
  if (error) throw new Error(error.message || "Database request failed");
  return (data == null ? fallback : data).map(hydrateRow);
}

/* ------------------------------------------------------------------ */
/* Degraded mode: when a Supabase table is missing (e.g. migrations    */
/* not applied yet), transparently fall back to the seeded in-memory   */
/* database so the platform stays fully functional.                    */
/* ------------------------------------------------------------------ */
let fallbackRef = null; // filled after fallbackDb is defined (module init)

function isMissingTable(error) {
  const code = error && error.code;
  const msg = String((error && (error.message) || "") || "");
  const combined = `${code} ${msg}`;
  return (
    combined.includes("PGRST205") ||   // Could not find the table in the schema cache
    combined.includes("PGRST301") ||   // inspect could not find column/relationship
    combined.includes("42703") ||      // undefined_column
    combined.includes("42P01") ||      // undefined_table
    msg.includes("Could not find the table") ||
    msg.includes("in the schema cache") ||
    msg.includes("relation") && msg.includes("does not exist")
  );
}

function degradeEntity(entity) {
  resolvedBackend = fallbackRef || fallbackDb;
  return resolvedBackend.entities[entity];
}

function wrapDegrade(entity, fn, args, publicName) {
  return fn(...args).catch((err) => {
    if (!isMissingTable(err)) throw err;
    const fb = degradeEntity(entity);
    if (!fb) throw err;
    const method = fb[publicName || fn.name];
    return typeof method === "function" ? method(...args) : Promise.resolve(null);
  });
}

function applyFilters(query, filters) {
  for (const [k, v] of Object.entries(filters || {})) {
    const col = toLabel(k);
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      query = query.in(col, v);
    } else if (v && typeof v === "object") {
      for (const [op, val] of Object.entries(v)) {
        if (val === undefined || val === null || val === "") continue;
        if (op === "like") query = query.like(col, `%${val}%`);
        else if (op === "ilike") query = query.ilike(col, `%${val}%`);
        else if (op === "gte") query = query.gte(col, val);
        else if (op === "lte") query = query.lte(col, val);
        else if (op === "gt") query = query.gt(col, val);
        else if (op === "lt") query = query.lt(col, val);
        else if (op === "neq") query = query.neq(col, val);
        else if (op === "in") query = query.in(col, val);
      }
    } else {
      query = query.eq(col, v);
    }
  }
  return query;
}

function pickWritable(rows) {
  const EXCLUDE = new Set([
    "id", "created_at", "updated_at", "created_by_id", "created_date", "updated_date",
  ]);
  return rows.map((r) => {
    const out = {};
    for (const [k, v] of Object.entries(r || {})) {
      if (EXCLUDE.has(k) || v === undefined) continue;
      out[k] = v;
    }
    return out;
  });
}

function makeSupabaseEntity(entity) {
  const table = supabaseTable(entity);

  async function doFilter(filters = {}, sort, limit) {
    const supabase = await getSupabase();
    let q = supabase.from(table).select("*");
    q = applyFilters(q, filters);
    if (sort) {
      const { by, dir } = toSupabaseOrder(sort);
      q = q.order(by, { ascending: dir !== "desc" });
    } else {
      q = q.order("created_at", { ascending: false });
    }
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    return rowsOrError(data, error);
  }
  async function doList(sort, limit) {
    return doFilter({}, sort, limit);
  }
  async function doGet(id) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const row = rowsOrError(data, error)[0];
    return row ?? null;
  }
  async function doCreate(data) {
    const supabase = await getSupabase();
    const payload = pickWritable([data])[0];
    const { data: created, error } = await supabase
      .from(table)
      .insert(payload)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return hydrateRow(created);
  }
  async function doUpdate(id, patch) {
    const supabase = await getSupabase();
    const payload = pickWritable([patch])[0];
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    const rows = rowsOrError(data, error);
    return rows[0] ?? { id, ...patch };
  }
  async function doDelete(id) {
    const supabase = await getSupabase();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
  async function doBulkCreate(rows) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(table)
      .insert(pickWritable(rows || []))
      .select("*");
    return rowsOrError(data, error);
  }

  return {
    filter: (filters, sort, limit) => wrapDegrade(entity, doFilter, [filters, sort, limit], "filter"),
    list: (sort, limit) => wrapDegrade(entity, doList, [sort, limit], "list"),
    get: (id) => wrapDegrade(entity, doGet, [id], "get"),
    create: (data) => wrapDegrade(entity, doCreate, [data], "create"),
    update: (id, patch) => wrapDegrade(entity, doUpdate, [id, patch], "update"),
    delete: (id) => wrapDegrade(entity, doDelete, [id], "delete"),
    async bulkUpdate(items) {
      for (const item of items || []) {
        const { id, ...patch } = item;
        if (!id) continue;
        await this.update(id, patch);
      }
    },
    bulkCreate: (rows) => wrapDegrade(entity, doBulkCreate, [rows], "bulkCreate"),
  };
}

async function supabaseSyncProfile() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) {
    const email = user.email || "";
    const meta = user.user_metadata || {};
    const names = nameFields(meta.first_name, meta.last_name);
    const name = names.full_name || meta.full_name || meta.name || null;
    // Match the exact domain, not a suffix: "…nelvinbenefits.com" would also
    // match attacker-controlled lookalikes such as evilnelvinbenefits.com.
    const domain = email.split("@")[1]?.toLowerCase() || "";
    const staffDomain = domain === "nelvinbenefits.com" || domain === "nelvin.app";
    // Self-selected role at signup decides between the member, partner and HR
    // portals, so it is honoured — but only for the non-privileged set.
    // Anything else (admin/founder/staff) is ignored rather than trusted, since
    // user_metadata is client-supplied and would otherwise be a route to admin.
    const SIGNUP_ROLES = ["subscriber", "business", "hr_admin"];
    const requested = String(user.user_metadata?.role || "");
    const fallbackRole = staffDomain
      ? "admin"
      : SIGNUP_ROLES.includes(requested)
        ? requested
        : "subscriber";
    const { data: inserted, error: insErr } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          email,
          full_name: name,
          ...names,
          role: fallbackRole,
          account_type: fallbackRole === "business" ? "business" : fallbackRole === "hr_admin" ? "corporate" : "individual",
          membership_status: "active",
          membership_tier: "Free",
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();
    if (insErr) {
      console.error("Failed to create profile:", insErr.message);
      const { data: fetched } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return hydrateRow(fetched);
    }
    return hydrateRow(inserted);
  }
  return hydrateRow(data);
}

async function supabaseUploadFile({ file }) {
  const supabase = await getSupabase();
  if (!file) return { file_url: "" };
  const ext = (file.name || "").split(".").pop()?.toLowerCase() || "bin";
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const { error } = await supabase.storage
    .from("nelvin-public")
    .upload(key, file, { cacheControl: "3600", upsert: false });
  if (error) {
    console.error("Upload failed:", error.message);
    return { file_url: "" };
  }
  const { data } = supabase.storage.from("nelvin-public").getPublicUrl(key);
  return { file_url: data.publicUrl };
}

function makeSupabaseBackend() {
  const entities = {};
  const ENTITIES = [
    "User", "Company", "Offer", "Category", "Country", "MembershipPlan",
    "Employee", "Department", "Team", "Location", "Redemption", "Favorite",
    "Review", "Notification", "SupportTicket", "Payment", "AuditLog",
    "VendorApplication", "AnalyticsEvent", "Benefit", "Allowance", "Claim",
    "PlatformSetting", "PromoCode", "Campaign",
  ];
  for (const name of ENTITIES) {
    entities[name] = makeSupabaseEntity(name);
  }

  return {
    entities,
    auth: {
      async isAuthenticated() {
        const supabase = await getSupabase();
        if (!supabase) return false;
        const { data } = await supabase.auth.getSession();
        return !!data?.session;
      },
      async me() {
        return supabaseSyncProfile();
      },
      async loginViaEmailPassword(email, password) {
        const supabase = await getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        await supabaseSyncProfile();
        return { user: data.user };
      },
      async loginWithProvider(provider, redirectPath) {
        const supabase = await getSupabase();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider === "apple" ? "apple" : "google",
          options: { redirectTo: redirectPath || `${window.location.origin}/dashboard` },
        });
        if (error) throw new Error(error.message);
      },
      async register({ email, password, role, firstName, lastName }) {
        const supabase = await getSupabase();
        const names = nameFields(firstName, lastName);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // The name rides in user_metadata so supabaseSyncProfile can seed the
            // profile row on the first authenticated load (and after an OAuth
            // round trip, where the profile may not exist yet).
            data: { role: role || "subscriber", ...names },
          },
        });
        if (error) throw new Error(error.message);
        if (data?.user?.identities?.length === 0) {
          throw new Error("An account already exists for this email — please log in.");
        }
        // If email confirmation is disabled, signUp already returns a session.
        if (data.session) {
          await supabaseSyncProfile();
          return { user: data.user, email, session: data.session };
        }
        return { user: data.user, email };
      },
      async verifyOtp({ email, otpCode }) {
        const supabase = await getSupabase();
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: "email",
        });
        if (error) throw new Error(error.message);
        await supabaseSyncProfile();
        return data.session ? { access_token: data.session.access_token } : { session: data.session };
      },
      async updateMe(patch) {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        const safe = { ...patch };
        delete safe.role;
        const { error } = await supabase
          .from("users")
          .update(pickWritable([safe])[0])
          .eq("id", user.id);
        if (error) throw new Error(error.message);
        return supabaseSyncProfile();
      },
      async resetPassword(opts) {
        const supabase = await getSupabase();
        const { newPassword, tokenType } = opts || {};
        // Supabase recovery links come in two shapes:
        //  * ?token_hash=…&type=recovery  — the session is restored automatically
        //    by the supabase-js client on page load (PKCE), so we must NOT exchange it.
        //  * an OTP token passed explicitly (legacy ?token=) that needs verifyOtp.
        let target = null;
        if (opts?.resetToken && tokenType !== "token_hash") {
          const { data, error: tErr } = await supabase.auth.verifyOtp({
            token: opts.resetToken,
            type: "recovery",
          });
          if (tErr) throw new Error(tErr.message);
          target = data;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw new Error(error.message);
        return target;
      },
      async resetPasswordRequest(email) {
        const supabase = await getSupabase();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw new Error(error.message);
      },
      async setToken(token) {
        try { localStorage.setItem(LOCAL_TOKEN_KEY, token); } catch {}
      },
      async logout() {
        const supabase = await getSupabase();
        await supabase.auth.signOut();
        try { localStorage.removeItem(LOCAL_TOKEN_KEY); } catch {}
      },
      redirectToLogin() {
        window.location.href = loginUrlWithReturnTo();
      },
    },
    users: {
      async inviteUser(email, role) {
        const supabase = await getSupabase();
        const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
          data: { role: role || "subscriber" },
        });
        if (error) throw new Error(error.message);
      },
    },
    integrations: {
      Core: {
        UploadFile: supabaseUploadFile,
        SendEmail: async () => ({}),
      },
    },
  };
}

/* ------------------------------------------------------------------ */
/* Local in-memory fallback (dev / no backend configured)              */
/* ------------------------------------------------------------------ */

import { CATEGORIES, COUNTRIES } from "@/lib/nelvinData";

function makeId(prefix) {
  return `${prefix || "row"}_${Math.random().toString(36).slice(2, 10)}`;
}

const seedOffers = (() => {
  const countries = COUNTRIES.slice(0, 12).map((c) => c.name);
  const brands = [
    ["The Signature Grill", "Restaurants & Cafés", "25% Off Fine Dining", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"],
    ["Sunrise Resorts", "Hotels & Resorts", "30% Off Weekend Getaways", "https://images.unsplash.com/photo-1506878206813-92402b8ded23?w=800&q=80"],
    ["AeroSkies Airlines", "Travel & Airlines", "Up to 40% Off Flights", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"],
    ["FitHub Gym", "Fitness & Sports", "2 Months Free Membership", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"],
    ["Glow Pharmacy", "Healthcare", "20% Off Vitamins & Care", "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80"],
    ["Urban Threads", "Shopping & Fashion", "Buy 1 Get 1 — Weekend", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"],
    ["TechNova Store", "Electronics", "₦20,000 Off Gadgets", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"],
    ["La Belle Spa", "Beauty & Spa", "35% Off Spa Packages", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"],
    ["CinemaMax", "Entertainment", "50% Off Movie Tickets", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80"],
  ];
  return brands.map(([business_name, category, label, image_url], i) => ({
    id: makeId("off"),
    title: `${label} — ${business_name}`,
    business_name,
    category,
    country: countries[i % countries.length],
    city: "Lagos",
    image_url,
    discount_label: label,
    description: `Enjoy ${label.toLowerCase()} at ${business_name}. This exclusive offer is available to active Nelvin members.`,
    rating: (4 + (i % 5) / 5).toFixed(1),
    reviews: Math.floor(Math.random() * 80) + 20,
    savings_amount: Math.floor(Math.random() * 80) + 15,
    original_price: Math.floor(Math.random() * 300) + 100,
    discount_price: Math.floor(Math.random() * 150) + 50,
    tag: i % 3 === 0 ? "Popular" : i % 3 === 1 ? "Trending" : "New",
    status: "active",
    is_published: true,
    is_featured: i < 3,
    membership_requirement: "All",
    total_redemptions_count: 0,
    max_redemptions_per_user: 1,
    expires_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    created_date: new Date(Date.now() - i * 86400000).toISOString(),
  }));
})();

const seedCategories = CATEGORIES.map((c, i) => ({
  id: makeId("cat"),
  name: c.name,
  slug: c.slug,
  icon: c.icon || "",
  description: `${c.name} — curated offers from trusted partners`,
  display_order: i,
  is_active: true,
  is_enabled: true,
  is_hidden: i >= 10,
  is_featured: i < 6,
}));

const seedCountries = COUNTRIES.map((c, i) => ({
  id: makeId("ctry"),
  name: c.name,
  slug: c.slug,
  flag: c.flag,
  image_url: c.image,
  is_active: true,
  display_order: i,
}));

const seedPlans = [
  { name: "Free", tier: "free", price_monthly: 0, price_yearly: 0, currency: "USD", description: "For individuals", benefits: "Find & redeem offers", display_order: 1, color: "#64748b", is_active: true, seats_included: 0 },
  { name: "Premium", tier: "premium", price_monthly: 9, price_yearly: 90, currency: "USD", description: "Most popular choice", benefits: "Everything in Free, plus\nUnlimited redemptions, cashback, priority support", display_order: 2, color: "#0A3A2F", is_active: true, seats_included: 0 },
  { name: "VIP", tier: "vip", price_monthly: 29, price_yearly: 290, currency: "USD", description: "The full luxury experience", benefits: "Everything in Premium, plus\nConcierge, airport lounge, luxury partners", display_order: 3, color: "#eab308", is_active: true, seats_included: 0 },
  { name: "Enterprise", tier: "enterprise", price_monthly: 0, price_yearly: 0, currency: "USD", description: "For businesses", benefits: "Custom plans, analytics, SSO", is_corporate: true, display_order: 5, is_active: true, seats_included: 100 },
];

const LOCAL_DB_KEY = "nv_local_db";

// Seeded rows get a stable id derived from their position. That lets the seed
// be rebuilt on every load (so content edits ship to returning visitors) while
// staying distinguishable from rows the user created, which are kept.
const seedTables = {
  [toLabel("Offer")]: seedOffers.map((r, i) => ({ ...r, id: `seed_offer_${i}` })),
  [toLabel("Category")]: seedCategories.map((r, i) => ({ ...r, id: `seed_category_${i}` })),
  [toLabel("Country")]: seedCountries.map((r, i) => ({ ...r, id: `seed_country_${i}` })),
  [toLabel("MembershipPlan")]: seedPlans.map((r, i) => ({ ...r, id: `seed_plan_${i}` })),
};

const localTables = {};
const ensureTable = (name) => {
  const key = toLabel(name);
  if (!localTables[key]) localTables[key] = seedTables[key] ? [...seedTables[key]] : [];
  return localTables[key];
};

function loadLocalTables() {
  let stored = {};
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (raw) stored = JSON.parse(raw) || {};
  } catch {
    stored = {};
  }
  for (const [key, rows] of Object.entries(stored)) {
    if (!Array.isArray(rows)) continue;
    const userRows = rows.filter((r) => r && !String(r.id).startsWith("seed_"));
    localTables[key] = [...(seedTables[key] || []), ...userRows];
  }
}

function flushLocalTables() {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(localTables));
  } catch { /* storage full or blocked — the write stays in memory */ }
}

if (typeof window !== "undefined") loadLocalTables();

// ---------------------------------------------------------------------------
// Local auth store (used only when no real backend is configured).
//
// This is a genuine credential store, not a stub: passwords are salted and
// hashed with iterated SHA-256, sessions are random tokens with an expiry, and
// credentials are verified before a session is issued. It still cannot replace a
// real identity provider — the data lives in this browser only — so production
// deployments must configure Supabase (see .env.example).
// ---------------------------------------------------------------------------

const USERS_KEY = "nv_auth_users";
const SESSION_KEY = "nv_auth_session";
const RESET_KEY = "nv_auth_reset";
const DEMO_SEED_KEY = "nv_auth_demo_seed";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const HASH_ROUNDS = 1000;

/**
 * Demo accounts, available only on the local fallback.
 *
 * Accounts in this mode live in the browser's own storage, so a visitor on a
 * fresh browser — or a second device — had no accounts at all and every sign-in
 * was rejected with "Incorrect email or password." The app looked like it
 * refused all logins, when in fact there was simply nothing to log in to.
 * Seeding one account per portal makes the platform usable out of the box and
 * lets the member, HR, partner and admin areas be demonstrated.
 *
 * These exist only when no real backend is configured; with Supabase set the
 * local store is never used and nothing here applies.
 */
const DEMO_SEED_VERSION = 1;
const DEMO_USERS = [
  { email: "demo@nelvinbenefits.com", password: "Demo1234!", role: "subscriber", firstName: "Amara", lastName: "Okafor" },
  { email: "hr@nelvinbenefits.com", password: "Demo1234!", role: "hr_admin", firstName: "Nadia", lastName: "Bello" },
  { email: "partner@nelvinbenefits.com", password: "Demo1234!", role: "business", firstName: "Kofi", lastName: "Mensah" },
  { email: "admin@nelvinbenefits.com", password: "Demo1234!", role: "admin", firstName: "Site", lastName: "Admin" },
];

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage full or blocked — the session simply will not persist */ }
}

function randomHex(bytes = 16) {
  const buf = new Uint8Array(bytes);
  // crypto.getRandomValues is available in insecure contexts too, but fall back
  // to Math.random so a locked-down environment can still issue ids/tokens
  // rather than crashing the whole auth flow.
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(buf);
  else for (let i = 0; i < bytes; i++) buf[i] = Math.floor(Math.random() * 256);
  return toHex(buf);
}

async function hashPassword(password, salt) {
  let acc = `${salt}:${password}`;
  for (let i = 0; i < HASH_ROUNDS; i++) acc = await sha256HexAsync(acc);
  return acc;
}

/**
 * Verify a password without re-deriving the full 1000 rounds when we can avoid
 * it, falling back to the plain implementation when WebCrypto is unavailable.
 */
async function verifyPassword(password, user) {
  try {
    return (await hashPassword(String(password || ""), user.salt)) === user.password_hash;
  } catch {
    return false;
  }
}

function makeSubscriberId() {
  return `NV-${randomHex(3).toUpperCase()}`;
}

/**
 * Name fields shared by every signup path.
 *
 * The signup form asks for a first and last name and the whole app renders
 * `full_name`, but registration used to discard both — new members were greeted
 * as "Valued Member" and HR rosters showed blanks. Derive `full_name` from the
 * parts so every existing reader keeps working, and only write the key when a
 * name was actually supplied (a patch must never blank an existing profile).
 */
function nameFields(firstName, lastName) {
  const first = String(firstName || "").trim();
  const last = String(lastName || "").trim();
  const out = {};
  if (first) out.first_name = first;
  if (last) out.last_name = last;
  const full = [first, last].filter(Boolean).join(" ");
  if (full) out.full_name = full;
  return out;
}

/** Role → the profile fields the rest of the app reads off `user`. */
function profileForRole(role) {
  const base = {
    membership_status: "active",
    subscriber_id: makeSubscriberId(),
  };
  if (role === "business" || role === "partner") {
    return { ...base, role: "business", account_type: "business" };
  }
  if (role === "hr_admin" || role === "corporate") {
    return { ...base, role: "hr_admin", account_type: "corporate" };
  }
  if (role === "admin" || role === "founder" || role === "staff") {
    return { ...base, role, account_type: "individual" };
  }
  return { ...base, role: "subscriber", account_type: "individual" };
}

/**
 * Seed the demo accounts once per browser.
 *
 * Runs only on the local fallback and only when an account is not already
 * present, so a visitor who has already registered or changed a demo password
 * keeps their own credentials. Hashing is asynchronous, so this is awaited from
 * the auth entry points rather than at module load.
 */
let demoSeedPromise = null;
function ensureDemoAccounts() {
  if (demoSeedPromise) return demoSeedPromise;
  demoSeedPromise = (async () => {
    let seeded = null;
    try { seeded = localStorage.getItem(DEMO_SEED_KEY); } catch { /* ignore */ }
    if (seeded === String(DEMO_SEED_VERSION)) return;

    const users = readStore(USERS_KEY, []);
    let changed = false;
    for (const demo of DEMO_USERS) {
      const email = demo.email.toLowerCase();
      if (users.some((u) => u.email === email)) continue;
      const salt = randomHex(16);
      users.push({
        id: `user_${randomHex(8)}`,
        email,
        salt,
        password_hash: await hashPassword(demo.password, salt),
        created_date: new Date().toISOString(),
        ...nameFields(demo.firstName, demo.lastName),
        ...profileForRole(demo.role),
        is_demo: true,
      });
      changed = true;
    }
    if (changed) writeStore(USERS_KEY, users);
    try { localStorage.setItem(DEMO_SEED_KEY, String(DEMO_SEED_VERSION)); } catch { /* ignore */ }
  })().catch(() => { /* seeding is best-effort; never block auth */ });
  return demoSeedPromise;
}

function findUserByEmail(email) {
  const target = String(email || "").trim().toLowerCase();
  return readStore(USERS_KEY, []).find((u) => u.email === target) || null;
}

function publicUser(user) {
  if (!user) return null;
  const { password_hash, salt, ...safe } = user;
  return safe;
}

function currentSession() {
  const session = readStore(SESSION_KEY, null);
  if (!session || !session.token) return null;
  if (session.expires_at && Date.parse(session.expires_at) < Date.now()) {
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    return null;
  }
  return session;
}

function getLocalUser() {
  const session = currentSession();
  if (!session) return null;
  const user = readStore(USERS_KEY, []).find((u) => u.id === session.user_id);
  return publicUser(user);
}

function issueSession(user) {
  const token = randomHex(32);
  writeStore(SESSION_KEY, {
    token,
    user_id: user.id,
    expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });
  // Kept for code that still reads the legacy key directly.
  try { localStorage.setItem(LOCAL_TOKEN_KEY, token); } catch { /* ignore */ }
  return token;
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LOCAL_TOKEN_KEY);
  } catch { /* ignore */ }
}

function localFilter(rows, filters) {
  return rows.filter((r) =>
    Object.entries(filters || {}).every(([k, v]) => {
      if (v === undefined || v === null || v === "") return true;
      if (k === "q") {
        return Object.values(r).some((x) =>
          String(x ?? "").toLowerCase().includes(String(v).toLowerCase())
        );
      }
      return String(r[k] ?? "") === String(v);
    })
  );
}

function applyLocalSort(rows, sort) {
  if (!sort) {
    return rows.slice().sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  }
  const desc = sort.startsWith("-");
  const key = desc ? sort.slice(1) : sort;
  return rows.slice().sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    let cmp;
    if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
    else cmp = String(av ?? "").localeCompare(String(bv ?? ""));
    return desc ? -cmp : cmp;
  });
}

function makeLocalEntity(name) {
  const tableName = toLabel(name);
  return {
    async filter(filters = {}, sort, limit) {
      let rows = localFilter(ensureTable(tableName), filters);
      rows = applyLocalSort(rows, sort);
      if (limit) rows = rows.slice(0, limit);
      return rows;
    },
    async list(sort, limit) {
      return this.filter({}, sort, limit);
    },
    async get(id) {
      return ensureTable(tableName).find((r) => r.id === id) || null;
    },
    async create(data) {
      const row = {
        id: makeId("row"),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        created_by_id: getLocalUser()?.id,
        ...data,
      };
      ensureTable(tableName).push(row);
      flushLocalTables();
      return row;
    },
    async update(id, patch) {
      const table = ensureTable(tableName);
      const idx = table.findIndex((r) => r.id === id);
      if (idx >= 0) {
        table[idx] = { ...table[idx], ...patch, updated_date: new Date().toISOString() };
        flushLocalTables();
        return table[idx];
      }
      const row = { id, ...patch, created_date: new Date().toISOString(), updated_date: new Date().toISOString() };
      table.push(row);
      flushLocalTables();
      return row;
    },
    async delete(id) {
      const table = ensureTable(tableName);
      const idx = table.findIndex((r) => r.id === id);
      if (idx >= 0) table.splice(idx, 1);
      flushLocalTables();
    },
    async bulkUpdate(items) {
      for (const item of items || []) {
        const { id, ...patch } = item;
        if (id) await this.update(id, patch);
      }
    },
    async bulkCreate(rows) {
      const created = [];
      for (const row of rows || []) created.push(await this.create(row));
      return created;
    },
  };
}

const fallbackDb = {
  auth: {
    isAuthenticated: async () => !!getLocalUser(),
    me: async () => getLocalUser(),

    async loginViaEmailPassword(email, password) {
      await ensureDemoAccounts();
      const user = findUserByEmail(email);
      // Same error for an unknown email and a wrong password: do not reveal
      // which addresses have accounts.
      const genericFailure = new Error("Incorrect email or password.");
      genericFailure.status = 401;
      if (!user) throw genericFailure;
      // A hashing failure must not be reported as a wrong password — that is
      // what hid the missing-WebCrypto crash behind "Incorrect email or
      // password." and made a broken sign-in look like a user typo.
      let ok = false;
      try {
        ok = await verifyPassword(password, user);
      } catch (err) {
        const failure = new Error(
          "Sign-in could not complete on this device. Please reload and try again."
        );
        failure.status = 500;
        failure.cause = err;
        throw failure;
      }
      if (!ok) throw genericFailure;
      issueSession(user);
      return { user: publicUser(user) };
    },

    loginWithProvider(provider, redirectPath) {
      // There is no OAuth provider available without a real backend. Fail
      // loudly instead of fabricating a session.
      const err = new Error(
        `${provider === "apple" ? "Apple" : "Google"} sign-in needs a configured identity provider.`
      );
      err.status = 501;
      throw err;
    },

    async register({ email, password, role, firstName, lastName }) {
      await ensureDemoAccounts();
      const cleanEmail = String(email || "").trim().toLowerCase();
      if (!cleanEmail || !password) throw new Error("Email and password are required.");
      if (String(password).length < 6) throw new Error("Password must be at least 6 characters.");
      if (findUserByEmail(cleanEmail)) {
        throw new Error("An account already exists for this email — please log in.");
      }

      const salt = randomHex(16);
      const user = {
        id: `user_${randomHex(8)}`,
        email: cleanEmail,
        salt,
        password_hash: await hashPassword(String(password), salt),
        created_date: new Date().toISOString(),
        ...nameFields(firstName, lastName),
        ...profileForRole(role),
      };

      const users = readStore(USERS_KEY, []);
      users.push(user);
      writeStore(USERS_KEY, users);

      // No mail transport locally, so the account is usable straight away
      // rather than waiting on a confirmation email that will never arrive.
      const token = issueSession(user);
      return { user: publicUser(user), email: cleanEmail, session: { access_token: token } };
    },

    async verifyOtp({ email, otpCode }) {
      // Only reachable when a real backend required email confirmation; the
      // local store creates verified accounts directly.
      const user = findUserByEmail(email);
      if (!user || !otpCode) throw new Error("Invalid verification code.");
      issueSession(user);
      return { access_token: randomHex(32) };
    },

    async updateMe(patch) {
      const session = currentSession();
      if (!session) throw new Error("Not authenticated");
      const users = readStore(USERS_KEY, []);
      const idx = users.findIndex((u) => u.id === session.user_id);
      if (idx === -1) throw new Error("Not authenticated");
      // `role` is not self-serviceable. The Supabase path already strips it, but
      // the fallback store accepted it, so any signed-in member could call
      // updateMe({ role: "admin" }) and be treated as an admin on the next read.
      // The role is set at registration and only an admin may change it.
      const { password_hash, salt, id, email, role, ...safePatch } = patch || {};
      users[idx] = { ...users[idx], ...safePatch };
      writeStore(USERS_KEY, users);
      return publicUser(users[idx]);
    },

    async resetPasswordRequest(email) {
      const user = findUserByEmail(email);
      // Always succeed so the response cannot be used to enumerate accounts.
      if (!user) return {};
      const token = randomHex(24);
      writeStore(RESET_KEY, {
        token,
        user_id: user.id,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });
      // Returned so the UI can continue the flow — there is no mail transport
      // locally, and a token that can never be delivered is a dead end.
      return { token };
    },

    async resetPassword({ resetToken, newPassword }) {
      if (!newPassword || String(newPassword).length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      const pending = readStore(RESET_KEY, null);
      if (!pending || !resetToken || pending.token !== resetToken) {
        throw new Error("This reset link is invalid or has expired.");
      }
      if (Date.parse(pending.expires_at) < Date.now()) {
        try { localStorage.removeItem(RESET_KEY); } catch { /* ignore */ }
        throw new Error("This reset link has expired — request a new one.");
      }
      const users = readStore(USERS_KEY, []);
      const idx = users.findIndex((u) => u.id === pending.user_id);
      if (idx === -1) throw new Error("This reset link is invalid or has expired.");

      const salt = randomHex(16);
      users[idx] = { ...users[idx], salt, password_hash: await hashPassword(String(newPassword), salt) };
      writeStore(USERS_KEY, users);
      try { localStorage.removeItem(RESET_KEY); } catch { /* ignore */ }

      // Password change invalidates any existing session.
      clearSession();
      return {};
    },

    setToken(token) {
      const session = currentSession();
      if (session) writeStore(SESSION_KEY, { ...session, token });
      try { localStorage.setItem(LOCAL_TOKEN_KEY, token || ""); } catch { /* ignore */ }
    },

    logout() {
      clearSession();
    },

    redirectToLogin() { window.location.href = loginUrlWithReturnTo(); },
  },
  entities: new Proxy(
    {},
    {
      get: (target, name) => makeLocalEntity(name),
    }
  ),
  users: {
    async inviteUser(email, role) {
      const name = toLabel("User");
      const exists = ensureTable(name).some((r) => r.email === email);
      if (exists) return;
      await makeLocalEntity(name).create({
        email, role: role || "subscriber", status: "invited",
        created_date: new Date().toISOString(),
      });
    },
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        if (!file || typeof window === "undefined") return { file_url: "" };
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file_url: String(reader.result) });
          reader.onerror = () => resolve({ file_url: "" });
          reader.readAsDataURL(file);
        });
      },
      SendEmail: async () => ({}),
    },
  },
};

fallbackRef = fallbackDb;

let resolvedBackend = null;
function resolveBackend() {
  if (resolvedBackend) return resolvedBackend;

  if (hasSupabaseConfig()) {
    console.info("[nelvin] Using Supabase backend");
    resolvedBackend = makeSupabaseBackend();
    return resolvedBackend;
  }

  if (typeof globalThis !== "undefined" && globalThis.__B44_DB__) {
    console.info("[nelvin] Using Base44 host SDK");
    resolvedBackend = globalThis.__B44_DB__;
    return resolvedBackend;
  }

  console.info("[nelvin] No backend configured — using local in-memory data");
  resolvedBackend = fallbackDb;
  return resolvedBackend;
}

/** The active database client (Supabase when configured, else Base44 host SDK, else local). */
export const db = resolveBackend();


/** True when the app is backed by a real Supabase project. */
export const isSupabaseBackend = () => hasSupabaseConfig();

/**
 * The demo sign-in accounts, exposed for the login screen's hint panel.
 *
 * Empty when a real backend is configured — the local store is not in use then
 * and these credentials would be misleading.
 */
export const demoAccounts = () =>
  hasSupabaseConfig()
    ? []
    : DEMO_USERS.map(({ email, password, role }) => ({ email, password, role }));

export default db;