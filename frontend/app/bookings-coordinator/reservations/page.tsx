"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, Search, Filter, Calendar, Clock, MapPin, 
  User, MoreVertical, Edit, Trash2, Eye 
} from "lucide-react"

const reservations = [
  { 
    id: "RES-001", 
    customer: "John Smith", 
    facility: "Main Field", 
    date: "Jan 15, 2025",
    time: "09:00 - 11:00",
    purpose: "Soccer Training",
    status: "confirmed",
    amount: "$150"
  },
  { 
    id: "RES-002", 
    customer: "Sarah Johnson", 
    facility: "Tennis Court A", 
    date: "Jan 15, 2025",
    time: "14:00 - 16:00",
    purpose: "Private Lesson",
    status: "pending",
    amount: "$80"
  },
  { 
    id: "RES-003", 
    customer: "Metro Sports Club", 
    facility: "Indoor Court", 
    date: "Jan 16, 2025",
    time: "10:00 - 12:00",
    purpose: "Basketball Tournament",
    status: "confirmed",
    amount: "$300"
  },
  { 
    id: "RES-004", 
    customer: "Emily Davis", 
    facility: "Swimming Pool", 
    date: "Jan 16, 2025",
    time: "15:00 - 16:00",
    purpose: "Swim Class",
    status: "confirmed",
    amount: "$45"
  },
  { 
    id: "RES-005", 
    customer: "Corporate Team", 
    facility: "Multi-Purpose Hall", 
    date: "Jan 18, 2025",
    time: "09:00 - 17:00",
    purpose: "Team Building Event",
    status: "pending",
    amount: "$1,200"
  },
]

const stats = [
  { label: "Today's Reservations", value: "12", change: "+3 from yesterday" },
  { label: "Pending Confirmations", value: "5", change: "Awaiting approval" },
  { label: "This Week Revenue", value: "$4,850", change: "+12% vs last week" },
  { label: "Occupancy Rate", value: "78%", change: "+5% this month" },
]

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground">Manage all facility reservations</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="glass-card border-white/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">All Reservations</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reservations..." className="pl-10 w-64 glass-subtle border-white/20" />
            </div>
            <Button variant="outline" size="icon" className="glass-subtle border-white/20">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reservation ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Facility</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Purpose</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 font-mono text-sm">{res.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {res.customer}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {res.facility}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {res.date}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {res.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{res.purpose}</td>
                    <td className="py-3 px-4">
                      <Badge className={res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
                        {res.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{res.amount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
