"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Mail,
  MailOpen,
  Clock,
  Loader2,
  AlertCircle,
  Inbox,
  CheckCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import messagingService, { Message, Conversation } from "@/lib/services/messagingService"

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({ recipientId: '', subject: '', content: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true)
        setError(null)

        const [messagesData, unreadData] = await Promise.all([
          messagingService.getMessages('all'),
          messagingService.getUnreadCount(),
        ])

        setMessages(messagesData)
        setUnreadCount(unreadData.count)
      } catch (err) {
        console.error('Failed to fetch messages:', err)
        setError('Failed to load messages. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  // Filter messages based on search query
  const filteredMessages = messages.filter(msg =>
    msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle marking message as read
  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messagingService.markAsRead(messageId)
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

  // Handle sending new message
  const handleSendMessage = async () => {
    if (!newMessage.recipientId || !newMessage.content) return

    try {
      setSending(true)
      await messagingService.sendMessage({
        recipientId: newMessage.recipientId,
        subject: newMessage.subject,
        content: newMessage.content,
        messageType: 'direct',
      })

      setNewMessageOpen(false)
      setNewMessage({ recipientId: '', subject: '', content: '' })

      // Refresh messages
      const messagesData = await messagingService.getMessages('all')
      setMessages(messagesData)
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }

  // Get initials from ID (simplified - would need user lookup in real app)
  const getInitials = (id: string) => {
    return id.substring(0, 2).toUpperCase()
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    }
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with members and staff</p>
        </div>
        <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Recipient</label>
                <Input
                  placeholder="Enter recipient ID or email..."
                  value={newMessage.recipientId}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, recipientId: e.target.value }))}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  placeholder="Message subject..."
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  className="glass-input min-h-[150px]"
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                onClick={handleSendMessage}
                disabled={sending || !newMessage.recipientId || !newMessage.content}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Inbox className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-sm text-muted-foreground">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <MailOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.isRead).length}</p>
              <p className="text-sm text-muted-foreground">Read</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.messageType === 'direct').length}</p>
              <p className="text-sm text-muted-foreground">Direct</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <Card className="glass-card border-white/20 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No messages found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (!message.isRead) {
                          handleMarkAsRead(message.id)
                        }
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'glass-subtle hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                            {getInitials(message.senderId)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium truncate ${!message.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {message.subject || 'No Subject'}
                            </p>
                            {!message.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.messageType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardContent className="p-6">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                        {getInitials(selectedMessage.senderId)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedMessage.subject || 'No Subject'}</h3>
                      <p className="text-sm text-muted-foreground">From: {selectedMessage.senderId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedMessage.messageType}</Badge>
                    {selectedMessage.priority && (
                      <Badge className={
                        selectedMessage.priority === 'urgent' ? 'bg-red-500/20 text-red-600' :
                        selectedMessage.priority === 'high' ? 'bg-orange-500/20 text-orange-600' :
                        'bg-gray-500/20 text-gray-600'
                      }>
                        {selectedMessage.priority}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatDate(selectedMessage.createdAt)}
                </div>

                <div className="pt-4 border-t border-white/20">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      className="glass-input flex-1"
                    />
                    <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Select a message</p>
                <p className="text-sm">Choose a message from the list to view its contents</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
