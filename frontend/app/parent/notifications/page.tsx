/**
 * Parent Notifications Page
 * 
 * Backend Integration:
 * - Uses NotificationService for real-time notifications via Socket.IO
 * - Notification events come from backend/src/services/socketService.ts
 * - Parents receive booking updates, message notifications, and payment alerts
 */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, CheckCheck, Calendar, MessageSquare, CreditCard, Users, Loader2, AlertCircle, Info } from "lucide-react"
import { notificationService, type Notification } from "@/lib/services/notificationService"

// Get icon based on notification category
function getNotificationIcon(category: string) {
  switch (category?.toLowerCase()) {
    case 'booking':
    case 'session':
      return Calendar
    case 'message':
    case 'messages':
      return MessageSquare
    case 'payment':
    case 'payments':
      return CreditCard
    case 'users':
    case 'student':
      return Users
    default:
      return Info
  }
}

// Get badge class based on notification type
function getTypeClass(type: string): string {
  switch (type) {
    case 'success':
      return 'bg-green-500/20 text-green-600'
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'error':
      return 'bg-red-500/20 text-red-600'
    default:
      return 'bg-blue-500/20 text-blue-600'
  }
}

// Helper to format time ago
function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffSeconds < 60) return 'Just now'
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isConnected, setIsConnected] = useState(false)

  // Initialize notification service and fetch notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Connect to real-time notifications
        notificationService.connect()
        
        // Get initial notifications from REST API
        const initialNotifications = await notificationService.getNotifications({ limit: 50 })
        setNotifications(initialNotifications)
      } catch (err) {
        console.error('Error loading notifications:', err)
        // Don't show error, just start with empty state
        setNotifications([])
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()

    // Subscribe to connection changes
    const unsubConnection = notificationService.onConnectionChange((connected) => {
      setIsConnected(connected)
    })

    // Subscribe to new notifications
    const unsubNotification = notificationService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev])
    })

    return () => {
      unsubConnection()
      unsubNotification()
      notificationService.disconnect()
    }
  }, [])

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  // Filter notifications
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read)

  const unreadCount = notifications.filter(n => !n.read).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">View notifications</p>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
            {isConnected && (
              <Badge className="bg-green-500/20 text-green-600 text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {(['all', 'unread'] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? 'default' : 'ghost'}
                onClick={() => setFilter(f)}
                className={filter === f ? 'bg-pink-500 text-white' : 'glass-subtle'}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="glass-subtle border-white/20 bg-transparent"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-pink-500" />
            <CardTitle>Recent Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'You\'re all caught up!' 
                  : 'Notifications about bookings, messages, and payments will appear here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.category)
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/10 transition-colors ${
                      !notification.read ? 'bg-pink-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeClass(notification.type)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs border-white/20">
                            {notification.category}
                          </Badge>
                          <Badge className={`text-xs ${getTypeClass(notification.type)}`}>
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
