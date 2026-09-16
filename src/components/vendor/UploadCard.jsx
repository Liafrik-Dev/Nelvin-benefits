import { db } from "@/services/api/base44Client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";

export default function UploadCard({ label, hint, fileUrl, onUploaded, accept = "image/*,.pdf" }) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    onUploaded(file_url);
    setUploading(false);
  };

  return (
    <label
      className={`group relative flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
        fileUrl
          ? "border-[#F1F1F1] bg-[#F4F4F4]0"
          : "border-[#F1F1F1] bg-[#f9f9fb] hover:border-gray-900/30 hover:shadow-[0_0_0_4px_rgba(0,0,0,0.03)]"
      }`}
    >
      <input type="file" accept={accept} className="hidden" onChange={handleChange} />
      <div className="w-10 h-10 rounded-xl bg-emerald-black ring-1 ring-[#F1F1F1] border border-transparent flex items-center justify-center flex-shrink-0">
        {uploading ? (
          <Loader2 className="w-4 h-4 text-ivory-dim animate-spin" />
        ) : fileUrl ? (
          <CheckCircle2 className="w-5 h-5 text-[#1B4F9C]" />
        ) : (
          <UploadCloud className="w-4 h-4 text-ivory-dim" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ivory">{label}</p>
        <p className="text-xs text-ivory-dim truncate">
          {uploading ? "Uploading..." : fileUrl ? "Uploaded — tap to replace" : hint}
        </p>
      </div>
    </label>
  );
}