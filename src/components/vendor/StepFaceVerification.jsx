import { db } from "@/services/api/base44Client";

import React, { useState } from "react";
import { Camera, CheckCircle2, Loader2, RotateCcw } from "lucide-react";

export default function StepFaceVerification({ form, update, onNext, onBack }) {
  const [uploading, setUploading] = useState(false);

  const handleCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    update("selfie_url", file_url);
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-lg bg-[#F9F8F7] flex items-center justify-center mx-auto mb-3">
          <Camera className="w-6 h-6 text-[#0866FF]" />
        </div>
        <h2 className="text-xl font-semibold text-ivory">Take a quick selfie</h2>
        <p className="text-sm text-ivory-muted mt-1.5 max-w-sm mx-auto">
          This is used only to match you with your uploaded ID and help prevent fraud.
        </p>
      </div>

      <ul className="text-sm text-ivory-muted space-y-2 max-w-xs mx-auto">
        {["Look directly at the camera", "Good lighting", "No sunglasses or face covering"].map((rule) => (
          <li key={rule} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0866FF] flex-shrink-0" />
            {rule}
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-4">
        <div className="w-56 h-56 rounded-full bg-[#F9F8F7] border-2 border-dashed border-[#F1F1F1] flex items-center justify-center overflow-hidden">
          {form.selfie_url ? (
            <img src={form.selfie_url} alt="Selfie preview" className="w-full h-full object-cover" />
          ) : uploading ? (
            <Loader2 className="w-8 h-8 text-[#282828]/60 animate-spin" />
          ) : (
            <Camera className="w-10 h-10 text-[#282828]/60" />
          )}
        </div>

        <label className="cursor-pointer border border-[#E3E3E3] bg-[#FFFFFF] hover:bg-[#F9F8F7] text-[#282828] rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
          <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleCapture} />
          {form.selfie_url ? <RotateCcw className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          {form.selfie_url ? "Retake Selfie" : "Take Selfie"}
        </label>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="px-6 py-3.5 rounded-full text-sm font-semibold text-ivory-muted hover:bg-[#F4F4F4] transition-all">
          Back
        </button>
        <button
          type="button"
          disabled={!form.selfie_url}
          onClick={onNext}
          className="flex-1 border border-[#E3E3E3] bg-[#FFFFFF] hover:bg-[#F9F8F7] disabled:opacity-40 disabled:cursor-not-allowed text-[#282828] rounded-full py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}