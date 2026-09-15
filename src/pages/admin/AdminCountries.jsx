import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Edit2, Trash2, Plus, Star, Power } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminCountries() {
  const [data, setData] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [filterRegion, setFilterRegion] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cnts, ofrs] = await Promise.all([
        db.entities.Country.list("-created_date", 500).catch(() => []),
        db.entities.Offer.list("-created_date", 500).catch(() => []),
      ]);
      setData(cnts);
      setOffers(ofrs);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const offerCount = (country) => offers.filter((o) => o.country === country.name).length;

  const filtered = useMemo(() => {
    let arr = data;
    if (filterRegion) arr = arr.filter((c) => (c.is_african ? "africa" : "world") === filterRegion);
    if (filterStatus) arr = arr.filter((c) => (c.is_active ? "active" : "inactive") === filterStatus);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((c) => (c.name || "").toLowerCase().includes(s) || (c.country_code || "").toLowerCase().includes(s));
    }
    return arr;
  }, [data, search, filterRegion, filterStatus]);

  const update = async (id, payload) => {
    await db.entities.Country.update(id, payload);
    await load();
  };

  const toggleActive = (c) => update(c.id, { is_active: !c.is_active });
  const toggleFeatured = (c) => update(c.id, { is_featured: !c.is_featured });
  const remove = async (c) => {
    if (!window.confirm(`Delete country "${c.name}"?`)) return;
    await db.entities.Country.delete(c.id);
    await load();
  };

  const columns = [
    { key: "name", label: "Country", sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          <span className="text-xl w-8 h-8 flex items-center justify-center">{c.flag || "🏳️"}</span>
          <div>
            <p className="text-sm font-medium text-ivory truncate flex items-center gap-1">{c.name}{c.is_featured && <Star className="w-3 h-3 text-[#0866FF] fill-[#0866FF]" />}</p>
            <p className="text-xs text-ivory-dim truncate">{c.country_code || "—"}</p>
          </div>
        </div>
      ) },
    { key: "currency", label: "Currency", sortable: true, render: (c) => <span className="text-xs">{c.currency || "—"}</span> },
    { key: "is_african", label: "Region", sortable: true, render: (c) => <StatusBadge status={c.is_african ? "active" : "individual"} label={c.is_african ? "Africa" : "World"} /> },
    { key: "offerCount", label: "Offers", render: (c) => <span className="text-xs font-medium text-ivory">{offerCount(c)}</span> },
    { key: "is_active", label: "Status", sortable: true, render: (c) => <StatusBadge status={c.is_active ? "active" : "inactive"} label={c.is_active ? "Active" : "Inactive"} /> },
  ];

  const editFields = [
    { key: "name", label: "Country Name", type: "text" },
    { key: "slug", label: "Slug", type: "text" },
    { key: "flag", label: "Flag (emoji)", type: "text" },
    { key: "currency", label: "Currency", type: "text" },
    { key: "country_code", label: "Country Code (ISO alpha-2)", type: "text" },
    { key: "is_african", label: "African Country", type: "bool" },
    { key: "is_active", label: "Active", type: "bool" },
    { key: "is_featured", label: "Featured", type: "bool" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Countries</h1>
          <p className="text-sm text-ivory-muted mt-1">{filtered.length} countries · All 54 African countries plus major world countries.</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#0866FF] hover:bg-[#0866FF] text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> New country
        </button>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`countries-${Date.now()}.csv`}
        renderActions={(c) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title={c.is_active ? "Disable" : "Enable"} Icon={Power} color={c.is_active ? "text-[#0866FF]" : "text-ivory-dim"} onClick={() => toggleActive(c)} />
            <RowIconBtn title={c.is_featured ? "Unfeature" : "Feature"} Icon={Star} color={c.is_featured ? "text-[#0866FF]" : "text-ivory-dim"} onClick={() => toggleFeatured(c)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(c)} />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => remove(c)} />
          </div>
        )}
        bulkActions={[
          { label: "Enable", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: true }));
            db.entities.Country.bulkUpdate(items).then(load);
          } },
          { label: "Disable", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, is_active: false }));
            db.entities.Country.bulkUpdate(items).then(load);
          } },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} countries?`)) return;
            for (const id of ids) await db.entities.Country.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "region", label: "Region", value: filterRegion, onChange: (e) => setFilterRegion(e.target.value),
            options: [
              { value: "africa", label: "Africa" },
              { value: "world", label: "World" },
            ] },
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ] },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="Country"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit country" : "New country"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />
    </div>
  );
}