"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { messagingService, Message, Conversation, TypingIndicator } from '@/lib/services/messagingService'
import { useAuth } from '@/lib/contexts/AuthContext'

interface MessagingContextType {
  messages: Message[]
  conversations: Conversation[]
  unreadCount: number
  isConnected: boolean
  isLoading: boolean
  selectedConversation: Conversation | null
  typingUsers: TypingIndicator[]
  error: string | null

  // Actions
  sendMessage: (content: string, recipientId?: string) => Promise<void>
  markAsRead: (messageId: string) => Promise<void>
  selectConversation: (conversation: Conversation | null) => void
  startTyping: (recipientId: string) => void
  stopTyping: (recipientId: string) => void
  refreshMessages: () => Promise<void>
  refreshConversations: () => Promise<void>
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

export const useMessaging = () => {
  const context = useContext(MessagingContext)
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider')
  }
  return context
}

interface MessagingProviderProps {
  children: React.ReactNode
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [error, setError] = useState<string | null>(null)

  // Initialize messaging service
  useEffect(() => {
    if (user) {
      messagingService.connect()

      // Set up event listeners
      const unsubscribeMessage = messagingService.onMessage((message) => {
        setMessages(prev => [message, ...prev])
        setUnreadCount(prev => prev + 1)
      })

      const unsubscribeTyping = messagingService.onTyping((data) => {
        setTypingUsers(prev => {
          const existing = prev.find(t => t.userId === data.userId)
          if (data.isTyping && !existing) {
            return [...prev, data]
          } else if (!data.isTyping && existing) {
            return prev.filter(t => t.userId !== data.userId)
          }
          return prev
        })
      })

      const unsubscribeConnection = messagingService.onConnectionChange((connected) => {
        setIsConnected(connected)
      })

      return () => {
        unsubscribeMessage()
        unsubscribeTyping()
        unsubscribeConnection()
        messagingService.disconnect()
      }
    }
  }, [user])

  // Load initial data
  useEffect(() => {
    if (user && isConnected) {
      refreshMessages()
      refreshConversations()
      loadUnreadCount()
    }
  }, [user, isConnected])

  const refreshMessages = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await messagingService.getMessages('inbox')
      setMessages(data)
    } catch (err) {
      setError('Failed to load messages')
      console.error('Error loading messages:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshConversations = useCallback(async () => {
    try {
      const data = await messagingService.getConversations()
      setConversations(data)
    } catch (err) {
      console.error('Error loading conversations:', err)
    }
  }, [])

  const loadUnreadCount = useCallback(async () => {
    try {
      const data = await messagingService.getUnreadCount()
      setUnreadCount(data.count)
    } catch (err) {
      console.error('Error loading unread count:', err)
    }
  }, [])

  const sendMessage = useCallback(async (content: string, recipientId?: string) => {
    try {
      if (!recipientId && !selectedConversation) {
        throw new Error('No recipient specified')
      }

      const targetRecipientId = recipientId || selectedConversation?.participants.find(p => p !== user?.id) || ''

      if (isConnected) {
        messagingService.sendMessageRealTime(targetRecipientId, content)
      } else {
        await messagingService.sendMessage({
          recipientId: targetRecipientId,
          content,
          messageType: 'direct'
        })
      }

      // Optimistically update UI
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user?.id || '',
        recipientId: targetRecipientId,
        content,
        messageType: 'direct',
        isRead: false,
        tenantId: user?.tenantId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setMessages(prev => [newMessage, ...prev])
    } catch (err) {
      setError('Failed to send message')
      console.error('Error sending message:', err)
      throw err
    }
  }, [selectedConversation, user, isConnected])

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      if (isConnected) {
        messagingService.markMessageAsRead(messageId)
      } else {
        await messagingService.markAsRead(messageId)
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }, [isConnected])

  const selectConversation = useCallback((conversation: Conversation | null) => {
    setSelectedConversation(conversation)
    if (conversation) {
      messagingService.joinConversation(conversation.id)
    }
  }, [])

  const startTyping = useCallback((recipientId: string) => {
    messagingService.startTyping(recipientId)
  }, [])

  const stopTyping = useCallback((recipientId: string) => {
    messagingService.stopTyping(recipientId)
  }, [])

  const value: MessagingContextType = {
    messages,
    conversations,
    unreadCount,
    isConnected,
    isLoading,
    selectedConversation,
    typingUsers,
    error,
    sendMessage,
    markAsRead,
    selectConversation,
    startTyping,
    stopTyping,
    refreshMessages,
    refreshConversations
  }

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  )
}