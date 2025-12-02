"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Search, Phone, Mail, Clock, ArrowRight, Plus } from "lucide-react"

const inquiries = [
  { id: 1, name: "Jennifer Martinez", subject: "Membership Information", channel: "phone", time: "10 min ago", status: "pending", priority: "high" },
  { id: 2, name: "Robert Chen", subject: "Class Schedule Question", channel: "email", time: "30 min ago", status: "pending", priority: "medium" },
  { id: 3, name: "Amanda Wilson", subject: "Birthday Party Booking", channel: "walk-in", time: "1 hour ago", status: "in-progress", priority: "medium" },
  { id: 4, name: "Michael Brown", subject: "Refund Request", channel: "phone", time: "2 hours ago", status: "resolved", priority: "high" },
  { id: 5, name: "Sarah Thompson", subject: "Group Lesson Inquiry", channel: "email", time: "3 hours ago", status: "resolved", priority: "low" },
]

const channelIcons = { phone: Phone, email: Mail, "walk-in": MessageSquare }
const priorityColors = { high: "bg-red-500/20 text-red-500", medium: "bg-yellow-500/20 text-yellow-500", low: "bg-green-500/20 text-green-500" }
const statusColors = { pending: "bg-blue-500/20 text-blue-500", "in-progress": "bg-purple-500/20 text-purple-500", resolved: "bg-green-500/20 text-green-500" }

export default function InquiriesPage() {
  const pendingCount = inquiries.filter(i => i.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
          <p className="text-muted-foreground">Manage customer inquiries and questions</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Log Inquiry
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-blue-500">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-purple-500">{inquiries.filter(i => i.status === "in-progress").length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-2xl font-bold text-green-500">{inquiries.filter(i => i.status === "resolved").length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search inquiries..." className="pl-10 glass-subtle border-white/20" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Inquiries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inquiries.map((inquiry) => {
            const ChannelIcon = channelIcons[inquiry.channel as keyof typeof channelIcons]
            return (
              <div key={inquiry.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <ChannelIcon className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.subject}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[inquiry.priority as keyof typeof priorityColors]}>{inquiry.priority}</Badge>
                  <Badge className={statusColors[inquiry.status as keyof typeof statusColors]}>{inquiry.status}</Badge>
                  <Button size="sm" variant="ghost" className="text-cyan-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
