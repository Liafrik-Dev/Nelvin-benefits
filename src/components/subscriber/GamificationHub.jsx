import React, { useState } from "react";
import { Award, Gift, Send, Sparkles, Trophy, Users } from "lucide-react";

export default function GamificationHub() {
  const [points, setPoints] = useState(1250);
  const [badgeTier] = useState("Gold Tier");
  const [recipient, setRecipient] = useState("");
  const [kudosMsg, setKudosMsg] = useState("");
  const [kudosPoints, setKudosPoints] = useState(50);
  const [showKudosSuccess, setShowKudosSuccess] = useState(false);

  const [feed, setFeed] = useState([
    {
      id: 1,
      sender: "Marcus Vance",
      receiver: "Sarah Connor",
      points: 100,
      message: "Great leadership on the Q3 Wellness Campaign rollout!",
      time: "2h ago",
    },
    {
      id: 2,
      sender: "Amira Said",
      receiver: "You",
      points: 50,
      message: "Thanks for helping organize the team gym challenge!",
      time: "1d ago",
    },
  ]);

  const handleSendKudos = (e) => {
    e.preventDefault();
    if (!recipient || !kudosMsg) return;

    setFeed([
      {
        id: Date.now(),
        sender: "You",
        receiver: recipient,
        points: Number(kudosPoints),
        message: kudosMsg,
        time: "Just now",
      },
      ...feed,
    ]);

    setPoints((prev) => prev - Number(kudosPoints));
    setRecipient("");
    setKudosMsg("");
    setShowKudosSuccess(true);
    setTimeout(() => setShowKudosSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-[#082F24]/10 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#082F24] to-[#0d4a39] text-white p-6 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#B8FF00]" />
            <h3 className="text-xl font-bold">Gamification & Peer Kudos</h3>
          </div>
          <p className="text-sm text-emerald-100/80">
            Recognize your colleagues with points and level up your status.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/15">
          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-medium block">
              {badgeTier}
            </span>
            <span className="text-xl font-extrabold text-[#B8FF00]">{points} pts</span>
          </div>
          <Award className="w-8 h-8 text-[#B8FF00]" />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kudos Form */}
        <div className="border border-[#082F24]/10 rounded-xl p-5 bg-[#F7F3ED]/40 space-y-4">
          <div className="flex items-center gap-2 text-[#082F24] font-bold">
            <Send className="w-5 h-5 text-[#00BD00]" />
            <h4>Send Peer Kudos</h4>
          </div>

          {showKudosSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 text-sm rounded-lg font-medium">
              ✨ Kudos sent successfully!
            </div>
          )}

          <form onSubmit={handleSendKudos} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Recipient (Colleague Name)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Points Amount
                </label>
                <select
                  value={kudosPoints}
                  onChange={(e) => setKudosPoints(e.target.value)}
                  className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                >
                  <option value={25}>25 Pts</option>
                  <option value={50}>50 Pts</option>
                  <option value={100}>100 Pts</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Category Tag
                </label>
                <span className="inline-flex items-center gap-1.5 w-full text-xs font-semibold p-2.5 bg-white border border-slate-200 rounded-lg text-[#082F24]">
                  <Sparkles className="w-3.5 h-3.5 text-[#00BD00]" /> Teamwork
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Appreciation Message
              </label>
              <textarea
                rows={2}
                placeholder="Write a brief note of gratitude..."
                value={kudosMsg}
                onChange={(e) => setKudosMsg(e.target.value)}
                className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#082F24] hover:bg-[#082F24]/90 text-white font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-[#B8FF00]" /> Send Kudos Points
            </button>
          </form>
        </div>

        {/* Live Kudos Feed */}
        <div className="border border-[#082F24]/10 rounded-xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#082F24] font-bold">
              <Users className="w-5 h-5 text-[#00BD00]" />
              <h4>Recent Kudos Activity</h4>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {feed.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 transition-colors flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#082F24] flex items-center gap-1.5">
                    <span>{item.sender}</span>
                    <span className="text-slate-400 font-normal">➡️</span>
                    <span className="text-[#00BD00]">{item.receiver}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{item.message}"</p>
                  <span className="text-[10px] text-slate-400 block">{item.time}</span>
                </div>
                <span className="text-xs font-bold text-[#082F24] bg-[#B8FF00]/40 border border-[#B8FF00] px-2 py-1 rounded-md shrink-0">
                  +{item.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
