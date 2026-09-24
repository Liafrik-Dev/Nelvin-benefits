import { db } from "@/services/api/dataClient";

import React, { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { Send, Bell } from "lucide-react";

const TYPES = [
  { id: "announcement", label: "Announcement" },
  { id: "maintenance", label: "Maintenance notice" },
  { id: "new_benefit", label: "New Benefits alert" },
  { id: "holiday", label: "Holiday Message" },
  { id: "reminder", label: "Reminder" },
];

const AUDIENCES = [
  { id: "company", label: "Entire Company" },
  { id: "department", label: "Department" },
  { id: "specific", label: "Specific Employees" },
];

export default function NotificationsPanel({ company }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    type: "announcement", audience: "company",
    department: "", recipient_emails: "", title: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      // Build recipient set + record one Notification per targeted employee (so each sees it).
      // For company-wide: set target_company_id which employees can read via RLS (company_id matches).
      let recipients = [];
      if (form.audience === "company") {
        const emps = await db.entities.Employee.filter({ company_id: company.id, status: "active" }, "-created_date", 500).catch(() => []);
        recipients = emps.filter((e) => e.user_email).map((e) => e.user_email);
      } else if (form.audience === "department") {
        const emps = await db.entities.Employee.filter({ company_id: company.id, status: "active" }, "-created_date", 500).catch(() => []);
        recipients = emps.filter((e) => e.department === form.department && e.user_email).map((e) => e.user_email);
      } else {
        recipients = form.recipient_emails.split(/[,\n]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
      }

      if (recipients.length === 0) {
        toast({ title: "No recipients", description: "No matching active employees found for this audience.", variant: "destructive" });
        setSending(false);
        return;
      }

      // One notification record per recipient (so the existing RLS matches each user's email).
      await db.entities.Notification.bulkCreate(
        recipients.map((email) => ({
          title: form.title,
          message: form.message,
          type: "system",
          channel: "system",
          audience: "specific_users",
          recipient_email: email,
          target_company_id: company.id,
          sent_by_admin: false,
          admin_id: user?.id,
        }))
      );

      try {
        await db.entities.AuditLog.create({
          admin_id: user?.id, admin_name: user?.full_name || user?.email,
          action: "create", entity_type: "Notification", entity_id: company.id,
          entity_name: form.title,
          description: `HR sent ${form.type} (${form.audience}) to ${recipients.length} recipient(s)`,
        });
      } catch {}

      toast({ title: "Notification sent", description: `Delivered to ${recipients.length} employee(s) (in-app). Email delivery available when credits reset.` });
      setSent([{ title: form.title, count: recipients.length, ts: new Date().toISOString() }, ...sent].slice(0, 5));
      setForm({ ...form, title: "", message: "", recipient_emails: "" });
    } catch (err) {
      toast({ title: "Send failed", description: err?.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Notifications</h1>
        <p className="text-sm text-ivory-muted mt-1">Send announcements, benefit alerts, or reminders to your team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <form onSubmit={submit} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Type">
              <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
                {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Audience">
              <select value={form.audience} onChange={(e) => setForm((s) => ({ ...s, audience: e.target.value }))} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
                {AUDIENCES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </Field>
          </div>

          {form.audience === "company" && (
            <p className="text-xs text-ivory-muted">Will be delivered to every active employee in {company.name}.</p>
          )}
          {form.audience === "department" && (
            <Field label="Department">
              <select value={form.department} onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
                <option value="">Select department</option>
              </select>
            </Field>
          )}
          {form.audience === "specific" && (
            <Field label="Specific employees (emails, comma or newline separated)">
              <textarea rows={3} value={form.recipient_emails} onChange={(e) => setForm((s) => ({ ...s, recipient_emails: e.target.value }))} placeholder="ada@acme.com, john@acme.com" className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40" />
            </Field>
          )}

          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="New wellness week benefits just dropped!" className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40" />
          </Field>
          <Field label="Message">
            <textarea rows={4} value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} placeholder="Tell your team what they should know..." className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40" />
          </Field>

          <div className="flex items-center justify-between">
            <p className="text-xs text-ivory-dim">Delivered in-app to all matching employees. Email delivery resumes when workspace credits reset (currently blocked).</p>
            <button type="submit" disabled={sending} className="inline-flex items-center gap-2 bg-[#1B4F9C] hover:bg-[#1B4F9C] disabled:opacity-70 text-white text-sm font-semibold px-5 py-2.5 rounded-full">
              <Send className="w-4 h-4" /> {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 h-fit">
          <h3 className="font-semibold text-ivory mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-[#1B4F9C]" /> Recently sent</h3>
          {sent.length === 0 ? (
            <p className="text-sm text-ivory-dim">No notifications sent yet in this session.</p>
          ) : (
            <div className="space-y-2">
              {sent.map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#F9F8F7]">
                  <p className="text-sm font-medium text-ivory truncate">{s.title}</p>
                  <p className="text-xs text-ivory-dim">{s.count} recipients · {new Date(s.ts).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ivory-muted mb-1">{label}</label>
      {children}
    </div>
  );
}