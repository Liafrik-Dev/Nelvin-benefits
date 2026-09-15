import React from "react";

const VARIANTS = {
  active: "bg-[#FFFFFF] text-ivory border-[#F1F1F1]",
  approved: "bg-[#FFFFFF] text-ivory border-[#F1F1F1]",
  verified: "bg-[#FFFFFF] text-ivory border-[#F1F1F1]",
  completed: "bg-[#FFFFFF] text-ivory border-[#F1F1F1]",
  published: "bg-[#FFFFFF] text-ivory border-[#F1F1F1]",
  pending: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#0866FF]/25",
  in_progress: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#0866FF]/25",
  open: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#F1F1F1]",
  rejected: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-rose-100",
  cancelled: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-rose-100",
  failed: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-rose-100",
  suspended: "bg-[#F9F8F7] text-rose-200 ring-1 ring-rose-400/25 border-transparent",
  expired: "bg-[#F4F4F4] text-ivory-muted border-[#F1F1F1]",
  archived: "bg-[#F4F4F4] text-ivory-muted border-[#F1F1F1]",
  hidden: "bg-[#F4F4F4] text-ivory-muted border-[#F1F1F1]",
  deleted: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-rose-100",
  inactive: "bg-[#F4F4F4] text-ivory-muted border-[#F1F1F1]",
  unverified: "bg-[#F4F4F4] text-ivory-muted border-[#F1F1F1]",
  individual: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#F1F1F1]",
  corporate: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#F1F1F1]",
  business: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#0866FF]/25",
  featured: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#0866FF]/25",
  free: "bg-[#F4F4F4] text-ivory-muted border-[#F1F1F1]",
  silver: "bg-[#F9F8F7] text-ivory-dim ring-1 ring-[#F1F1F1] border-transparent",
  gold: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#0866FF]/25",
  platinum: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#F1F1F1]",
  enterprise: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#F1F1F1]",
  refunded: "bg-[#F9F8F7] text-rose-200 ring-1 ring-rose-400/25 border-transparent",
  used: "bg-[#FFFFFF] text-ivory border-[#F1F1F1]",
  issued: "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20 border-[#0866FF]/25",
};

export default function StatusBadge({ status, label, className = "" }) {
  const cls = VARIANTS[(status || "").toLowerCase()] || "bg-[#F4F4F4] text-ivory-muted border-[#F1F1F1]";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${cls} ${className}`}>
      {label || status || "—"}
    </span>
  );
}