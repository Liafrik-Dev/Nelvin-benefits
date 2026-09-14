import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Bell, CheckCircle2, Tag, Gift, Wallet } from "lucide-react";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifs() {
      if (!user?.id) { setLoading(false); return; }
      try {
        const data = await db.entities.Notification
          .filter({ target_user_id: user.id }, "-created_date", 100)
          .catch(() => []);
        if (data && data.length === 0) {
          const byEmail = await db.entities.Notification
            .filter({ recipient_email: user.email }, "-created_date", 50)
            .catch(() => []);
          setNotifications(byEmail || []);
        } else {
          setNotifications(data || []);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadNotifs();
  }, [user?.id]);

  const defaultNotifs = [
    { id: "1", title: "New Benefit Allocated!", message: "Your company added a $150/mo Meal Allowance to your Nelvin account.", date: "Today, 10:00 AM", type: "benefit" },
    { id: "2", title: "Cashback Credited", message: "You earned $12.50 cashback from your purchase at Nike Store.", date: "Yesterday", type: "wallet" },
    { id: "3", title: "Flash Deal Alert", message: "Exclusive 50% discount on gym memberships expiring in 48 hours.", date: "3 days ago", type: "offer" },
  ];

  const list = notifications.length > 0 ? notifications : defaultNotifs;

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A3A2F] text-[#E5C77A] text-xs font-bold uppercase">
              <Bell className="w-3.5 h-3.5 text-[#D6B56D]" /> Activity Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-2 font-heading">
              Notifications & Alerts
            </h1>
          </div>
          <span className="text-xs font-bold text-ivory-muted bg-white/5 px-3 py-1.5 rounded-full">
            {list.length} Messages
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-ivory-dim">Loading notifications...</div>
        ) : (
          <div className="space-y-4">
            {list.map((n) => (
              <div key={n.id} className="bg-white rounded-xl border border-white/10 p-5 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0A3A2F] text-ivory flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ivory text-sm font-heading">{n.title}</h3>
                    <span className="text-[10px] text-ivory-dim font-medium">{n.date || "Recent"}</span>
                  </div>
                  <p className="text-xs text-ivory-muted leading-relaxed">{n.message || n.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}