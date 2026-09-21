import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";
import { ScrollText, Loader2, RefreshCw } from "lucide-react";
import AdminDataTable from "@/components/admin/AdminDataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/adminUtils";

// Actions the audit trail can contain. Kept here so the filter lists exactly
// what the writers in src/lib/auditLog.js and the corporate panels emit.
const ACTION_TONE = {
  create: "approved",
  approve: "approved",
  update: "pending",
  export: "pending",
  delete: "rejected",
  reject: "rejected",
  refund: "rejected",
};

export default function AdminAuditLogs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await db.entities.AuditLog.list("-created_date", 500).catch(() => []);
      setData(rows || []);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const actions = Array.from(new Set(data.map((l) => l.action).filter(Boolean))).sort();
  const entities = Array.from(new Set(data.map((l) => l.entity_type).filter(Boolean))).sort();

  const filtered = data.filter((l) => {
    if (filterAction && l.action !== filterAction) return false;
    if (filterEntity && l.entity_type !== filterEntity) return false;
    if (search) {
      const s = search.toLowerCase();
      return (l.admin_name || "").toLowerCase().includes(s)
        || (l.entity_name || "").toLowerCase().includes(s)
        || (l.description || "").toLowerCase().includes(s);
    }
    return true;
  });

  const columns = [
    { key: "created_date", label: "Timestamp", sortable: true,
      render: (l) => <span className="text-xs text-ivory-muted">{formatDate(l.created_date)}</span> },
    { key: "admin_name", label: "Actor", sortable: true,
      render: (l) => <span className="text-sm text-ivory">{l.admin_name || "—"}</span> },
    { key: "action", label: "Action", sortable: true,
      render: (l) => <StatusBadge status={ACTION_TONE[l.action] || "pending"} label={l.action || "—"} className="capitalize" /> },
    { key: "entity_type", label: "Entity", sortable: true,
      render: (l) => <span className="text-xs text-ivory">{l.entity_type || "—"}</span> },
    { key: "entity_name", label: "Target",
      render: (l) => <span className="text-xs text-ivory line-clamp-1 max-w-xs">{l.entity_name || l.entity_id || "—"}</span> },
    { key: "description", label: "Description",
      render: (l) => <span className="text-xs text-ivory-muted">{l.description || "—"}</span> },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Audit Logs</h1>
          <p className="text-sm text-ivory-muted mt-1">
            Every recorded admin and staff action — actor, target, action and timestamp.
          </p>
        </div>
        <button
          onClick={load}
          className="text-xs font-semibold text-[#1B4F9C] inline-flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-ivory-muted">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading audit trail…
        </div>
      ) : data.length === 0 ? (
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFFFFF] text-[#1B4F9C] rounded-lg mb-4">
            <ScrollText className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-ivory">No logged actions yet</h2>
          <p className="text-sm text-ivory-muted max-w-md mx-auto mt-2">
            The trail fills up as admins and HR teams change things: user and company edits, offer approvals,
            settings and backups. Corporate actions (employee, department and budget changes) are recorded here too.
          </p>
        </div>
      ) : (
        <AdminDataTable
          data={filtered}
          columns={columns}
          loading={loading}
          search={search} setSearch={setSearch}
          sort={sort} setSort={setSort}
          exportName={`audit-logs-${Date.now()}.csv`}
          emptyMessage="No entries match these filters."
          filters={[
            { key: "action", label: "Action", value: filterAction, onChange: (e) => setFilterAction(e.target.value),
              options: actions.map((a) => ({ value: a, label: a })) },
            { key: "entity", label: "Entity", value: filterEntity, onChange: (e) => setFilterEntity(e.target.value),
              options: entities.map((e) => ({ value: e, label: e })) },
          ]}
        />
      )}
    </div>
  );
}
