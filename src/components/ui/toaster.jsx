import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const ICONS = {
  default: Info,
  success: CheckCircle2,
  destructive: AlertTriangle,
}

const ACCENTS = {
  default: "border-slate-200 text-slate-800",
  success: "border-white/15 text-[#D6B56D]",
  destructive: "border-rose-200 text-rose-600",
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => {
        const Icon = ICONS[t.variant] || ICONS.default
        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-200",
              ACCENTS[t.variant] || ACCENTS.default
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              {t.title && <p className="text-sm font-semibold text-slate-900">{t.title}</p>}
              {t.description && <p className="mt-1 text-sm text-slate-500">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-400 hover:text-slate-600 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}