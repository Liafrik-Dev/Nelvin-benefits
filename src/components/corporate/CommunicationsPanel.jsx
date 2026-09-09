import React, { useState } from "react";
import { Megaphone, Send, Mail, MessageSquare } from "lucide-react";

export default function CommunicationsPanel({ company }) {
  const [announcement, setAnnouncement] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Internal Communications</h1>
        <p className="text-sm text-gray-500 mt-1">Broadcast benefit updates, company policy changes, or deal reminders to employees.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm max-w-2xl">
        <h3 className="font-bold text-gray-900 text-base font-heading flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-emerald-600" /> Send Broadcast Announcement
        </h3>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Target Department</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium">
            <option value="all">All Employees ({company.employee_count || 50})</option>
            <option value="eng">Engineering</option>
            <option value="sales">Sales & Marketing</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Message Content</label>
          <textarea
            rows={4}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Write your company update..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-emerald-600"
          />
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <Send className="w-4 h-4" /> Broadcast Message
        </button>
      </div>
    </div>
  );
}