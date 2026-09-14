import React from "react";

const VARIANTS = {
  active: "bg-[#0A3A2F] text-ivory border-white/10",
  approved: "bg-[#0A3A2F] text-ivory border-white/10",
  verified: "bg-[#0A3A2F] text-ivory border-white/10",
  completed: "bg-[#0A3A2F] text-ivory border-white/10",
  published: "bg-[#0A3A2F] text-ivory border-white/10",
  pending: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-[#D6B56D]/25",
  in_progress: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-[#D6B56D]/25",
  open: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-white/10",
  rejected: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-rose-100",
  cancelled: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-rose-100",
  failed: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-rose-100",
  suspended: "bg-[#103F35]/70 text-rose-200 ring-1 ring-rose-400/25 border-transparent",
  expired: "bg-[#0A3A2F]/5 text-ivory-muted border-white/12",
  archived: "bg-[#0A3A2F]/5 text-ivory-muted border-white/12",
  hidden: "bg-[#0A3A2F]/5 text-ivory-muted border-white/12",
  deleted: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-rose-100",
  inactive: "bg-[#0A3A2F]/5 text-ivory-muted border-white/12",
  unverified: "bg-[#0A3A2F]/5 text-ivory-muted border-white/12",
  individual: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-white/10",
  corporate: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-white/10",
  business: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-[#D6B56D]/25",
  featured: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-[#D6B56D]/25",
  free: "bg-[#0A3A2F]/5 text-ivory-muted border-white/12",
  silver: "bg-[#103F35]/70 text-ivory-dim ring-1 ring-white/10 border-transparent",
  gold: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-[#D6B56D]/25",
  platinum: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-white/10",
  enterprise: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-white/10",
  refunded: "bg-[#103F35]/70 text-rose-200 ring-1 ring-rose-400/25 border-transparent",
  used: "bg-[#0A3A2F] text-ivory border-white/10",
  issued: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 border-[#D6B56D]/25",
};

export default function StatusBadge({ status, label, className = "" }) {
  const cls = VARIANTS[(status || "").toLowerCase()] || "bg-[#0A3A2F]/5 text-ivory-muted border-white/12";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${cls} ${className}`}>
      {label || status || "—"}
    </span>
  );
}