import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { formatDate } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Check, X, Edit2, Eye } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-gray-600 hover:text-gray-900" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-gray-100 ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminPendingOffers() {
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
      const offers = await db.entities.Offer.list("-created_date", 500).catch(() => []);
      setData(offers.filter((o) => o.status === "pending"));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (search) {
      const s = search.toLowerCase();
      return data.filter((o) => (o.title || "").toLowerCase().includes(s) || (o.business_name || "").toLowerCase().includes(s));
    }
    return data;
  }, [data, search]);

  const approve = async (o) => {
    await db.entities.Offer.update(o.id, { status: "active", is_published: true, rejection_reason: "" });
    await load();
  };

  const reject = async (o) => {
    const reason = window.prompt("Reason for rejection (optional):", o.rejection_reason || "") || "";
    await db.entities.Offer.update(o.id, { status: "rejected", rejection_reason: reason, is_published: false });
    await load();
  };

  const requestChanges = async (o) => {
    const notes = window.prompt("What changes does the business need to make?", o.review_notes || "") || "";
    await db.entities.Offer.update(o.id, { review_notes: notes });
    await load();
  };

  const bulkUpdate = async (ids, payload) => {
    const items = ids.map((id) => ({ id, ...payload }));
    await db.entities.Offer.bulkUpdate(items);
    await load();
  };

  const columns = [
    { key: "title", label: "Offer", sortable: true,
      render: (o) => (
        <div className="flex items-center gap-2">
          {o.image_url ? <img src={o.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">{(o.title || "?").slice(0,1)}</div>}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{o.title}</p>
            <p className="text-xs text-gray-400 truncate">{o.business_name}</p>
          </div>
        </div>
      ) },
    { key: "category", label: "Category", sortable: true, render: (o) => <span className="text-xs">{o.category || "—"}</span> },
    { key: "country", label: "Location", sortable: true, render: (o) => <span className="text-xs">{o.city ? `${o.city}, ` : ""}{o.country}</span> },
    { key: "discount_label", label: "Discount", render: (o) => <span className="text-xs font-semibold text-emerald-700">{o.discount_label || "—"}</span> },
    { key: "membership_requirement", label: "Tier", render: (o) => <StatusBadge status={(o.membership_requirement || "All").toLowerCase()} label={o.membership_requirement || "All"} /> },
    { key: "created_date", label: "Submitted", sortable: true, render: (o) => <span className="text-xs text-gray-500">{formatDate(o.created_date)}</span> },
  ];

  const editFields = [
    { key: "title", label: "Title", type: "text" },
    { key: "business_name", label: "Business Name", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image_url", label: "Image URL", type: "url" },
    { key: "discount_label", label: "Discount Label", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "original_price", label: "Original Price", type: "number" },
    { key: "discount_price", label: "Discount Price", type: "number" },
    { key: "savings_amount", label: "Savings Amount", type: "number" },
    { key: "expires_date", label: "Expires Date", type: "text" },
    { key: "membership_requirement", label: "Membership Requirement", type: "select",
      options: ["All", "Free", "Silver", "Gold", "Platinum", "Enterprise"].map((t) => ({ value: t, label: t })) },
    { key: "max_redemptions_per_user", label: "Max Redemptions per User", type: "number" },
    { key: "total_redemption_limit", label: "Total Redemption Limit (optional)", type: "number" },
    { key: "review_notes", label: "Internal Review Notes", type: "textarea" },
    { key: "rejection_reason", label: "Rejection Reason", type: "textarea" },
    { key: "status", label: "Status", type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "active", label: "Active (Publish)" },
        { value: "rejected", label: "Rejected" },
      ] },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Pending Offers</h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} offers awaiting approval · Approve, reject or request changes.</p>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`pending-offers-${Date.now()}.csv`}
        onRowClick={setViewing}
        renderActions={(o) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Preview" Icon={Eye} onClick={() => setViewing(o)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(o)} />
            <RowIconBtn title="Approve & publish" Icon={Check} color="text-emerald-600 hover:text-emerald-700" onClick={() => approve(o)} />
            <RowIconBtn title="Reject" Icon={X} color="text-rose-600 hover:text-rose-700" onClick={() => reject(o)} />
            <button title="Request changes" onClick={() => requestChanges(o)} className="px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded hover:bg-amber-100">Request changes</button>
          </div>
        )}
        bulkActions={[
          { label: "Approve & Publish", onClick: (ids) => bulkUpdate(ids, { status: "active", is_published: true }) },
          { label: "Reject", onClick: (ids) => {
            const reason = window.prompt("Rejection reason (optional):", "") || "";
            bulkUpdate(ids, { status: "rejected", is_published: false, rejection_reason: reason });
          } },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="Offer"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit pending offer" : "Edit offer"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />

      {viewing && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">{viewing.title}</h2>
              <button onClick={() => setViewing(null)} className="text-gray-400">✕</button>
            </div>
            {viewing.image_url && <img src={viewing.image_url} alt="" className="w-full h-40 rounded-lg object-cover mb-3" />}
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-400">Business</span><p>{viewing.business_name}</p></div>
                <div><span className="text-xs text-gray-400">Category</span><p>{viewing.category}</p></div>
                <div><span className="text-xs text-gray-400">Location</span><p>{viewing.city}, {viewing.country}</p></div>
                <div><span className="text-xs text-gray-400">Discount</span><p className="font-semibold text-emerald-700">{viewing.discount_label || "—"}</p></div>
                <div><span className="text-xs text-gray-400">Max / user</span><p>{viewing.max_redemptions_per_user || 1}</p></div>
                <div><span className="text-xs text-gray-400">Total limit</span><p>{viewing.total_redemption_limit || "Unlimited"}</p></div>
              </div>
              {viewing.description && <div><span className="text-xs text-gray-400">Description</span><p className="text-gray-700">{viewing.description}</p></div>}
              {viewing.review_notes && <div><span className="text-xs text-gray-400">Review Notes</span><p className="text-amber-700">{viewing.review_notes}</p></div>}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => approve(viewing)} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg py-2 text-sm font-semibold">Approve & publish</button>
              <button onClick={() => reject(viewing)} className="flex-1 bg-rose-50 text-rose-700 rounded-lg py-2 text-sm font-semibold">Reject</button>
              <button onClick={() => { setEditing(viewing); setViewing(null); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}