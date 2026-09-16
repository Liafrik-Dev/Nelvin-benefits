import React, { useState } from "react";
import { Shield, Plus, Check } from "lucide-react";

export default function RolesPanel({ company }) {
  const roles = [
    { name: "HR Super Admin", members: 2, permissions: ["All Permissions", "Manage Billing", "Approve Claims", "Edit Settings"] },
    { name: "Department Manager", members: 8, permissions: ["View Employees", "Issue Points", "Approve Department Claims"] },
    { name: "Payroll Admin", members: 1, permissions: ["View Reports", "Export Payroll CSV", "View Allowances"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Roles & Permissions</h1>
          <p className="text-sm text-ivory-muted mt-1">Configure role-based access control (RBAC) for HR administrators and managers.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((r) => (
          <div key={r.name} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Shield className="w-6 h-6 text-[#1B4F9C]" />
              <span className="text-xs font-bold text-ivory-muted">{r.members} Members</span>
            </div>
            <div>
              <h3 className="font-bold text-ivory text-lg font-heading">{r.name}</h3>
              <div className="mt-3 space-y-1.5">
                {r.permissions.map((p) => (
                  <p key={p} className="text-xs text-ivory-muted flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1B4F9C]" /> {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}