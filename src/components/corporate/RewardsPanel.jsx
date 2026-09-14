import React, { useState } from "react";
import { Gift, Award, Trophy, Plus, Star, X } from "lucide-react";

export default function RewardsPanel({ company }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");

  const [feed, setFeed] = useState([
    { id: "1", sender: "Sarah Connor (HR)", recipient: "Pamela A.", points: 250, reason: "Excellent client presentation in Q1", date: "Yesterday" },
    { id: "2", sender: "David Kim", recipient: "Michael S.", points: 100, reason: "Helped onboard the engineering team", date: "3 days ago" },
  ]);

  const handleIssuePoints = (e) => {
    e.preventDefault();
    if (!recipient || !points || !reason) return;
    setFeed([
      {
        id: `${Date.now()}`,
        sender: "HR Admin",
        recipient,
        points: parseInt(points, 10),
        reason,
        date: "Just now",
      },
      ...feed,
    ]);
    setRecipient("");
    setPoints("");
    setReason("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#F5F1E8]">Rewards & Recognition</h1>
          <p className="text-sm text-ivory-muted mt-1">Manage peer praise point allocations, milestone awards, and company gift cards.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#062B23] hover:bg-[#0A3A2F] text-[#D6B56D] text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-[#D6B56D]" /> Issue Points
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6 space-y-2 shadow-sm">
          <p className="text-xs font-bold text-ivory-dim uppercase">Monthly Recognition Pool</p>
          <p className="text-3xl font-black text-ivory">50,000 Pts</p>
          <p className="text-xs text-[#D6B56D] font-semibold">12,400 Distributed this month</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6 space-y-2 shadow-sm">
          <p className="text-xs font-bold text-ivory-dim uppercase">Active Rewards Claimed</p>
          <p className="text-3xl font-black text-ivory">142 Vouchers</p>
          <p className="text-xs text-ivory-muted">Value: $7,100</p>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6 space-y-2 shadow-sm">
          <p className="text-xs font-bold text-ivory-dim uppercase">Top Recognized Employee</p>
          <p className="text-lg font-bold text-ivory">Pamela Anderson (Designer)</p>
          <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> 1,450 Points Earned
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-white/10 p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-ivory font-heading">Recent Recognition Stream</h3>
        <div className="space-y-3">
          {feed.map((item) => (
            <div key={item.id} className="p-4 bg-forest-secondary/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-ivory"><span className="text-[#E5C77A] font-extrabold">{item.sender}</span> awarded <span className="text-[#F5F1E8] font-extrabold">{item.recipient}</span></p>
                <p className="text-ivory-muted italic mt-0.5">"{item.reason}"</p>
              </div>
              <span className="bg-[#D6B56D] text-[#062B23] font-bold px-3 py-1 rounded-full">{item.points} Pts</span>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-emerald-black rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-[#F5F1E8]">Issue Reward Points</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ivory-dim hover:text-ivory-muted"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleIssuePoints} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ivory-muted uppercase mb-1">Recipient Employee</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full text-xs p-3 border border-white/12 rounded-xl focus:border-[#0A3A2F] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ivory-muted uppercase mb-1">Points Amount</label>
                <input
                  type="number"
                  required
                  placeholder="250"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full text-xs p-3 border border-white/12 rounded-xl focus:border-[#0A3A2F] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ivory-muted uppercase mb-1">Reason / Praise Note</label>
                <textarea
                  required
                  placeholder="Great teamwork on launch week!"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs p-3 border border-white/12 rounded-xl focus:border-[#0A3A2F] focus:outline-none"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#062B23] hover:bg-[#0A3A2F] text-[#D6B56D] font-bold text-xs py-3 rounded-xl shadow-sm transition-colors"
              >
                Send Reward Points
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}