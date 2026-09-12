import React, { useState } from "react";
import { Bot, Download, FileSpreadsheet, Sparkles, X, CheckCircle2, Sliders } from "lucide-react";

export default function HRAssistantDrawer({ isOpen, onClose }) {
  const [autoAllocate, setAutoAllocate] = useState(true);
  const [reportFormat, setReportFormat] = useState("pdf");
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Report generated and downloaded as ${reportFormat.toUpperCase()}`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#082F24] text-[#B8FF00] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#082F24]">Smart HR Copilot</h3>
                <p className="text-xs text-slate-500">Automations & Impact Analytics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Insights & Budget Suggestions */}
          <div className="p-4 bg-[#F7F3ED] rounded-xl border border-[#082F24]/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#082F24]">
              <Sparkles className="w-4 h-4 text-[#00BD00]" />
              Smart Budget Recommendation
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on employee usage data in <strong>Wellness & Gym</strong>, reallocating 15% of unused Food budget will increase employee benefit adoption by <strong>+24%</strong>.
            </p>
            <button className="text-xs font-bold text-[#082F24] underline hover:text-[#00BD00]">
              Apply Budget Optimization
            </button>
          </div>

          {/* Onboarding Automations */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Automated Benefit Rules
            </h4>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#082F24] block">
                  Auto-assign Welcome Wallet
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Grant €150 allowance upon employee onboarding
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAllocate}
                onChange={(e) => setAutoAllocate(e.target.checked)}
                className="w-4 h-4 accent-[#082F24] rounded"
              />
            </div>
          </div>

          {/* Export Report Generator */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Export Comprehensive HR Report
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportFormat("pdf")}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  reportFormat === "pdf"
                    ? "border-[#082F24] bg-[#082F24] text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Download className="w-4 h-4" /> PDF Executive
              </button>
              <button
                type="button"
                onClick={() => setReportFormat("csv")}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  reportFormat === "csv"
                    ? "border-[#082F24] bg-[#082F24] text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" /> CSV Raw Data
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleExport}
            disabled={downloading}
            className="w-full bg-[#082F24] hover:bg-[#082F24]/90 text-[#B8FF00] font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            {downloading ? (
              <span>Generating Report...</span>
            ) : (
              <>
                <Download className="w-4 h-4" /> Generate {reportFormat.toUpperCase()} Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
