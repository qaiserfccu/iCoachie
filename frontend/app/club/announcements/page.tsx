"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Plus,
  Send,
  Clock,
  Users,
  Loader2,
  AlertCircle,
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import messagingService, { Message } from "@/lib/services/messagingService"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newAnnouncementOpen, setNewAnnouncementOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    subject: '',
    content: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
  })

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setLoading(true)
        setError(null)

        const data = await messagingService.getAnnouncements()
        setAnnouncements(data)
      } catch (err) {
        console.error('Failed to fetch announcements:', err)
        setError('Failed to load announcements. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  // Handle creating new announcement
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.subject || !newAnnouncement.content) return

    try {
      setSending(true)
      // For club-wide announcements, we would need to get all member IDs
      // For now, we'll send to a placeholder - in production this would broadcast to all
      await messagingService.createAnnouncement({
        recipientIds: ['all'], // This would be replaced with actual member IDs
        subject: newAnnouncement.subject,
        content: newAnnouncement.content,
        priority: newAnnouncement.priority,
      })

      setNewAnnouncementOpen(false)
      setNewAnnouncement({ subject: '', content: '', priority: 'normal' })

      // Refresh announcements
      const data = await messagingService.getAnnouncements()
      setAnnouncements(data)
    } catch (err) {
      console.error('Failed to create announcement:', err)
    } finally {
      setSending(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get priority icon
  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      case 'low':
        return <Info className="w-4 h-4 text-gray-500" />
      default:
        return <Bell className="w-4 h-4 text-blue-500" />
    }
  }

  // Get priority badge color
  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-600'
      case 'high':
        return 'bg-orange-500/20 text-orange-600'
      case 'low':
        return 'bg-gray-500/20 text-gray-600'
      default:
        return 'bg-blue-500/20 text-blue-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading announcements...</p>
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
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Broadcast important updates to club members</p>
        </div>
        <Dialog open={newAnnouncementOpen} onOpenChange={setNewAnnouncementOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  placeholder="Announcement subject..."
                  value={newAnnouncement.subject}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, subject: e.target.value }))}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <Select
                  value={newAnnouncement.priority}
                  onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') =>
                    setNewAnnouncement(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea
                  placeholder="Type your announcement..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  className="glass-input min-h-[150px]"
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                onClick={handleCreateAnnouncement}
                disabled={sending || !newAnnouncement.subject || !newAnnouncement.content}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Megaphone className="w-4 h-4 mr-2" />
                )}
                Broadcast Announcement
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
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{announcements.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {announcements.filter(a => a.priority === 'urgent').length}
              </p>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {announcements.filter(a => a.priority === 'high').length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {announcements.filter(a => a.isRead).length}
              </p>
              <p className="text-sm text-muted-foreground">Read by All</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No announcements yet</p>
              <p className="text-sm mt-1">Create your first announcement to notify club members</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
                        {getPriorityIcon(announcement.priority)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{announcement.subject}</h3>
                          <Badge className={getPriorityBadge(announcement.priority)}>
                            {announcement.priority || 'normal'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(announcement.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            All Members
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
