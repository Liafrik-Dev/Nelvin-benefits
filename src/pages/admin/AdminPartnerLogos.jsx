import { db } from "@/services/api/dataClient";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Edit2, Trash2, Plus, ArrowUp, ArrowDown, EyeOff } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

/**
 * Manages the logos that scroll in the "Trusted by" marquee on the public
 * homepage (TrustedBrands.jsx). That section shows Nelvin's own category
 * list until at least one active partner logo exists here — once you add
 * your first real partner and mark it active, the marquee switches over to
 * showing real logos instead.
 */
export default function AdminPartnerLogos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "display_order", dir: "asc" });
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await db.entities.PartnerLogo.list("display_order", 500).catch(() => []));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

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
    await db.entities.PartnerLogo.update(id, payload);
    await load();
  };

  const move = async (c, dir) => {
    await db.entities.PartnerLogo.update(c.id, { display_order: (c.display_order || 0) + dir });
    await load();
  };

  const toggleActive = (c) => update(c.id, { is_active: !c.is_active });
  const remove = async (c) => {
    if (!window.confirm(`Remove "${c.name}" from the partner marquee? This cannot be undone.`)) return;
    await db.entities.PartnerLogo.delete(c.id);
    await load();
  };

  const activeCount = data.filter((c) => c.is_active).length;

  const columns = [
    { key: "name", label: "Partner", sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          {c.logo_url ? (
            <img src={c.logo_url} alt="" className="h-8 w-8 rounded-lg object-contain bg-[#F9F8F7] p-1" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F4] text-xs text-ivory-muted">🏢</div>
          )}
          <p className="truncate text-sm font-medium text-ivory">{c.name}</p>
        </div>
      ) },
    { key: "website_url", label: "Website", render: (c) => c.website_url ? <a href={c.website_url} target="_blank" rel="noreferrer" className="text-xs text-[#1B4F9C] hover:underline truncate block max-w-[14rem]">{c.website_url}</a> : <span className="text-xs text-ivory-dim">—</span> },
    { key: "display_order", label: "Order", sortable: true, render: (c) => <span className="text-xs">{c.display_order || 0}</span> },
    { key: "is_active", label: "Status", sortable: true, render: (c) => <StatusBadge status={c.is_active ? "active" : "inactive"} label={c.is_active ? "On marquee" : "Hidden"} /> },
  ];

  const editFields = [
    { key: "name", label: "Partner name", type: "text" },
    { key: "logo_url", label: "Logo URL", type: "url", help: "A transparent-background PNG or SVG works best." },
    { key: "website_url", label: "Website URL", type: "url" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Show on public homepage", type: "bool" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Partner logos</h1>
          <p className="text-sm text-ivory-muted mt-1">
            {activeCount > 0
              ? `${activeCount} logo${activeCount === 1 ? "" : "s"} currently scrolling on the public homepage.`
              : "No active logos yet — the homepage marquee is showing Nelvin's own categories instead. Add and activate a partner below to switch it over."}
          </p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-full"
        >
          <Plus className="w-4 h-4" /> Add partner logo
        </button>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`partner-logos-${Date.now()}.csv`}
        renderActions={(c) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Move up" Icon={ArrowUp} onClick={() => move(c, -1)} />
            <RowIconBtn title="Move down" Icon={ArrowDown} onClick={() => move(c, 1)} />
            <RowIconBtn title={c.is_active ? "Hide from marquee" : "Show on marquee"} Icon={EyeOff} color={c.is_active ? "text-ivory-dim" : "text-[#1B4F9C]"} onClick={() => toggleActive(c)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(c)} />
            <RowIconBtn title="Remove" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => remove(c)} />
          </div>
        )}
        bulkActions={[
          { label: "Show on marquee", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: true }));
            db.entities.PartnerLogo.bulkUpdate(items).then(load);
          } },
          { label: "Hide", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: false }));
            db.entities.PartnerLogo.bulkUpdate(items).then(load);
          } },
          { label: "Remove", onClick: async (ids) => {
            if (!window.confirm(`Remove ${ids.size} partner logo(s)?`)) return;
            for (const id of ids) await db.entities.PartnerLogo.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "active", label: "On marquee" },
              { value: "inactive", label: "Hidden" },
            ] },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="PartnerLogo"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit partner logo" : "Add partner logo"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />
    </div>
  );
}
