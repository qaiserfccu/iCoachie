"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useMessaging } from '@/contexts/MessagingContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  recipientId?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const MessageInput: React.FC<MessageInputProps> = ({
  recipientId,
  placeholder = 'Type a message...',
  className,
  disabled = false
}) => {
  const { sendMessage, selectedConversation, startTyping, stopTyping, isConnected } = useMessaging()
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleSend = async () => {
    if (!content.trim() || isSending) return

    try {
      setIsSending(true)
      await sendMessage(content.trim(), recipientId)
      setContent('')

      // Clear typing indicator
      if (recipientId) {
        stopTyping(recipientId)
      }

      // Focus back to textarea
      textareaRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)

    // Handle typing indicators
    if (recipientId && isConnected) {
      startTyping(recipientId)

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(recipientId)
      }, 2000)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [content])

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const canSend = content.trim().length > 0 && !isSending && !disabled
  const hasRecipient = recipientId || selectedConversation

  return (
    <div className={cn('border-t bg-background p-4', className)}>
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={hasRecipient ? placeholder : 'Select a conversation to start messaging'}
            disabled={disabled || !hasRecipient}
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          className="h-10 w-10 p-0 flex-shrink-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isConnected && (
        <div className="mt-2 text-xs text-muted-foreground">
          Not connected - messages will be sent when connection is restored
        </div>
      )}
    </div>
  )
}