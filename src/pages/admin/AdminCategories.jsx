import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Edit2, Trash2, Plus, ArrowUp, ArrowDown, EyeOff, Star } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-white/5 ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminCategories() {
  const [data, setData] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "display_order", dir: "asc" });
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, ofrs] = await Promise.all([
        db.entities.Category.list("-created_date", 500).catch(() => []),
        db.entities.Offer.list("-created_date", 500).catch(() => []),
      ]);
      setData(cats);
      setOffers(ofrs);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const offerCount = (cat) => offers.filter((o) => o.category === cat.name).length;

  const filtered = useMemo(() => {
    let arr = data;
    if (filterStatus) arr = arr.filter((c) => (c.is_active ? "active" : "inactive") === filterStatus);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((c) => (c.name || "").toLowerCase().includes(s));
    }
    return arr;
  }, [data, search, filterStatus]);

  const update = async (id, payload) => {
    await db.entities.Category.update(id, payload);
    await load();
  };

  const move = async (c, dir) => {
    const next = (c.display_order || 0) + dir;
    await db.entities.Category.update(c.id, { display_order: next });
    await load();
  };

  const toggleFeatured = (c) => update(c.id, { is_featured: !c.is_featured });
  const toggleActive = (c) => update(c.id, { is_active: !c.is_active, is_enabled: !c.is_active, is_hidden: c.is_active });
  const remove = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"? This cannot be undone.`)) return;
    await db.entities.Category.delete(c.id);
    await load();
  };

  const columns = [
    { key: "name", label: "Category", sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          {c.image_url ? <img src={c.image_url} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-white/5 text-ivory-muted flex items-center justify-center text-xs">{c.icon || "📁"}</div>}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ivory truncate flex items-center gap-1">{c.name}{c.is_featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}</p>
            <p className="text-xs text-ivory-dim truncate">{c.slug}</p>
          </div>
        </div>
      ) },
    { key: "description", label: "Description", render: (c) => <span className="text-xs text-ivory-muted line-clamp-2 max-w-xs">{c.description || "—"}</span> },
    { key: "offerCount", label: "Offers", render: (c) => <span className="text-xs font-medium text-ivory">{offerCount(c)}</span> },
    { key: "display_order", label: "Order", sortable: true, render: (c) => <span className="text-xs">{c.display_order || 0}</span> },
    { key: "is_active", label: "Status", sortable: true, render: (c) => <StatusBadge status={c.is_active ? "active" : "inactive"} label={c.is_active ? "Active" : "Inactive"} /> },
  ];

  const editFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "slug", label: "Slug", type: "text", help: "URL-friendly identifier" },
    { key: "icon", label: "Icon (emoji)", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image_url", label: "Image URL (unique per category)", type: "url", help: "Each category must have a unique image." },
    { key: "accent_color", label: "Accent Color (hex)", type: "text" },
    { key: "display_order", label: "Display Order", type: "number" },
    { key: "is_active", label: "Active", type: "bool" },
    { key: "is_enabled", label: "Enabled", type: "bool" },
    { key: "is_hidden", label: "Hidden", type: "bool" },
    { key: "is_featured", label: "Featured", type: "bool" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Categories</h1>
          <p className="text-sm text-ivory-muted mt-1">{filtered.length} categories · Each must have a unique image.</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#D6B56D] hover:bg-[#E5C77A] text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> New category
        </button>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`categories-${Date.now()}.csv`}
        renderActions={(c) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Move up" Icon={ArrowUp} onClick={() => move(c, -1)} />
            <RowIconBtn title="Move down" Icon={ArrowDown} onClick={() => move(c, 1)} />
            <RowIconBtn title={c.is_featured ? "Unfeature" : "Feature"} Icon={Star} color={c.is_featured ? "text-amber-500" : "text-ivory-dim"} onClick={() => toggleFeatured(c)} />
            <RowIconBtn title={c.is_active ? "Hide category" : "Show category"} Icon={EyeOff} color={c.is_active ? "text-ivory-dim" : "text-[#D6B56D]"} onClick={() => toggleActive(c)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(c)} />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => remove(c)} />
          </div>
        )}
        bulkActions={[
          { label: "Activate", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: true, is_enabled: true, is_hidden: false }));
            db.entities.Category.bulkUpdate(items).then(load);
          } },
          { label: "Disable", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: false, is_enabled: false }));
            db.entities.Category.bulkUpdate(items).then(load);
          } },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} categories?`)) return;
            for (const id of ids) await db.entities.Category.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ] },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="Category"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit category" : "New category"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />
    </div>
  );
}