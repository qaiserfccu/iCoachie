"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, Plus, MapPin, Users, DollarSign, ArrowRight, Calendar } from "lucide-react"

const venues = [
  { id: 1, name: "Main Soccer Field", type: "field", capacity: 500, status: "available", hourlyRate: 150, bookings: 12 },
  { id: 2, name: "Indoor Court A", type: "court", capacity: 200, status: "available", hourlyRate: 100, bookings: 18 },
  { id: 3, name: "Swimming Pool", type: "pool", capacity: 150, status: "maintenance", hourlyRate: 200, bookings: 0 },
  { id: 4, name: "Fitness Center", type: "gym", capacity: 50, status: "available", hourlyRate: 30, bookings: 45 },
  { id: 5, name: "Tennis Courts", type: "court", capacity: 40, status: "available", hourlyRate: 80, bookings: 22 },
  { id: 6, name: "Conference Room", type: "room", capacity: 30, status: "occupied", hourlyRate: 50, bookings: 8 },
]

const statusColors = { available: "bg-green-500/20 text-green-500", occupied: "bg-blue-500/20 text-blue-500", maintenance: "bg-orange-500/20 text-orange-500" }

export default function VenuesPage() {
  const availableCount = venues.filter(v => v.status === "available").length
  const totalBookings = venues.reduce((sum, v) => sum + v.bookings, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Venues</h1>
          <p className="text-muted-foreground">Manage facility venues and spaces</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Venue
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Venues</p>
              <p className="text-2xl font-bold">{venues.length}</p>
            </div>
            <Building className="w-8 h-8 text-teal-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-500">{availableCount}</p>
            </div>
            <MapPin className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month Bookings</p>
              <p className="text-2xl font-bold text-blue-500">{totalBookings}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
              <p className="text-2xl font-bold text-purple-500">{venues.reduce((sum, v) => sum + v.capacity, 0)}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Venues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {venues.map((venue) => (
            <div key={venue.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Building className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{venue.type} • Capacity: {venue.capacity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-green-500">${venue.hourlyRate}/hr</p>
                  <p className="text-xs text-muted-foreground">{venue.bookings} bookings</p>
                </div>
                <Badge className={statusColors[venue.status as keyof typeof statusColors]}>{venue.status}</Badge>
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
