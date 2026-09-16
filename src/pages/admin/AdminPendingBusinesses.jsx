import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { formatDate } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Check, X, Edit2, Eye } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminPendingBusinesses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const apps = await db.entities.VendorApplication.list("-created_date", 500).catch(() => []);
      setData(apps.filter((a) => a.status === "pending"));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (search) {
      const s = search.toLowerCase();
      return data.filter((b) => (b.business_name || "").toLowerCase().includes(s) || (b.email || "").toLowerCase().includes(s) || (b.contact_name || "").toLowerCase().includes(s));
    }
    return data;
  }, [data, search]);

  const approve = async (b) => {
    await db.entities.VendorApplication.update(b.id, { status: "approved", rejection_reason: "" });
    await load();
  };

  const reject = async (b) => {
    const reason = window.prompt("Reason for rejection (optional):", b.rejection_reason || "") || "";
    await db.entities.VendorApplication.update(b.id, { status: "rejected", rejection_reason: reason });
    await load();
  };

  const requestChanges = async (b) => {
    const notes = window.prompt("What changes does the vendor need to make?", b.requested_changes || "") || "";
    await db.entities.VendorApplication.update(b.id, { review_notes: notes, requested_changes: notes });
    await load();
  };

  const bulkUpdate = async (ids, payload) => {
    const items = ids.map((id) => ({ id, ...payload }));
    await db.entities.VendorApplication.bulkUpdate(items);
    await load();
  };

  const columns = [
    { key: "business_name", label: "Business", sortable: true,
      render: (b) => (
        <div className="flex items-center gap-2">
          {b.logo_url ? <img src={b.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 flex items-center justify-center text-xs font-bold">{(b.business_name || "?").slice(0, 1)}</div>}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ivory truncate">{b.business_name}</p>
            <p className="text-xs text-ivory-dim truncate">{b.contact_name}</p>
          </div>
        </div>
      ) },
    { key: "email", label: "Contact", render: (b) => <div className="text-xs"><div className="text-ivory">{b.email}</div><div className="text-ivory-dim">{b.phone || "—"}</div></div> },
    { key: "category", label: "Category", sortable: true, render: (b) => <span className="text-xs">{b.category || "—"}</span> },
    { key: "country", label: "Location", sortable: true, render: (b) => <span className="text-xs">{b.city ? `${b.city}, ` : ""}{b.country}</span> },
    { key: "document_type", label: "Document", render: (b) => b.document_url ? <a href={b.document_url} target="_blank" className="text-[#1B4F9C] text-xs underline">View</a> : <span className="text-xs text-ivory-dim">—</span> },
    { key: "created_date", label: "Submitted", sortable: true, render: (b) => <span className="text-xs text-ivory-muted">{formatDate(b.created_date)}</span> },
  ];

  const editFields = [
    { key: "business_name", label: "Business Name", type: "text" },
    { key: "contact_name", label: "Contact", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "business_address", label: "Address", type: "text" },
    { key: "website", label: "Website", type: "url" },
    { key: "logo_url", label: "Logo URL", type: "url" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "review_notes", label: "Internal Review Notes", type: "textarea" },
    { key: "requested_changes", label: "Request Changes (sent to vendor)", type: "textarea" },
    { key: "status", label: "Status", type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ] },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Pending Businesses</h1>
        <p className="text-sm text-ivory-muted mt-1">{filtered.length} applications awaiting approval · Approve, reject, request changes.</p>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`pending-businesses-${Date.now()}.csv`}
        onRowClick={setViewing}
        renderActions={(b) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Preview" Icon={Eye} onClick={() => setViewing(b)} />
            <RowIconBtn title="Edit before approving" Icon={Edit2} onClick={() => setEditing(b)} />
            <RowIconBtn title="Approve" Icon={Check} color="text-[#1B4F9C] hover:text-[#1B4F9C]" onClick={() => approve(b)} />
            <RowIconBtn title="Reject" Icon={X} color="text-rose-600 hover:text-rose-700" onClick={() => reject(b)} />
            <button title="Request changes" onClick={() => requestChanges(b)} className="px-2 py-1 text-xs bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 rounded hover:bg-[#F9F8F7]">Request changes</button>
          </div>
        )}
        bulkActions={[
          { label: "Approve", onClick: (ids) => bulkUpdate(ids, { status: "approved" }) },
          { label: "Reject", onClick: (ids) => {
            const reason = window.prompt("Rejection reason (optional):", "") || "";
            bulkUpdate(ids, { status: "rejected", rejection_reason: reason });
          } },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="VendorApplication"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit pending business" : "Edit business"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />

      {viewing && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-lg bg-[#FFFFFF] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ivory text-lg">{viewing.business_name}</h2>
              <button onClick={() => setViewing(null)} className="text-ivory-dim">✕</button>
            </div>
            {viewing.logo_url && <img src={viewing.logo_url} alt="" className="w-full h-32 rounded-lg object-cover mb-3" />}
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-ivory-dim">Owner</span><p>{viewing.contact_name}</p></div>
                <div><span className="text-xs text-ivory-dim">Email</span><p className="truncate">{viewing.email}</p></div>
                <div><span className="text-xs text-ivory-dim">Phone</span><p>{viewing.phone || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Category</span><p>{viewing.category}</p></div>
                <div><span className="text-xs text-ivory-dim">Country</span><p>{viewing.country}</p></div>
                <div><span className="text-xs text-ivory-dim">City</span><p>{viewing.city}</p></div>
              </div>
              {viewing.business_address && <div><span className="text-xs text-ivory-dim">Address</span><p>{viewing.business_address}</p></div>}
              {viewing.website && <div><span className="text-xs text-ivory-dim">Website</span><a href={viewing.website} target="_blank" className="text-[#1B4F9C] truncate block">{viewing.website}</a></div>}
              {viewing.description && <div><span className="text-xs text-ivory-dim">Description</span><p className="text-ivory">{viewing.description}</p></div>}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F1F1F1]">
                {viewing.document_url && <a href={viewing.document_url} target="_blank" className="text-[#1B4F9C] text-xs underline">Business document</a>}
                {viewing.id_document_url && <a href={viewing.id_document_url} target="_blank" className="text-[#1B4F9C] text-xs underline">ID document</a>}
                {viewing.selfie_url && <a href={viewing.selfie_url} target="_blank" className="text-[#1B4F9C] text-xs underline">Selfie</a>}
              </div>
              {(viewing.business_image_urls || []).length > 0 && (
                <div>
                  <span className="text-xs text-ivory-dim">Gallery</span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {viewing.business_image_urls.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-full h-20 rounded object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => approve(viewing)} className="flex-1 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-lg py-2 text-sm font-semibold">Approve</button>
              <button onClick={() => reject(viewing)} className="flex-1 bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 rounded-lg py-2 text-sm font-semibold">Reject</button>
              <button onClick={() => { setEditing(viewing); setViewing(null); }} className="px-3 py-2 border border-[#F1F1F1] rounded-lg text-sm">Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}