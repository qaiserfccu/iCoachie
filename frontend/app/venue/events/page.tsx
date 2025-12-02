"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PartyPopper, Plus, Calendar, Users, Clock, MapPin } from "lucide-react"

const events = [
  { id: 1, name: "Annual Sports Gala", venue: "Main Hall", date: "Jan 25, 2024", time: "6:00 PM", attendees: 200, status: "upcoming", type: "Gala" },
  { id: 2, name: "Corporate Training Day", venue: "Conference Center", date: "Jan 28, 2024", time: "9:00 AM", attendees: 50, status: "upcoming", type: "Training" },
  { id: 3, name: "Youth Tournament Finals", venue: "Stadium", date: "Feb 1, 2024", time: "10:00 AM", attendees: 500, status: "planning", type: "Sports" },
  { id: 4, name: "Charity Dinner", venue: "Banquet Hall", date: "Feb 14, 2024", time: "7:00 PM", attendees: 150, status: "planning", type: "Dinner" },
]

const upcomingTasks = [
  { id: 1, event: "Annual Sports Gala", task: "Finalize catering menu", dueDate: "Jan 20", priority: "high" },
  { id: 2, event: "Annual Sports Gala", task: "Confirm entertainment", dueDate: "Jan 22", priority: "medium" },
  { id: 3, event: "Corporate Training Day", task: "Setup AV equipment", dueDate: "Jan 27", priority: "high" },
  { id: 4, event: "Youth Tournament Finals", task: "Arrange parking", dueDate: "Jan 28", priority: "low" },
]

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Plan and manage venue events</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" />Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <PartyPopper className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-sm text-muted-foreground">Total Guests</p>
                <p className="text-2xl font-bold">900</p>
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
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{event.name}</h3>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.attendees} attendees
                      </div>
                    </div>
                  </div>
                  <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-3 rounded-lg glass-subtle">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-sm">{task.task}</span>
                  <Badge variant={
                    task.priority === "high" ? "destructive" :
                    task.priority === "medium" ? "default" : "secondary"
                  } className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{task.event}</p>
                <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
