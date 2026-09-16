import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";

import { useAuth } from "@/lib/AuthContext";
import { formatDate } from "@/lib/adminUtils";
import StatusBadge from "@/components/admin/StatusBadge";
import { Send, Loader2 } from "lucide-react";

export default function AdminNotifications() {
  const { user: adminUser } = useAuth();
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
    channel: "system",
    target_country: "",
    target_membership_plan: "",
    target_company_id: "",
    recipient_email: "",
    type: "system",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(0);
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    const data = await db.entities.Notification.filter({ sent_by_admin: true }, "-created_date", 30).catch(() => []);
    setHistory(data || []);
  }, []);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const sendServer = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      await db.entities.Notification.create({
        title: form.title,
        message: form.message,
        type: form.type,
        channel: form.channel,
        audience: form.audience,
        target_country: form.target_country,
        target_membership_plan: form.target_membership_plan,
        target_company_id: form.target_company_id,
        recipient_email: form.recipient_email,
        sent_by_admin: true,
        admin_id: adminUser?.id,
        read: false,
      });
      setSent((s) => s + 1);
      await loadHistory();
      setForm((p) => ({ ...p, title: "", message: "", recipient_email: "" }));
    } catch (err) {
      alert(err?.message || "Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Notifications</h1>
        <p className="text-sm text-ivory-muted mt-1">Send system (in-app) and email notifications to specific audiences.</p>
      </div>

      <div className="bg-[#F9F8F7] border border-[#1B4F9C]/25 rounded-xl px-4 py-3 mb-6 text-sm text-[#1B4F9C]">
        Email notifications require SendEmail integration credits, which are currently exhausted. They will resume after credits reset on 2026-09-01 or with a higher tier. System (in-app) notifications work immediately.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-ivory">Compose notification</h2>
          <div>
            <label className="text-sm font-medium text-ivory block mb-1.5">Channel</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set("channel", "system")}
                className={`px-4 py-2 text-sm rounded-lg border ${form.channel === "system" ? "bg-[#FFFFFF] border-[#F1F1F1] text-[#1B4F9C]" : "bg-[#FFFFFF] border-[#F1F1F1] text-ivory-muted"}`}
              >
                System (in-app)
              </button>
              <button
                type="button"
                onClick={() => set("channel", "email")}
                className={`px-4 py-2 text-sm rounded-lg border ${form.channel === "email" ? "bg-[#FFFFFF] border-[#F1F1F1] text-[#1B4F9C]" : "bg-[#FFFFFF] border-[#F1F1F1] text-ivory-muted"}`}
              >
                Email
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ivory block mb-1.5">Audience</label>
            <select value={form.audience} onChange={(e) => set("audience", e.target.value)} className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4F9C]/20">
              <option value="all">All Users</option>
              <option value="specific_users">Specific Users (by email)</option>
              <option value="businesses">Businesses</option>
              <option value="countries">By Country</option>
              <option value="membership">By Membership Plan</option>
              <option value="companies">Specific Companies</option>
            </select>
          </div>
          {form.audience === "specific_users" && (
            <div>
              <label className="text-sm font-medium text-ivory block mb-1.5">Recipient Email</label>
              <input value={form.recipient_email} onChange={(e) => set("recipient_email", e.target.value)} className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm" />
            </div>
          )}
          {form.audience === "countries" && (
            <div>
              <label className="text-sm font-medium text-ivory block mb-1.5">Country</label>
              <input value={form.target_country} onChange={(e) => set("target_country", e.target.value)} className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm" />
            </div>
          )}
          {form.audience === "membership" && (
            <div>
              <label className="text-sm font-medium text-ivory block mb-1.5">Plan</label>
              <select value={form.target_membership_plan} onChange={(e) => set("target_membership_plan", e.target.value)} className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm bg-[#FFFFFF]/40 text-ivory">
                <option value="">—</option>
                {["Free", "Silver", "Gold", "Platinum", "Enterprise"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          )}
          {form.audience === "companies" && (
            <div>
              <label className="text-sm font-medium text-ivory block mb-1.5">Company ID</label>
              <input value={form.target_company_id} onChange={(e) => set("target_company_id", e.target.value)} className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-ivory block mb-1.5">Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-ivory block mb-1.5">Message</label>
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={4} className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm" />
          </div>
          <button
            onClick={sendServer}
            disabled={sending}
            className="bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send {form.channel === "email" ? "email" : "notification"}
          </button>
          {sent > 0 && <p className="text-xs text-[#1B4F9C]">{sent} notifications delivered this session.</p>}
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6">
          <h2 className="font-semibold text-ivory mb-3">Recent notifications</h2>
          {history.length === 0 ? (
            <p className="text-sm text-ivory-dim py-8 text-center">No notifications sent yet.</p>
          ) : (
            <ul className="divide-y divide-[#F1F1F1]">
              {history.map((n) => (
                <li key={n.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ivory">{n.title}</p>
                    <StatusBadge status={n.channel === "email" ? "individual" : "active"} label={n.channel === "email" ? "Email" : "System"} />
                  </div>
                  <p className="text-xs text-ivory-muted mt-0.5">{n.message}</p>
                  <p className="text-xs text-ivory-dim mt-1">To: {n.audience} · {formatDate(n.created_date)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}