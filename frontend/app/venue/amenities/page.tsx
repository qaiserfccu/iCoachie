"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, Check, Wifi, Car, Coffee, Mic, Monitor, Wind } from "lucide-react"

const amenities = [
  { id: 1, name: "Wi-Fi", icon: Wifi, venues: ["All Venues"], status: "available" },
  { id: 2, name: "Parking", icon: Car, venues: ["Main Hall", "Outdoor Area", "Stadium"], status: "available" },
  { id: 3, name: "Catering", icon: Coffee, venues: ["Main Hall", "Banquet Hall", "Conference Rooms"], status: "available" },
  { id: 4, name: "Sound System", icon: Mic, venues: ["Main Hall", "Banquet Hall", "Outdoor Area"], status: "available" },
  { id: 5, name: "Projector & Screen", icon: Monitor, venues: ["All Indoor Venues"], status: "available" },
  { id: 6, name: "Air Conditioning", icon: Wind, venues: ["All Indoor Venues"], status: "maintenance" },
]

const venueAmenities = [
  { venue: "Main Hall", amenities: ["Wi-Fi", "Parking", "Catering", "Sound System", "Projector", "A/C"], rating: 4.8 },
  { venue: "Banquet Hall", amenities: ["Wi-Fi", "Catering", "Sound System", "Projector", "A/C"], rating: 4.6 },
  { venue: "Conference Room A", amenities: ["Wi-Fi", "Projector", "A/C", "Whiteboard"], rating: 4.5 },
  { venue: "Outdoor Area", amenities: ["Wi-Fi", "Parking", "Sound System", "Lighting"], rating: 4.7 },
]

export default function AmenitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Amenities</h1>
          <p className="text-muted-foreground">Manage venue amenities and features</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Add Amenity
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Available Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="p-4 rounded-xl glass-subtle flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-500/20">
                    <amenity.icon className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="font-medium">{amenity.name}</p>
                    <p className="text-sm text-muted-foreground">{amenity.venues.join(", ")}</p>
                  </div>
                </div>
                <Badge variant={amenity.status === "available" ? "default" : "secondary"}>
                  {amenity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Venue Amenity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {venueAmenities.map((venue, index) => (
              <div key={index} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{venue.venue}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{venue.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
