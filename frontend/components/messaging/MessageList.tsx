"use client"

import React, { useEffect, useRef } from 'react'
import { Message } from '@/lib/services/messagingService'
import { useMessaging } from '@/contexts/MessagingContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface MessageListProps {
  messages: Message[]
  className?: string
}

export const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  const { user, markAsRead } = useMessaging()
  const { user: currentUser } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mark messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages.filter(msg => !msg.isRead && msg.recipientId === currentUser?.id)
    unreadMessages.forEach(msg => {
      markAsRead(msg.id)
    })
  }, [messages, currentUser, markAsRead])

  const getMessageSenderName = (message: Message) => {
    // In a real app, you'd fetch user names from a user service
    return message.senderId === currentUser?.id ? 'You' : `User ${message.senderId.slice(-4)}`
  }

  const getMessageAvatar = (message: Message) => {
    return message.senderId === currentUser?.id ? 'Y' : message.senderId.charAt(0).toUpperCase()
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'normal': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  if (messages.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full text-muted-foreground', className)}>
        <div className="text-center">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start a conversation by sending a message</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full overflow-y-auto p-4 space-y-4', className)}>
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUser?.id

        return (
          <div
            key={message.id}
            className={cn(
              'flex items-start space-x-3',
              isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
            )}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {getMessageAvatar(message)}
              </AvatarFallback>
            </Avatar>

            <div className={cn(
              'flex flex-col max-w-[70%]',
              isOwnMessage ? 'items-end' : 'items-start'
            )}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium">
                  {getMessageSenderName(message)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </span>
                {message.priority && message.priority !== 'normal' && (
                  <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                    {message.priority}
                  </Badge>
                )}
              </div>

              <div className={cn(
                'rounded-lg px-3 py-2 max-w-full break-words',
                isOwnMessage
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}>
                {message.subject && (
                  <div className="font-medium text-sm mb-1 opacity-90">
                    {message.subject}
                  </div>
                )}
                <div className="text-sm">
                  {message.content}
                </div>
              </div>

              {message.messageType === 'announcement' && (
                <Badge variant="outline" className="mt-1 text-xs">
                  Announcement
                </Badge>
              )}
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}