import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Settings as SettingsIcon, Lock, Bell, Shield, CheckCircle } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A3A2F] text-[#E5C77A] text-xs font-bold uppercase">
            <SettingsIcon className="w-3.5 h-3.5 text-[#D6B56D]" /> Account Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-2 font-heading">
            Subscriber Settings
          </h1>
          <p className="text-ivory-muted text-sm">Manage security, communication channels, and privacy settings.</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-ivory text-base font-heading flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#D6B56D]" /> Notification Channels
            </h3>
            <div className="flex items-center justify-between p-4 bg-forest-secondary/60 rounded-lg">
              <div>
                <p className="font-bold text-xs text-ivory">Email Alerts</p>
                <p className="text-[11px] text-ivory-muted">Receive weekly benefit digests and transaction receipts</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-forest-secondary/60 rounded-lg">
              <div>
                <p className="font-bold text-xs text-ivory">Push Notifications</p>
                <p className="text-[11px] text-ivory-muted">Instant alerts for flash sales and nearby store offers</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="font-bold text-ivory text-base font-heading flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D6B56D]" /> Account Security
            </h3>
            <div className="p-4 bg-forest-secondary/60 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-ivory">Password</p>
                <p className="text-[11px] text-ivory-muted">Last changed 3 months ago</p>
              </div>
              <button type="button" className="text-xs font-bold text-[#D6B56D] underline">Change Password</button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#062B23] text-[#D6B56D] font-bold px-6 py-2.5 rounded-full text-xs hover:bg-[#062B23] transition-colors shadow-sm"
            >
              Save Preferences
            </button>
            {saved && (
              <span className="text-xs font-bold text-[#D6B56D] flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Settings updated
              </span>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}