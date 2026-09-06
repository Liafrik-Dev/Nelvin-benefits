import React from "react";
import { ShieldCheck } from "lucide-react";
import UploadCard from "@/components/vendor/UploadCard";

const DOC_OPTIONS = [
  { value: "registration_certificate", label: "Business Registration Certificate (preferred)" },
  { value: "trading_license", label: "Trading License" },
  { value: "tax_certificate", label: "Tax Registration Certificate" },
  { value: "other", label: "Other proof (reviewed manually)" },
];

export default function StepVerification({ form, update, onNext, onBack }) {
  const canContinue = form.document_type && form.document_url && form.id_document_url;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Verify that you own or represent this business</h2>
        <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
          To keep NelvinBenefits trusted across Africa, every business completes a quick verification before offers go live.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Choose a document to upload</label>
        <select
          value={form.document_type}
          onChange={(e) => update("document_type", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 mb-3"
        >
          <option value="">Select document type</option>
          {DOC_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <UploadCard
          label="Upload document"
          hint="PDF or image, one document is enough"
          fileUrl={form.document_url}
          onUploaded={(url) => update("document_url", url)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 block">Government-issued ID</label>
        <UploadCard
          label="National ID, Passport, or Driver's License"
          hint="Used only to verify your identity"
          fileUrl={form.id_document_url}
          onUploaded={(url) => update("id_document_url", url)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 block">
          Business Logo <span className="text-gray-400 font-normal">(optional but recommended)</span>
        </label>
        <UploadCard
          label="Upload logo"
          hint="Square image works best"
          fileUrl={form.logo_url}
          onUploaded={(url) => update("logo_url", url)}
        />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="px-6 py-3.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all">
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}