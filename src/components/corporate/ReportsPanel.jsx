import { db } from "@/services/api/dataClient";

import React, { useState, useEffect } from "react";

import { jsPDF } from "jspdf";
import { FileText, Download, FileSpreadsheet, Calendar } from "lucide-react";

const PERIODS = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly", label: "Yearly" },
];
const SCOPES = [
  { id: "company", label: "Company-wide" },
  { id: "department", label: "Department" },
  { id: "country", label: "Country" },
  { id: "employee", label: "Employee" },
];

export default function ReportsPanel({ company, employees }) {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const [scope, setScope] = useState("company");
  const [scopeValue, setScopeValue] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ids = employees.filter((e) => e.user_id).map((e) => e.user_id);
        let rems = [];
        if (ids.length > 0) {
          rems = await db.entities.Redemption.filter({}, "-redeemed_at", 1000).catch(() => []);
          rems = rems.filter((r) => ids.includes(r.user_id));
        }
        setRedemptions(rems);
      } finally { setLoading(false); }
    })();
  }, [company.id, employees.length]);

  // Build the report dataset
  const buildRows = () => {
    const now = new Date();
    let cutoff = new Date(now);
    if (period === "monthly") cutoff.setMonth(now.getMonth() - 1);
    if (period === "quarterly") cutoff.setMonth(now.getMonth() - 3);
    if (period === "yearly") cutoff.setFullYear(now.getFullYear() - 1);

    let work = redemptions.filter((r) => !r.redeemed_at || new Date(r.redeemed_at) >= cutoff);

    if (scope === "department") work = work.filter((r) => employees.find((e) => e.user_id === r.user_id)?.department === scopeValue);
    if (scope === "country") work = work.filter((r) => r.country === scopeValue);
    if (scope === "employee") work = work.filter((r) => r.user_id === scopeValue);

    return work.map((r) => {
      const emp = employees.find((e) => e.user_id === r.user_id);
      return {
        redemption_id: r.id,
        employee_id: emp?.subscriber_id || r.user_id,
        employee_name: emp?.user_name || "",
        email: emp?.user_email || "",
        department: emp?.department || "",
        office: emp?.office || "",
        country: r.country || emp?.country || "",
        offer_id: r.offer_id,
        offer_title: r.offer_title,
        business: r.business_name,
        savings: r.savings_amount || 0,
        redeemed_at: r.redeemed_at || "",
        status: r.status,
      };
    });
  };

  const downloadCsv = (rows) => {
    if (rows.length === 0) { alert("No data for the selected filters."); return; }
    const header = Object.keys(rows[0]);
    const csv = [header.join(","), ...rows.map((r) => header.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    triggerDownload(csv, `${company.name.replace(/\s+/g, "_")}_${scope}_${period}.csv`, "text/csv;charset=utf-8;");
  };

  const downloadPdf = async (rows) => {
    if (rows.length === 0) { alert("No data for the selected filters."); return; }
    setGenerating(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`${company.name} — ${scope} ${period} report`, 14, 18);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 24);
      doc.text(`Rows: ${rows.length}`, 14, 30);

      const cols = ["employee_id", "employee_name", "department", "offer_title", "business", "savings", "redeemed_at"];
      const startX = 14;
      let y = 40;
      doc.setFontSize(8);
      doc.text(cols.join(" | "), startX, y); y += 6;
      rows.slice(0, 60).forEach((r) => {
        doc.text(cols.map((c) => String(r[c] ?? "")).join(" | ").slice(0, 180), startX, y);
        y += 5;
        if (y > 280) { doc.addPage(); y = 20; }
      });
      doc.save(`${company.name.replace(/\s+/g, "_")}_${scope}_${period}.pdf`);
    } catch (err) {
      alert("PDF generation failed — falling back to CSV.");
      downloadCsv(rows);
    } finally { setGenerating(false); }
  };

  const triggerDownload = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))];
  const countries = [...new Set(redemptions.map((r) => r.country).filter(Boolean))];
  const employeeOptions = employees.filter((e) => e.user_id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Reports</h1>
        <p className="text-sm text-ivory-muted mt-1">Generate savings reports for any period and scope. Export to CSV or PDF.</p>
      </div>

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ivory-muted mb-1.5 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
              {PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ivory-muted mb-1.5 uppercase tracking-wider">Scope</label>
            <select value={scope} onChange={(e) => { setScope(e.target.value); setScopeValue(""); }} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
              {SCOPES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {scope === "department" && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-ivory-muted mb-1.5 uppercase tracking-wider">Department</label>
            <select value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
              <option value="">All departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}
        {scope === "country" && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-ivory-muted mb-1.5 uppercase tracking-wider">Country</label>
            <select value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
              <option value="">All countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
        {scope === "employee" && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-ivory-muted mb-1.5 uppercase tracking-wider">Employee</label>
            <select value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#1B4F9C]/40">
              <option value="">All employees</option>
              {employeeOptions.map((e) => <option key={e.id} value={e.user_id}>{e.user_name || e.user_email}</option>)}
            </select>
          </div>
        )}

        <div className="mt-6 flex gap-3 flex-wrap">
          <button onClick={() => downloadCsv(buildRows())} disabled={loading} className="inline-flex items-center gap-2 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white text-sm font-semibold px-4 py-2 rounded-full">
            <FileSpreadsheet className="w-4 h-4" /> Download CSV
          </button>
          <button onClick={() => downloadPdf(buildRows())} disabled={loading || generating} className="inline-flex items-center gap-2 bg-emerald-black ring-1 ring-[#F1F1F1] border border-transparent hover:bg-[#F9F8F7] text-ivory text-sm font-semibold px-4 py-2 rounded-full">
            <Download className="w-4 h-4" /> {generating ? "Building…" : "Download PDF"}
          </button>
        </div>
        <p className="text-xs text-ivory-dim mt-3 flex items-center gap-1"><FileText className="w-3 h-3" /> Excel-compatible — open the CSV in Excel/Sheets directly.</p>
      </div>
    </div>
  );
}