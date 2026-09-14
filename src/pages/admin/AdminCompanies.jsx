import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useAuth } from "@/lib/AuthContext";
import { formatDate, formatMoney } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Check, X, Ban, Trash2, Edit2, Eye, Plus, RotateCcw } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-white/5 ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminCompanies() {
  const [data, setData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [comps, plns, usrs] = await Promise.all([
        db.entities.Company.list("-created_date", 500).catch(() => []),
        db.entities.MembershipPlan.list("-display_order", 50).catch(() => []),
        db.entities.User.list("-created_date", 500).catch(() => []),
      ]);
      setData(comps);
      setPlans(plns);
      setUsers(usrs);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const planName = (id) => plans.find((p) => p.id === id)?.name || "—";
  const employeesOf = (id) => users.filter((u) => u.company_id === id);

  const filtered = useMemo(() => {
    let arr = data;
    if (filterStatus) arr = arr.filter((c) => c.status === filterStatus);
    if (filterPlan) arr = arr.filter((c) => (c.membership_plan_id || c.membership_tier) === filterPlan);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((c) => (c.name || "").toLowerCase().includes(s) || (c.billing_contact_email || "").toLowerCase().includes(s) || (c.industry || "").toLowerCase().includes(s));
    }
    return arr;
  }, [data, search, filterStatus, filterPlan]);

  const updateMany = async (ids, payload) => {
    const items = ids.map((id) => ({ id, ...payload }));
    await db.entities.Company.bulkUpdate(items);
    await load();
  };

  const setStatus = async (id, status) => {
    await db.entities.Company.update(id, { status });
    await load();
  };

  // Activate / approve a company — flips dashboard_access=true so the HR admin gets
  // immediate dashboard access on next refresh. Idempotent: re-activating an already
  // active company is a harmless no-op (same values written again, no duplicate records).
  const activateCompany = async (c) => {
    const isLead = c.activation_type === "custom_pricing";
    const payload = {
      status: "approved",
      dashboard_access: true,
      subscription_status: "active",
      application_status: isLead ? "approved" : (c.application_status || "approved"),
    };
    if (!c.billing_start_date) payload.billing_start_date = new Date().toISOString().slice(0, 10);
    await db.entities.Company.update(c.id, payload);
    if (!isLead) {
      try {
        const pays = await db.entities.Payment.filter({ company_id: c.id, status: "pending" }, "-created_date", 10).catch(() => []);
        if (pays && pays.length > 0) await db.entities.Payment.update(pays[0].id, { status: "completed" });
      } catch { /* payment update is best-effort */ }
    }
    await load();
  };

  const rejectCompany = async (c) => {
    await db.entities.Company.update(c.id, {
      status: "rejected",
      dashboard_access: false,
      application_status: "rejected",
      subscription_status: "canceled",
    });
    await load();
  };

  const suspendCompany = async (c) => {
    await db.entities.Company.update(c.id, { status: "suspended", dashboard_access: false });
    await load();
  };

  const reactivateCompany = async (c) => {
    await db.entities.Company.update(c.id, { status: "approved", dashboard_access: true, subscription_status: "active" });
    await load();
  };

  const removeCompany = async (id) => {
    if (!window.confirm("Delete this company? Employees will lose their corporate access.")) return;
    await db.entities.Company.delete(id);
    await load();
  };

  const columns = [
    { key: "name", label: "Company", sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          {c.logo_url ? <img src={c.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">{(c.name || "?").slice(0,1)}</div>}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ivory truncate">{c.name}</p>
            <p className="text-xs text-ivory-dim truncate">{c.industry || "—"}</p>
          </div>
        </div>
      ) },
    { key: "billing_contact_email", label: "Billing contact",
      render: (c) => <div className="text-xs"><div className="text-ivory font-medium">{c.billing_contact_name || "—"}</div><div className="text-ivory-dim">{c.billing_contact_email || "—"}</div></div> },
    { key: "country", label: "Country", sortable: true,
      render: (c) => <span className="text-xs text-ivory-muted">{c.country || "—"}</span> },
    { key: "membership_tier", label: "Plan",
      render: (c) => <StatusBadge status={(planName(c.membership_plan_id) || c.membership_tier || "—").toLowerCase()} label={planName(c.membership_plan_id) || c.membership_tier || "—"} /> },
    { key: "seats_used", label: "Seats", sortable: true,
      render: (c) => (
        <span className="text-xs text-ivory font-medium">
          {c.seats_used || 0}/{c.seats_purchased || 0}
        </span>
      ) },
    { key: "activation_type", label: "Flow", sortable: true, render: (c) => (
        <span className="text-xs text-ivory-muted">
          {c.activation_type === "custom_pricing" ? "Custom (10+)" : c.activation_type === "self_serve" ? "Self-serve" : "—"}
        </span>
    ) },
    { key: "dashboard_access", label: "Access", sortable: true, render: (c) => (
        c.dashboard_access
          ? <span className="text-[10px] font-bold uppercase tracking-wide bg-[#103F35]/60 text-[#D6B56D] px-2 py-0.5 rounded-full">Active</span>
          : <span className="text-[10px] font-bold uppercase tracking-wide bg-white/5 text-ivory-muted px-2 py-0.5 rounded-full">Locked</span>
    ) },
    { key: "status", label: "Status", sortable: true, render: (c) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={c.status} />
          {c.is_corporate_lead && c.status === "pending" && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Need Call</span>
          )}
        </div>
    ) },
    { key: "created_date", label: "Created", sortable: true,
      render: (c) => <span className="text-xs text-ivory-muted">{formatDate(c.created_date)}</span> },
  ];

  const editFields = [
    { key: "name", label: "Company Name", type: "text" },
    { key: "industry", label: "Industry", type: "text" },
    { key: "billing_contact_name", label: "Billing Contact Name", type: "text" },
    { key: "billing_contact_email", label: "Billing Contact Email", type: "text" },
    { key: "billing_contact_phone", label: "Billing Phone", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "address", label: "Address", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "website", label: "Website", type: "url" },
    { key: "logo_url", label: "Logo URL (or data URL)", type: "url" },
    { key: "membership_plan_id", label: "Membership Plan", type: "select", help: "Choose the corporate plan",
      options: plans.map((p) => ({ value: p.id, label: p.name })) },
    { key: "seats_purchased", label: "Seats Purchased", type: "number" },
    { key: "billing_start_date", label: "Billing Start", type: "text" },
    { key: "billing_end_date", label: "Billing End", type: "text" },
    { key: "custom_pricing_quote_amount", label: "Custom Quote Amount", type: "number" },
    { key: "payment_link_url", label: "Payment Link URL", type: "url" },
    { key: "invoice_number", label: "Invoice Number", type: "text" },
    { key: "custom_pricing_notes", label: "Custom Pricing Notes", type: "textarea" },
    { key: "status", label: "Status", type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "suspended", label: "Suspended" },
        { value: "rejected", label: "Rejected" },
        { value: "deleted", label: "Deleted" },
      ] },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Companies</h1>
          <p className="text-sm text-ivory-muted mt-1">{filtered.length} companies · Corporate accounts with seats + billing.</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#D6B56D] hover:bg-[#E5C77A] text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> New company
        </button>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`companies-${Date.now()}.csv`}
        onRowClick={setViewing}
        renderActions={(c) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="View employees" Icon={Eye} onClick={() => setViewing(c)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(c)} />
            {!c.dashboard_access && c.status === "pending" && (
              <RowIconBtn title={c.activation_type === "custom_pricing" ? "Approve application" : "Confirm payment"} Icon={Check} color="text-[#D6B56D] hover:text-[#D6B56D]" onClick={() => activateCompany(c)} />
            )}
            {!c.dashboard_access && c.status === "pending" && (
              <RowIconBtn title="Reject" Icon={X} color="text-rose-600 hover:text-rose-700" onClick={() => rejectCompany(c)} />
            )}
            {c.dashboard_access && c.status !== "suspended" && (
              <RowIconBtn title="Suspend" Icon={Ban} color="text-amber-600 hover:text-amber-700" onClick={() => suspendCompany(c)} />
            )}
            {c.status === "suspended" && (
              <RowIconBtn title="Reactivate" Icon={RotateCcw} color="text-[#D6B56D] hover:text-[#D6B56D]" onClick={() => reactivateCompany(c)} />
            )}
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => removeCompany(c.id)} />
          </div>
        )}
        bulkActions={[
          { label: "Approve & Activate", onClick: (ids) => updateMany(ids, { status: "approved", dashboard_access: true, subscription_status: "active" }) },
          { label: "Suspend", onClick: (ids) => updateMany(ids, { status: "suspended", dashboard_access: false }) },
          { label: "Reject", onClick: (ids) => updateMany(ids, { status: "rejected", dashboard_access: false, application_status: "rejected" }) },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} companies?`)) return;
            for (const id of ids) await db.entities.Company.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "suspended", label: "Suspended" },
              { value: "rejected", label: "Rejected" },
            ] },
          { key: "plan", label: "Plan", value: filterPlan, onChange: (e) => setFilterPlan(e.target.value),
            options: plans.map((p) => ({ value: p.id, label: p.name })) },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="Company"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit company" : "New company"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />

      {/* Company viewers / employees drawer */}
      {viewing && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ivory text-lg">{viewing.name}</h2>
              <button onClick={() => setViewing(null)} className="text-ivory-dim"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-xs text-ivory-dim">Industry</span><p>{viewing.industry || "—"}</p></div>
              <div><span className="text-xs text-ivory-dim">Billing Contact</span><p>{viewing.billing_contact_name || "—"}</p><p className="text-xs text-ivory-muted">{viewing.billing_contact_email}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-ivory-dim">Country</span><p>{viewing.country || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Plan</span><p>{planName(viewing.membership_plan_id) || viewing.membership_tier || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Seats Used</span><p>{viewing.seats_used || 0}/{viewing.seats_purchased || 0}</p></div>
                <div><span className="text-xs text-ivory-dim">Status</span><p><StatusBadge status={viewing.status} /></p></div>
              </div>
              <div>
                <span className="text-xs text-ivory-dim">Employees ({employeesOf(viewing.id).length})</span>
                {employeesOf(viewing.id).length === 0 ? (
                  <p className="text-ivory-dim text-xs mt-2">No employees linked.</p>
                ) : (
                  <ul className="divide-y divide-white/10 mt-2">
                    {employeesOf(viewing.id).map((e) => (
                      <li key={e.id} className="py-2">
                        <p className="font-medium text-ivory text-sm">{e.full_name || "—"}</p>
                        <p className="text-xs text-ivory-dim">{e.email}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}