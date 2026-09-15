import React, { useState } from "react";
import { Store, MapPin, Globe, Phone, Save, CheckCircle, Image as ImageIcon } from "lucide-react";

export default function BusinessProfile() {
  const [profile, setProfile] = useState({
    businessName: "Nike Store Nigeria",
    category: "Shopping & Fashion",
    description: "Official Nike retail partner offering authentic athletic gear, sneakers, and lifestyle apparel.",
    phone: "+234 800 123 4567",
    email: "partner@nike.ng",
    website: "https://nike.ng",
    bannerUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    logoUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=300&q=80",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">Business Profile & Branding</h1>
        <p className="text-sm text-ivory-muted mt-1">Manage public merchant information, store hero images, and contact details.</p>
      </div>

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl overflow-hidden shadow-sm space-y-6">
        {/* Banner Preview */}
        <div className="relative h-44 bg-[#FFFFFF] overflow-hidden">
          <img src={profile.bannerUrl} alt="Store Banner" className="w-full h-full object-cover opacity-90" />
          <div className="absolute bottom-4 left-6 flex items-center gap-4">
            <img src={profile.logoUrl} alt="Logo" className="w-16 h-16 rounded-lg border-2 border-white object-cover bg-[#FFFFFF] shadow-md" />
            <div className="text-white">
              <h2 className="font-extrabold text-lg font-heading">{profile.businessName}</h2>
              <span className="text-xs bg-[#F4F4F4] backdrop-blur px-2.5 py-0.5 rounded-full">{profile.category}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-ivory mb-1">Business Name</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl px-3.5 py-2.5 text-xs font-bold text-ivory"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ivory mb-1">Store Hero Banner Image URL</label>
            <input
              type="text"
              value={profile.bannerUrl}
              onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
              className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl px-3.5 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ivory mb-1">Store Description</label>
            <textarea
              rows={3}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl p-3 text-xs outline-none focus:border-[#0866FF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ivory mb-1">Support Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ivory mb-1">Website URL</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#FFFFFF] text-[#0866FF] font-bold px-6 py-2.5 rounded-full text-xs hover:bg-[#FFFFFF] flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
            {saved && (
              <span className="text-xs font-bold text-[#0866FF] flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Store profile updated
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}