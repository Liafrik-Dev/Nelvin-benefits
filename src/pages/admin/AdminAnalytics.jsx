import React from "react";
import { BarChart3 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminAnalytics() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Analytics</h1>
        <p className="text-sm text-ivory-muted mt-1">Visitors, page views, offer clicks, redemptions, growth & country performance.</p>
      </div>
      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFFFFF] text-[#1B4F9C] rounded-lg mb-4">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-ivory">Scheduled for Phase 3</h2>
        <p className="text-sm text-ivory-muted max-w-md mx-auto mt-2">
          The Analytics module surfaces visitor stats, page views, offer clicks, redemptions, business growth and country/category performance. It requires a dedicated event-tracking layer that will be added in Phase 3 alongside Audit Logs and Admin Roles & Permissions.
        </p>
        <div className="inline-block mt-4">
          <StatusBadge status="pending" label="Phase 3" />
        </div>
      </div>
    </div>
  );
}