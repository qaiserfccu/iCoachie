"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus, Eye, Clock, CheckCircle, ArrowRight, Edit } from "lucide-react"

const announcements = [
  { id: 1, title: "Welcome to the New Season!", audience: "All", priority: "high", status: "published", views: 1250, publishDate: "Jan 10, 2024" },
  { id: 2, title: "Schedule Changes for Next Week", audience: "Students", priority: "high", status: "published", views: 890, publishDate: "Jan 12, 2024" },
  { id: 3, title: "Holiday Schedule Update", audience: "All", priority: "medium", status: "draft", views: 0, publishDate: null },
  { id: 4, title: "New Coach Introduction", audience: "Parents", priority: "low", status: "scheduled", views: 0, publishDate: "Jan 20, 2024" },
  { id: 5, title: "Equipment Pickup Information", audience: "Students", priority: "medium", status: "published", views: 456, publishDate: "Jan 8, 2024" },
]

const priorityColors = { high: "bg-red-500/20 text-red-500", medium: "bg-yellow-500/20 text-yellow-500", low: "bg-green-500/20 text-green-500" }
const statusColors = { published: "bg-green-500/20 text-green-500", draft: "bg-gray-500/20 text-gray-500", scheduled: "bg-blue-500/20 text-blue-500" }

export default function AnnouncementsPage() {
  const publishedCount = announcements.filter(a => a.status === "published").length
  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Create and manage announcements</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{announcements.length}</p>
            </div>
            <Megaphone className="w-8 h-8 text-violet-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold text-green-500">{publishedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold text-blue-500">{announcements.filter(a => a.status === "scheduled").length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold text-purple-500">{totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground">Audience: {announcement.audience} • {announcement.publishDate || "Not scheduled"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {announcement.views > 0 && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {announcement.views}
                  </span>
                )}
                <Badge className={priorityColors[announcement.priority as keyof typeof priorityColors]}>{announcement.priority}</Badge>
                <Badge className={statusColors[announcement.status as keyof typeof statusColors]}>{announcement.status}</Badge>
                <Button size="sm" variant="ghost" className="text-violet-500">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
