import React from "react";
import { DatabaseBackup } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminBackups() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Backups</h1>
        <p className="text-sm text-ivory-muted mt-1">Database & media backups, restore points, scheduled snapshots.</p>
      </div>
      <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0A3A2F] text-[#D6B56D] rounded-lg mb-4">
          <DatabaseBackup className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-ivory">Scheduled for Phase 3</h2>
        <p className="text-sm text-ivory-muted max-w-md mx-auto mt-2">
          Backup & restore tooling (full database snapshot, scheduled daily backups, point-in-time restore, and media storage export) is part of the Phase 3 reliability work. The data layer already supports entity exports via each admin section's CSV button in the meantime.
        </p>
        <div className="inline-block mt-4"><StatusBadge status="pending" label="Phase 3" /></div>
      </div>
    </div>
  );
}