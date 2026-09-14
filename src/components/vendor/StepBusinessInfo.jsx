import { db } from "@/services/api/base44Client";

import React, { useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

import { CATEGORIES, COUNTRIES } from "@/lib/nelvinData";

const inputClass =
  "w-full border border-white/12 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-white/15 transition-all";

export default function StepBusinessInfo({ form, update, onNext }) {
  const [uploading, setUploading] = useState(false);

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(
      files.map(async (file) => (await db.integrations.Core.UploadFile({ file })).file_url)
    );
    update("business_image_urls", [...form.business_image_urls, ...urls]);
    setUploading(false);
  };

  const removeImage = (url) =>
    update("business_image_urls", form.business_image_urls.filter((u) => u !== url));

  const canContinue = form.business_name && form.contact_name && form.email && form.country && form.city && form.category;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">Business Name</label>
          <input required value={form.business_name} onChange={(e) => update("business_name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">Contact Person</label>
          <input required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">Business Email</label>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">Mobile Number</label>
          <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">Country</label>
          <select required value={form.country} onChange={(e) => update("country", e.target.value)} className={inputClass}>
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c.slug} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">City</label>
          <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">Business Category</label>
          <select required value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ivory block mb-1.5">Business Address <span className="text-ivory-dim font-normal">(optional)</span></label>
          <input value={form.business_address} onChange={(e) => update("business_address", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ivory block mb-1.5">Website or Facebook/Instagram Page <span className="text-ivory-dim font-normal">(optional)</span></label>
        <input value={form.website} onChange={(e) => update("website", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-ivory block mb-1.5">Brief description of your offer</label>
        <textarea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-ivory block mb-1.5">
          Business Images <span className="text-ivory-dim font-normal">(1920 × 1080px recommended)</span>
        </label>
        <label className="flex items-center gap-3 border border-dashed border-white/15 rounded-lg p-4 cursor-pointer hover:border-gray-900/40 hover:bg-forest-secondary/60 transition-all">
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          <div className="w-10 h-10 rounded-xl bg-white border border-white/10 flex items-center justify-center flex-shrink-0">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin text-ivory-dim" /> : <ImagePlus className="w-4 h-4 text-ivory-dim" />}
          </div>
          <p className="text-sm text-ivory-muted">{uploading ? "Uploading..." : "Click to upload business photos"}</p>
        </label>
        {form.business_image_urls.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {form.business_image_urls.map((url) => (
              <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onNext}
        className="w-full bg-[#062B23] hover:bg-emerald-black disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Continue
      </button>
    </div>
  );
}