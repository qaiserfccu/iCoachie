"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { notificationService, Notification, AdminDashboardStats } from '@/lib/services/notificationService'
import { useAuth } from '@/lib/contexts/AuthContext'
import { toast } from 'sonner'

interface AdminSocketContextType {
  // Connection state
  isConnected: boolean
  
  // Notifications
  notifications: Notification[]
  unreadCount: number
  
  // Dashboard stats for real-time updates
  dashboardStats: AdminDashboardStats | null
  
  // Actions
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  refreshNotifications: () => Promise<void>
  requestStatsRefresh: () => void
}

const AdminSocketContext = createContext<AdminSocketContextType | undefined>(undefined)

export function useAdminSocket() {
  const context = useContext(AdminSocketContext)
  if (!context) {
    throw new Error('useAdminSocket must be used within an AdminSocketProvider')
  }
  return context
}

interface AdminSocketProviderProps {
  children: ReactNode
}

export function AdminSocketProvider({ children }: AdminSocketProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null)

  // Initialize connection and load initial data
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([])
      setUnreadCount(0)
      setDashboardStats(null)
      return
    }

    // Connect to socket
    notificationService.connect()

    // Set up event listeners
    const unsubscribeConnection = notificationService.onConnectionChange((connected) => {
      setIsConnected(connected)
      if (connected) {
        // Request initial stats when connected
        notificationService.requestDashboardStats()
      }
    })

    const unsubscribeNotification = notificationService.onNotification((notification) => {
      // Add new notification to the list
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Show toast for new notifications
      const toastType = notification.type === 'error' ? toast.error :
                       notification.type === 'warning' ? toast.warning :
                       notification.type === 'success' ? toast.success :
                       toast.info
      
      toastType(notification.title, {
        description: notification.message,
        action: notification.actionUrl ? {
          label: 'View',
          onClick: () => window.location.href = notification.actionUrl!
        } : undefined
      })
    })

    const unsubscribeStats = notificationService.onStatsUpdate((stats) => {
      setDashboardStats(stats)
    })

    // Load initial notifications
    loadNotifications()

    return () => {
      unsubscribeConnection()
      unsubscribeNotification()
      unsubscribeStats()
      notificationService.disconnect()
    }
  }, [isAuthenticated, user])

  const loadNotifications = async () => {
    try {
      const fetchedNotifications = await notificationService.getNotifications({ limit: 20 })
      setNotifications(fetchedNotifications)
      setUnreadCount(fetchedNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const markAsRead = useCallback((id: string) => {
    notificationService.markNotificationAsRead(id)
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    notificationService.markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  const deleteNotification = useCallback((id: string) => {
    const notification = notifications.find(n => n.id === id)
    notificationService.deleteNotification(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }, [notifications])

  const refreshNotifications = useCallback(async () => {
    await loadNotifications()
  }, [])

  const requestStatsRefresh = useCallback(() => {
    notificationService.requestDashboardStats()
  }, [])

  const value: AdminSocketContextType = {
    isConnected,
    notifications,
    unreadCount,
    dashboardStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    requestStatsRefresh,
  }

  return (
    <AdminSocketContext.Provider value={value}>
      {children}
    </AdminSocketContext.Provider>
  )
}
