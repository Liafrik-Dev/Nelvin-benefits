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
    <div className="bg-[#FFFFFF] border border-[#F1F1F1]/10 rounded-lg p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-black to-[#FFFFFF] text-white p-6 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#1B4F9C]" />
            <h3 className="text-xl font-bold">Gamification & Peer Kudos</h3>
          </div>
          <p className="text-sm text-[#1B4F9C]/80">
            Recognize your colleagues with points and level up your status.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[#F4F4F4] backdrop-blur-md px-4 py-2.5 rounded-lg border border-[#F1F1F1]">
          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-[#1B4F9C] font-medium block">
              {badgeTier}
            </span>
            <span className="text-xl font-extrabold text-[#1B4F9C]">{points} pts</span>
          </div>
          <Award className="w-8 h-8 text-[#1B4F9C]" />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kudos Form */}
        <div className="border border-[#F1F1F1]/10 rounded-xl p-5 bg-[#F9F8F7] space-y-4">
          <div className="flex items-center gap-2 text-[#282828] font-bold">
            <Send className="w-5 h-5 text-[#1B4F9C]" />
            <h4>Send Peer Kudos</h4>
          </div>

          {showKudosSuccess && (
            <div className="p-3 bg-[#F4F4F4] text-[#1B4F9C] text-sm rounded-lg font-medium">
              ✨ Kudos sent successfully!
            </div>
          )}

          <form onSubmit={handleSendKudos} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-ivory block mb-1">
                Recipient (Colleague Name)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E3E3]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-ivory block mb-1">
                  Points Amount
                </label>
                <select
                  value={kudosPoints}
                  onChange={(e) => setKudosPoints(e.target.value)}
                  className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E3E3]"
                >
                  <option value={25}>25 Pts</option>
                  <option value={50}>50 Pts</option>
                  <option value={100}>100 Pts</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-ivory block mb-1">
                  Category Tag
                </label>
                <span className="inline-flex items-center gap-1.5 w-full text-xs font-semibold p-2.5 bg-[#FFFFFF] border border-slate-200 rounded-lg text-[#282828]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1B4F9C]" /> Teamwork
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ivory block mb-1">
                Appreciation Message
              </label>
              <textarea
                rows={2}
                placeholder="Write a brief note of gratitude..."
                value={kudosMsg}
                onChange={(e) => setKudosMsg(e.target.value)}
                className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E3E3]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F4F4F4] hover:bg-[#E9E9E9] text-[#1B4F9C] font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-[#1B4F9C]" /> Send Kudos Points
            </button>
          </form>
        </div>

        {/* Live Kudos Feed */}
        <div className="border border-[#F1F1F1]/10 rounded-xl p-5 bg-[#FFFFFF] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#282828] font-bold">
              <Users className="w-5 h-5 text-[#1B4F9C]" />
              <h4>Recent Kudos Activity</h4>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#FFFFFF] text-[#1B4F9C] rounded-full border border-[#F1F1F1]">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {feed.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#F4F4F4] hover:bg-[#FFFFFF] rounded-lg ring-1 ring-[#F1F1F1] transition-colors flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#282828] flex items-center gap-1.5">
                    <span>{item.sender}</span>
                    <span className="text-ivory-dim font-normal">➡️</span>
                    <span className="text-[#1B4F9C]">{item.receiver}</span>
                  </div>
                  <p className="text-xs text-ivory-dim italic">"{item.message}"</p>
                  <span className="text-[10px] text-ivory-muted block">{item.time}</span>
                </div>
                <span className="text-xs font-bold text-[#282828] bg-[#1B4F9C]/40 border border-[#1B4F9C] px-2 py-1 rounded-md shrink-0">
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
