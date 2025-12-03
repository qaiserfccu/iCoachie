"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, Filter, Plus, ArrowRight, Clock, AlertTriangle, 
  CheckCircle, MessageSquare, Loader2 
} from "lucide-react"
import { useState, useEffect } from "react"
import { systemSupportService, type Ticket } from "@/lib/services"
import Link from "next/link"

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
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [stats, setStats] = useState({ open: 0, inProgress: 0, urgent: 0 })

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await systemSupportService.getTickets({
          status: selectedStatus || undefined,
          search: searchQuery || undefined,
          pageSize: 50
        })
        setTickets(data.tickets)
        setStats(data.stats)
      } catch (err) {
        console.error('Error fetching tickets:', err)
        setError('Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [searchQuery, selectedStatus])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

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

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <p className="text-2xl font-bold">{stats.open}</p>
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
              <p className="text-2xl font-bold">{stats.inProgress}</p>
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
              <p className="text-2xl font-bold">{stats.urgent}</p>
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
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tickets found matching your criteria
            </div>
          ) : (
            filteredTickets.map((ticket) => (
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
                  <Link href={`/system-support/tickets/${ticket.id}`}>
                    <Button size="sm" variant="ghost" className="text-purple-500">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
