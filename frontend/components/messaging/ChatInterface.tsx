import React from 'react'
import { useMessaging } from '@/contexts/MessagingContext'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
  className?: string
  onBack?: () => void
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className, onBack }) => {
  const {
    selectedConversation,
    messages,
    isConnected,
    typingUsers,
    selectConversation
  } = useMessaging()

  if (!selectedConversation) {
    return (
      <div className={cn('flex items-center justify-center h-full text-muted-foreground', className)}>
        <div className="text-center">
          <p className="text-lg mb-2">Select a conversation</p>
          <p className="text-sm">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    )
  }

  const conversationMessages = messages.filter(msg =>
    selectedConversation.participants.includes(msg.senderId) ||
    selectedConversation.participants.includes(msg.recipientId)
  )

  const getConversationDisplayName = () => {
    // For now, just show participant count
    // In a real app, you'd fetch user names
    return `Conversation with ${selectedConversation.participants.length} participants`
  }

  const getConversationAvatar = () => {
    return selectedConversation.id.charAt(0).toUpperCase()
  }

  const recipientId = selectedConversation.participants.find(p => p !== 'current-user-id') // Replace with actual current user ID

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                selectConversation(null)
                onBack()
              }}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback>{getConversationAvatar()}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-medium">{getConversationDisplayName()}</h3>
            <div className="flex items-center space-x-2">
              <div className={cn(
                'flex items-center space-x-1 text-xs',
                isConnected ? 'text-green-600' : 'text-red-600'
              )}>
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Disconnected</span>
                  </>
                )}
              </div>

              {typingUsers.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {typingUsers.length === 1
                    ? `${typingUsers[0].userName} is typing...`
                    : `${typingUsers.length} people typing...`
                  }
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={conversationMessages} />
      </div>

      {/* Message Input */}
      <MessageInput
        recipientId={recipientId}
        placeholder="Type your message..."
      />
    </div>
  )
}