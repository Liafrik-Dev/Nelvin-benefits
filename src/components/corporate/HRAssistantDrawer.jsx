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
      <div className="w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F1F1F1] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] text-[#0866FF] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#282828]">Smart HR Copilot</h3>
                <p className="text-xs text-ivory-dim">Automations & Impact Analytics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-ivory-dim hover:text-[#0866FF] hover:bg-[#FFFFFF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Insights & Budget Suggestions */}
          <div className="p-4 bg-forest-secondary rounded-xl border border-[#F1F1F1]/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#282828]">
              <Sparkles className="w-4 h-4 text-[#0866FF]" />
              Smart Budget Recommendation
            </div>
            <p className="text-xs text-ivory-dim leading-relaxed">
              Based on employee usage data in <strong>Wellness & Gym</strong>, reallocating 15% of unused Food budget will increase employee benefit adoption by <strong>+24%</strong>.
            </p>
            <button className="text-xs font-bold text-[#282828] underline hover:text-[#0866FF]">
              Apply Budget Optimization
            </button>
          </div>

          {/* Onboarding Automations */}
          <div className="space-y-3 border-t border-[#F1F1F1] pt-4">
            <h4 className="text-xs font-bold text-[#0866FF] uppercase tracking-wider">
              Automated Benefit Rules
            </h4>

            <div className="flex items-center justify-between p-3 bg-[#F4F4F4] rounded-lg ring-1 ring-[#F1F1F1]">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#282828] block">
                  Auto-assign Welcome Wallet
                </span>
                <span className="text-[11px] text-ivory-dim block">
                  Grant €150 allowance upon employee onboarding
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAllocate}
                onChange={(e) => setAutoAllocate(e.target.checked)}
                className="w-4 h-4 accent-[#062B23] rounded"
              />
            </div>
          </div>

          {/* Export Report Generator */}
          <div className="space-y-3 border-t border-[#F1F1F1] pt-4">
            <h4 className="text-xs font-bold text-[#0866FF] uppercase tracking-wider">
              Export Comprehensive HR Report
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportFormat("pdf")}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  reportFormat === "pdf"
                    ? "border-[#F1F1F1] border border-[#E3E3E3] bg-[#FFFFFF] text-[#282828]"
                    : "border-[#F1F1F1] text-ivory-muted hover:bg-[#FFFFFF]"
                }`}
              >
                <Download className="w-4 h-4" /> PDF Executive
              </button>
              <button
                type="button"
                onClick={() => setReportFormat("csv")}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  reportFormat === "csv"
                    ? "border-[#F1F1F1] border border-[#E3E3E3] bg-[#FFFFFF] text-[#282828]"
                    : "border-[#F1F1F1] text-ivory-muted hover:bg-[#FFFFFF]"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" /> CSV Raw Data
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-[#F1F1F1]">
          <button
            onClick={handleExport}
            disabled={downloading}
            className="w-full bg-[#FFFFFF] hover:bg-[#F9F8F7] text-[#0866FF] font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
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
