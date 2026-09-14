import React, { useState, useMemo } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { exportToCsv, paginate, applySort } from "@/lib/adminUtils";

export default function AdminDataTable({
  data,
  columns,
  loading = false,
  search,
  setSearch,
  filters = [],
  sort,
  setSort,
  selected,
  setSelected,
  bulkActions = [],
  pageSize = 10,
  renderActions,
  emptyMessage = "No records found.",
  exportName = "export.csv",
  onRowClick,
}) {
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => applySort(data, sort), [data, sort]);
  const paged = useMemo(() => paginate(sorted, page, pageSize), [sorted, page, pageSize]);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const allSelected = paged.length > 0 && paged.every((r) => selected && selected.has(r.id));
  const toggleAll = () => {
    if (!setSelected) return;
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };
  const toggleRow = (id) => {
    if (!setSelected) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const colSpan = columns.length + (setSelected ? 1 : 0) + (renderActions ? 1 : 0);

  return (
    <div className="bg-white rounded-lg border border-white/10 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 p-4 border-b border-white/10">
        {setSearch && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records…"
            className="flex-1 border border-white/12 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D6B56D]/20"
          />
        )}
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((f) => (
            <select
              key={f.key}
              value={f.value}
              onChange={f.onChange}
              className="border border-white/12 rounded-lg px-3 py-2 text-sm bg-white outline-none"
            >
              <option value="">{f.label}</option>
              {(f.options || []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
          <button
            onClick={() => exportToCsv(exportName, sorted, columns)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white/5 hover:bg-white/10 text-ivory rounded-lg whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <span className="text-xs text-ivory-dim hidden lg:inline">{total} total</span>
        </div>
      </div>

      {setSelected && bulkActions.length > 0 && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-[#0A3A2F] border-b border-white/10">
          <span className="text-sm text-[#D6B56D] font-medium">{selected.size} selected</span>
          {bulkActions.map((b, i) => (
            <button
              key={i}
              onClick={() => b.onClick(selected)}
              className="text-xs px-3 py-1.5 bg-white border bg-white rounded-md hover:bg-forest-secondary/60"
            >
              {b.label}
            </button>
          ))}
          <button onClick={() => setSelected(new Set())} className="text-xs text-ivory-muted ml-auto">
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase text-ivory-dim tracking-wide">
              {setSelected && (
                <th className="px-3 py-2 w-8">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
              )}
              {columns.map((c) => (
                <th key={c.key} className="px-3 py-2 whitespace-nowrap">
                  {c.sortable ? (
                    <button
                      onClick={() =>
                        setSort({ key: c.key, dir: sort && sort.key === c.key && sort.dir === "asc" ? "desc" : "asc" })
                      }
                      className="flex items-center gap-1 hover:text-ivory"
                    >
                      {c.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  ) : (
                    <span>{c.label}</span>
                  )}
                </th>
              ))}
              {renderActions && <th className="px-3 py-2"></th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="text-center py-10 text-ivory-dim">
                  Loading…
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="text-center py-10 text-ivory-dim">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-50 hover:bg-forest-secondary/60 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {setSelected && (
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2 text-sm text-ivory align-middle">
                      {c.render ? c.render(row) : typeof c.accessor === "function" ? c.accessor(row) : row[c.key]}
                    </td>
                  ))}
                  {renderActions && (
                    <td
                      className="px-3 py-2 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-sm">
          <span className="text-ivory-muted">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={(page + 1) * pageSize >= total}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}