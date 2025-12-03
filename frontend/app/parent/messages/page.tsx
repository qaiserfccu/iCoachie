/**
 * Parent Messages Page
 * 
 * Backend Integration:
 * - Messages: GET /api/messages (backend/src/controllers/messageController.ts)
 * - Send message: POST /api/messages (backend/src/controllers/messageController.ts)
 * - Mark as read: PATCH /api/messages/mark-read (backend/src/controllers/messageController.ts)
 * - Delete message: DELETE /api/messages/:id (backend/src/controllers/messageController.ts)
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Plus, Search, Mail, MailOpen, Trash2, Loader2, AlertCircle, Send, Inbox, ArrowLeft } from "lucide-react"
import { parentService, type ParentMessage } from "@/lib/services/parentService"

// Helper function to get initials from name
function getInitials(name: string | undefined): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Helper to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  } catch {
    return dateStr
  }
}

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ParentMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ParentMessage | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'sent'>('all')
  const [composeOpen, setComposeOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({ toUserId: '', subject: '', content: '' })
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  // Fetch messages from backend
  useEffect(() => {
    loadMessages()
  }, [filter])

  const loadMessages = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Backend source: GET /api/messages (backend/src/controllers/messageController.ts)
      const response = await parentService.getMessages({ 
        limit: 50,
        type: filter === 'all' ? 'all' : filter === 'unread' ? 'unread' : 'sent'
      })
      setMessages(response.data?.messages || [])
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Unable to load messages. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.content.trim()) return
    
    setSending(true)
    try {
      // Backend source: POST /api/messages (backend/src/controllers/messageController.ts)
      await parentService.sendMessage({
        toUserId: parseInt(newMessage.toUserId),
        subject: newMessage.subject || undefined,
        content: newMessage.content
      })
      setComposeOpen(false)
      setNewMessage({ toUserId: '', subject: '', content: '' })
      await loadMessages()
    } catch (err) {
      console.error('Error sending message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // Handle delete message
  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    setDeleting(id)
    try {
      // Backend source: DELETE /api/messages/:id (backend/src/controllers/messageController.ts)
      await parentService.deleteMessage(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Failed to delete message. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  // Handle marking message as read when selecting
  const handleSelectMessage = async (message: ParentMessage) => {
    setSelectedMessage(message)
    
    if (!message.isRead) {
      try {
        // Backend source: PATCH /api/messages/mark-read (backend/src/controllers/messageController.ts)
        await parentService.markMessagesAsRead([message.id])
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, isRead: true } : m
        ))
      } catch (err) {
        console.error('Error marking message as read:', err)
      }
    }
  }

  // Filter messages by search
  const filteredMessages = messages.filter(msg => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      msg.subject?.toLowerCase().includes(query) ||
      msg.content?.toLowerCase().includes(query) ||
      msg.fromUser?.name?.toLowerCase().includes(query)
    )
  })

  const unreadCount = messages.filter(m => !m.isRead).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">View and send messages</p>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">View and send messages</p>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'View and send messages'}
          </p>
        </div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
              <DialogDescription>
                Send a message to your child&apos;s coach or the club.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">To</label>
                <Input
                  placeholder="Enter recipient's name or email to search..."
                  value={newMessage.toUserId}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, toUserId: e.target.value }))}
                  className="glass-input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the coach or staff member&apos;s ID. Contact the club if you need help finding the right recipient.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject (optional)</label>
                <Input
                  placeholder="Message subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Write your message..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  className="glass-input min-h-[150px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setComposeOpen(false)} className="glass-subtle border-white/20 bg-transparent">
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={sending || !newMessage.content.trim() || !newMessage.toUserId}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <Card className="glass-card border-white/20 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2 flex-1">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {(['all', 'unread', 'sent'] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? 'default' : 'ghost'}
                  onClick={() => setFilter(f)}
                  className={filter === f ? 'bg-pink-500 text-white' : 'glass-subtle'}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'unread' && unreadCount > 0 && (
                    <Badge className="ml-1 bg-white text-pink-500 text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id 
                      ? 'bg-pink-500/20 border border-pink-500/30' 
                      : 'glass-subtle hover:bg-white/20'
                  } ${!message.isRead ? 'border-l-4 border-l-pink-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm">
                        {getInitials(message.fromUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-medium truncate ${!message.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {message.fromUser?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      {message.subject && (
                        <p className={`text-sm truncate ${!message.isRead ? 'font-medium' : ''}`}>
                          {message.subject}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {message.content}
                      </p>
                    </div>
                    {!message.isRead && (
                      <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          {selectedMessage ? (
            <>
              <CardHeader className="border-b border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="lg:hidden"
                      onClick={() => setSelectedMessage(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                        {getInitials(selectedMessage.fromUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedMessage.fromUser?.name || 'Unknown'}</h3>
                      <p className="text-sm text-muted-foreground">{selectedMessage.fromUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      disabled={deleting === selectedMessage.id}
                    >
                      {deleting === selectedMessage.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {selectedMessage.subject && (
                  <CardTitle className="mt-4">{selectedMessage.subject}</CardTitle>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <MailOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Message Selected</h3>
                <p className="text-muted-foreground">Select a message from the list to view its contents</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
