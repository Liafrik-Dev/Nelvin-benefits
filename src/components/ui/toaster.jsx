import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const ICONS = {
  default: Info,
  success: CheckCircle2,
  destructive: AlertTriangle,
}

const ACCENTS = {
  default: "border-[#F1F1F1] text-[#0866FF]",
  success: "border-[#F1F1F1] text-[#0866FF]",
  destructive: "border-rose-400/30 text-rose-300",
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
              "pointer-events-auto flex items-start gap-3 rounded-lg border bg-[#F9F8F7] p-4 shadow-lg ring-1 ring-[#F1F1F1] backdrop-blur animate-in slide-in-from-bottom-4 fade-in duration-200",
              ACCENTS[t.variant] || ACCENTS.default
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              {t.title && <p className="text-sm font-semibold text-ivory">{t.title}</p>}
              {t.description && <p className="mt-1 text-sm text-ivory-dim">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ivory-dim hover:text-[#0866FF] shrink-0"
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