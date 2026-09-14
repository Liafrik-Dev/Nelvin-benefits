import React from "react";

const VARIANTS = {
  active: "bg-[#0A3A2F] text-ivory border-white/10",
  approved: "bg-[#0A3A2F] text-ivory border-white/10",
  verified: "bg-[#0A3A2F] text-ivory border-white/10",
  completed: "bg-[#0A3A2F] text-ivory border-white/10",
  published: "bg-[#0A3A2F] text-ivory border-white/10",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  in_progress: "bg-amber-50 text-amber-700 border-amber-100",
  open: "bg-sky-50 text-sky-700 border-sky-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  failed: "bg-rose-50 text-rose-700 border-rose-100",
  suspended: "bg-orange-50 text-orange-700 border-orange-100",
  expired: "bg-white/5 text-ivory-muted border-white/12",
  archived: "bg-white/5 text-ivory-muted border-white/12",
  hidden: "bg-white/5 text-ivory-muted border-white/12",
  deleted: "bg-rose-50 text-rose-700 border-rose-100",
  inactive: "bg-white/5 text-ivory-muted border-white/12",
  unverified: "bg-white/5 text-ivory-muted border-white/12",
  individual: "bg-sky-50 text-sky-700 border-sky-100",
  corporate: "bg-violet-50 text-violet-700 border-violet-100",
  business: "bg-amber-50 text-amber-700 border-amber-100",
  featured: "bg-amber-50 text-amber-700 border-amber-100",
  free: "bg-white/5 text-ivory-muted border-white/12",
  silver: "bg-slate-100 text-slate-700 border-slate-200",
  gold: "bg-amber-50 text-amber-700 border-amber-100",
  platinum: "bg-indigo-50 text-indigo-700 border-indigo-100",
  enterprise: "bg-violet-50 text-violet-700 border-violet-100",
  refunded: "bg-orange-50 text-orange-700 border-orange-100",
  used: "bg-[#0A3A2F] text-ivory border-white/10",
  issued: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function StatusBadge({ status, label, className = "" }) {
  const cls = VARIANTS[(status || "").toLowerCase()] || "bg-white/5 text-ivory-muted border-white/12";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${cls} ${className}`}>
      {label || status || "—"}
    </span>
  );
}