import { io, Socket } from 'socket.io-client'
import { apiClient } from '../api'

// Types
export interface Message {
  id: string
  senderId: string
  recipientId: string
  subject?: string
  content: string
  messageType: 'direct' | 'announcement' | 'notification'
  isRead: boolean
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface SendMessageData {
  recipientId: string
  subject?: string
  content: string
  messageType?: 'direct' | 'announcement' | 'notification'
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

export interface CreateAnnouncementData {
  recipientIds: string[]
  subject: string
  content: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

export interface TypingIndicator {
  userId: string
  userName: string
  isTyping: boolean
}

class MessagingService {
  private readonly baseUrl = '/messages'
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // Event listeners
  private messageListeners: ((message: Message) => void)[] = []
  private typingListeners: ((data: TypingIndicator) => void)[] = []
  private connectionListeners: ((connected: boolean) => void)[] = []

  constructor() {
    this.initializeSocket()
  }

  private initializeSocket() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
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
      console.log('Connected to messaging server')
      this.reconnectAttempts = 0
      this.notifyConnectionListeners(true)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from messaging server:', reason)
      this.notifyConnectionListeners(false)

      if (reason === 'io server disconnect') {
        this.attemptReconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      this.attemptReconnect()
    })

    // Message events
    this.socket.on('message:new', (message: Message) => {
      this.notifyMessageListeners(message)
    })

    this.socket.on('message:read', (data: { messageId: string, readerId: string }) => {
      console.log('Message read:', data)
    })

    // Typing events
    this.socket.on('typing:start', (data: TypingIndicator) => {
      this.notifyTypingListeners(data)
    })

    this.socket.on('typing:stop', (data: TypingIndicator) => {
      this.notifyTypingListeners(data)
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.socket?.connect()
    }, delay)
  }

  // Socket.IO methods
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

  sendMessageRealTime(recipientId: string, content: string, messageType: 'direct' | 'announcement' | 'notification' = 'direct') {
    if (!this.socket) {
      throw new Error('Socket not connected')
    }

    this.socket.emit('message:send', {
      recipientId,
      content,
      messageType
    })
  }

  markMessageAsRead(messageId: string) {
    if (!this.socket) return
    this.socket.emit('message:read', { messageId })
  }

  startTyping(recipientId: string) {
    if (!this.socket) return
    this.socket.emit('typing:start', { recipientId })
  }

  stopTyping(recipientId: string) {
    if (!this.socket) return
    this.socket.emit('typing:stop', { recipientId })
  }

  joinConversation(conversationId: string) {
    if (!this.socket) return
    this.socket.emit('conversation:join', { conversationId })
  }

  leaveConversation(conversationId: string) {
    if (!this.socket) return
    this.socket.emit('conversation:leave', { conversationId })
  }

  // Event listener management
  onMessage(callback: (message: Message) => void) {
    this.messageListeners.push(callback)
    return () => {
      this.messageListeners = this.messageListeners.filter(listener => listener !== callback)
    }
  }

  onTyping(callback: (data: TypingIndicator) => void) {
    this.typingListeners.push(callback)
    return () => {
      this.typingListeners = this.typingListeners.filter(listener => listener !== callback)
    }
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionListeners.push(callback)
    return () => {
      this.connectionListeners = this.connectionListeners.filter(listener => listener !== callback)
    }
  }

  private notifyMessageListeners(message: Message) {
    this.messageListeners.forEach(listener => listener(message))
  }

  private notifyTypingListeners(data: TypingIndicator) {
    this.typingListeners.forEach(listener => listener(data))
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(listener => listener(connected))
  }

  // REST API methods (existing functionality)
  async getMessages(type?: 'inbox' | 'sent' | 'all', isRead?: boolean): Promise<Message[]> {
    const params: any = {}
    if (type) params.type = type
    if (isRead !== undefined) params.isRead = isRead
    return apiClient.get<Message[]>(this.baseUrl, { params })
  }

  async getMessage(id: string): Promise<Message> {
    return apiClient.get<Message>(`${this.baseUrl}/${id}`)
  }

  async sendMessage(data: SendMessageData): Promise<Message> {
    return apiClient.post<Message>(this.baseUrl, data)
  }

  async markAsRead(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/read`)
  }

  async markAsUnread(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/unread`)
  }

  async deleteMessage(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  async getConversations(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>(`${this.baseUrl}/conversations`)
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return apiClient.get<Message[]>(`${this.baseUrl}/conversations/${conversationId}`)
  }

  async sendConversationMessage(conversationId: string, content: string): Promise<Message> {
    return apiClient.post<Message>(`${this.baseUrl}/conversations/${conversationId}`, { content })
  }

  async createAnnouncement(data: CreateAnnouncementData): Promise<Message[]> {
    return apiClient.post<Message[]>(`${this.baseUrl}/announcements`, data)
  }

  async getAnnouncements(): Promise<Message[]> {
    return apiClient.get<Message[]>(`${this.baseUrl}/announcements`)
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(`${this.baseUrl}/unread/count`)
  }

  async archiveMessage(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/archive`)
  }

  async unarchiveMessage(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/unarchive`)
  }

  async searchMessages(query: string, type?: 'inbox' | 'sent' | 'all'): Promise<Message[]> {
    const params: any = { q: query }
    if (type) params.type = type
    return apiClient.get<Message[]>(`${this.baseUrl}/search`, { params })
  }

  // Connection status
  get isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const messagingService = new MessagingService()
export default messagingService