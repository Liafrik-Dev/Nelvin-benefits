import React, { useState } from "react";
import { Settings, Save, CheckCircle } from "lucide-react";

export default function BusinessSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Partner Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure notification webhooks and point-of-sale PINs.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Redemption Verification PIN</label>
          <input
            type="password"
            maxLength={4}
            defaultValue="1234"
            className="w-32 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-center text-sm font-bold font-mono"
          />
        </div>

        <button
          type="submit"
          className="bg-[#082F24] text-[#B8FF00] font-bold px-6 py-2.5 rounded-full text-xs hover:bg-emerald-950 flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" /> Save Settings
        </button>
        {saved && (
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Saved
          </span>
        )}
      </form>
    </div>
  );
}