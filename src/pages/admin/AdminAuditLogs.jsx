import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";

import { ScrollText } from "lucide-react";
import AdminDataTable from "@/components/admin/AdminDataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/adminUtils";

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
      setData(await db.entities.AuditLog.list("-created_date", 500).catch(() => []));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const actions = Array.from(new Set(data.map((l) => l.action).filter(Boolean)));
  const entities = Array.from(new Set(data.map((l) => l.entity_type).filter(Boolean)));

  const filtered = data.filter((l) => {
    if (filterAction && l.action !== filterAction) return false;
    if (filterEntity && l.entity_type !== filterEntity) return false;
    if (search) {
      const s = search.toLowerCase();
      return (l.admin_name || "").toLowerCase().includes(s) || (l.entity_name || "").toLowerCase().includes(s) || (l.description || "").toLowerCase().includes(s);
    }
    return true;
  });

  const columns = [
    { key: "created_date", label: "Timestamp", sortable: true, render: (l) => <span className="text-xs text-ivory-muted">{formatDate(l.created_date)}</span> },
    { key: "admin_name", label: "Admin", sortable: true, render: (l) => <span className="text-sm text-ivory">{l.admin_name || "—"}</span> },
    { key: "action", label: "Action", sortable: true, render: (l) => <StatusBadge status={l.action === "delete" ? "rejected" : l.action === "approve" ? "approved" : "pending"} label={l.action} className="capitalize" /> },
    { key: "entity_type", label: "Entity", sortable: true, render: (l) => <span className="text-xs text-ivory">{l.entity_type || "—"}</span> },
    { key: "entity_name", label: "Target", render: (l) => <span className="text-xs text-ivory line-clamp-1 max-w-xs">{l.entity_name || l.entity_id || "—"}</span> },
    { key: "description", label: "Description", render: (l) => <span className="text-xs text-ivory-muted">{l.description || "—"}</span> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Audit Logs</h1>
        <p className="text-sm text-ivory-muted mt-1">All admin actions across the platform with admin, target, action, and timestamp.</p>
      </div>
      {filtered.length === 0 && !loading ? (
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFFFFF] text-[#0866FF] rounded-lg mb-4">
            <ScrollText className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-ivory">No logged actions yet</h2>
          <p className="text-sm text-ivory-muted max-w-md mx-auto mt-2">
            No audit log entries have been recorded. Live audit log writes (auto-records on every admin create/update/delete/approve/reject/refund) will be wired to fire from the Admin pages in Phase 3. The viewer below already displays any stored log entries.
          </p>
          <div className="inline-block mt-4"><StatusBadge status="pending" label="Live writing in Phase 3" /></div>
        </div>
      ) : (
        <AdminDataTable
          data={filtered}
          columns={columns}
          loading={loading}
          search={search} setSearch={setSearch}
          sort={sort} setSort={setSort}
          exportName={`audit-logs-${Date.now()}.csv`}
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