import React from "react";
import { Link2, CheckCircle2, Shield, RefreshCw } from "lucide-react";

export default function IntegrationsPanel({ company }) {
  const apps = [
    { name: "BambooHR", category: "HRIS Employee Sync", connected: true, logo: "🎋" },
    { name: "Workday", category: "Enterprise HRIS", connected: false, logo: "💼" },
    { name: "Slack", category: "Notifications & Recognition", connected: true, logo: "💬" },
    { name: "Microsoft Entra / SSO", category: "Single Sign-On", connected: true, logo: "🔐" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Platform Integrations</h1>
        <p className="text-sm text-gray-500 mt-1">Connect your HRIS directory, SSO provider, and team messaging channels.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {apps.map((a) => (
          <div key={a.name} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-3xl">{a.logo}</span>
              <h3 className="font-bold text-gray-900 text-base font-heading">{a.name}</h3>
              <p className="text-xs text-gray-500">{a.category}</p>
            </div>
            <button className={`px-4 py-2 rounded-xl text-xs font-bold ${
              a.connected ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
              {a.connected ? "Connected" : "Connect App"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}