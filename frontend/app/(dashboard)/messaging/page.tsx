"use client"

import React from 'react'
import { MessagingProvider, useMessaging } from '@/contexts/MessagingContext'
import { ConversationList } from '@/components/messaging/ConversationList'
import { ChatInterface } from '@/components/messaging/ChatInterface'
import { Button } from '@/components/ui/button'
import { RefreshCw, MessageSquarePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

const MessagingContent: React.FC = () => {
  const { refreshMessages, refreshConversations, isLoading, selectedConversation } = useMessaging()

  const handleRefresh = async () => {
    await Promise.all([refreshMessages(), refreshConversations()])
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 border-r bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold">Messages</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ConversationList />
      </div>

      {/* Chat Interface */}
      <div className={cn(
        'flex-1',
        !selectedConversation && 'hidden md:flex'
      )}>
        <ChatInterface onBack={() => {}} />
      </div>
    </div>
  )
}

const MessagingPage: React.FC = () => {
  return (
    <MessagingProvider>
      <MessagingContent />
    </MessagingProvider>
  )
}

export default MessagingPage