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
          <h1 className="text-2xl font-bold font-heading text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Configure role-based access control (RBAC) for HR administrators and managers.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((r) => (
          <div key={r.name} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Shield className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-bold text-gray-500">{r.members} Members</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-heading">{r.name}</h3>
              <div className="mt-3 space-y-1.5">
                {r.permissions.map((p) => (
                  <p key={p} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> {p}
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