"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { 
  MessageSquare, Send, Users, Bell, Mail, 
  Plus, Search, Clock, CheckCheck, AlertCircle
} from "lucide-react"
import { headCoachService } from "@/lib/services/headCoachService"

interface Message {
  id: number
  from: string
  role: string
  avatar: string
  content: string
  time: string
  unread: boolean
}

interface Announcement {
  id: number
  title: string
  content: string
  date: string
  audience: string
  status: 'sent' | 'scheduled' | 'draft'
}

interface TeamChannel {
  id: number
  name: string
  members: number
  lastMessage: string
  unread: number
}

export default function CommunicationPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [channels, setChannels] = useState<TeamChannel[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const fallbackMessages: Message[] = [
    { id: 1, from: "Sarah Williams", role: "Assistant Coach", avatar: "SW", content: "The training equipment has been set up for tomorrow's session.", time: "2 hours ago", unread: true },
    { id: 2, from: "Mike Johnson", role: "Fitness Coach", avatar: "MJ", content: "Completed the fitness assessments for the U-12 team.", time: "4 hours ago", unread: true },
    { id: 3, from: "David Brown", role: "Assistant Coach", avatar: "DB", content: "Need to discuss the match strategy for next week.", time: "Yesterday", unread: false },
    { id: 4, from: "Emily Chen", role: "Sports Psychologist", avatar: "EC", content: "Mental training session scheduled for Friday.", time: "2 days ago", unread: false },
  ]

  const fallbackAnnouncements: Announcement[] = [
    { id: 1, title: "Weekly Training Schedule Update", content: "New training times have been published for next week.", date: "Jan 18, 2024", audience: "All Coaches", status: "sent" },
    { id: 2, title: "Tournament Preparation Meeting", content: "Mandatory meeting for all coaches on Friday at 9 AM.", date: "Jan 20, 2024", audience: "Coaching Staff", status: "scheduled" },
    { id: 3, title: "Equipment Inventory Check", content: "Please submit equipment needs by end of week.", date: "Jan 22, 2024", audience: "All Staff", status: "draft" },
  ]

  const fallbackChannels: TeamChannel[] = [
    { id: 1, name: "Coaching Staff", members: 8, lastMessage: "Meeting reminder for tomorrow", unread: 3 },
    { id: 2, name: "U-12 Soccer Team", members: 22, lastMessage: "Great practice today!", unread: 0 },
    { id: 3, name: "U-14 Basketball", members: 15, lastMessage: "Game day prep checklist", unread: 1 },
    { id: 4, name: "Training Coordinators", members: 5, lastMessage: "Schedule confirmed", unread: 0 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch staff to create message list
        const staff = await headCoachService.getStaffMembers()
        
        // Generate messages from staff data
        const realMessages: Message[] = staff.slice(0, 4).map((s, idx) => ({
          id: s.id,
          from: s.name,
          role: s.role,
          avatar: s.name.split(' ').map(n => n[0]).join(''),
          content: `Update from ${s.specialty} department.`,
          time: idx === 0 ? "Just now" : idx === 1 ? "1 hour ago" : `${idx} hours ago`,
          unread: idx < 2
        }))

        setMessages(realMessages.length > 0 ? realMessages : fallbackMessages)
        setAnnouncements(fallbackAnnouncements)
        setChannels(fallbackChannels)
      } catch (err) {
        console.error('Failed to fetch communication data:', err)
        setError('Failed to load communication data. Using fallback data.')
        setMessages(fallbackMessages)
        setAnnouncements(fallbackAnnouncements)
        setChannels(fallbackChannels)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const unreadCount = messages.filter(m => m.unread).length
  const totalChannelUnread = channels.reduce((sum, c) => sum + c.unread, 0)

  const statusConfig = {
    sent: { color: "bg-green-500/20 text-green-500" },
    scheduled: { color: "bg-blue-500/20 text-blue-500" },
    draft: { color: "bg-yellow-500/20 text-yellow-500" },
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Communication</h1>
            <p className="text-muted-foreground">Messages, announcements, and team channels</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Communication</h1>
          <p className="text-muted-foreground">Messages, announcements, and team channels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Bell className="w-4 h-4 mr-2" />
            Announcement
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unread Messages</p>
              <p className="text-2xl font-bold text-orange-500">{unreadCount}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Team Channels</p>
              <p className="text-2xl font-bold text-blue-500">{channels.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Announcements</p>
              <p className="text-2xl font-bold text-purple-500">{announcements.length}</p>
            </div>
            <Bell className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Channel Notifications</p>
              <p className="text-2xl font-bold text-green-500">{totalChannelUnread}</p>
            </div>
            <Mail className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Messages</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 bg-white/10 border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-4 p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer ${message.unread ? 'border-l-4 border-orange-500' : ''}`}>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm">
                    {message.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{message.from}</p>
                      {message.unread && (
                        <Badge className="bg-orange-500/20 text-orange-500 text-xs">New</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {message.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.role}</p>
                  <p className="text-sm mt-1 truncate">{message.content}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20">
              View All Messages
            </Button>
          </CardContent>
        </Card>

        {/* Channels & Announcements */}
        <div className="space-y-6">
          {/* Team Channels */}
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Team Channels</CardTitle>
              <Button size="sm" variant="ghost" className="text-orange-500">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {channels.map((channel) => (
                <div key={channel.id} className="flex items-center justify-between p-3 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.members} members</p>
                    </div>
                  </div>
                  {channel.unread > 0 && (
                    <Badge className="bg-orange-500 text-white">{channel.unread}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-3 rounded-xl glass-subtle">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <Badge className={statusConfig[announcement.status].color}>
                      {announcement.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{announcement.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{announcement.audience}</span>
                    <span>{announcement.date}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full glass-subtle border-white/20">
                View All Announcements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
