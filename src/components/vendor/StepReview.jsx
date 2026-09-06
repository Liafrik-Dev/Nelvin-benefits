import React from "react";
import { Loader2, FileCheck2 } from "lucide-react";

const DOC_LABELS = {
  registration_certificate: "Business Registration Certificate",
  trading_license: "Trading License",
  tax_certificate: "Tax Registration Certificate",
  other: "Other proof (manual review)",
};

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-900 font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}

export default function StepReview({ form, confirmed, setConfirmed, onBack, onSubmit, submitting }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
        <p className="text-sm text-gray-500 mt-1.5">Please confirm everything looks right before submitting.</p>
      </div>

      <div className="bg-[#f9f9fb] rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business Information</p>
        <Row label="Business Name" value={form.business_name} />
        <Row label="Contact Person" value={form.contact_name} />
        <Row label="Email" value={form.email} />
        <Row label="Mobile Number" value={form.phone} />
        <Row label="Location" value={[form.city, form.country].filter(Boolean).join(", ")} />
        <Row label="Category" value={form.category} />
        <Row label="Address" value={form.business_address} />
        <Row label="Website / Social" value={form.website} />
      </div>

      <div className="bg-[#f9f9fb] rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Offer Details</p>
        <p className="text-sm text-gray-700">{form.description}</p>
        {form.business_image_urls.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {form.business_image_urls.map((url) => (
              <img key={url} src={url} alt="" className="aspect-square object-cover rounded-lg border border-gray-100" />
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#f9f9fb] rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Uploaded Documents</p>
        <div className="space-y-2">
          {[
            [DOC_LABELS[form.document_type] || "Business Document", form.document_url],
            ["Government-issued ID", form.id_document_url],
            ["Business Logo", form.logo_url],
            ["Selfie Verification", form.selfie_url],
          ].map(([label, url]) =>
            url ? (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                <FileCheck2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {label}
              </div>
            ) : null
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">Verification Status: <span className="text-amber-600 font-medium">Pending Review</span></p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-gray-900"
        />
        <span className="text-sm text-gray-600">I confirm that I own or am authorized to represent this business.</span>
      </label>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="px-6 py-3.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all">
          Back
        </button>
        <button
          type="button"
          disabled={!confirmed || submitting}
          onClick={onSubmit}
          className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Submitting..." : "Submit for Review"}
        </button>
      </div>
    </div>
  );
}