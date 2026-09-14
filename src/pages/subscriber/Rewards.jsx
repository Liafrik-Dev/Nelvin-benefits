import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Gift, Award, Sparkles, Send, Trophy, History } from "lucide-react";
import GamificationHub from "@/components/subscriber/GamificationHub";

export default function Rewards() {
  const { user } = useAuth();
  const [points, setPoints] = useState(1250);
  const [rewards, setRewards] = useState([]);
  const [feed, setFeed] = useState([
    { id: "1", sender: "Sarah Connor (HR)", recipient: "You", points: 250, reason: "Outstanding performance on Q1 campaign delivery!", date: "2 days ago" },
    { id: "2", sender: "Michael Scott", recipient: "Pam Beesly", points: 100, reason: "Great teamwork during product launch week.", date: "4 days ago" },
  ]);
  const [praiseRecipient, setPraiseRecipient] = useState("");
  const [praiseReason, setPraiseReason] = useState("");
  const [praisePoints, setPraisePoints] = useState(50);
  const [sentMsg, setSentMsg] = useState(false);

  const handleSendPraise = (e) => {
    e.preventDefault();
    if (!praiseRecipient || !praiseReason) return;
    setFeed([
      {
        id: String(Date.now()),
        sender: user?.full_name || "You",
        recipient: praiseRecipient,
        points: praisePoints,
        reason: praiseReason,
        date: "Just now",
      },
      ...feed,
    ]);
    setPraiseRecipient("");
    setPraiseReason("");
    setSentMsg(true);
    setTimeout(() => setSentMsg(false), 3000);
  };

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Extended Gamification Module */}
        <GamificationHub />

        {/* Header KPI */}
        <div className="bg-gradient-to-r from-[#062B23] to-[#062B23] rounded-xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Recognition & Rewards Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Peer Praise & Achievement Points
            </h1>
            <p className="text-white/70 text-sm">Earn recognition points from colleagues and redeem them for gift vouchers or perks.</p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-lg text-center min-w-[200px]">
            <p className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-1">Your Reward Balance</p>
            <p className="text-4xl font-black text-[#D6B56D] font-heading">{points}</p>
            <p className="text-xs text-white/60 mt-1">Pts ($125 Value)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Peer Praise */}
          <div className="bg-white rounded-xl border border-white/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#E5C77A] font-bold font-heading">
              <Send className="w-5 h-5 text-[#D6B56D]" /> Send Peer Recognition
            </div>
            <p className="text-xs text-ivory-muted">Recognize a coworker for going above and beyond.</p>

            <form onSubmit={handleSendPraise} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Teammate Email or Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={praiseRecipient}
                  onChange={(e) => setPraiseRecipient(e.target.value)}
                  className="w-full bg-forest-secondary/60 border border-white/12 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Points to Award</label>
                <select
                  value={praisePoints}
                  onChange={(e) => setPraisePoints(Number(e.target.value))}
                  className="w-full bg-forest-secondary/60 border border-white/12 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                >
                  <option value={25}>25 Points (Great job)</option>
                  <option value={50}>50 Points (Exceeded expectations)</option>
                  <option value={100}>100 Points (Outstanding leadership)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Shoutout Reason</label>
                <textarea
                  rows={3}
                  placeholder="Describe why you are giving this praise..."
                  value={praiseReason}
                  onChange={(e) => setPraiseReason(e.target.value)}
                  className="w-full bg-forest-secondary/60 border border-white/12 rounded-xl p-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/40"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#062B23] text-[#D6B56D] font-bold py-3 rounded-full text-xs hover:bg-[#062B23] transition-colors shadow-sm"
              >
                Send Praise
              </button>
              {sentMsg && <p className="text-xs text-[#D6B56D] font-bold text-center">Praise sent successfully!</p>}
            </form>
          </div>

          {/* Social Praise Feed */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-white/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-ivory font-heading">
                <Sparkles className="w-5 h-5 text-amber-500" /> Recognition Feed
              </div>
              <span className="text-xs font-semibold text-ivory-dim">Live Team Wall</span>
            </div>

            <div className="space-y-4">
              {feed.map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-forest-secondary/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-ivory">
                      <span className="text-[#D6B56D]">{item.sender}</span> recognized <span className="text-[#D6B56D]">{item.recipient}</span>
                    </p>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      +{item.points} Pts
                    </span>
                  </div>
                  <p className="text-xs text-ivory-muted italic">"{item.reason}"</p>
                  <p className="text-[10px] text-ivory-dim">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}