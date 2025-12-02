"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Plus, CheckCircle, Clock, XCircle, Eye } from "lucide-react"

const bookings = [
  { id: 1, venue: "Main Hall", client: "ABC Corp", event: "Conference", date: "Jan 20, 2024", time: "9:00 AM - 5:00 PM", guests: 150, status: "confirmed" },
  { id: 2, venue: "Conference Room A", client: "XYZ Ltd", event: "Meeting", date: "Jan 21, 2024", time: "2:00 PM - 4:00 PM", guests: 20, status: "pending" },
  { id: 3, venue: "Outdoor Area", client: "Sports Club", event: "Tournament", date: "Jan 22, 2024", time: "8:00 AM - 6:00 PM", guests: 200, status: "confirmed" },
  { id: 4, venue: "Banquet Hall", client: "Johnson Family", event: "Wedding Reception", date: "Jan 25, 2024", time: "6:00 PM - 11:00 PM", guests: 180, status: "confirmed" },
  { id: 5, venue: "Training Room", client: "Tech Training", event: "Workshop", date: "Jan 26, 2024", time: "10:00 AM - 3:00 PM", guests: 30, status: "cancelled" },
]

export default function VenueBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Venue Bookings</h1>
          <p className="text-muted-foreground">Manage venue reservations and bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" />New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <CalendarDays className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">19</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.venue}</TableCell>
                  <TableCell>{booking.client}</TableCell>
                  <TableCell>{booking.event}</TableCell>
                  <TableCell>
                    <div>
                      <p>{booking.date}</p>
                      <p className="text-sm text-muted-foreground">{booking.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.status === "confirmed" ? "default" :
                      booking.status === "pending" ? "secondary" : "destructive"
                    }>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
