import React from "react";
import { SearchX, Loader2, Inbox } from "lucide-react";

export function LoadingState({ label = "Loading data..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#F5F1E8]/50">
      <Loader2 className="w-7 h-7 animate-spin text-[#E5C77A]" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <span className="w-14 h-14 rounded-lg bg-forest-secondary ring-1 ring-[#103F35]/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#D6B56D]" />
      </span>
      <h3 className="text-base font-bold text-[#F5F1E8]">{title}</h3>
      {desc && <p className="text-sm text-[#F5F1E8]/55 mt-1 max-w-sm">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong. Please try again." , onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <span className="w-14 h-14 rounded-lg bg-[#103F35]/70 ring-1 ring-red-200 flex items-center justify-center mb-4">
        <SearchX className="w-6 h-6 text-red-500" />
      </span>
      <h3 className="text-base font-bold text-[#F5F1E8]">Could not load data</h3>
      <p className="text-sm text-[#F5F1E8]/55 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 bg-[#103F35] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#0A3A2F] transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function PageHeader({ kicker, title, desc, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {kicker && <p className="text-[#E5C77A] font-bold text-xs tracking-[0.2em] uppercase mb-2">{kicker}</p>}
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F1E8] tracking-tight leading-tight">{title}</h1>
        {desc && <p className="mt-2 text-sm text-[#F5F1E8]/55 leading-relaxed max-w-2xl">{desc}</p>}
      </div>
      {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, tone = "dark" }) {
  const tones = {
    dark: { bg: "bg-[#103F35]", label: "text-white/50", value: "text-[#D6B56D]" },
    green: { bg: "bg-[#062B23]", label: "text-white/50", value: "text-white" },
    lime: { bg: "bg-[#D6B56D]", label: "text-[#062B23]/60", value: "text-[#062B23]" },
    purple: { bg: "bg-[#0A3A2F]", label: "text-white/50", value: "text-white" },
  }[tone];
  return (
    <div className={`${tones.bg} rounded-lg p-5 ring-1 ring-black/5`}>
      <div className="flex items-center justify-between">
        <p className={`text-[11px] font-semibold ${tones.label}`}>{label}</p>
        <Icon className={`w-4 h-4 ${tones.label}`} />
      </div>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${tones.value}`}>{value}</p>
      {trend && <p className="mt-1 text-[11px] font-semibold text-[#E5C77A]">{trend}</p>}
    </div>
  );
}