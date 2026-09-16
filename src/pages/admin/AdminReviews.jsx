import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";

import { formatDate } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Check, X, Reply, EyeOff, Star, Flag, Trash2 } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminReviews() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selected, setSelected] = useState(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await db.entities.Review.list("-created_date", 500).catch(() => []));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const update = async (id, payload) => {
    await db.entities.Review.update(id, payload);
    await load();
  };

  const setStatus = (r, status) => update(r.id, { status, is_approved: status === "approved", is_hidden: status === "hidden", is_featured: status === "featured" });
  const feature = (r) => update(r.id, { is_featured: !r.is_featured, status: !r.is_featured ? "featured" : (r.is_approved ? "approved" : "pending") });
  const report = (r) => update(r.id, { reported: !r.reported });
  const remove = async (r) => {
    if (!window.confirm("Delete this review?")) return;
    await db.entities.Review.delete(r.id);
    await load();
  };
  const reply = async (r) => {
    const text = window.prompt("Admin reply:", r.admin_reply || "") || "";
    if (!text) return;
    await db.entities.Review.update(r.id, { admin_reply: text });
    await load();
  };

  const filtered = data.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterType && r.target_type !== filterType) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(r.user_name || "").toLowerCase().includes(s) && !(r.title || "").toLowerCase().includes(s) && !(r.body || "").toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const columns = [
    { key: "rating", label: "Rating", sortable: true, render: (r) => <span className="text-xs font-semibold text-[#1B4F9C]">★ {r.rating}</span> },
    { key: "user_name", label: "Author", sortable: true, render: (r) => <div><p className="text-sm font-medium text-ivory">{r.user_name || "—"}</p><p className="text-xs text-ivory-dim">{r.user_email}</p></div> },
    { key: "target_type", label: "For", render: (r) => <StatusBadge status={r.target_type === "business" ? "business" : "active"} label={r.target_type === "business" ? "Business" : "Offer"} /> },
    { key: "target_name", label: "Target", render: (r) => <span className="text-xs">{r.target_name || "—"}</span> },
    { key: "title", label: "Review", render: (r) => <div className="max-w-xs"><p className="text-sm font-medium text-ivory truncate">{r.title}</p><p className="text-xs text-ivory-dim line-clamp-1">{r.body}</p></div> },
    { key: "created_date", label: "Date", sortable: true, render: (r) => <span className="text-xs text-ivory-muted">{formatDate(r.created_date)}</span> },
    { key: "status", label: "Status", sortable: true, render: (r) => <StatusBadge status={r.status} className="capitalize" /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Reviews</h1>
        <p className="text-sm text-ivory-muted mt-1">{filtered.length} reviews · Approve, reject, hide, feature or reply.</p>
      </div>
      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`reviews-${Date.now()}.csv`}
        renderActions={(r) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Approve" Icon={Check} color="text-[#1B4F9C] hover:text-[#1B4F9C]" onClick={() => setStatus(r, "approved")} />
            <RowIconBtn title="Reject" Icon={X} color="text-rose-600 hover:text-rose-700" onClick={() => setStatus(r, "rejected")} />
            <RowIconBtn title="Hide" Icon={EyeOff} color="text-ivory-muted" onClick={() => setStatus(r, "hidden")} />
            <RowIconBtn title={r.is_featured ? "Unfeature" : "Feature"} Icon={Star} color={r.is_featured ? "text-[#1B4F9C]" : "text-ivory-dim"} onClick={() => feature(r)} />
            <RowIconBtn title="Reply" Icon={Reply} color="text-[#1B4F9C]" onClick={() => reply(r)} />
            <RowIconBtn title="Report" Icon={Flag} color="text-[#1B4F9C]" onClick={() => report(r)} />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => remove(r)} />
          </div>
        )}
        bulkActions={[
          { label: "Approve", onClick: (ids) => {
            db.entities.Review.bulkUpdate(Array.from(ids).map((id) => ({ id, status: "approved", is_approved: true }))).then(load);
          } },
          { label: "Hide", onClick: (ids) => {
            db.entities.Review.bulkUpdate(Array.from(ids).map((id) => ({ id, status: "hidden", is_hidden: true }))).then(load);
          } },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} reviews?`)) return;
            for (const id of ids) await db.entities.Review.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "hidden", label: "Hidden" },
              { value: "featured", label: "Featured" },
            ] },
          { key: "type", label: "Type", value: filterType, onChange: (e) => setFilterType(e.target.value),
            options: [
              { value: "offer", label: "Offer" },
              { value: "business", label: "Business" },
            ] },
        ]}
      />
    </div>
  );
}