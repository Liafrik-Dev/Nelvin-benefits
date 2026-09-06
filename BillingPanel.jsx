const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { Receipt, Download, Plus, Minus, ArrowUpCircle, Calendar } from "lucide-react";

const TIERS_UPGRADE = [
  { name: "Starter", monthly: 19, capacity: 4 },
  { name: "Team", monthly: 39, capacity: 9 },
];

export default function BillingPanel({ company, onChanged }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingSeats, setAddingSeats] = useState(false);
  const [seats, setSeats] = useState(0);

  const isLead = company.is_corporate_lead || (company.employee_count || 0) >= 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await db.entities.Payment.filter(
          { account_type: "corporate", company_id: company.id },
          "-created_date", 50
        ).catch(() => []);
        setPayments(data);
      } finally { setLoading(false); }
    })();
  }, [company.id]);

  const writeAudit = async (action, id, name, description) => {
    try {
      await db.entities.AuditLog.create({
        admin_id: user?.id, admin_name: user?.full_name || user?.email,
        action, entity_type: "Payment", entity_id: id, entity_name: name, description,
      });
    } catch {}
  };

  const seatsTotal = company.seats_purchased || 0;
  const seatsUsed = company.seats_used || 0;
  const seatsRemaining = Math.max(0, seatsTotal - seatsUsed);

  const addSeats = async () => {
    if (seats < 1) return;
    try {
      const tier = TIERS_UPGRADE.find((t) => t.name === company.membership_tier) || TIERS_UPGRADE[0];
      const amount = tier.monthly * seats;
      const today = new Date().toISOString().slice(0, 10);
      // For v1 we record the pending payment and bump seats; real gateway checkout is the next phase.
      const p = await db.entities.Payment.create({
        type: "membership", account_type: "corporate",
        company_id: company.id, company_name: company.name,
        amount, currency: "USD", payment_method: "card",
        description: `Self-serve upgrade — ${seats} additional seats (${tier.name})`,
        membership_plan_name: tier.name, seats, status: "completed",
        billing_period_start: today,
      });
      await db.entities.Company.update(company.id, {
        seats_purchased: (company.seats_purchased || 0) + seats,
        employee_count: (company.seats_purchased || 0) + seats,
      });
      await writeAudit("create", p.id, company.name, `Added ${seats} seats for ${amount} USD`);
      toast({ title: "Seats added", description: `${seats} seat(s) added and a receipt recorded.` });
      setAddingSeats(false);
      setSeats(0);
      onChanged?.();
    } catch (err) {
      toast({ title: "Add seats failed", description: err?.message, variant: "destructive" });
    }
  };

  const downloadInvoice = (p) => {
    const rows = [
      ["Field", "Value"],
      ["Invoice number", p.invoice_number || `INV-${p.id?.slice(-6) || ""}`],
      ["Company", company.name],
      ["Plan", p.membership_plan_name || "—"],
      ["Description", p.description || "—"],
      ["Seats", p.seats || "—"],
      ["Amount", `${p.currency || "USD"} ${p.amount || 0}`],
      ["Payment method", p.payment_method || "—"],
      ["Status", p.status],
      ["Date", new Date(p.created_date || new Date()).toLocaleString()],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-${p.invoice_number || p.id?.slice(-6)}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-1">{isLead ? "Enterprise plan — invoiced seats, single renewal." : "Self-serve plan — billed monthly per seat."}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-600" /> Current Plan</h3>
          <p className="text-2xl font-bold text-emerald-700">{company.membership_tier || "—"}</p>
          <p className="text-sm text-gray-500 mt-1">{isLead ? "Custom enterprise plan, manually approved after a sales call." : "Self-serve tier, billed per seat per month."}</p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 uppercase tracking-wider">Seats Purchased</p><p className="font-bold text-gray-900">{seatsTotal}</p></div>
            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 uppercase tracking-wider">Seats Used</p><p className="font-bold text-gray-900">{seatsUsed}</p></div>
            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 uppercase tracking-wider">Remaining</p><p className="font-bold text-gray-900">{seatsRemaining}</p></div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Renewal</p>
              <p className="font-bold text-gray-900 text-xs">{company.next_renewal_date ? new Date(company.next_renewal_date).toLocaleDateString() : (company.billing_end_date || "—")}</p>
            </div>
          </div>

          {!isLead && (
            <div className="mt-6 bg-emerald-50 rounded-lg p-4">
              <p className="text-xs text-emerald-700 uppercase tracking-wider font-semibold">Add seats</p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setSeats((s) => Math.max(0, s - 1))} className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-700"><Minus className="w-3.5 h-3.5" /></button>
                <input type="number" min="0" value={seats} onChange={(e) => setSeats(Math.max(0, Number(e.target.value)))} className="w-16 text-center px-2 py-1.5 text-sm border border-emerald-200 rounded-lg" />
                <button onClick={() => setSeats((s) => s + 1)} className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-700"><Plus className="w-3.5 h-3.5" /></button>
                <button onClick={addSeats} disabled={addingSeats || seats < 1} className="ml-2 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                  <ArrowUpCircle className="w-4 h-4" /> Add {seats} seat{seats === 1 ? "" : "s"}
                </button>
              </div>
              <p className="text-xs text-emerald-700/70 mt-2">Checkout is recorded as a completed payment in v1 — gateway wiring is the next phase.</p>
            </div>
          )}

          {isLead && (
            <div className="mt-6 bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-800">To adjust seats, change renewal date, or invoices, contact <a href="mailto:Nelvin23@proton.me" className="font-semibold underline">Nelvin23@proton.me</a>.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Payments & Invoices</h3>
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-400">Loading…</div>
          ) : payments.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No payments recorded yet.</div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
              {payments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.description || p.membership_plan_name || "Payment"}</p>
                    <p className="text-xs text-gray-400">{new Date(p.created_date || p.billing_period_start).toLocaleDateString()} · {p.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">${(p.amount || 0).toLocaleString()}</span>
                    <button onClick={() => downloadInvoice(p)} className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Invoice</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}