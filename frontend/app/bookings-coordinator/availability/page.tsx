"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Clock, Calendar, Settings, ChevronRight, Plus, Edit } from "lucide-react"

const facilities = [
  { 
    id: 1, 
    name: "Main Soccer Field", 
    type: "Outdoor",
    hours: "06:00 - 22:00",
    available: true,
    bookedSlots: 4,
    totalSlots: 8,
  },
  { 
    id: 2, 
    name: "Indoor Basketball Court", 
    type: "Indoor",
    hours: "08:00 - 21:00",
    available: true,
    bookedSlots: 6,
    totalSlots: 10,
  },
  { 
    id: 3, 
    name: "Swimming Pool", 
    type: "Indoor",
    hours: "06:00 - 20:00",
    available: true,
    bookedSlots: 5,
    totalSlots: 7,
  },
  { 
    id: 4, 
    name: "Tennis Courts (A-D)", 
    type: "Outdoor",
    hours: "07:00 - 21:00",
    available: true,
    bookedSlots: 8,
    totalSlots: 12,
  },
  { 
    id: 5, 
    name: "Multi-Purpose Hall", 
    type: "Indoor",
    hours: "08:00 - 22:00",
    available: false,
    bookedSlots: 0,
    totalSlots: 6,
    note: "Under maintenance"
  },
]

const timeSlots = [
  { time: "06:00 - 08:00", status: "available" },
  { time: "08:00 - 10:00", status: "booked", by: "U-12 Soccer" },
  { time: "10:00 - 12:00", status: "available" },
  { time: "12:00 - 14:00", status: "blocked", reason: "Maintenance" },
  { time: "14:00 - 16:00", status: "booked", by: "Adult League" },
  { time: "16:00 - 18:00", status: "available" },
  { time: "18:00 - 20:00", status: "booked", by: "Youth Training" },
  { time: "20:00 - 22:00", status: "available" },
]

const weeklyHours = [
  { day: "Monday", open: "06:00", close: "22:00", closed: false },
  { day: "Tuesday", open: "06:00", close: "22:00", closed: false },
  { day: "Wednesday", open: "06:00", close: "22:00", closed: false },
  { day: "Thursday", open: "06:00", close: "22:00", closed: false },
  { day: "Friday", open: "06:00", close: "22:00", closed: false },
  { day: "Saturday", open: "08:00", close: "20:00", closed: false },
  { day: "Sunday", open: "08:00", close: "18:00", closed: false },
]

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Availability Management</h1>
          <p className="text-muted-foreground">Manage facility availability and time slots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Calendar className="w-4 h-4 mr-2" />
            Block Dates
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Facility Availability</CardTitle>
              <Button variant="ghost" size="sm" className="text-cyan-500">
                <Plus className="w-4 h-4 mr-1" />
                Add Facility
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {facilities.map((facility) => (
                <div key={facility.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                      <p className="font-medium">{facility.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>{facility.type}</span>
                        <span>•</span>
                        <span>{facility.hours}</span>
                        {facility.note && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-500">{facility.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{facility.bookedSlots}/{facility.totalSlots} slots</p>
                      <div className="w-24 h-2 bg-white/10 rounded-full mt-1">
                        <div 
                          className="h-full bg-cyan-500 rounded-full" 
                          style={{ width: `${(facility.bookedSlots / facility.totalSlots) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Switch checked={facility.available} />
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Today's Time Slots - Main Soccer Field</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit Slots
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl text-center cursor-pointer transition-colors ${
                      slot.status === 'available' 
                        ? 'glass-subtle hover:bg-cyan-500/20 border border-dashed border-white/20' 
                        : slot.status === 'booked'
                          ? 'bg-cyan-500/20 border border-cyan-500/30'
                          : 'bg-yellow-500/20 border border-yellow-500/30'
                    }`}
                  >
                    <p className="text-sm font-medium">{slot.time}</p>
                    <p className={`text-xs mt-1 ${
                      slot.status === 'available' 
                        ? 'text-green-500' 
                        : slot.status === 'booked'
                          ? 'text-cyan-500'
                          : 'text-yellow-500'
                    }`}>
                      {slot.status === 'available' ? 'Available' : slot.by || slot.reason}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyHours.map((day) => (
                <div key={day.day} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10">
                  <span className="font-medium text-sm">{day.day}</span>
                  <div className="flex items-center gap-2">
                    {day.closed ? (
                      <Badge className="bg-red-500/20 text-red-500">Closed</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">{day.open} - {day.close}</span>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start glass-subtle border-white/20">
                <Calendar className="w-4 h-4 mr-2" />
                Block Holiday Dates
              </Button>
              <Button variant="outline" className="w-full justify-start glass-subtle border-white/20">
                <Clock className="w-4 h-4 mr-2" />
                Set Special Hours
              </Button>
              <Button variant="outline" className="w-full justify-start glass-subtle border-white/20">
                <Settings className="w-4 h-4 mr-2" />
                Bulk Update Slots
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
