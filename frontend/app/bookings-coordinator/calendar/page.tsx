"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from "lucide-react"

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
]

const bookings = [
  { id: 1, title: "U-12 Soccer Training", facility: "Main Field", time: "09:00 - 11:00", status: "confirmed", attendees: 18 },
  { id: 2, title: "Adult Tennis Session", facility: "Court A", time: "10:00 - 12:00", status: "confirmed", attendees: 4 },
  { id: 3, title: "Basketball Practice", facility: "Indoor Court", time: "14:00 - 16:00", status: "pending", attendees: 12 },
  { id: 4, title: "Swimming Class", facility: "Main Pool", time: "16:00 - 17:00", status: "confirmed", attendees: 8 },
  { id: 5, title: "Yoga Session", facility: "Studio B", time: "18:00 - 19:00", status: "confirmed", attendees: 15 },
]

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Booking Calendar</h1>
          <p className="text-muted-foreground">View and manage all facility bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-lg font-semibold">January 2025</CardTitle>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Day</Button>
            <Button variant="outline" size="sm" className="bg-cyan-500/20 text-cyan-500 border-cyan-500/30">Week</Button>
            <Button variant="outline" size="sm">Month</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day, idx) => (
              <div key={day} className="text-center p-2">
                <p className="text-sm text-muted-foreground">{day}</p>
                <p className="text-lg font-semibold mt-1">{13 + idx}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="space-y-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer">
                  <div className={`w-1 h-12 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium">{booking.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.facility}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {booking.attendees}
                      </span>
                    </div>
                  </div>
                  <Badge className={booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {timeSlots.slice(0, 6).map((time) => (
              <div key={time} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10">
                <span className="text-sm text-muted-foreground w-12">{time}</span>
                <div className="flex-1 h-8 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-sm text-muted-foreground">
                  Available
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Facility Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Main Field", "Indoor Court", "Swimming Pool", "Tennis Courts", "Gym"].map((facility) => (
              <div key={facility} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <span className="font-medium">{facility}</span>
                <Badge className="bg-green-500/20 text-green-500">Available</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
