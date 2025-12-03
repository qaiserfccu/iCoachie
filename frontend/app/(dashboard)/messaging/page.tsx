"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  MessageSquarePlus,
  Check,
  CheckCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  mockConversations,
  mockMessages,
  mockUsers,
  type MockConversation,
} from "@/lib/services/mockDataService"

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<MockConversation | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const currentUser = mockUsers.coach

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const messages = selectedConversation ? mockMessages[selectedConversation.id] || [] : []

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    // In a real app, this would send the message
    setMessageInput("")
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-4 p-4">
      {/* Conversations List */}
      <Card
        className={cn(
          "glass-card border-white/20 w-full md:w-96 flex flex-col",
          selectedConversation && "hidden md:flex"
        )}
      >
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <Button size="icon" variant="ghost" className="rounded-xl">
              <MessageSquarePlus className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                  "hover:bg-white/10",
                  selectedConversation?.id === conversation.id && "bg-white/10 border-l-4 border-primary"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {conversation.participantAvatar}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{conversation.participantName}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate pr-2">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs h-5 min-w-[20px] flex items-center justify-center">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card
        className={cn(
          "glass-card border-white/20 flex-1 flex flex-col",
          !selectedConversation && "hidden md:flex"
        )}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-xl"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {selectedConversation.participantAvatar}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedConversation.participantName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.isOnline ? "Online" : "Offline"} • {selectedConversation.participantRole}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex items-end gap-2", message.isOwn && "flex-row-reverse")}
                  >
                    {!message.isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                          {message.senderAvatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        message.isOwn
                          ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-md"
                          : "glass-subtle rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1",
                          message.isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        <span className={cn("text-xs", message.isOwn ? "text-white/70" : "text-muted-foreground")}>
                          {message.timestamp}
                        </span>
                        {message.isOwn && (
                          <span className="text-white/70">
                            {message.status === "read" ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  className="rounded-xl gradient-primary"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <MessageSquarePlus className="w-12 h-12 opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-sm text-center max-w-sm">
              Choose a conversation from the list to start messaging or create a new one
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}