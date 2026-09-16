import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { formatDate, formatMoney } from "@/lib/adminUtils";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminEditModal from "@/components/admin/AdminEditModal";
import StatusBadge from "@/components/admin/StatusBadge";
import { Eye, RotateCcw, Ban, Trash2 } from "lucide-react";

function RowIconBtn({ title, onClick, Icon, color = "text-ivory-muted hover:text-ivory" }) {
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded hover:bg-[#F4F4F4] ${color}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function AdminPayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "created_date", dir: "desc" });
  const [filterType, setFilterType] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payments = await db.entities.Payment.list("-created_date", 500).catch(() => []);
      setData(payments);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let arr = data;
    if (filterType) arr = arr.filter((p) => p.type === filterType);
    if (filterAccount) arr = arr.filter((p) => p.account_type === filterAccount);
    if (filterStatus) arr = arr.filter((p) => p.status === filterStatus);
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((p) =>
        (p.user_name || "").toLowerCase().includes(s) ||
        (p.user_email || "").toLowerCase().includes(s) ||
        (p.company_name || "").toLowerCase().includes(s) ||
        (p.business_name || "").toLowerCase().includes(s) ||
        (p.invoice_number || "").toLowerCase().includes(s) ||
        (p.reference || "").toLowerCase().includes(s)
      );
    }
    return arr;
  }, [data, search, filterType, filterAccount, filterStatus]);

  const update = async (id, payload) => {
    await db.entities.Payment.update(id, payload);
    await load();
  };

  const refund = async (p) => {
    const reason = window.prompt("Refund reason:", p.refund_reason || "") || "";
    await db.entities.Payment.update(p.id, { status: "refunded", refund_reason: reason, refund_amount: p.amount });
    await load();
  };

  const cancel = async (p) => await update(p.id, { status: "cancelled" });
  const approve = async (p) => await update(p.id, { status: "completed" });

  const columns = [
    { key: "invoice_number", label: "Invoice", sortable: true, render: (p) => <span className="text-xs font-medium text-ivory">{p.invoice_number || "—"}</span> },
    { key: "payer", label: "Payer", sortable: true,
      accessor: (p) => p.user_name || p.company_name || p.business_name || "—" },
    { key: "account_type", label: "Type", sortable: true, render: (p) => <StatusBadge status={p.account_type || "individual"} label={p.account_type === "corporate" ? "Corporate" : p.account_type === "business" ? "Business" : "Individual"} /> },
    { key: "description", label: "Description", render: (p) => <span className="text-xs text-ivory-muted line-clamp-1 max-w-xs">{p.description || p.membership_plan_name || "—"}</span> },
    { key: "amount", label: "Amount", sortable: true, render: (p) => <span className="text-sm font-semibold text-ivory">{formatMoney(p.amount, p.currency || "USD")}</span> },
    { key: "payment_method", label: "Method", render: (p) => <span className="text-xs">{p.payment_method || "—"}</span> },
    { key: "created_date", label: "Date", sortable: true, render: (p) => <span className="text-xs text-ivory-muted">{formatDate(p.created_date)}</span> },
    { key: "status", label: "Status", sortable: true, render: (p) => <StatusBadge status={p.status} className="capitalize" /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Payments</h1>
        <p className="text-sm text-ivory-muted mt-1">{filtered.length} transactions · Every payment is linked to either an individual or a company.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-4">
          <p className="text-xs text-ivory-dim">Completed</p>
          <p className="text-lg font-bold text-[#1B4F9C]">
            {formatMoney(filtered.filter((p) => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0), "USD")}
          </p>
          <p className="text-xs text-ivory-dim">{filtered.filter((p) => p.status === "completed").length} payments</p>
        </div>
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-4">
          <p className="text-xs text-ivory-dim">Pending</p>
          <p className="text-lg font-bold text-[#1B4F9C]">
            {formatMoney(filtered.filter((p) => p.status === "pending").reduce((s, p) => s + (p.amount || 0), 0), "USD")}
          </p>
          <p className="text-xs text-ivory-dim">{filtered.filter((p) => p.status === "pending").length} payments</p>
        </div>
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-4">
          <p className="text-xs text-ivory-dim">Refunded</p>
          <p className="text-lg font-bold text-[#1B4F9C]">
            {formatMoney(filtered.filter((p) => p.status === "refunded").reduce((s, p) => s + (p.refund_amount || p.amount || 0), 0), "USD")}
          </p>
          <p className="text-xs text-ivory-dim">{filtered.filter((p) => p.status === "refunded").length} refunds</p>
        </div>
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-4">
          <p className="text-xs text-ivory-dim">Failed</p>
          <p className="text-lg font-bold text-rose-600">
            {formatMoney(filtered.filter((p) => p.status === "failed").reduce((s, p) => s + (p.amount || 0), 0), "USD")}
          </p>
          <p className="text-xs text-ivory-dim">{filtered.filter((p) => p.status === "failed").length} payments</p>
        </div>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        search={search} setSearch={setSearch}
        sort={sort} setSort={setSort}
        selected={selected} setSelected={setSelected}
        exportName={`payments-${Date.now()}.csv`}
        onRowClick={setViewing}
        renderActions={(p) => (
          <div className="flex items-center justify-end gap-1">
            <RowIconBtn title="View receipt" Icon={Eye} onClick={() => setViewing(p)} />
            {p.status === "pending" && (
              <button onClick={() => approve(p)} className="px-2 py-1 text-xs bg-[#FFFFFF] text-[#1B4F9C] rounded hover:bg-[#FFFFFF]">Approve</button>
            )}
            {p.status === "completed" && (
              <RowIconBtn title="Refund" Icon={RotateCcw} color="text-[#1B4F9C] hover:text-[#1B4F9C]" onClick={() => refund(p)} />
            )}
            {p.status === "pending" && (
              <RowIconBtn title="Cancel" Icon={Ban} color="text-rose-600 hover:text-rose-700" onClick={() => cancel(p)} />
            )}
          </div>
        )}
        bulkActions={[
          { label: "Mark completed", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, status: "completed" }));
            db.entities.Payment.bulkUpdate(items).then(load);
          } },
          { label: "Cancel", onClick: (ids) => {
            const items = Array.from(ids).map((id) => ({ id, status: "cancelled" }));
            db.entities.Payment.bulkUpdate(items).then(load);
          } },
          { label: "Refund", onClick: (ids) => {
            const items = Array.from(ids).map((id) => {
              const p = data.find((x) => x.id === id);
              return { id, status: "refunded", refund_amount: p?.amount || 0 };
            });
            db.entities.Payment.bulkUpdate(items).then(load);
          } },
          { label: "Delete", onClick: async (ids) => {
            if (!window.confirm(`Delete ${ids.size} payments?`)) return;
            for (const id of ids) await db.entities.Payment.delete(id);
            await load();
          } },
        ]}
        filters={[
          { key: "type", label: "Type", value: filterType, onChange: (e) => setFilterType(e.target.value),
            options: [
              { value: "membership", label: "Membership" },
              { value: "business", label: "Business" },
              { value: "refund", label: "Refund" },
            ] },
          { key: "account", label: "Account", value: filterAccount, onChange: (e) => setFilterAccount(e.target.value),
            options: [
              { value: "individual", label: "Individual" },
              { value: "corporate", label: "Corporate" },
              { value: "business", label: "Business" },
            ] },
          { key: "status", label: "Status", value: filterStatus, onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" },
              { value: "refunded", label: "Refunded" },
              { value: "cancelled", label: "Cancelled" },
            ] },
        ]}
      />

      {viewing && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-md bg-[#FFFFFF] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ivory text-lg">Payment receipt</h2>
              <button onClick={() => setViewing(null)} className="text-ivory-dim">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-ivory-dim">Invoice</span><p className="font-medium">{viewing.invoice_number || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Reference</span><p>{viewing.reference || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Type</span><p><StatusBadge status={viewing.account_type || "individual"} label={viewing.account_type} className="capitalize" /></p></div>
                <div><span className="text-xs text-ivory-dim">Status</span><p><StatusBadge status={viewing.status} className="capitalize" /></p></div>
                <div><span className="text-xs text-ivory-dim">Amount</span><p className="font-semibold">{formatMoney(viewing.amount, viewing.currency || "USD")}</p></div>
                <div><span className="text-xs text-ivory-dim">Method</span><p>{viewing.payment_method || "—"}</p></div>
                <div><span className="text-xs text-ivory-dim">Date</span><p>{formatDate(viewing.created_date)}</p></div>
                <div><span className="text-xs text-ivory-dim">Plan</span><p>{viewing.membership_plan_name || "—"}</p></div>
              </div>
              <div><span className="text-xs text-ivory-dim">Payer</span>
                <p className="font-medium">{viewing.user_name || viewing.company_name || viewing.business_name || "—"}</p>
                <p className="text-xs text-ivory-muted">{viewing.user_email || viewing.company_name || ""}</p>
              </div>
              {viewing.description && <div><span className="text-xs text-ivory-dim">Description</span><p className="text-ivory">{viewing.description}</p></div>}
              {viewing.refund_reason && <div><span className="text-xs text-ivory-dim">Refund reason</span><p className="text-[#1B4F9C]">{viewing.refund_reason}</p></div>}
              {viewing.receipt_url && (
                <a href={viewing.receipt_url} target="_blank" className="inline-block text-[#1B4F9C] text-sm underline mt-2">Open receipt</a>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              {viewing.status === "pending" && (
                <button onClick={() => { approve(viewing); setViewing(null); }} className="flex-1 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-lg py-2 text-sm font-semibold">Approve</button>
              )}
              {viewing.status === "completed" && (
                <button onClick={() => { refund(viewing); setViewing(null); }} className="flex-1 bg-[#F9F8F7] text-rose-200 ring-1 ring-rose-400/25 rounded-lg py-2 text-sm font-semibold">Refund</button>
              )}
              {viewing.status === "pending" && (
                <button onClick={() => { cancel(viewing); setViewing(null); }} className="flex-1 bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 rounded-lg py-2 text-sm font-semibold">Cancel</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}