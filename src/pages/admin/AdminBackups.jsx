import { db } from "@/services/api/dataClient";

import React, { useState, useEffect } from "react";
import { DatabaseBackup, Download, Loader2, FileJson, RefreshCw, Clock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { writeAudit } from "@/lib/auditLog";
import { formatDate } from "@/lib/adminUtils";

// Every entity the admin backend writes to. Exporting them all is the backup:
// a JSON snapshot an operator can keep off-site and restore from.
const BACKED_UP_ENTITIES = [
  "User", "Company", "Offer", "Category", "Country", "MembershipPlan",
  "Employee", "Department", "Team", "Location", "Redemption", "Favorite",
  "Review", "Notification", "SupportTicket", "Payment", "AuditLog",
  "VendorApplication", "Benefit", "Allowance", "Claim", "PlatformSetting",
];

const LAST_BACKUP_KEY = "nv_last_backup";

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminBackups() {
  const { user } = useAuth();
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [lastBackup, setLastBackup] = useState(() => {
    try { return localStorage.getItem(LAST_BACKUP_KEY); } catch { return null; }
  });
  const [message, setMessage] = useState("");

  const countAll = async () => {
    const entries = await Promise.all(
      BACKED_UP_ENTITIES.map(async (name) => {
        const rows = await db.entities[name].list(null, 5000).catch(() => []);
        return [name, rows.length];
      })
    );
    return Object.fromEntries(entries);
  };

  useEffect(() => {
    (async () => {
      try { setCounts(await countAll()); } finally { setLoading(false); }
    })();
  }, []);

  const runBackup = async () => {
    setWorking(true);
    setMessage("");
    try {
      const snapshot = { exported_at: new Date().toISOString(), entities: {} };
      for (const name of BACKED_UP_ENTITIES) {
        snapshot.entities[name] = await db.entities[name].list(null, 5000).catch(() => []);
      }
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      downloadJson(`nelvin-backup-${stamp}.json`, snapshot);

      const total = Object.values(snapshot.entities).reduce((s, rows) => s + rows.length, 0);
      const at = new Date().toISOString();
      try { localStorage.setItem(LAST_BACKUP_KEY, at); } catch {}
      setLastBackup(at);
      await writeAudit(user, {
        action: "export",
        entity_type: "Backup",
        entity_id: stamp,
        entity_name: `nelvin-backup-${stamp}.json`,
        description: `Exported full platform snapshot (${total} rows across ${BACKED_UP_ENTITIES.length} entities)`,
      });
      setMessage(`Snapshot exported — ${total} rows across ${BACKED_UP_ENTITIES.length} entities.`);
    } catch (err) {
      setMessage(err?.message || "Export failed.");
    } finally {
      setWorking(false);
    }
  };

  const exportOne = async (name) => {
    const rows = await db.entities[name].list(null, 5000).catch(() => []);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadJson(`nelvin-${name.toLowerCase()}-${stamp}.json`, { exported_at: new Date().toISOString(), entity: name, rows });
  };

  const totalRows = counts ? Object.values(counts).reduce((s, n) => s + n, 0) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-ivory-muted">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Counting records…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">Backups</h1>
        <p className="text-sm text-ivory-muted mt-1">
          Export a full JSON snapshot of every platform table, or a single table. Keep the file off-site.
        </p>
      </div>

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#FFFFFF] text-[#1B4F9C] flex items-center justify-center shrink-0">
              <DatabaseBackup className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ivory">Full platform snapshot</h2>
              <p className="text-sm text-ivory-muted">
                {totalRows.toLocaleString()} rows across {BACKED_UP_ENTITIES.length} tables.
              </p>
            </div>
          </div>
          <button
            onClick={runBackup}
            disabled={working}
            className="bg-[#1B4F9C] hover:opacity-90 text-white rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            {working ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {working ? "Exporting…" : "Run backup now"}
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-[#F1F1F1] flex items-center gap-2 text-xs text-ivory-muted">
          <Clock className="w-3.5 h-3.5" />
          {lastBackup ? `Last backup on this browser: ${formatDate(lastBackup)}` : "No backup taken from this browser yet."}
        </div>
      </div>

      {message && (
        <p className="text-sm text-ivory bg-[#FFFFFF] ring-1 ring-[#F1F1F1] rounded-lg px-4 py-3">{message}</p>
      )}

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F1F1F1] flex items-center justify-between">
          <h2 className="font-semibold text-ivory">Tables</h2>
          <button
            onClick={async () => { setLoading(true); setCounts(await countAll()); setLoading(false); }}
            className="text-xs font-semibold text-[#1B4F9C] inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh counts
          </button>
        </div>
        <ul className="divide-y divide-[#F1F1F1]">
          {BACKED_UP_ENTITIES.map((name) => (
            <li key={name} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-ivory inline-flex items-center gap-2">
                <FileJson className="w-4 h-4 text-ivory-dim" /> {name}
              </span>
              <span className="flex items-center gap-4">
                <span className="text-ivory-muted text-xs">{(counts?.[name] ?? 0).toLocaleString()} rows</span>
                <button
                  onClick={() => exportOne(name)}
                  className="text-xs font-semibold text-[#1B4F9C] inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-ivory-dim">
        A JSON export is the portable backup: it restores into any Postgres, Supabase project or Base44
        workspace, unlike a database-specific dump. Automated off-site scheduling runs in your hosting or
        database provider, not in the browser — this page is the manual, on-demand path.
      </p>
    </div>
  );
}
