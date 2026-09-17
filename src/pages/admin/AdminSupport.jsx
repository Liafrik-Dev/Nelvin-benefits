import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";

import { formatDate } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Check, Reply, Ban, Trash2 } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminSupport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await db.entities.SupportTicket.list("-created_date", 500).catch(() => []));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = data.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    if (search) {
      const s = search.toLowerCase();
      return (t.subject || "").toLowerCase().includes(s) || (t.user_email || "").toLowerCase().includes(s);
    }
    return true;
  });

  const update = async (id, payload) => {
    await db.entities.SupportTicket.update(id, payload);
    await load();
  };

  const reply = async (t) => {
    const body = window.prompt("Your reply:", "") || "";
    if (!body) return;
    const replyObj = { author_name: "Admin", is_admin: true, body, created_date: new Date().toISOString() };
    await db.entities.SupportTicket.update(t.id, {
      last_reply: body,
      replies: [...(t.replies || []), replyObj],
      status: t.status === "open" || t.status === "closed" ? "in_progress" : t.status,
    });
    await load();
  };

  const close = (t) => update(t.id, { status: "closed" });
  const archive = (t) => update(t.id, { status: "archived" });
  const remove = async (t) => {
    if (!window.confirm("Delete this ticket?")) return;
    await db.entities.SupportTicket.delete(t.id);
    await load();
  };

  const columns = [
    { key: "subject", label: "Subject", sortable: true,
      render: (t) => (
        <div className="min-w-0">
          <p className="text-sm font-medium text-ivory truncate">{t.subject}</p>
          <p className="text-xs text-ivory-dim truncate">{t.user_email || "—"}</p>
        </div>
      ) },
    { key: "priority", label: "Priority", sortable: true, render: (t) => <StatusBadge status={t.priority || "medium"} className="capitalize" /> },
    { key: "category", label: "Category", render: (t) => <span className="text-xs">{t.category || "—"}</span> },
    { key: "status", label: "Status", sortable: true, render: (t) => <StatusBadge status={t.status} className="capitalize" /> },
    { key: "created_date", label: "Opened", sortable: true, render: (t) => <span className="text-xs text-ivory-muted">{formatDate(t.created_date)}</span> },
  ];

  const editFields = [
    { key: "status", label: "Status", type: "select",
      options: [
        { value: "open", label: "Open" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
        { value: "archived", label: "Archived" },
      ] },
    { key: "priority", label: "Priority", type: "select",
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ] },
    { key: "assigned_to", label: "Assigned To (admin id)", type: "text" },
    { key: "assigned_name", label: "Assigned Name", type: "text" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Support Tickets</h1>
        <p className="text-sm text-ivory-muted mt-1">{filtered.length} tickets · Reply, close, assign, prioritize, archive.</p>
      </div>
      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`support-tickets-${Date.now()}.csv`}
        onRowClick={setViewing}
        renderActions={(t) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="Reply" Icon={Reply} color="text-[#1B4F9C]" onClick={() => reply(t)} />
            <RowIconBtn title="Close" Icon={Check} color="text-[#1B4F9C]" onClick={() => close(t)} />
            <RowIconBtn title="Archive" Icon={Ban} color="text-ivory-muted" onClick={() => archive(t)} />
            <RowIconBtn title="Delete" Icon={Trash2} color="text-rose-600 hover:text-rose-700" onClick={() => remove(t)} />
          </div>
        )}
        bulkActions={[
          { label: "Close", onClick: (ids) => db.entities.SupportTicket.bulkUpdate(Array.from(ids).map((id) => ({ id, status: "closed" }))).then(load) },
          { label: "Archive", onClick: (ids) => db.entities.SupportTicket.bulkUpdate(Array.from(ids).map((id) => ({ id, status: "archived" }))).then(load) },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} tickets?`)) return;
            for (const id of ids) await db.entities.SupportTicket.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "open", label: "Open" },
              { value: "in_progress", label: "In Progress" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
              { value: "archived", label: "Archived" },
            ] },
          { key: "priority", label: "Priority", value: filterPriority, onChange: (e) => setFilterPriority(e.target.value),
            options: [
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ] },
        ]}
      />
      <AdminEditModal
        open={!!editing}
        entityName="SupportTicket"
        record={editing}
        fields={editFields}
        title={editing?.id ? "Manage ticket" : "Edit ticket"}
        onClose={() => setEditing(null)}
        onSaved={load}
      />
      {viewing && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-md bg-[#FFFFFF] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ivory text-lg">{viewing.subject}</h2>
              <button onClick={() => setViewing(null)} className="text-ivory-dim">✕</button>
            </div>
            <div className="text-sm space-y-2 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-ivory-dim">User</span><p>{viewing.user_name || "—"}</p><p className="text-xs text-ivory-dim">{viewing.user_email}</p></div>
                <div><span className="text-xs text-ivory-dim">Priority</span><p><StatusBadge status={viewing.priority || "medium"} className="capitalize" /></p></div>
                <div><span className="text-xs text-ivory-dim">Status</span><p><StatusBadge status={viewing.status} className="capitalize" /></p></div>
                <div><span className="text-xs text-ivory-dim">Opened</span><p>{formatDate(viewing.created_date)}</p></div>
              </div>
              <div><span className="text-xs text-ivory-dim">Body</span><p className="text-ivory">{viewing.body}</p></div>
            </div>
            <div className="border-t border-[#F1F1F1] pt-4 space-y-2">
              <p className="text-xs text-ivory-dim uppercase tracking-wide">Replies</p>
              {(viewing.replies || []).length === 0 ? (
                <p className="text-sm text-ivory-dim">No replies yet.</p>
              ) : (
                viewing.replies.map((r, i) => (
                  <div key={i} className={`rounded-lg p-3 ${r.is_admin ? "bg-[#FFFFFF]" : "bg-[#F9F8F7]"}`}>
                    <p className="text-xs font-semibold text-ivory">{r.is_admin ? "Admin" : r.author_name || "User"} · {formatDate(r.created_date)}</p>
                    <p className="text-sm text-ivory">{r.body}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => reply(viewing)} className="flex-1 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-full py-2 text-sm font-semibold">Reply</button>
              <button onClick={() => { setEditing(viewing); setViewing(null); }} className="px-3 py-2 border border-[#F1F1F1] rounded-full text-sm">Manage</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}