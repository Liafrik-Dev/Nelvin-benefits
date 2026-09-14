/**
 * Central access point for the Base44 database / auth SDK.
 *
 * Nelvin Benefits is hosted on the Base44 platform. The Base44 runtime injects
 * the database client (auth + entities + integrations) on `globalThis.__B44_DB__`
 * before the bundle boots (see src/lib/app-params.js for the bootstrap flow). When
 * developing outside the Base44 host (plain `vite dev`/ `npm run preview`),
 * a read-only in-memory fallback keeps the UI renderable.
 *
 * IMPORTANT: All application code MUST import `db` from this module instead of
 * touching `globalThis.__B44_DB__` directly. This is the single seam that will
 * allow replacing Base44 with Supabase/PostgreSQL/your own API without touching
 * feature code. See docs/BASE44_DEPENDENCIES.md.
 */

const mockUser = {
  id: "user_demo_123",
  email: "admin@nelvinbenefits.com",
  full_name: "Demo Admin User",
  role: "admin",
  company_id: "company_demo_456",
  account_type: "corporate",
  subscriber_id: "NV-009988",
  membership_status: "active",
};

const mockCompany = {
  id: "company_demo_456",
  name: "Acme Corporation",
  status: "approved",
  dashboard_access: true,
  membership_tier: "Enterprise Gold",
  employee_count: 150,
  country: "Nigeria",
};

const fallbackDb = {
  auth: {
    isAuthenticated: async () => {
      return !!localStorage.getItem("nv_auth_token");
    },
    me: async () => {
      const token = localStorage.getItem("nv_auth_token");
      return token ? mockUser : null;
    },
    loginViaEmailPassword: async (email, password) => {
      localStorage.setItem("nv_auth_token", "demo_session_token");
      return { user: mockUser };
    },
    loginWithProvider: (provider, redirectPath) => {
      localStorage.setItem("nv_auth_token", "demo_session_token");
      window.location.href = redirectPath || "/";
    },
    register: async ({ email, password, role }) => {
      localStorage.setItem("nv_auth_token", "demo_session_token");
      return { email };
    },
    verifyOtp: async ({ email, otpCode }) => {
      return { access_token: "demo_session_token" };
    },
    updateMe: async (patch) => {
      Object.assign(mockUser, patch || {});
      return { ...mockUser };
    },
    resetPassword: async () => {},
    resetPasswordRequest: async () => {},
    setToken: (token) => {
      localStorage.setItem("nv_auth_token", token);
    },
    logout: () => {
      localStorage.removeItem("nv_auth_token");
    },
    redirectToLogin: () => {},
  },
  entities: new Proxy(
    {},
    {
      get: (target, prop) => ({
        filter: async () => [],
        list: async () => [],
        get: async (id) => (prop === "Company" ? mockCompany : null),
        create: async (data) => ({ id: "id_" + Date.now(), ...data }),
        update: async (id, data) => ({ id, ...data }),
        updateMe: async (patch) => ({ ...mockUser, ...patch }),
        delete: async () => ({}),
        bulkUpdate: async () => ({}),
        bulkCreate: async () => [],
      }),
    },
  ),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: "" }),
      SendEmail: async () => ({}),
    },
  },
};

/** The Base44 SDK handle injected by the platform (or the fallback outside it). */
export const db = globalThis.__B44_DB__ || fallbackDb;

/** Alias kept for backwards compatibility with code that named the import `base44`. */
export const base44 = db;

export default db;