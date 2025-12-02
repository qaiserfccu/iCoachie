"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Plus, ArrowRight, CheckCircle, XCircle } from "lucide-react"

const bookings = [
  { id: 1, facility: "Main Soccer Field", user: "U-12 Soccer Team", date: "Jan 16", time: "10:00 AM - 12:00 PM", status: "confirmed" },
  { id: 2, facility: "Indoor Court A", user: "Basketball Practice", date: "Jan 16", time: "2:00 PM - 4:00 PM", status: "confirmed" },
  { id: 3, facility: "Swimming Pool", user: "Swimming Lessons", date: "Jan 17", time: "9:00 AM - 11:00 AM", status: "pending" },
  { id: 4, facility: "Conference Room", user: "Parent Meeting", date: "Jan 17", time: "3:00 PM - 4:00 PM", status: "confirmed" },
  { id: 5, facility: "Fitness Center", user: "Staff Workout", date: "Jan 18", time: "6:00 AM - 7:00 AM", status: "cancelled" },
]

const statusColors = { confirmed: "bg-green-500/20 text-green-500", pending: "bg-yellow-500/20 text-yellow-500", cancelled: "bg-red-500/20 text-red-500" }

export default function FacilityBookingsPage() {
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length
  const pendingCount = bookings.filter(b => b.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Facility Bookings</h1>
          <p className="text-muted-foreground">View and manage bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-teal-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold text-green-500">{confirmedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-red-500">{bookings.filter(b => b.status === "cancelled").length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className={`flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors ${booking.status === "cancelled" ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-1 h-14 rounded-full bg-teal-500" />
                <div>
                  <p className="font-medium">{booking.facility}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {booking.user}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[booking.status as keyof typeof statusColors]}>{booking.status}</Badge>
                <Button size="sm" variant="ghost" className="text-teal-500">
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
