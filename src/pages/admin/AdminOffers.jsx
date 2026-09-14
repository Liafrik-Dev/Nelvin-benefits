import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { formatMoney, formatDate } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Star, Eye, Edit2, Trash2, ClipboardCopy, EyeOff, Archive, Send, Ban } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#0A3A2F]/5 ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminOffers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterMembership, setFilterMembership] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const offers = await db.entities.Offer.list("-created_date", 500).catch(() => []);
      // Exclude pending offers (they live on the PendingOffers page)
      setData(offers.filter((o) => o.status !== "pending"));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const categories = useMemo(() => Array.from(new Set(data.map((o) => o.category).filter(Boolean))), [data]);
  const countries = useMemo(() => Array.from(new Set(data.map((o) => o.country).filter(Boolean))), [data]);

  const filtered = useMemo(() => {
    let arr = data;
    if (filterStatus) arr = arr.filter((o) => o.status === filterStatus);
    if (filterCategory) arr = arr.filter((o) => o.category === filterCategory);
    if (filterCountry) arr = arr.filter((o) => o.country === filterCountry);
    if (filterMembership) arr = arr.filter((o) => o.membership_requirement === filterMembership);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((o) => (o.title || "").toLowerCase().includes(s) || (o.business_name || "").toLowerCase().includes(s));
    }
    return arr;
  }, [data, search, filterStatus, filterCategory, filterCountry, filterMembership]);

  const update = async (id, payload) => {
    await db.entities.Offer.update(id, payload);
    await load();
  };

  const bulkUpdate = async (ids, payload) => {
    const items = ids.map((id) => ({ id, ...payload }));
    await db.entities.Offer.bulkUpdate(items);
    await load();
  };

  const duplicate = async (o) => {
    const { id, created_date, updated_date, created_by_id, total_redemptions_count, status, ...rest } = o;
    await db.entities.Offer.create({ ...rest, title: `${rest.title} (Copy)`, status: "inactive", is_published: false, is_featured: false });
    await load();
  };

  const remove = async (o) => {
    if (!window.confirm(`Delete offer "${o.title}"? This cannot be undone.`)) return;
    await db.entities.Offer.delete(o.id);
    await load();
  };

  const columns = [
    { key: "title", label: "Offer", sortable: true,
      render: (o) => (
        <div className="flex items-center gap-2">
          {o.image_url ? <img src={o.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-[#103F35]/60 text-[#D6B56D] flex items-center justify-center text-xs font-bold">{(o.title || "?").slice(0,1)}</div>}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ivory truncate flex items-center gap-1">
              {o.title}{o.is_featured && <Star className="w-3.5 h-3.5 text-[#E5C77A] fill-[#D6B56D]" />}
            </p>
            <p className="text-xs text-ivory-dim truncate">{o.business_name}</p>
          </div>
        </div>
      ) },
    { key: "category", label: "Category", sortable: true, render: (o) => <span className="text-xs">{o.category || "—"}</span> },
    { key: "country", label: "Location", sortable: true, render: (o) => <span className="text-xs">{o.city ? `${o.city}, ` : ""}{o.country}</span> },
    { key: "discount_label", label: "Discount", render: (o) => <span className="text-xs font-semibold text-[#D6B56D]">{o.discount_label || (o.original_price ? `${o.discount_price || 0} vs ${o.original_price}` : "—")}</span> },
    { key: "max_redemptions_per_user", label: "Limit", render: (o) => <span className="text-xs">{o.max_redemptions_per_user || 1}/user{o.total_redemption_limit ? ` · ${o.total_redemptions_count || 0}/${o.total_redemption_limit}` : ""}</span> },
    { key: "membership_requirement", label: "Tier", sortable: true, render: (o) => <StatusBadge status={(o.membership_requirement || "All").toLowerCase()} label={o.membership_requirement || "All"} /> },
    { key: "status", label: "Status", sortable: true, render: (o) => <StatusBadge status={o.status} className="capitalize" /> },
  ];

  const editFields = [
    { key: "title", label: "Title", type: "text" },
    { key: "business_name", label: "Business Name", type: "text" },
    { key: "business_id", label: "Business ID (vendor reference)", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image_url", label: "Image URL", type: "url" },
    { key: "discount_label", label: "Discount Label (e.g. 30% OFF)", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "original_price", label: "Original Price", type: "number" },
    { key: "discount_price", label: "Discount Price", type: "number" },
    { key: "savings_amount", label: "Savings Amount", type: "number" },
    { key: "start_date", label: "Start Date", type: "text" },
    { key: "end_date", label: "End Date", type: "text" },
    { key: "expires_date", label: "Expires Date", type: "text" },
    { key: "tag", label: "Tag", type: "select",
      options: ["Popular", "VIP", "Cashback", "Trending", "New", "Limited Time", "Exclusive"].map((t) => ({ value: t, label: t })) },
    { key: "membership_requirement", label: "Membership Requirement", type: "select",
      options: ["All", "Free", "Silver", "Gold", "Platinum", "Enterprise"].map((t) => ({ value: t, label: t })) },
    { key: "max_redemptions_per_user", label: "Max Redemptions per User", type: "number" },
    { key: "total_redemption_limit", label: "Total Redemption Limit (optional)", type: "number" },
    { key: "status", label: "Status", type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "hidden", label: "Hidden" },
        { value: "archived", label: "Archived" },
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" },
      ] },
    { key: "is_featured", label: "Featured", type: "bool" },
    { key: "is_published", label: "Published", type: "bool" },
    { key: "is_archived", label: "Archived flag", type: "bool" },
    { key: "rejection_reason", label: "Rejection Reason", type: "textarea" },
    { key: "review_notes", label: "Review Notes", type: "textarea" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Offers</h1>
          <p className="text-sm text-ivory-muted mt-1">{filtered.length} offers · Approve, feature, publish, archive, duplicate.</p>
        </div>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`offers-${Date.now()}.csv`}
        onRowClick={setViewing}
        renderActions={(o) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Preview" Icon={Eye} onClick={() => setViewing(o)} />
            <RowIconBtn title="Edit" Icon={Edit2} onClick={() => setEditing(o)} />
            <RowIconBtn title={o.is_featured ? "Unfeature" : "Feature"} Icon={Star} color={o.is_featured ? "text-[#E5C77A]" : "text-ivory-dim"} onClick={() => update(o.id, { is_featured: !o.is_featured })} />
            <RowIconBtn title={o.is_published ? "Unpublish" : "Publish"} Icon={Send} color={o.is_published ? "text-[#D6B56D]" : "text-ivory-dim"} onClick={() => update(o.id, { is_published: !o.is_published, status: !o.is_published ? "active" : "inactive" })} />
            <RowIconBtn title={o.status === "hidden" ? "Unhide" : "Hide"} Icon={EyeOff} color={o.status === "hidden" ? "text-ivory" : "text-ivory-dim"} onClick={() => update(o.id, { status: o.status === "hidden" ? "active" : "hidden" })} />
            <RowIconBtn title={o.is_archived ? "Restore" : "Archive"} Icon={Archive} color={o.is_archived ? "text-[#D6B56D]" : "text-ivory-dim"} onClick={() => update(o.id, { is_archived: !o.is_archived, status: !o.is_archived ? "archived" : "active" })} />
            <RowIconBtn title="Duplicate" Icon={ClipboardCopy} onClick={() => duplicate(o)} />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => remove(o)} />
          </div>
        )}
        bulkActions={[
          { label: "Publish", onClick: (ids) => bulkUpdate(ids, { is_published: true, status: "active" }) },
          { label: "Unpublish", onClick: (ids) => bulkUpdate(ids, { is_published: false, status: "inactive" }) },
          { label: "Feature", onClick: (ids) => bulkUpdate(ids, { is_featured: true }) },
          { label: "Hide", onClick: (ids) => bulkUpdate(ids, { status: "hidden" }) },
          { label: "Archive", onClick: (ids) => bulkUpdate(ids, { is_archived: true, status: "archived" }) },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} offers?`)) return;
            for (const id of ids) await db.entities.Offer.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "hidden", label: "Hidden" },
              { value: "archived", label: "Archived" },
            ] },
          { key: "category", label: "Category", value: filterCategory, onChange: (e) => setFilterCategory(e.target.value),
            options: categories.map((c) => ({ value: c, label: c })) },
          { key: "country", label: "Country", value: filterCountry, onChange: (e) => setFilterCountry(e.target.value),
            options: countries.map((c) => ({ value: c, label: c })) },
          { key: "membership", label: "Membership Tier", value: filterMembership, onChange: (e) => setFilterMembership(e.target.value),
            options: ["All", "Free", "Silver", "Gold", "Platinum", "Enterprise"].map((t) => ({ value: t, label: t })) },
        ]}
      />

      <AdminEditModal
        open={!!editing}
        entityName="Offer"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Edit offer" : "New offer"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />

      {viewing && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-lg bg-[#0A3A2F] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ivory text-lg">{viewing.title}</h2>
              <button onClick={() => setViewing(null)} className="text-ivory-dim">✕</button>
            </div>
            {viewing.image_url && <img src={viewing.image_url} alt="" className="w-full h-40 rounded-lg object-cover mb-3" />}
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-ivory-dim">Business</span><p>{viewing.business_name}</p></div>
                <div><span className="text-xs text-ivory-dim">Category</span><p>{viewing.category}</p></div>
                <div><span className="text-xs text-ivory-dim">Location</span><p>{viewing.city}, {viewing.country}</p></div>
                <div><span className="text-xs text-ivory-dim">Discount</span><p className="font-semibold text-[#D6B56D]">{viewing.discount_label || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Original price</span><p>{formatMoney(viewing.original_price, "USD")}</p></div>
                <div><span className="text-xs text-ivory-dim">Discount price</span><p>{formatMoney(viewing.discount_price, "USD")}</p></div>
                <div><span className="text-xs text-ivory-dim">Expires</span><p>{formatDate(viewing.expires_date)}</p></div>
                <div><span className="text-xs text-ivory-dim">Membership tier</span><p><StatusBadge status={(viewing.membership_requirement || "All").toLowerCase()} label={viewing.membership_requirement || "All"} /></p></div>
                <div><span className="text-xs text-ivory-dim">Max / user</span><p>{viewing.max_redemptions_per_user || 1}</p></div>
                <div><span className="text-xs text-ivory-dim">Total limit</span><p>{viewing.total_redemption_limit || "Unlimited"}</p></div>
              </div>
              {viewing.description && <div><span className="text-xs text-ivory-dim">Description</span><p className="text-ivory">{viewing.description}</p></div>}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div><span className="text-xs text-ivory-dim">Status</span><p><StatusBadge status={viewing.status} className="capitalize" /></p></div>
                <div><span className="text-xs text-ivory-dim">Flags</span><p className="text-xs">{viewing.is_featured ? "Featured · " : ""}{viewing.is_published ? "Published · " : "Unpublished · "}{viewing.is_archived ? "Archived" : ""}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}