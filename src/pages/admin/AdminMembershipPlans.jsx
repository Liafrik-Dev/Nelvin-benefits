import { db } from "@/services/api/dataClient";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { formatMoney } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Edit2, Trash2, Plus, Power } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminMembershipPlans() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "display_order", dir: "asc" });
  const [filterType, setFilterType] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const plans = await db.entities.MembershipPlan.list("-created_date", 50).catch(() => []);
      setData(plans);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let arr = data;
    if (filterType) arr = arr.filter((p) => (p.is_corporate ? "corporate" : "individual") === filterType);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((p) => (p.name || "").toLowerCase().includes(s));
    }
    return arr;
  }, [data, search, filterType]);

  const update = async (id, payload) => {
    await db.entities.MembershipPlan.update(id, payload);
    await load();
  };

  const toggleActive = (p) => update(p.id, { is_active: !p.is_active });

  const remove = async (p) => {
    if (!window.confirm(`Delete plan "${p.name}"? Active members on this tier will lose their plan assignment.`)) return;
    await db.entities.MembershipPlan.delete(p.id);
    await load();
  };

  const columns = [
    { key: "name", label: "Plan", sortable: true,
      render: (p) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F4F4F4] text-[#1B4F9C] flex items-center justify-center text-sm font-bold">{(p.name || "?").slice(0, 1)}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ivory truncate">{p.name}</p>
            <p className="text-xs text-ivory-dim truncate">{p.tier || "—"}</p>
          </div>
        </div>
      ) },
    { key: "price_monthly", label: "Monthly", sortable: true, render: (p) => <span className="text-xs font-medium">{formatMoney(p.price_monthly, p.currency)}</span> },
    { key: "price_yearly", label: "Yearly", sortable: true, render: (p) => <span className="text-xs font-medium">{formatMoney(p.price_yearly, p.currency)}</span> },
    { key: "is_corporate", label: "Type", sortable: true, render: (p) => <StatusBadge status={p.is_corporate ? "corporate" : "individual"} label={p.is_corporate ? "Corporate" : "Individual"} /> },
    { key: "seats_included", label: "Seats", render: (p) => <span className="text-xs">{p.seats_included || (p.is_corporate ? "Custom" : "1")}</span> },
    { key: "display_order", label: "Order", sortable: true, render: (p) => <span className="text-xs">{p.display_order || 0}</span> },
    { key: "is_active", label: "Status", sortable: true, render: (p) => <StatusBadge status={p.is_active ? "active" : "inactive"} label={p.is_active ? "Active" : "Inactive"} /> },
  ];

  const editFields = [
    { key: "name", label: "Plan Name", type: "select",
      options: ["Free", "Silver", "Gold", "Platinum", "Enterprise"].map((n) => ({ value: n, label: n })) },
    { key: "tier", label: "Tier Slug", type: "text", help: "e.g., free, silver, gold, platinum, enterprise" },
    { key: "price_monthly", label: "Monthly Price", type: "number" },
    { key: "price_yearly", label: "Yearly Price", type: "number" },
    { key: "currency", label: "Currency", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "benefits", label: "Benefits (comma or newline separated)", type: "textarea" },
    { key: "features", label: "Features", type: "textarea" },
    { key: "max_redemptions_per_day", label: "Max Redemptions / Day", type: "number" },
    { key: "is_corporate", label: "Corporate Plan", type: "bool" },
    { key: "seats_included", label: "Seats Included", type: "number" },
    { key: "is_active", label: "Active", type: "bool" },
    { key: "display_order", label: "Display Order", type: "number" },
    { key: "color", label: "Accent Color (hex)", type: "text" },
    { key: "icon", label: "Icon (emoji)", type: "text" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Membership Plans</h1>
          <p className="text-sm text-ivory-muted mt-1">{filtered.length} plans · Free, Silver, Gold, Platinum, Enterprise.</p>
        </div>
        <button
          onClick={() => setEditing({ currency: "USD", is_active: true, display_order: data.length })}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-full"
        >
          <Plus className="w-4 h-4" /> New plan
        </button>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`membership-plans-${Date.now()}.csv`}
        renderActions={(p) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title={p.is_active ? "Deactivate" : "Activate"} Icon={Power} color={p.is_active ? "text-[#1B4F9C]" : "text-ivory-dim"} onClick={() => toggleActive(p)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(p)} />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => remove(p)} />
          </div>
        )}
        bulkActions={[
          { label: "Activate", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: true }));
            db.entities.MembershipPlan.bulkUpdate(items).then(load);
          } },
          { label: "Deactivate", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: false }));
            db.entities.MembershipPlan.bulkUpdate(items).then(load);
          } },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} plans?`)) return;
            for (const id of ids) await db.entities.MembershipPlan.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "type", label: "Type", value: filterType, onChange: (e) => setFilterType(e.target.value),
            options: [
              { value: "individual", label: "Individual" },
              { value: "corporate", label: "Corporate" },
            ] },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="MembershipPlan"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit plan" : "New plan"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />
    </div>
  );
}