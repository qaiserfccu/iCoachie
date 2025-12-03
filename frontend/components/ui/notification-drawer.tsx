"use client"

import * as React from "react"
import { Bell, X, CheckCircle, AlertTriangle, AlertCircle, Info, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockNotifications, type MockNotification } from "@/lib/services/mockDataService"

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: "right" | "left"
}

const notificationTypeConfig = {
  success: {
    icon: CheckCircle,
    iconClass: "text-green-500",
    bgClass: "bg-green-500/10",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-red-500",
    bgClass: "bg-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-500",
    bgClass: "bg-yellow-500/10",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
  },
}

export function NotificationDrawer({ isOpen, onClose, position = "right" }: NotificationDrawerProps) {
  const [notifications, setNotifications] = React.useState<MockNotification[]>(mockNotifications)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 bottom-0 z-50 w-full sm:w-96 flex flex-col",
          "glass-card border-l border-white/20 shadow-2xl",
          "animate-in duration-300",
          position === "right" 
            ? "right-0 slide-in-from-right" 
            : "left-0 slide-in-from-left"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => {
                const config = notificationTypeConfig[notification.type]
                const Icon = config.icon
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "relative group p-4 rounded-xl transition-all cursor-pointer",
                      "hover:bg-white/10",
                      !notification.read && "bg-white/5 border-l-4 border-primary"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                        config.bgClass
                      )}>
                        <Icon className={cn("w-5 h-5", config.iconClass)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            "font-medium text-sm",
                            !notification.read && "text-foreground"
                          )}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    
                    {/* Delete button (appears on hover) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <Button 
            variant="outline" 
            className="w-full glass-subtle border-white/20"
            onClick={onClose}
          >
            View All Notifications
          </Button>
        </div>
      </div>
    </>
  )
}

// Hook for managing notification drawer state
export function useNotificationDrawer() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  }
}
