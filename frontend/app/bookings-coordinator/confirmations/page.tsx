"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  CheckCircle, XCircle, Clock, Search, Filter, 
  Mail, Phone, Calendar, User, MapPin, Send, RefreshCw
} from "lucide-react"

const pendingConfirmations = [
  { 
    id: "RES-006", 
    customer: "Michael Brown", 
    email: "michael@email.com",
    phone: "+1 555-0123",
    facility: "Main Field", 
    date: "Jan 17, 2025",
    time: "10:00 - 12:00",
    purpose: "Birthday Party",
    requestedAt: "2 hours ago",
    amount: "$200"
  },
  { 
    id: "RES-007", 
    customer: "Lisa Chen", 
    email: "lisa@company.com",
    phone: "+1 555-0124",
    facility: "Multi-Purpose Hall", 
    date: "Jan 20, 2025",
    time: "14:00 - 18:00",
    purpose: "Corporate Training",
    requestedAt: "5 hours ago",
    amount: "$600"
  },
  { 
    id: "RES-008", 
    customer: "Youth Soccer League", 
    email: "contact@youthsoccer.org",
    phone: "+1 555-0125",
    facility: "Main Field", 
    date: "Jan 22, 2025",
    time: "08:00 - 16:00",
    purpose: "Tournament",
    requestedAt: "1 day ago",
    amount: "$900"
  },
]

const recentConfirmations = [
  { id: "RES-005", customer: "Corporate Team", facility: "Multi-Purpose Hall", status: "confirmed", confirmedAt: "1 hour ago" },
  { id: "RES-004", customer: "Emily Davis", facility: "Swimming Pool", status: "confirmed", confirmedAt: "3 hours ago" },
  { id: "RES-003", customer: "Metro Sports Club", facility: "Indoor Court", status: "confirmed", confirmedAt: "5 hours ago" },
  { id: "RES-002", customer: "Sarah Johnson", facility: "Tennis Court A", status: "declined", confirmedAt: "6 hours ago" },
]

const stats = [
  { label: "Pending", value: pendingConfirmations.length, color: "text-yellow-500", bg: "bg-yellow-500/20" },
  { label: "Confirmed Today", value: 8, color: "text-green-500", bg: "bg-green-500/20" },
  { label: "Declined Today", value: 1, color: "text-red-500", bg: "bg-red-500/20" },
  { label: "Avg Response Time", value: "2.5h", color: "text-cyan-500", bg: "bg-cyan-500/20" },
]

export default function ConfirmationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Confirmations</h1>
          <p className="text-muted-foreground">Review and confirm pending reservations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-subtle border-white/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <Send className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="glass-card border-white/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                {stat.label === "Pending" ? <Clock className={`w-5 h-5 ${stat.color}`} /> :
                 stat.label.includes("Confirmed") ? <CheckCircle className={`w-5 h-5 ${stat.color}`} /> :
                 stat.label.includes("Declined") ? <XCircle className={`w-5 h-5 ${stat.color}`} /> :
                 <RefreshCw className={`w-5 h-5 ${stat.color}`} />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Pending Confirmations</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-48 glass-subtle border-white/20" />
            </div>
            <Button variant="outline" size="icon" className="glass-subtle border-white/20">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingConfirmations.map((reservation) => (
            <div key={reservation.id} className="p-4 rounded-xl glass-subtle border border-yellow-500/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
                      <span className="font-mono text-sm">{reservation.id}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{reservation.requestedAt}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{reservation.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{reservation.facility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{reservation.date} • {reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{reservation.purpose}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <p className="text-xl font-bold text-cyan-500">{reservation.amount}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10">
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Confirmations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentConfirmations.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div className="flex items-center gap-4">
                  {item.status === 'confirmed' ? (
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.customer}</p>
                    <p className="text-sm text-muted-foreground">{item.facility} • {item.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={item.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                    {item.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{item.confirmedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
