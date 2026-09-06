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

const fallbackDb = {
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
  },
  entities: new Proxy(
    {},
    {
      get: () => ({
        filter: async () => [],
        get: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      }),
    },
  ),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: "" }),
    },
  },
};

/** The Base44 SDK handle injected by the platform (or the fallback outside it). */
export const db = globalThis.__B44_DB__ || fallbackDb;

/** Alias kept for backwards compatibility with code that named the import `base44`. */
export const base44 = db;

export default db;