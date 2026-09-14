import React, { useState } from "react";
import { Megaphone, Send, Mail, MessageSquare } from "lucide-react";

export default function CommunicationsPanel({ company }) {
  const [announcement, setAnnouncement] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">Internal Communications</h1>
        <p className="text-sm text-ivory-muted mt-1">Broadcast benefit updates, company policy changes, or deal reminders to employees.</p>
      </div>

      <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-6 space-y-4 shadow-sm max-w-2xl">
        <h3 className="font-bold text-ivory text-base font-heading flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#D6B56D]" /> Send Broadcast Announcement
        </h3>
        <div>
          <label className="block text-xs font-bold text-ivory mb-1">Target Department</label>
          <select className="w-full bg-forest-secondary/60 border border-white/12 rounded-xl px-3.5 py-2 text-xs font-medium">
            <option value="all">All Employees ({company.employee_count || 50})</option>
            <option value="eng">Engineering</option>
            <option value="sales">Sales & Marketing</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-ivory mb-1">Message Content</label>
          <textarea
            rows={4}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Write your company update..."
            className="w-full bg-forest-secondary/60 border border-white/12 rounded-xl p-3 text-xs outline-none focus:border-[#D6B56D]"
          />
        </div>
        <button className="bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <Send className="w-4 h-4" /> Broadcast Message
        </button>
      </div>
    </div>
  );
}