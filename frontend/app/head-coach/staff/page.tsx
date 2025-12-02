"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Plus, Users, Star, Calendar, Mail, Phone,
  ArrowRight, CheckCircle, Clock
} from "lucide-react"

const staff = [
  { id: 1, name: "Sarah Williams", role: "Assistant Coach", specialty: "Soccer", status: "active", email: "sarah@icoachie.com", phone: "+1 555-0101", rating: 4.9, sessions: 12 },
  { id: 2, name: "Mike Johnson", role: "Fitness Coach", specialty: "Strength & Conditioning", status: "active", email: "mike@icoachie.com", phone: "+1 555-0102", rating: 4.8, sessions: 8 },
  { id: 3, name: "David Brown", role: "Assistant Coach", specialty: "Basketball", status: "active", email: "david@icoachie.com", phone: "+1 555-0103", rating: 4.7, sessions: 10 },
  { id: 4, name: "Emily Chen", role: "Sports Psychologist", specialty: "Mental Training", status: "active", email: "emily@icoachie.com", phone: "+1 555-0104", rating: 4.9, sessions: 6 },
  { id: 5, name: "James Taylor", role: "Goalkeeping Coach", specialty: "Soccer", status: "on-leave", email: "james@icoachie.com", phone: "+1 555-0105", rating: 4.6, sessions: 0 },
  { id: 6, name: "Lisa Martinez", role: "Swimming Coach", specialty: "Swimming", status: "active", email: "lisa@icoachie.com", phone: "+1 555-0106", rating: 4.8, sessions: 14 },
]

const upcomingMeetings = [
  { id: 1, title: "Weekly Staff Meeting", date: "Jan 20, 2024", time: "9:00 AM", attendees: 6 },
  { id: 2, title: "Training Plan Review", date: "Jan 22, 2024", time: "2:00 PM", attendees: 4 },
  { id: 3, title: "Performance Discussion", date: "Jan 24, 2024", time: "10:00 AM", attendees: 3 },
]

const statusConfig = {
  active: { color: "bg-green-500/20 text-green-500" },
  "on-leave": { color: "bg-yellow-500/20 text-yellow-500" },
  inactive: { color: "bg-gray-500/20 text-gray-500" },
}

export default function StaffPage() {
  const activeStaff = staff.filter(s => s.status === "active").length
  const totalSessions = staff.reduce((sum, s) => sum + s.sessions, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Coordination</h1>
          <p className="text-muted-foreground">Manage coaching staff and schedule meetings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <p className="text-2xl font-bold">{staff.length}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-500">{activeStaff}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sessions This Week</p>
              <p className="text-2xl font-bold text-blue-500">{totalSessions}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <p className="text-2xl font-bold text-yellow-500">4.8</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Coaching Staff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      <Badge className={statusConfig[member.status as keyof typeof statusConfig].color}>
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role} • {member.specialty}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" /> {member.rating}
                      </span>
                      <span>{member.sessions} sessions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-blue-500" title="Email">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-green-500" title="Call">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-orange-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="p-4 rounded-xl glass-subtle">
                <p className="font-medium text-sm">{meeting.title}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{meeting.date}</span>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{meeting.time}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{meeting.attendees} attendees</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
