import React, { useState } from "react";
import { Store, MapPin, Globe, Phone, Save, CheckCircle } from "lucide-react";

export default function BusinessProfile() {
  const [profile, setProfile] = useState({
    businessName: "Nike Nigeria Store",
    category: "Shopping & Fashion",
    description: "Official Nike retail outlet providing premium athletic wear, footwear, and sports equipment across West Africa.",
    phone: "+234 800 123 4567",
    email: "partner@nike.ng",
    website: "https://nike.ng",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Business Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage public merchant information, store branding, and contact details.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm max-w-2xl">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Business Name</label>
          <input
            type="text"
            value={profile.businessName}
            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
          <select
            value={profile.category}
            onChange={(e) => setProfile({ ...profile, category: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
          >
            <option>Shopping & Fashion</option>
            <option>Food & Dining</option>
            <option>Health & Wellness</option>
            <option>Travel & Stay</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Store Description</label>
          <textarea
            rows={3}
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Support Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Website URL</label>
            <input
              type="text"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between">
          <button
            type="submit"
            className="bg-[#082F24] text-[#B8FF00] font-bold px-6 py-2.5 rounded-full text-xs hover:bg-emerald-950 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
          {saved && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Profile updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
}