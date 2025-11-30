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

class MessagingService {
  private readonly baseUrl = '/messages'

  // Get all messages for current user
  async getMessages(type?: 'inbox' | 'sent' | 'all', isRead?: boolean): Promise<Message[]> {
    const params: any = {}
    if (type) params.type = type
    if (isRead !== undefined) params.isRead = isRead
    return apiClient.get<Message[]>(this.baseUrl, { params })
  }

  // Get message by ID
  async getMessage(id: string): Promise<Message> {
    return apiClient.get<Message>(`${this.baseUrl}/${id}`)
  }

  // Send message
  async sendMessage(data: SendMessageData): Promise<Message> {
    return apiClient.post<Message>(this.baseUrl, data)
  }

  // Mark message as read
  async markAsRead(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/read`)
  }

  // Mark message as unread
  async markAsUnread(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/unread`)
  }

  // Delete message
  async deleteMessage(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Get conversations
  async getConversations(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>(`${this.baseUrl}/conversations`)
  }

  // Get conversation messages
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return apiClient.get<Message[]>(`${this.baseUrl}/conversations/${conversationId}`)
  }

  // Send message in conversation
  async sendConversationMessage(conversationId: string, content: string): Promise<Message> {
    return apiClient.post<Message>(`${this.baseUrl}/conversations/${conversationId}`, { content })
  }

  // Create announcement
  async createAnnouncement(data: CreateAnnouncementData): Promise<Message[]> {
    return apiClient.post<Message[]>(`${this.baseUrl}/announcements`, data)
  }

  // Get announcements
  async getAnnouncements(): Promise<Message[]> {
    return apiClient.get<Message[]>(`${this.baseUrl}/announcements`)
  }

  // Get unread message count
  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(`${this.baseUrl}/unread/count`)
  }

  // Archive message
  async archiveMessage(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/archive`)
  }

  // Unarchive message
  async unarchiveMessage(id: string): Promise<Message> {
    return apiClient.patch<Message>(`${this.baseUrl}/${id}/unarchive`)
  }

  // Search messages
  async searchMessages(query: string, type?: 'inbox' | 'sent' | 'all'): Promise<Message[]> {
    const params: any = { q: query }
    if (type) params.type = type
    return apiClient.get<Message[]>(`${this.baseUrl}/search`, { params })
  }
}

export const messagingService = new MessagingService()
export default messagingService