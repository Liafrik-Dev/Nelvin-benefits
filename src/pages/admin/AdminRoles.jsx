import React from "react";
import { ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

const ROLES = [
  { name: "Founder", description: "Full access to everything. Cannot be edited or removed by other admins.", ceiling: "All permissions" },
  { name: "Admin", description: "Manage users, companies, businesses, offers, categories, reviews, memberships, payments, notifications.", ceiling: "Everything except Founder-only actions" },
  { name: "Staff", description: "Day-to-day moderation: approve/reject businesses and offers, respond to support tickets. No payments or settings.", ceiling: "Approvals + support only" },
  { name: "Vendor", description: "Manage only their own business profile and offers.", ceiling: "Single business scope" },
  { name: "Subscriber", description: "Individual or corporate end user; browse offers, manage own profile, reviews, favorites, redemptions, and membership.", ceiling: "End-user only" },
];

export default function AdminRoles() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Admin Roles & Permissions</h1>
        <p className="text-sm text-ivory-muted mt-1">Available roles and per-role permission customization.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES.map((r) => (
          <div key={r.name} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] text-[#1B4F9C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-ivory">{r.name}</h2>
                <p className="text-xs text-ivory-muted">{r.ceiling}</p>
              </div>
            </div>
            <p className="text-sm text-ivory-muted">{r.description}</p>
          </div>
        ))}
      </div>
      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-10 text-center mt-4">
        <div className="inline-block">
          <StatusBadge status="pending" label="Phase 3" />
        </div>
        <p className="text-sm text-ivory-muted max-w-md mx-auto mt-3">
          Granular per-permission toggles for each internal role (Founder/Admin/Staff), live user lists per role, and the Founders lock-out protection will be delivered in Phase 3 alongside Audit Logs and Backups.
        </p>
      </div>
    </div>
  );
}