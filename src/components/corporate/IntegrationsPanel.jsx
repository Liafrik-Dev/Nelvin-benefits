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
        <h1 className="text-2xl font-bold font-heading text-ivory">Platform Integrations</h1>
        <p className="text-sm text-ivory-muted mt-1">Connect your HRIS directory, SSO provider, and team messaging channels.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {apps.map((a) => (
          <div key={a.name} className="bg-white rounded-lg border border-white/10 p-6 space-y-4 shadow-sm flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-3xl">{a.logo}</span>
              <h3 className="font-bold text-ivory text-base font-heading">{a.name}</h3>
              <p className="text-xs text-ivory-muted">{a.category}</p>
            </div>
            <button className={`px-4 py-2 rounded-xl text-xs font-bold ${
              a.connected ? "bg-[#0A3A2F] text-ivory" : "bg-white/5 text-ivory hover:bg-white/10"
            }`}>
              {a.connected ? "Connected" : "Connect App"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}