// Minimal toast hook (shadcn-compatible API) for Nelvin Benefits.
// The Base44 excerpt did not ship a toast implementation; this restores the
// `useToast()` / `toast()` surface every feature module already imports.
import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastState = {
  toasts: [],
  listeners: new Set(),
}

function emit() {
  toastState.listeners.forEach((lsten) => lsten([...toastState.toasts]))
}

function dismiss(toastId) {
  toastState.toasts = toastState.toasts.filter((t) => t.id !== toastId)
  emit()
}

function remove(toastId) {
  toastState.toasts = toastState.toasts.filter((t) => t.id !== toastId)
  emit()
}

function addToast(props, id = genId()) {
  const toast = { ...props, id, open: true }
  toastState.toasts = [toast, ...toastState.toasts].slice(0, TOAST_LIMIT)
  emit()

  if (props.duration !== Infinity) {
    const duration = props.duration || TOAST_REMOVE_DELAY
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  return { id, dismiss: () => dismiss(id), update: (patch) => {
    toastState.toasts = toastState.toasts.map((t) => (t.id === id ? { ...t, ...patch } : t))
    emit()
  } }
}

const toast = Object.assign(
  (props) => {
    if (props && typeof props === "object") {
      if (toastState.toasts.some((t) => t.id === props.id)) return { id: props.id }
      // ID collides — generate a new one for non-`id` payloads.
      return addToast(props)
    }
    return addToast({ title: props })
  },
  {
    success: (message, opts) => toast({ title: typeof message === "string" ? message : message?.title, ...opts }),
    error: (message, opts) => toast({ title: typeof message === "string" ? message : message?.title, variant: "destructive", ...opts }),
    dismiss: dismiss,
  }
)

function useToast() {
  const [state, setState] = React.useState(toastState.toasts)

  React.useEffect(() => {
    toastState.listeners.add(setState)
    return () => toastState.listeners.delete(setState)
  }, [])

  return {
    toast,
    dismiss,
    toasts: state,
  }
}

export { useToast, toast }