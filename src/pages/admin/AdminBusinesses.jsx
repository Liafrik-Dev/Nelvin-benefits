import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { formatDate } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Star, BadgeCheck, Ban, Trash2, Edit2, Eye, Plus, RotateCcw, ClipboardCopy } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminBusinesses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterVerification, setFilterVerification] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const apps = await db.entities.VendorApplication.list("-created_date", 500).catch(() => []);
      setData(apps.filter((a) => a.status === "approved"));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let arr = data;
    if (filterVerification) arr = arr.filter((b) => b.verification_status === filterVerification);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((b) => (b.business_name || "").toLowerCase().includes(s) || (b.contact_name || "").toLowerCase().includes(s) || (b.email || "").toLowerCase().includes(s));
    }
    return arr;
  }, [data, search, filterVerification]);

  const updateMany = async (ids, payload) => {
    const items = ids.map((id) => ({ id, ...payload }));
    await db.entities.VendorApplication.bulkUpdate(items);
    await load();
  };

  const toggleFeatured = async (b) => {
    await db.entities.VendorApplication.update(b.id, { is_featured: !b.is_featured });
    await load();
  };

  const toggleVerified = async (b) => {
    await db.entities.VendorApplication.update(b.id, {
      verification_status: b.verification_status === "verified" ? "unverified" : "verified",
    });
    await load();
  };

  const toggleSuspended = async (b) => {
    await db.entities.VendorApplication.update(b.id, { is_suspended: !b.is_suspended });
    await load();
  };

  const duplicate = async (b) => {
    const { id, created_date, updated_date, created_by_id, ...rest } = b;
    await db.entities.VendorApplication.create({ ...rest, business_name: `${rest.business_name} (Copy)`, status: "pending" });
    await load();
  };

  const removeBusiness = async (b) => {
    if (!window.confirm(`Delete business "${b.business_name}"? This cannot be undone.`)) return;
    await db.entities.VendorApplication.delete(b.id);
    await load();
  };

  const columns = [
    { key: "business_name", label: "Business", sortable: true,
      render: (b) => (
        <div className="flex items-center gap-2">
          {b.logo_url ? <img src={b.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 flex items-center justify-center text-xs font-bold">{(b.business_name || "?").slice(0, 1)}</div>}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ivory truncate flex items-center gap-1">
              {b.business_name}{b.is_featured && <Star className="w-3.5 h-3.5 text-[#1B4F9C] fill-[#1B4F9C]" />}
            </p>
            <p className="text-xs text-ivory-dim truncate">{b.contact_name}</p>
          </div>
        </div>
      ) },
    { key: "email", label: "Contact", render: (b) => <div className="text-xs"><div className="text-ivory">{b.email}</div><div className="text-ivory-dim">{b.phone || "—"}</div></div> },
    { key: "category", label: "Category", sortable: true, render: (b) => <span className="text-xs">{b.category || "—"}</span> },
    { key: "country", label: "Location", sortable: true, render: (b) => <span className="text-xs">{b.city ? `${b.city}, ` : ""}{b.country}</span> },
    { key: "verification_status", label: "Verified", sortable: true, render: (b) => <StatusBadge status={b.verification_status} className="capitalize" /> },
    { key: "is_suspended", label: "Suspended", render: (b) => (b.is_suspended ? <StatusBadge status="suspended" /> : <StatusBadge status="active" label="Live" />) },
  ];

  const editFields = [
    { key: "business_name", label: "Business Name", type: "text" },
    { key: "contact_name", label: "Owner / Contact", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "business_address", label: "Address", type: "text" },
    { key: "website", label: "Website", type: "url" },
    { key: "logo_url", label: "Logo URL", type: "url" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "membership_type", label: "Membership Tier", type: "select",
      options: [
        { value: "Free", label: "Free" },
        { value: "Silver", label: "Silver" },
        { value: "Gold", label: "Gold" },
        { value: "Platinum", label: "Platinum" },
      ] },
    { key: "status", label: "Status", type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ] },
    { key: "verification_status", label: "Verification Status", type: "select",
      options: [
        { value: "unverified", label: "Unverified" },
        { value: "verified", label: "Verified" },
        { value: "rejected", label: "Rejected" },
      ] },
    { key: "is_featured", label: "Featured", type: "bool" },
    { key: "is_suspended", label: "Suspended", type: "bool" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Businesses</h1>
          <p className="text-sm text-ivory-muted mt-1">{filtered.length} approved vendors · Verify, feature, suspend, duplicate.</p>
        </div>
        <button
          onClick={() => setEditing({ status: "pending" })}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-full"
        >
          <Plus className="w-4 h-4" /> New business
        </button>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`businesses-${Date.now()}.csv`}
        onRowClick={setViewing}
        renderActions={(b) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Preview" Icon={Eye} onClick={() => setViewing(b)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(b)} />
            <RowIconBtn title={b.is_featured ? "Unfeature" : "Feature"} Icon={Star} color={b.is_featured ? "text-[#1B4F9C] hover:text-[#1B4F9C]" : "text-ivory-dim"} onClick={() => toggleFeatured(b)} />
            <RowIconBtn title={b.verification_status === "verified" ? "Revoke verification" : "Verify"} Icon={BadgeCheck} color={b.verification_status === "verified" ? "text-[#1B4F9C]" : "text-ivory-dim"} onClick={() => toggleVerified(b)} />
            <RowIconBtn title={b.is_suspended ? "Unsuspend" : "Suspend"} Icon={Ban} color={b.is_suspended ? "text-[#1B4F9C]" : "text-[#1B4F9C]"} onClick={() => toggleSuspended(b)} />
            <RowIconBtn title="Duplicate" Icon={ClipboardCopy} onClick={() => duplicate(b)} />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => removeBusiness(b)} />
          </div>
        )}
        bulkActions={[
          { label: "Verify", onClick: (ids) => updateMany(ids, { verification_status: "verified" }) },
          { label: "Unverify", onClick: (ids) => updateMany(ids, { verification_status: "unverified" }) },
          { label: "Suspend", onClick: (ids) => updateMany(ids, { is_suspended: true }) },
          { label: "Activate", onClick: (ids) => updateMany(ids, { is_suspended: false }) },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} businesses?`)) return;
            for (const id of ids) await db.entities.VendorApplication.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "verification", label: "Verification", value: filterVerification, onChange: (e) => setFilterVerification(e.target.value),
            options: [
              { value: "unverified", label: "Unverified" },
              { value: "verified", label: "Verified" },
              { value: "rejected", label: "Rejected" },
            ] },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="VendorApplication"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit business" : "New business"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />

      {viewing && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-md bg-[#FFFFFF] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ivory text-lg">{viewing.business_name}</h2>
              <button onClick={() => setViewing(null)} className="text-ivory-dim">✕</button>
            </div>
            {viewing.logo_url && <img src={viewing.logo_url} alt="" className="w-full h-32 rounded-lg object-cover mb-3" />}
            <div className="space-y-2 text-sm">
              <div><span className="text-xs text-ivory-dim">Owner</span><p>{viewing.contact_name}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-ivory-dim">Email</span><p className="truncate">{viewing.email}</p></div>
                <div><span className="text-xs text-ivory-dim">Phone</span><p>{viewing.phone || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Location</span><p>{viewing.city}, {viewing.country}</p></div>
                <div><span className="text-xs text-ivory-dim">Category</span><p>{viewing.category}</p></div>
              </div>
              {viewing.description && <div><span className="text-xs text-ivory-dim">Description</span><p className="text-ivory">{viewing.description}</p></div>}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F1F1] mt-2">
                <div><span className="text-xs text-ivory-dim">Status</span><p><StatusBadge status={viewing.status} /></p></div>
                <div><span className="text-xs text-ivory-dim">Verified</span><p><StatusBadge status={viewing.verification_status} className="capitalize" /></p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}