import React from "react";
import { UserCog, Plus, Shield } from "lucide-react";

export default function BusinessTeam() {
  const members = [
    { name: "John Doe (Owner)", email: "john@nike.ng", role: "Merchant Admin" },
    { name: "Jane Smith", email: "jane@nike.ng", role: "Store Cashier / Scanner" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Store Staff & Cashier Logins</h1>
          <p className="text-sm text-gray-500 mt-1">Add store cashiers or managers with QR scanner access.</p>
        </div>
        <button className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.map((m) => (
          <div key={m.email} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
            <UserCog className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-base font-heading">{m.name}</h3>
            <p className="text-xs text-gray-500">{m.email}</p>
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full mt-2">
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}