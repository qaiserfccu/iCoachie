"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const bookings = [
  {
    id: "BK001",
    client: "Emma Davis",
    avatar: "ED",
    type: "Swimming Lesson",
    date: "Nov 29, 2024",
    time: "2:00 PM",
    duration: "1h",
    amount: "$75",
    status: "confirmed",
  },
  {
    id: "BK002",
    client: "Jack Wilson",
    avatar: "JW",
    type: "Private Training",
    date: "Nov 29, 2024",
    time: "4:00 PM",
    duration: "1.5h",
    amount: "$100",
    status: "confirmed",
  },
  {
    id: "BK003",
    client: "Sophie Miller",
    avatar: "SM",
    type: "Swimming Lesson",
    date: "Nov 30, 2024",
    time: "10:00 AM",
    duration: "1h",
    amount: "$75",
    status: "pending",
  },
  {
    id: "BK004",
    client: "Lucas Brown",
    avatar: "LB",
    type: "Trial Session",
    date: "Nov 30, 2024",
    time: "3:00 PM",
    duration: "45m",
    amount: "$50",
    status: "pending",
  },
  {
    id: "BK005",
    client: "Olivia Johnson",
    avatar: "OJ",
    type: "Swimming Lesson",
    date: "Nov 28, 2024",
    time: "11:00 AM",
    duration: "1h",
    amount: "$75",
    status: "completed",
  },
  {
    id: "BK006",
    client: "Noah Williams",
    avatar: "NW",
    type: "Private Training",
    date: "Nov 27, 2024",
    time: "2:00 PM",
    duration: "1.5h",
    amount: "$100",
    status: "cancelled",
  },
]

const bookingStats = [
  { label: "Confirmed", count: 8, icon: CheckCircle, color: "text-green-500 bg-green-500/20" },
  { label: "Pending", count: 4, icon: AlertCircle, color: "text-yellow-500 bg-yellow-500/20" },
  { label: "Completed", count: 24, icon: Calendar, color: "text-blue-500 bg-blue-500/20" },
  { label: "Cancelled", count: 2, icon: XCircle, color: "text-red-500 bg-red-500/20" },
]

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">Manage your session bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bookingStats.map((stat) => (
          <Card key={stat.label} className="glass-card border-white/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Bookings</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto w-48"
                />
              </div>
              <Button variant="outline" size="icon" className="glass-subtle border-white/20 bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10 hover:bg-white/10">
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/.jpg?key=lqfad&height=40&width=40&query=${booking.client}`}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-sm">
                            {booking.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{booking.client}</span>
                      </div>
                    </TableCell>
                    <TableCell>{booking.type}</TableCell>
                    <TableCell>
                      <div>
                        <p>{booking.date}</p>
                        <p className="text-sm text-muted-foreground">{booking.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.duration}</TableCell>
                    <TableCell className="font-medium text-green-500">{booking.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-500/20 text-green-600"
                            : booking.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-600"
                              : booking.status === "completed"
                                ? "bg-blue-500/20 text-blue-600"
                                : "bg-red-500/20 text-red-600"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10 bg-transparent"
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                      {booking.status === "confirmed" && (
                        <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
