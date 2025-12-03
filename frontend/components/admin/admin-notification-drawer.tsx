"use client"

import * as React from "react"
import { Bell, X, CheckCircle, AlertTriangle, AlertCircle, Info, Check, Trash2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAdminSocket } from "@/contexts/AdminSocketContext"
import { Notification } from "@/lib/services/notificationService"

interface AdminNotificationDrawerProps {
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

export function AdminNotificationDrawer({ isOpen, onClose, position = "right" }: AdminNotificationDrawerProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    refreshNotifications,
    isConnected 
  } = useAdminSocket()
  
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshNotifications()
    setIsRefreshing(false)
  }

  const handleClearAll = () => {
    notifications.forEach(n => deleteNotification(n.id))
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-drawer-title"
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
              <h2 id="notification-drawer-title" className="font-semibold text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-xl"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
            <p className="text-xs text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              Real-time updates paused - reconnecting...
            </p>
          </div>
        )}

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
              onClick={handleClearAll}
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
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => {
                const config = notificationTypeConfig[notification.type] || notificationTypeConfig.info
                const Icon = config.icon
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "relative group p-4 rounded-xl transition-all cursor-pointer",
                      "hover:bg-white/10",
                      !notification.read && "bg-white/5 border-l-4 border-primary"
                    )}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl
                        onClose()
                      }
                    }}
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
                          {formatTime(notification.createdAt)}
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
            onClick={() => {
              window.location.href = '/admin/notifications'
              onClose()
            }}
          >
            View All Notifications
          </Button>
        </div>
      </div>
    </>
  )
}
