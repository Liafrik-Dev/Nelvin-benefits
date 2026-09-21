import React from "react";
import { Loader2, Store } from "lucide-react";

/** Shared loading spinner for the partner portal pages. */
export function PortalLoading({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center py-24 text-ivory-muted">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> {label}
    </div>
  );
}

/**
 * Shown when a partner has no business record yet (or it has not been approved).
 * Without this the pages displayed a hard-coded storefront instead.
 */
export function NoBusinessYet({ business, error }) {
  const pending = business && business.status !== "approved";
  return (
    <div className="max-w-lg mx-auto text-center bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 mt-6">
      <Store className="w-10 h-10 text-[#1B4F9C] mx-auto mb-4" />
      <h1 className="text-xl font-bold text-ivory">
        {pending ? "Your business is under review" : "No business linked yet"}
      </h1>
      <p className="text-sm text-ivory-muted mt-2">
        {error
          ? error
          : pending
          ? `We have your application for "${business.business_name}". You can manage offers, redemptions and payouts once it is approved.`
          : "Apply as a partner to publish offers, validate redemptions and track earnings."}
      </p>
      {pending && business.rejection_reason && (
        <p className="text-sm text-red-600 bg-red-50 ring-1 ring-red-100 rounded-lg px-4 py-3 mt-4">
          Reason: {business.rejection_reason}
        </p>
      )}
    </div>
  );
}

/** Empty-state card used by the list pages. */
export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-10 text-center">
      {Icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFFFFF] text-[#1B4F9C] rounded-lg mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h2 className="text-lg font-semibold text-ivory">{title}</h2>
      {children && <p className="text-sm text-ivory-muted max-w-md mx-auto mt-2">{children}</p>}
    </div>
  );
}
