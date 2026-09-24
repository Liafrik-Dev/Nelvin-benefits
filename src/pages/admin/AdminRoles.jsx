import { db } from "@/services/api/dataClient";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, Loader2, Lock, ChevronRight } from "lucide-react";
import { exportToCsv } from "@/lib/adminUtils";

// The role model mirrors public.users.role and the RLS helpers in
// supabase/migrations — is_admin() accepts admin/founder/staff, and the portal
// guards in AdminLayout/BusinessLayout/CorporateDashboard agree with this list.
const ROLES = [
  { name: "Founder", value: "founder", ceiling: "All permissions", editable: false,
    description: "Full access. Cannot be demoted or removed by another admin." },
  { name: "Admin", value: "admin", ceiling: "Everything except Founder-only actions",
    description: "Manage users, companies, businesses, offers, categories, reviews, memberships, payments, notifications." },
  { name: "Staff", value: "staff", ceiling: "Approvals + support",
    description: "Day-to-day moderation: approve or reject businesses and offers, answer support tickets." },
  { name: "HR admin", value: "hr_admin", ceiling: "Own company only",
    description: "Corporate portal: manage their company's employees, benefits, budgets and campaigns." },
  { name: "Business", value: "business", ceiling: "Single business",
    description: "Vendor portal: manage their own business profile, offers, promo codes and redemptions." },
  { name: "Subscriber", value: "subscriber", ceiling: "End user",
    description: "Browse offers, manage their profile, reviews, favourites, redemptions and membership." },
];

export default function AdminRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setUsers(await db.entities.User.list("-created_date", 1000).catch(() => []));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byRole = useMemo(() => {
    const map = new Map(ROLES.map((r) => [r.value, []]));
    for (const u of users) {
      const r = String(u.role || "subscriber").toLowerCase();
      if (!map.has(r)) map.set(r, []);
      map.get(r).push(u);
    }
    return map;
  }, [users]);

  const exportRole = (role) => {
    const rows = byRole.get(role.value) || [];
    exportToCsv(
      `nelvin-${role.value}-users.csv`,
      rows,
      [
        { key: "full_name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status" },
        { key: "created_date", label: "Joined" },
      ]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-ivory-muted">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading roles…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">Admin Roles &amp; Permissions</h1>
        <p className="text-sm text-ivory-muted mt-1">
          Who can reach each portal, and how many accounts hold each role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES.map((r) => {
          const holders = byRole.get(r.value) || [];
          return (
            <div key={r.value} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] text-[#1B4F9C] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-ivory">{r.name}</h2>
                    {r.editable === false && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-ivory-dim ring-1 ring-[#F1F1F1] rounded-full px-2 py-0.5">
                        <Lock className="w-3 h-3" /> Protected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ivory-muted">{r.ceiling}</p>
                </div>
              </div>
              <p className="text-sm text-ivory-muted mb-4">{r.description}</p>

              <div className="mt-auto pt-3 border-t border-[#F1F1F1] flex items-center justify-between">
                <span className="text-xs text-ivory inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-ivory-dim" />
                  {holders.length} {holders.length === 1 ? "account" : "accounts"}
                </span>
                <span className="flex items-center gap-3">
                  {holders.length > 0 && (
                    <button onClick={() => exportRole(r)} className="text-xs font-semibold text-[#1B4F9C]">
                      Export
                    </button>
                  )}
                  <Link
                    to={`/admin/users?role=${r.value}`}
                    className="text-xs font-semibold text-[#1B4F9C] inline-flex items-center gap-0.5"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5 text-sm text-ivory-muted">
        <p className="text-ivory font-semibold mb-1.5">How permissions are enforced</p>
        <p>
          Portal access is checked in the UI (<code className="text-xs">AdminLayout</code>,{" "}
          <code className="text-xs">BusinessLayout</code>, <code className="text-xs">CorporateDashboard</code>)
          and again in the database by row-level security. The database is the authority: the UI check only
          decides which page you see. Change a role on the{" "}
          <Link to="/admin/users" className="text-[#1B4F9C] font-semibold">Users</Link> page.
        </p>
      </div>
    </div>
  );
}
