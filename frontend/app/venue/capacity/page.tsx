"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building, Edit } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const venues = [
  { id: 1, name: "Main Hall", capacity: 500, currentBooking: 200, availability: 60, type: "Hall" },
  { id: 2, name: "Conference Room A", capacity: 50, currentBooking: 0, availability: 100, type: "Room" },
  { id: 3, name: "Conference Room B", capacity: 30, currentBooking: 25, availability: 17, type: "Room" },
  { id: 4, name: "Banquet Hall", capacity: 300, currentBooking: 180, availability: 40, type: "Hall" },
  { id: 5, name: "Outdoor Area", capacity: 1000, currentBooking: 0, availability: 100, type: "Outdoor" },
  { id: 6, name: "Training Room", capacity: 40, currentBooking: 30, availability: 25, type: "Room" },
]

export default function CapacityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Capacity Planning</h1>
          <p className="text-muted-foreground">Monitor venue capacity and utilization</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <Edit className="w-4 h-4 mr-2" />Edit Capacities
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <Building className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Venues</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">1,920</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currently Booked</p>
                <p className="text-2xl font-bold">435</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Users className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="text-2xl font-bold">23%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Venue Capacity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {venues.map((venue) => (
              <div key={venue.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{venue.name}</h3>
                    <Badge variant="outline">{venue.type}</Badge>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{venue.currentBooking}</span>
                    <span className="text-muted-foreground"> / {venue.capacity}</span>
                  </div>
                </div>
                <Progress value={100 - venue.availability} className="h-3" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{venue.availability}% available</span>
                  <span>{venue.capacity - venue.currentBooking} spots remaining</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
