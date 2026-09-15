import React from "react";
import { SearchX, Loader2, Inbox } from "lucide-react";

export function LoadingState({ label = "Loading data..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#282828]/50">
      <Loader2 className="w-7 h-7 animate-spin text-[#0866FF]" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <span className="w-14 h-14 rounded-lg bg-forest-secondary ring-1 ring-[#E3E3E3]/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#0866FF]" />
      </span>
      <h3 className="text-base font-bold text-[#282828]">{title}</h3>
      {desc && <p className="text-sm text-[#282828]/55 mt-1 max-w-sm">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong. Please try again." , onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <span className="w-14 h-14 rounded-lg bg-[#F9F8F7] ring-1 ring-red-200 flex items-center justify-center mb-4">
        <SearchX className="w-6 h-6 text-red-500" />
      </span>
      <h3 className="text-base font-bold text-[#282828]">Could not load data</h3>
      <p className="text-sm text-[#282828]/55 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 border border-[#E3E3E3] bg-[#FFFFFF] text-[#282828] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#FFFFFF] transition-colors"
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
        {kicker && <p className="text-[#0866FF] font-bold text-xs tracking-[0.2em] uppercase mb-2">{kicker}</p>}
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#282828] tracking-tight leading-tight">{title}</h1>
        {desc && <p className="mt-2 text-sm text-[#282828]/55 leading-relaxed max-w-2xl">{desc}</p>}
      </div>
      {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, tone = "dark" }) {
  const tones = {
    dark: { bg: "bg-[#FFFFFF]", label: "text-[#737373]", value: "text-[#0866FF]" },
    green: { bg: "bg-[#FFFFFF]", label: "text-[#737373]", value: "text-white" },
    lime: { bg: "bg-[#0866FF]", label: "text-[#282828]/60", value: "text-[#282828]" },
    purple: { bg: "bg-[#FFFFFF]", label: "text-[#737373]", value: "text-white" },
  }[tone];
  return (
    <div className={`${tones.bg} rounded-lg p-5 ring-1 ring-black/5`}>
      <div className="flex items-center justify-between">
        <p className={`text-[11px] font-semibold ${tones.label}`}>{label}</p>
        <Icon className={`w-4 h-4 ${tones.label}`} />
      </div>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${tones.value}`}>{value}</p>
      {trend && <p className="mt-1 text-[11px] font-semibold text-[#0866FF]">{trend}</p>}
    </div>
  );
}