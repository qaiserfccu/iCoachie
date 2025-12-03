"use client"

import * as React from "react"
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastNotificationProps {
  type: ToastType
  title: string
  message?: string
  isVisible: boolean
  onClose: () => void
  duration?: number
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgClass: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
    borderClass: "border-green-500/30",
    iconClass: "text-green-500",
    titleClass: "text-green-700 dark:text-green-300",
  },
  error: {
    icon: AlertCircle,
    bgClass: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
    borderClass: "border-red-500/30",
    iconClass: "text-red-500",
    titleClass: "text-red-700 dark:text-red-300",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
    borderClass: "border-yellow-500/30",
    iconClass: "text-yellow-500",
    titleClass: "text-yellow-700 dark:text-yellow-300",
  },
  info: {
    icon: Info,
    bgClass: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
    borderClass: "border-blue-500/30",
    iconClass: "text-blue-500",
    titleClass: "text-blue-700 dark:text-blue-300",
  },
}

const positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
}

export function ToastNotification({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
  position = "top-right",
}: ToastNotificationProps) {
  const config = toastConfig[type]
  const Icon = config.icon

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed z-[100] w-80 max-w-[calc(100vw-2rem)]",
        positionClasses[position],
        "animate-in fade-in slide-in-from-top-5 duration-300"
      )}
    >
      <div
        className={cn(
          "relative rounded-xl border p-4 shadow-lg backdrop-blur-xl",
          config.bgClass,
          config.borderClass
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn("flex-shrink-0 p-1 rounded-full", config.bgClass)}>
            <Icon className={cn("h-5 w-5", config.iconClass)} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn("font-semibold text-sm", config.titleClass)}>
              {title}
            </h4>
            {message && (
              <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
          <div 
            className={cn("h-full animate-shrink-width", config.iconClass.replace("text-", "bg-"))}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  )
}

// Toast context for global toast management
interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useAppToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useAppToast must be used within a ToastProvider")
  }
  return context
}

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const showToast = React.useCallback((type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { id, type, title, message }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ transform: `translateY(${index * 4}px)` }}
          >
            <ToastNotification
              type={toast.type}
              title={toast.title}
              message={toast.message}
              isVisible={true}
              onClose={() => removeToast(toast.id)}
              position="top-right"
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
