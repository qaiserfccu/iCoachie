"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, Filter, Plus, ArrowRight, Clock, AlertTriangle, 
  CheckCircle, MessageSquare, MoreVertical 
} from "lucide-react"
import { useState } from "react"

const tickets = [
  { id: "TKT-1234", user: "John Smith", email: "john@email.com", issue: "Cannot login to account", priority: "high", status: "open", time: "5 min ago", avatar: "JS", category: "technical", responses: 2 },
  { id: "TKT-1233", user: "Sarah Wilson", email: "sarah@email.com", issue: "Payment processing failed", priority: "urgent", status: "in-progress", time: "15 min ago", avatar: "SW", category: "billing", responses: 5 },
  { id: "TKT-1232", user: "Mike Johnson", email: "mike@email.com", issue: "Session booking not showing", priority: "medium", status: "open", time: "32 min ago", avatar: "MJ", category: "technical", responses: 1 },
  { id: "TKT-1231", user: "Elite Sports Academy", email: "elite@academy.com", issue: "Bulk user import failing", priority: "high", status: "open", time: "1 hour ago", avatar: "ES", category: "technical", responses: 3 },
  { id: "TKT-1230", user: "Lisa Garcia", email: "lisa@email.com", issue: "Invoice discrepancy", priority: "medium", status: "resolved", time: "2 hours ago", avatar: "LG", category: "billing", responses: 4 },
  { id: "TKT-1229", user: "David Brown", email: "david@email.com", issue: "Mobile app crashes on startup", priority: "high", status: "in-progress", time: "3 hours ago", avatar: "DB", category: "technical", responses: 6 },
  { id: "TKT-1228", user: "Emma Davis", email: "emma@email.com", issue: "Password reset not working", priority: "low", status: "closed", time: "1 day ago", avatar: "ED", category: "account", responses: 2 },
  { id: "TKT-1227", user: "James Miller", email: "james@email.com", issue: "Feature request: Dark mode", priority: "low", status: "open", time: "2 days ago", avatar: "JM", category: "feature-request", responses: 0 },
]

const priorityColors = {
  urgent: "bg-red-500/20 text-red-500",
  high: "bg-orange-500/20 text-orange-500",
  medium: "bg-yellow-500/20 text-yellow-600",
  low: "bg-green-500/20 text-green-500",
}

const statusColors = {
  open: "bg-blue-500/20 text-blue-500",
  "in-progress": "bg-purple-500/20 text-purple-500",
  resolved: "bg-green-500/20 text-green-500",
  closed: "bg-gray-500/20 text-gray-500",
}

const categoryColors = {
  technical: "bg-blue-500/20 text-blue-500",
  billing: "bg-emerald-500/20 text-emerald-500",
  account: "bg-orange-500/20 text-orange-500",
  "feature-request": "bg-purple-500/20 text-purple-500",
  other: "bg-gray-500/20 text-gray-500",
}

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || ticket.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const openCount = tickets.filter(t => t.status === "open").length
  const inProgressCount = tickets.filter(t => t.status === "in-progress").length
  const urgentCount = tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and respond to user support requests</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <p className="text-2xl font-bold">{openCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="text-2xl font-bold">{urgentCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets by ID, user, or issue..."
                className="pl-10 glass-subtle border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(null)}
                className={selectedStatus === null ? "bg-purple-500" : "glass-subtle border-white/20"}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === "open" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("open")}
                className={selectedStatus === "open" ? "bg-blue-500" : "glass-subtle border-white/20"}
              >
                Open
              </Button>
              <Button
                variant={selectedStatus === "in-progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("in-progress")}
                className={selectedStatus === "in-progress" ? "bg-purple-500" : "glass-subtle border-white/20"}
              >
                In Progress
              </Button>
              <Button
                variant={selectedStatus === "resolved" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("resolved")}
                className={selectedStatus === "resolved" ? "bg-green-500" : "glass-subtle border-white/20"}
              >
                Resolved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Tickets ({filteredTickets.length})</CardTitle>
          <Button variant="ghost" size="sm" className="text-purple-500">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-sm">
                    {ticket.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{ticket.id}</span>
                    <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={categoryColors[ticket.category as keyof typeof categoryColors]}>
                      {ticket.category}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{ticket.issue}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.user} • {ticket.email} • {ticket.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                    {ticket.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticket.responses} responses
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="text-purple-500">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
