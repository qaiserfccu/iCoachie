import { io, Socket } from 'socket.io-client'
import { apiClient } from '../api'

// Notification types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

export interface NotificationStats {
  total: number
  unread: number
  byType: {
    info: number
    success: number
    warning: number
    error: number
  }
}

// Admin real-time events
export interface AdminDashboardStats {
  totalUsers: number
  activeClubs: number
  verifiedCoaches: number
  monthlyRevenue: string
  pendingApprovals: number
  pendingVerifications: number
  pendingRefunds: number
  supportTickets: number
}

class NotificationService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // Event listeners
  private notificationListeners: ((notification: Notification) => void)[] = []
  private statsListeners: ((stats: AdminDashboardStats) => void)[] = []
  private connectionListeners: ((connected: boolean) => void)[] = []
  private unreadCountListeners: ((count: number) => void)[] = []

  constructor() {
    // Initialize socket lazily when needed
  }

  private initializeSocket() {
    if (typeof window === 'undefined') return
    
    const token = localStorage.getItem('authToken')
    if (!token) return

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

    this.socket = io(API_URL, {
      auth: {
        token: token.replace('Bearer ', '')
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
    })

    this.setupSocketListeners()
  }

  private setupSocketListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Connected to notification server')
      this.reconnectAttempts = 0
      this.notifyConnectionListeners(true)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from notification server:', reason)
      this.notifyConnectionListeners(false)

      if (reason === 'io server disconnect') {
        this.attemptReconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('Notification connection error:', error)
      this.attemptReconnect()
    })

    // Notification events
    this.socket.on('notification', (notification: Notification) => {
      this.notifyNotificationListeners(notification)
    })

    // Admin dashboard stats
    this.socket.on('dashboard-stats', (stats: AdminDashboardStats) => {
      this.notifyStatsListeners(stats)
    })

    // Helper function to generate unique IDs
    const generateId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

    // Real-time updates for specific events
    this.socket.on('user-registered', (data: any) => {
      this.notifyNotificationListeners({
        id: generateId('user'),
        title: 'New User Registration',
        message: `${data.name} has registered as ${data.role}`,
        type: 'info',
        category: 'users',
        read: false,
        actionUrl: '/admin/users/pending',
        createdAt: new Date().toISOString()
      })
    })

    this.socket.on('club-registered', (data: any) => {
      this.notifyNotificationListeners({
        id: generateId('club'),
        title: 'New Club Registration',
        message: `${data.name} has submitted a registration`,
        type: 'info',
        category: 'clubs',
        read: false,
        actionUrl: '/admin/clubs/pending',
        createdAt: new Date().toISOString()
      })
    })

    this.socket.on('coach-verification', (data: any) => {
      this.notifyNotificationListeners({
        id: generateId('coach'),
        title: 'Coach Verification Request',
        message: `${data.name} has requested verification`,
        type: 'info',
        category: 'coaches',
        read: false,
        actionUrl: '/admin/coaches/verifications',
        createdAt: new Date().toISOString()
      })
    })

    this.socket.on('payment-received', (data: any) => {
      this.notifyNotificationListeners({
        id: generateId('payment'),
        title: 'Payment Received',
        message: `Payment of ${data.amount} received from ${data.user}`,
        type: 'success',
        category: 'payments',
        read: false,
        actionUrl: '/admin/payments',
        createdAt: new Date().toISOString()
      })
    })

    this.socket.on('refund-requested', (data: any) => {
      this.notifyNotificationListeners({
        id: generateId('refund'),
        title: 'Refund Requested',
        message: `${data.user} has requested a refund of ${data.amount}`,
        type: 'warning',
        category: 'payments',
        read: false,
        actionUrl: '/admin/payments/refunds',
        createdAt: new Date().toISOString()
      })
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    // Calculate delay with exponential backoff, capped at 30 seconds
    const maxDelay = 30000
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), maxDelay)

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.socket?.connect()
    }, delay)
  }

  // Public connection methods
  connect() {
    if (!this.socket) {
      this.initializeSocket()
    } else {
      this.socket.connect()
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Request dashboard stats refresh
  requestDashboardStats() {
    if (!this.socket) return
    this.socket.emit('get-dashboard-stats')
  }

  // Mark notification as read via socket
  markAsRead(notificationId: string) {
    if (!this.socket) return
    this.socket.emit('mark-notification-read', { notificationId })
  }

  // Event listener management
  onNotification(callback: (notification: Notification) => void) {
    this.notificationListeners.push(callback)
    return () => {
      this.notificationListeners = this.notificationListeners.filter(l => l !== callback)
    }
  }

  onStatsUpdate(callback: (stats: AdminDashboardStats) => void) {
    this.statsListeners.push(callback)
    return () => {
      this.statsListeners = this.statsListeners.filter(l => l !== callback)
    }
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionListeners.push(callback)
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== callback)
    }
  }

  onUnreadCountChange(callback: (count: number) => void) {
    this.unreadCountListeners.push(callback)
    return () => {
      this.unreadCountListeners = this.unreadCountListeners.filter(l => l !== callback)
    }
  }

  private notifyNotificationListeners(notification: Notification) {
    this.notificationListeners.forEach(listener => listener(notification))
  }

  private notifyStatsListeners(stats: AdminDashboardStats) {
    this.statsListeners.forEach(listener => listener(stats))
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(listener => listener(connected))
  }

  private notifyUnreadCountListeners(count: number) {
    this.unreadCountListeners.forEach(listener => listener(count))
  }

  // REST API methods for notifications
  async getNotifications(params?: { limit?: number; offset?: number; read?: boolean }): Promise<Notification[]> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.offset) queryParams.append('offset', params.offset.toString())
      if (params?.read !== undefined) queryParams.append('read', params.read.toString())
      
      const url = queryParams.toString() ? `/admin/notifications?${queryParams}` : '/admin/notifications'
      const response = await apiClient.get<{ notifications: Notification[] }>(url)
      return response.notifications
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // Return empty array on error to prevent UI breaks
      return []
    }
  }

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      return await apiClient.get<NotificationStats>('/admin/notifications/stats')
    } catch (error) {
      console.error('Error fetching notification stats:', error)
      return { total: 0, unread: 0, byType: { info: 0, success: 0, warning: 0, error: 0 } }
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/admin/notifications/${id}/read`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.patch('/admin/notifications/read-all')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/notifications/${id}`)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Connection status
  get isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const notificationService = new NotificationService()
export default notificationService
