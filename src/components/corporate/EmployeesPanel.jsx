import { db } from "@/services/api/base44Client";

import React, { useState, useCallback, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { genSubscriberId } from "@/lib/subscriberId";
import {
  UserPlus, Upload, Search, MoreVertical, Ban, RotateCcw, Trash2, FileSpreadsheet,
  Key, Download, Tag as TagIcon,
} from "lucide-react";

function StatusPill({ status }) {
  const map = {
    invited: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20",
    active: "bg-[#103F35]/60 text-[#D6B56D] ring-1 ring-[#D6B56D]/25",
    suspended: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20",
    removed: "bg-[#0A3A2F]/5 text-ivory-muted",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || "bg-[#0A3A2F]/5"}`}>{status}</span>;
}

export default function EmployeesPanel({ company, employees, onChanged }) {
  const { user, checkUserAuth } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState(employees || []);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ email: "", department: "", office: "" });
  const [csvMode, setCsvMode] = useState(false);
  const [edit, setEdit] = useState(null);
  const [departments, setDepartments] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.entities.Employee.filter({ company_id: company.id }, "-created_date", 500).catch(() => []);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [company.id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    db.entities.Department.filter({ company_id: company.id }, "-created_date", 100)
      .then(setDepartments).catch(() => {});
  }, [company.id]);

  // Keep cards up to date if parent passes fresh employees prop
  useEffect(() => { if (employees?.length) setItems(employees); }, [employees]);

  const filtered = items.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (e.user_email || "").toLowerCase().includes(s)
      || (e.user_name || "").toLowerCase().includes(s)
      || (e.department || "").toLowerCase().includes(s)
      || (e.subscriber_id || "").toLowerCase().includes(s);
  });

  const writeAudit = async (action, entity_id, entity_name, description) => {
    try {
      await db.entities.AuditLog.create({
        admin_id: user?.id, admin_name: user?.full_name || user?.email,
        action, entity_type: "Employee", entity_id, entity_name, description,
      });
    } catch { /* best-effort */ }
  };

  const submitInvite = async (e) => {
    e.preventDefault();
    const email = invite.email.trim().toLowerCase();
    if (!email) return;
    if (items.some((i) => i.user_email === email)) {
      toast({ title: "Already invited", description: `${email} is already on your team list.`, variant: "destructive" });
      return;
    }
    try {
      try { await db.users.inviteUser(email, "subscriber"); } catch { /* may already be a user; ignore */ }
      const sid = genSubscriberId(email);
      const created = await db.entities.Employee.create({
        user_email: email,
        company_id: company.id,
        company_name: company.name,
        department: invite.department,
        office: invite.office,
        status: "invited",
        subscriber_id: sid,
        membership_tier: company.membership_tier,
      });
      await writeAudit("create", created.id, email, `Invited employee ${email} to ${company.name}`);
      toast({ title: "Invitation sent", description: `${email} can join with their ${company.email_domain || "company"} email.` });
      setInvite({ email: "", department: "", office: "" });
      setShowInvite(false);
      await load();
      onChanged?.();
    } catch (err) {
      toast({ title: "Invite failed", description: err?.message || "Please try again.", variant: "destructive" });
    }
  };

  const setStatus = async (id, status) => {
    await db.entities.Employee.update(id, { status });
    const emp = items.find((e) => e.id === id);
    await writeAudit(status === "suspended" ? "suspend" : status === "removed" ? "remove" : "activate", id, emp?.user_email, `Set employee status to ${status}`);
    await load();
    onChanged?.();
  };

  const removeRow = async (id) => {
    if (!window.confirm("Remove this employee? Their subscriber ID is preserved but they lose access.")) return;
    await db.entities.Employee.delete(id);
    const emp = items.find((e) => e.id === id);
    await writeAudit("delete", id, emp?.user_email, `Removed employee ${emp?.user_email}`);
    await load();
    onChanged?.();
  };

  const resetPassword = async (emp) => {
    if (!window.confirm(`Send a password-reset link to ${emp.user_email}?`)) return;
    try {
      await db.auth.resetPasswordRequest(emp.user_email);
      toast({ title: "Reset link sent", description: `A password reset email was sent to ${emp.user_email}.` });
    } catch {
      toast({ title: "Reset failed", description: "We couldn't issue a reset link right now.", variant: "destructive" });
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows = lines
      .map((l) => l.split(",").map((c) => c.trim()))
      .filter((cells) => cells[0] && /@/.test(cells[0]));

    let added = 0;
    for (const cells of rows) {
      const email = cells[0].toLowerCase();
      const department = cells[1] || "";
      const office = cells[2] || "";
      if (items.some((i) => i.user_email === email)) continue;
      try {
        try { await db.users.inviteUser(email, "subscriber"); } catch {}
        const sid = genSubscriberId(email);
        await db.entities.Employee.create({
          user_email: email, company_id: company.id, company_name: company.name,
          department, office, status: "invited", subscriber_id: sid,
        });
        added++;
      } catch {}
    }
    toast({ title: "CSV processed", description: `${added} employee(s) invited.` });
    setCsvMode(false);
    await load();
    onChanged?.();
  };

  const exportCsv = () => {
    const header = ["subscriber_id", "name", "email", "department", "office", "country", "status", "total_savings", "redemptions_count", "last_login", "joined_date"];
    const rows = items.map((e) => [
      e.subscriber_id, e.user_name, e.user_email, e.department, e.office,
      e.country, e.status, e.total_savings || 0, e.redemptions_count || 0,
      e.last_login || "", e.joined_date || "",
    ].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `employees-${company.name.replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  const saveEdit = async () => {
    if (!edit) return;
    try {
      await db.entities.Employee.update(edit.id, {
        user_name: edit.user_name, department: edit.department, office: edit.office,
        country: edit.country, manager_name: edit.manager_name, employee_id: edit.employee_id,
      });
      await writeAudit("update", edit.id, edit.user_email, "Updated employee profile");
      setEdit(null);
      await load();
      onChanged?.();
    } catch (err) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Employees</h1>
          <p className="text-sm text-ivory-muted mt-1">{items.length} total · {items.filter((e) => e.status === "active").length} active</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowInvite(true)} className="inline-flex items-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] text-sm font-semibold px-4 py-2 rounded-lg"><UserPlus className="w-4 h-4" /> Invite</button>
          <button onClick={() => setCsvMode(true)} className="inline-flex items-center gap-2 bg-emerald-black ring-1 ring-white/10 border border-transparent hover:bg-forest-secondary/60 text-ivory text-sm font-semibold px-4 py-2 rounded-lg"><Upload className="w-4 h-4" /> CSV</button>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 bg-emerald-black ring-1 ring-white/10 border border-transparent hover:bg-forest-secondary/60 text-ivory text-sm font-semibold px-4 py-2 rounded-lg"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-dim" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, department, or NV-ID..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40 focus:ring-2 focus:ring-white/10" />
      </div>

      <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-sm text-ivory-dim">Loading employees…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-ivory-dim">No employees yet. Invite your first team member above.</div>
        ) : (
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-forest-secondary/60 text-ivory-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Member</th>
                <th className="text-left font-semibold px-4 py-3">NV-ID</th>
                <th className="text-left font-semibold px-4 py-3">Department</th>
                <th className="text-left font-semibold px-4 py-3">Office</th>
                <th className="text-left font-semibold px-4 py-3">Savings</th>
                <th className="text-left font-semibold px-4 py-3">Redemptions</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-forest-secondary/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {e.photo_url ? (
                        <img src={e.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#103F35]/60 text-[#D6B56D] ring-1 ring-[#D6B56D]/25 flex items-center justify-center text-xs font-bold">
                          {(e.user_name || e.user_email || "?").slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-ivory truncate">{e.user_name || "—"}</p>
                        <p className="text-xs text-ivory-dim truncate">{e.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-ivory-muted">{e.subscriber_id || "—"}</span></td>
                  <td className="px-4 py-3 text-ivory-muted">{e.department || "—"}</td>
                  <td className="px-4 py-3 text-ivory-muted">{e.office || "—"}</td>
                  <td className="px-4 py-3 text-ivory-muted">${(e.total_savings || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-ivory-muted">{e.redemptions_count || 0}</td>
                  <td className="px-4 py-3"><StatusPill status={e.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <RowMenu
                      onEdit={() => setEdit(e)}
                      onSuspend={e.status !== "suspended" && e.status !== "removed" ? () => setStatus(e.id, "suspended") : null}
                      onActivate={e.status === "suspended" ? () => setStatus(e.id, "active") : null}
                      onReset={() => resetPassword(e)}
                      onRemove={() => removeRow(e.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showInvite && (
        <Modal title="Invite an employee" onClose={() => setShowInvite(false)}>
          <form onSubmit={submitInvite} className="space-y-3">
            <Field label="Work email">
              <input type="email" required value={invite.email}
                onChange={(e) => setInvite((s) => ({ ...s, email: e.target.value }))}
                placeholder="ada@acme.com" className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40 focus:ring-2 focus:ring-white/10" />
            </Field>
            <Field label="Department (optional)">
              <input list="dept-options" value={invite.department}
                onChange={(e) => setInvite((s) => ({ ...s, department: e.target.value }))}
                placeholder="Engineering" className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40 focus:ring-2 focus:ring-white/10" />
              <datalist id="dept-options">{departments.map((d) => <option key={d.id} value={d.name} />)}</datalist>
            </Field>
            <Field label="Office (optional)">
              <input value={invite.office}
                onChange={(e) => setInvite((s) => ({ ...s, office: e.target.value }))}
                placeholder="Lagos HQ / Remote" className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40 focus:ring-2 focus:ring-white/10" />
            </Field>
            <p className="text-xs text-ivory-dim">They'll get a Nelvin invite and auto-join this company when they sign up with their email. A subscriber ID is auto-issued for them.</p>
            <button type="submit" className="w-full bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-semibold py-2.5 rounded-lg text-sm">Send invitation</button>
          </form>
        </Modal>
      )}

      {csvMode && (
        <Modal title="Upload employee CSV" onClose={() => setCsvMode(false)}>
          <div className="space-y-3">
            <div className="bg-[#0A3A2F] text-ivory rounded-lg p-3 text-xs flex gap-2">
              <FileSpreadsheet className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Columns: <code className="font-mono bg-[#0A3A2F] px-1 rounded">email, department, office</code> (office optional). One row per employee.</span>
            </div>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="block w-full text-sm text-ivory-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0A3A2F] file:text-[#D6B56D] file:font-semibold" />
          </div>
        </Modal>
      )}

      {edit && (
        <Modal title="Edit employee" onClose={() => setEdit(null)}>
          <div className="space-y-3">
            <Field label="Name"><input value={edit.user_name || ""} onChange={(e) => setEdit({ ...edit, user_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department"><input list="dept-options2" value={edit.department || ""} onChange={(e) => setEdit({ ...edit, department: e.target.value })} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40" /><datalist id="dept-options2">{departments.map((d) => <option key={d.id} value={d.name} />)}</datalist></Field>
              <Field label="Office"><input value={edit.office || ""} onChange={(e) => setEdit({ ...edit, office: e.target.value })} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40" /></Field>
              <Field label="Country"><input value={edit.country || ""} onChange={(e) => setEdit({ ...edit, country: e.target.value })} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40" /></Field>
              <Field label="Manager name"><input value={edit.manager_name || ""} onChange={(e) => setEdit({ ...edit, manager_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40" /></Field>
              <Field label="Employee ID (internal)"><input value={edit.employee_id || ""} onChange={(e) => setEdit({ ...edit, employee_id: e.target.value })} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40" /></Field>
            </div>
            <button onClick={saveEdit} className="w-full bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-semibold py-2.5 rounded-lg text-sm">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function RowMenu({ onEdit, onSuspend, onActivate, onReset, onRemove }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((o) => !o)} className="p-1.5 rounded hover:bg-[#0A3A2F]/5"><MoreVertical className="w-4 h-4 text-ivory-muted" /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-52 bg-[#0A3A2F] rounded-lg shadow-xl border border-white/10 py-1 text-sm">
            <button onClick={() => { setOpen(false); onEdit(); }} className="w-full text-left px-3 py-2 hover:bg-forest-secondary/60 text-ivory flex items-center gap-2"><TagIcon className="w-3.5 h-3.5" /> Edit</button>
            {onActivate && <button onClick={() => { setOpen(false); onActivate(); }} className="w-full text-left px-3 py-2 hover:bg-forest-secondary/60 text-ivory flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5" /> Activate</button>}
            {onSuspend && <button onClick={() => { setOpen(false); onSuspend(); }} className="w-full text-left px-3 py-2 hover:bg-forest-secondary/60 text-[#E5C77A] flex items-center gap-2"><Ban className="w-3.5 h-3.5" /> Suspend</button>}
            <button onClick={() => { setOpen(false); onReset(); }} className="w-full text-left px-3 py-2 hover:bg-forest-secondary/60 text-[#D6B56D] flex items-center gap-2"><Key className="w-3.5 h-3.5" /> Reset password</button>
            <button onClick={() => { setOpen(false); onRemove(); }} className="w-full text-left px-3 py-2 hover:bg-forest-secondary/60 text-rose-700 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
          </div>
        </>
      )}
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

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-[#0A3A2F] rounded-lg shadow-2xl border border-white/10 w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ivory text-lg">{title}</h3>
          <button onClick={onClose} className="text-ivory-dim hover:text-ivory">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}