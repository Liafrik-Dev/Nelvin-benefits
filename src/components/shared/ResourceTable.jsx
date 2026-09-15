import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Pencil, Check, X, Trash2, Download, RefreshCw, ListFilter, Loader2, Inbox } from "lucide-react";

const PAGE_SIZE = 10;

const DEFAULT_ACTIONS = [
  { key: "view", label: "View", icon: Eye, tone: "ghost" },
  { key: "edit", label: "Edit", icon: Pencil, tone: "ghost" },
  { key: "activate", label: "Activate", icon: Check, tone: "success" },
  { key: "deactivate", label: "Deactivate", icon: X, tone: "danger" },
  { key: "delete", label: "Delete", icon: Trash2, tone: "danger" },
];

function Button({ onClick, children, tone = "ghost", disabled }) {
  const tones = {
    ghost: "bg-[#FFFFFF] text-[#282828] ring-1 ring-[#F1F1F1] hover:bg-[#FFFFFF] hover:text-[#0866FF]",
    success: "bg-[#FFFFFF] text-ivory ring-1 ring-[#0866FF]/25 hover:bg-[#0866FF] hover:text-[#282828]",
    danger: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 hover:bg-red-600 hover:text-[#282828]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-colors ${tones[tone]} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

function Value({ value }) {
  if (value === null || value === undefined || value === "" ) return <span className="text-[#282828]/35">—</span>;
  if (typeof value === "boolean") return value ? <span className="text-[#0866FF] font-semibold">Yes</span> : <span className="text-red-500 font-semibold">No</span>;
  return <span>{String(value)}</span>;
}

function StatusBadge({ status }) {
  const map = {
    active: ["bg-[#F4F4F4] text-[#4EA11E]", "Active"],
    approved: ["bg-[#F4F4F4] text-[#4EA11E]", "Approved"],
    pending: ["bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20", "Pending"],
    rejected: ["bg-[#F9F8F7] text-red-600", "Rejected"],
    suspended: ["bg-[#F9F8F7] text-red-600", "Suspended"],
    inactive: ["bg-[#F4F4F4] text-ivory-muted", "Inactive"],
    draft: ["bg-[#F4F4F4] text-ivory-muted", "Draft"],
    redeemed: ["bg-[#F4F4F4] text-[#0866FF]", "Redeemed"],
    default: ["bg-[#F4F4F4] text-ivory", String(status || "—").toUpperCase()],
  };
  const [bg, txt] = map[status] || map.default;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${bg}`}>{txt}</span>;
}

function ActionMenu({ row, actions, onAction }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="w-8 h-8 rounded-full hover:bg-[#F9F8F7] flex items-center justify-center text-[#282828]/60"
        aria-label="Row actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 bg-[#FFFFFF] rounded-lg shadow-xl ring-1 ring-[#F1F1F1] p-1.5">
          {actions.filter((a) => row[a.key] !== false).map((a) => (
            <button
              key={a.key}
              onClick={() => { setOpen(false); onAction(a.key, row); }}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] font-semibold text-[#282828]/75 hover:bg-[#F9F8F7] hover:text-[#282828] rounded-lg transition-colors"
            >
              <a.icon className="w-3.5 h-3.5" />
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable premium resource table.
 * - Built-in search, status filter, pagination, export CSV, refresh and row actions.
 - Columns: { key, label, render?(row), hide? }
 - Actions: preset keys view/edit/activate/deactivate/delete or custom {key,label,onAction}.
*/
export default function ResourceTable({
  entityLabel = "records",
  columns,
  rows = [],
  loading = false,
  onRetry,
  searchKeys = [],
  statuses = [],
  statusKey = "status",
  count,
  actions = DEFAULT_ACTIONS,
  onAction,
  onView,
  onExport,
  emptyTitle,
  emptyDesc,
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    let out = rows;
    if (q.trim()) {
      const needle = q.toLowerCase();
      const keys = searchKeys.length
        ? searchKeys
        : columns.filter((c) => !c.hide).map((c) => c.key);
      out = out.filter((r) =>
        keys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)) ||
        columns.some((c) => c.render && String(c.render(r) ?? "").toLowerCase().includes(needle))
      );
    }
    if (status !== "all") out = out.filter((r) => (r[statusKey] || "active") === status);
    return out;
  }, [rows, q, status, statusKey, searchKeys, columns]);

  const total = count ?? filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = useMemo(() => {
    const out = { all: rows.length };
    for (const r of rows) {
      const s = r[statusKey] || "active";
      out[s] = (out[s] | 0) + 1;
    }
    return out;
  }, [rows, statusKey]);

  const exportRows = () => {
    const visible = columns.filter((c) => !c.hide);
    const cols = visible.map((c) => c.label);
    const lines = [
      cols.join(", "),
      ...filtered.map((r) =>
        visible.map((c) => JSON.stringify(c.render ? c.render(r) : (r[c.key] ?? ""))).join(", ")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entityLabel.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#FFFFFF] rounded-lg ring-1 ring-[#F1F1F1] overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 p-4 border-b border-[#F1F1F1]">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#282828]/35" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder={`Search ${entityLabel}...`}
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-forest-secondary text-sm text-[#282828] placeholder:text-[#282828]/35 focus:outline-none focus:ring-2 focus:ring-[#E3E3E3]/40"
          />
        </div>
        {statuses.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto">
            <ListFilter className="w-4 h-4 text-[#282828]/40 flex-shrink-0" />
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-10 rounded-xl bg-forest-secondary text-sm font-medium text-[#282828] px-3 focus:outline-none focus:ring-2 focus:ring-[#E3E3E3]/40"
            >
              <option value="all">All ({rows.length})</option>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label} ({statusCounts[s.value] || 0})</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2">
          {onExport && (
            <button onClick={exportRows} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#FFFFFF] ring-1 ring-[#F1F1F1] text-xs font-semibold text-[#282828] hover:bg-[#FFFFFF] transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          )}
          {onRetry && (
            <button onClick={onRetry} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#FFFFFF] ring-1 ring-[#F1F1F1] text-xs font-semibold text-[#282828] hover:bg-[#FFFFFF] transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F1F1F1] bg-[#F9F8F7]">
              {columns.filter((c) => !c.hide).map((c) => (
                <th key={c.key} className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-[#282828]/45 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right pr-6 w-16" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-sm text-[#282828]/50">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0866FF]" />
                  Loading {entityLabel}...
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-14">
                  <div className="flex flex-col items-center text-center">
                    <Inbox className="w-8 h-8 text-[#282828]/25 mb-3" />
                    <p className="text-sm font-semibold text-[#282828]/60">{emptyTitle || `No ${entityLabel} found`}</p>
                    {emptyDesc && <p className="text-xs text-[#282828]/40 mt-1 max-w-sm">{emptyDesc}</p>}
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((r, ri) => (
                <tr
                  key={r.id || ri}
                  onClick={onView ? () => onView(r) : undefined}
                  className={`border-b border-[#F1F1F1] hover:bg-[#F9F8F7] transition-colors ${onView ? "cursor-pointer" : ""}`}
                >
                  {columns.filter((c) => !c.hide).map((c) => (
                    <td key={c.key} className="px-4 py-3.5 text-sm text-[#282828]/80 whitespace-nowrap">
                      {c.render ? c.render(r, ri) : <Value value={r[c.key]} />}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 pr-4 text-right">
                    <ActionMenu row={r} actions={actions} onAction={(key, row) => {
                      if (key === "view" && onView) return onView(row);
                      if (key === "export" && onExport) return onExport(row);
                      onAction?.(key, row);
                    }} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#F1F1F1]">
        <p className="text-[11px] text-[#282828]/50 font-medium">
          Showing {pageRows.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{total ? Math.min(page * PAGE_SIZE, total) : 0} of {total} {entityLabel}
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-lg ring-1 ring-[#E3E3E3]/10 disabled:opacity-40 hover:bg-[#F9F8F7] flex items-center justify-center text-[#282828]/60"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pages }).slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${page === i + 1 ? "bg-[#FFFFFF] text-[#0866FF]" : "text-[#282828]/60 hover:bg-[#F9F8F7]"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="w-8 h-8 rounded-lg ring-1 ring-[#E3E3E3]/10 disabled:opacity-40 hover:bg-[#F9F8F7] flex items-center justify-center text-[#282828]/60"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}