"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MessageSquare, Calendar, Star, DollarSign } from "lucide-react"

const clients = [
  {
    id: 1,
    name: "Emma Davis",
    avatar: "ED",
    sessions: 12,
    totalSpent: "$900",
    rating: 5,
    lastSession: "Today",
    nextSession: "Dec 2, 2024",
    status: "Active",
  },
  {
    id: 2,
    name: "Jack Wilson",
    avatar: "JW",
    sessions: 8,
    totalSpent: "$600",
    rating: 5,
    lastSession: "Yesterday",
    nextSession: "Dec 1, 2024",
    status: "Active",
  },
  {
    id: 3,
    name: "Sophie Miller",
    avatar: "SM",
    sessions: 6,
    totalSpent: "$450",
    rating: 4,
    lastSession: "2 days ago",
    nextSession: "Nov 30, 2024",
    status: "Active",
  },
  {
    id: 4,
    name: "Lucas Brown",
    avatar: "LB",
    sessions: 3,
    totalSpent: "$150",
    rating: 5,
    lastSession: "1 week ago",
    nextSession: "Pending",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Olivia Johnson",
    avatar: "OJ",
    sessions: 10,
    totalSpent: "$750",
    rating: 5,
    lastSession: "3 days ago",
    nextSession: "Dec 3, 2024",
    status: "Active",
  },
  {
    id: 6,
    name: "Noah Williams",
    avatar: "NW",
    sessions: 4,
    totalSpent: "$300",
    rating: 4,
    lastSession: "5 days ago",
    nextSession: "Pending",
    status: "Inactive",
  },
]

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto" />
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`/.jpg?key=5eabz&height=56&width=56&query=${client.name}`} />
                    <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-lg">
                      {client.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(client.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <Badge
                  className={
                    client.status === "Active" ? "bg-green-500/20 text-green-600" : "bg-gray-500/20 text-gray-500"
                  }
                >
                  {client.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{client.sessions} sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-medium">{client.totalSpent}</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4 space-y-1">
                <p>Last session: {client.lastSession}</p>
                <p>Next: {client.nextSession}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                <Button size="sm" variant="outline" className="flex-1 glass-subtle border-white/20 bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Calendar className="w-4 h-4 mr-1" />
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
