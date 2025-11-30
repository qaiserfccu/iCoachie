import React from 'react'
import { Conversation } from '@/lib/services/messagingService'
import { useMessaging } from '@/contexts/MessagingContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ConversationListProps {
  className?: string
}

export const ConversationList: React.FC<ConversationListProps> = ({ className }) => {
  const { conversations, selectedConversation, selectConversation, unreadCount } = useMessaging()

  const getConversationDisplayName = (conversation: Conversation) => {
    // For now, just show participant count or first participant
    // In a real app, you'd fetch user names
    return `Conversation with ${conversation.participants.length} participants`
  }

  const getConversationAvatar = (conversation: Conversation) => {
    // For now, use first letter of conversation ID
    return conversation.id.charAt(0).toUpperCase()
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="mt-1">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => selectConversation(conversation)}
              className={cn(
                'p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors',
                selectedConversation?.id === conversation.id && 'bg-muted'
              )}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback>{getConversationAvatar(conversation)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {getConversationDisplayName(conversation)}
                    </p>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>

                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.lastMessage.content}
                    </p>
                  )}

                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}