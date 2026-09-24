import { useState, useEffect, useCallback } from "react";
import { db } from "@/services/api/dataClient";
import { useAuth } from "@/lib/AuthContext";

// Resolves which business record the signed-in partner owns.
//
// The business pages each hard-coded a store ("Nike Store Nigeria") and invented
// its numbers, so every partner saw the same fake storefront. One lookup, shared
// by those pages, keeps them consistent and lets them read real rows.
//
// Matching order: owner_id (the vendor application's own link) first, then
// created_by_id (the local fallback records the creator), then an email match —
// the same precedence the admin approval flow uses.
export function usePartnerBusiness() {
  const { user, isLoadingAuth } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user?.id) { setBusiness(null); setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const apps = await db.entities.VendorApplication.list("-created_date", 200).catch(() => []);
      const mine = apps.find((a) => a.owner_id === user.id)
        || apps.find((a) => a.created_by_id === user.id)
        || apps.find((a) => a.email && user.email && a.email.toLowerCase() === user.email.toLowerCase())
        || null;
      setBusiness(mine);
    } catch (err) {
      setError(err?.message || "Could not load your business profile.");
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.email]);

  useEffect(() => { if (!isLoadingAuth) load(); }, [isLoadingAuth, load]);

  return {
    business,
    businessId: business?.id || null,
    businessName: business?.business_name || "",
    loading: loading || isLoadingAuth,
    error,
    reload: load,
  };
}