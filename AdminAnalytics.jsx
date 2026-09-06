import React from "react";
import { BarChart3 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminAnalytics() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Visitors, page views, offer clicks, redemptions, growth & country performance.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl mb-4">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Scheduled for Phase 3</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
          The Analytics module surfaces visitor stats, page views, offer clicks, redemptions, business growth and country/category performance. It requires a dedicated event-tracking layer that will be added in Phase 3 alongside Audit Logs and Admin Roles & Permissions.
        </p>
        <div className="inline-block mt-4">
          <StatusBadge status="pending" label="Phase 3" />
        </div>
      </div>
    </div>
  );
}