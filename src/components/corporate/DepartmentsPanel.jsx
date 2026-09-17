import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { Plus, Boxes, MoreVertical, Pencil, Trash2 } from "lucide-react";

const PRESET = ["Marketing", "Finance", "IT", "Sales", "Operations", "Legal", "Support", "HR"];
const COLORS = ["#059669", "#4f46e5", "#dc2626", "#ea580c", "#0891b2", "#7c3aed", "#c026d3", "#16a34a"];

export default function DepartmentsPanel({ company, employees, onChanged }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", head_email: "", description: "", color: COLORS[0] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.entities.Department.filter({ company_id: company.id }, "-created_date", 200).catch(() => []);
      setItems(data);
    } finally { setLoading(false); }
  }, [company.id]);

  useEffect(() => { load(); }, [load]);

  const writeAudit = async (action, id, name, desc) => {
    try {
      await db.entities.AuditLog.create({
        admin_id: user?.id, admin_name: user?.full_name || user?.email,
        action, entity_type: "Department", entity_id: id, entity_name: name, description: desc,
      });
    } catch {}
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    try {
      const created = await db.entities.Department.create({
        name: form.name, description: form.description,
        company_id: company.id, company_name: company.name,
        head_email: form.head_email, color: form.color,
      });
      await writeAudit("create", created.id, form.name, `Created department ${form.name}`);
      toast({ title: "Department created", description: `${form.name} added.` });
      setForm({ name: "", head_email: "", description: "", color: COLORS[0] });
      setShowAdd(false);
      await load();
      onChanged?.();
    } catch (err) {
      toast({ title: "Failed", description: err?.message, variant: "destructive" });
    }
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Delete department ${name}? Employees will keep their assigned dept value.`)) return;
    await db.entities.Department.delete(id);
    await writeAudit("delete", id, name, `Deleted department ${name}`);
    await load();
    onChanged?.();
  };

  const employeesByDept = (deptName) => employees.filter((e) => e.department === deptName && e.status === "active");
  const totalSavingsByDept = (deptName) =>
    employeesByDept(deptName).reduce((s, e) => s + (e.total_savings || 0), 0);

  // Leaderboard: departments ranked by total savings
  const leaderboard = items
    .map((d) => ({ name: d.name, color: d.color, sav: totalSavingsByDept(d.name), count: employeesByDept(d.name).length }))
    .sort((a, b) => b.sav - a.sav);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Departments</h1>
          <p className="text-sm text-ivory-muted mt-1">Group your team and track per-department savings.</p>
        </div>
        <div className="flex gap-2">
          {PRESET.filter((p) => !items.some((i) => i.name === p)).slice(0, 3).map((p) => (
            <button key={p} onClick={() => { setForm((s) => ({ ...s, name: p })); setShowAdd(true); }}
              className="text-xs bg-[#F4F4F4] hover:bg-[#F4F4F4] text-ivory px-3 py-2 rounded-full">+ {p}</button>
          ))}
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white text-sm font-semibold px-4 py-2 rounded-full">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 text-center text-sm text-ivory-dim">Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-12 text-center">
          <Boxes className="w-10 h-10 text-[#282828]/60 mx-auto mb-3" />
          <p className="text-sm text-ivory-muted">No departments yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((d) => {
            const emps = employeesByDept(d.name);
            const sav = totalSavingsByDept(d.name);
            return (
              <div key={d.id} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: d.color || "#059669" }} />
                    <h3 className="font-semibold text-ivory">{d.name}</h3>
                  </div>
                  <button onClick={() => remove(d.id, d.name)} className="text-[#282828]/60 hover:text-rose-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                {d.description && <p className="text-xs text-ivory-muted mt-1">{d.description}</p>}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-[#F9F8F7] rounded-lg p-2">
                    <p className="text-ivory-dim uppercase tracking-wider">Employees</p>
                    <p className="text-sm font-bold text-ivory">{emps.length}</p>
                  </div>
                  <div className="bg-[#F9F8F7] rounded-lg p-2">
                    <p className="text-ivory-dim uppercase tracking-wider">Savings</p>
                    <p className="text-sm font-bold text-ivory">${sav.toLocaleString()}</p>
                  </div>
                </div>
                {d.head_email && <p className="text-xs text-ivory-dim mt-2">Head: {d.head_email}</p>}
              </div>
            );
          })}
        </div>
      )}

      {leaderboard.length > 0 && (
        <div className="mt-8 bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6">
          <h3 className="font-semibold text-ivory mb-3">Department Leaderboard</h3>
          <div className="space-y-2">
            {leaderboard.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F9F8F7]">
                <span className="text-xs text-ivory-dim w-5">{i + 1}</span>
                <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                <span className="text-sm text-ivory flex-1">{d.name}</span>
                <span className="text-xs text-ivory-muted">{d.count} emp · </span>
                <span className="text-sm font-bold text-[#1B4F9C]">${d.sav.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <Modal title="Add department" onClose={() => setShowAdd(false)}>
          <form onSubmit={create} className="space-y-3">
            <Field label="Department name">
              <input required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Marketing" className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40" />
            </Field>
            <Field label="Head email (optional)">
              <input type="email" value={form.head_email} onChange={(e) => setForm((s) => ({ ...s, head_email: e.target.value }))} placeholder="head@acme.com" className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40" />
            </Field>
            <Field label="Description (optional)">
              <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40" />
            </Field>
            <div>
              <label className="block text-xs font-semibold text-ivory-muted mb-1.5">Tag color</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button type="button" key={c} onClick={() => setForm((s) => ({ ...s, color: c }))} className={`w-7 h-7 rounded-full border-2 ${form.color === c ? "border-gray-900" : "border-transparent"}`} style={{ background: c }} />
                ))}
              </div>
            </div>
            <button type="submit" className="w-full bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white font-semibold py-2.5 rounded-full text-sm">Save department</button>
          </form>
        </Modal>
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
      <div className="relative bg-[#FFFFFF] rounded-lg shadow-2xl border border-[#F1F1F1] w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ivory text-lg">{title}</h3>
          <button onClick={onClose} className="text-ivory-dim hover:text-ivory">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}