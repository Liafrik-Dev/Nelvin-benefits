import React from "react";
import { Users, Building2 } from "lucide-react";

export default function BusinessCustomers() {
  const companies = [
    { name: "Acme Corporation", members: 45, redemptions: 112, revenue: "$4,200" },
    { name: "Cyberdyne Systems", members: 28, redemptions: 64, revenue: "$2,850" },
    { name: "Dunder Mifflin Inc", members: 15, redemptions: 32, revenue: "$1,400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Audience & Customer Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Breakdown of top corporate employers sending members to your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3 shadow-sm">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-lg font-heading">{c.name}</h3>
            <div className="pt-2 border-t border-gray-50 text-xs space-y-1 text-gray-600">
              <p><span className="font-bold">Active Members:</span> {c.members}</p>
              <p><span className="font-bold">Redemptions:</span> {c.redemptions}</p>
              <p className="text-emerald-700 font-bold"><span className="font-bold">Total Sales:</span> {c.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}