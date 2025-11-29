"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, UserPlus, Star, Calendar, Users, MoreVertical, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const coaches = [
  {
    id: 1,
    name: "John Smith",
    avatar: "JS",
    specialty: "Swimming",
    rating: 4.9,
    students: 45,
    sessions: 12,
    status: "Active",
    email: "john.smith@email.com",
    phone: "+1 234 567 8901",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    avatar: "SW",
    specialty: "Soccer",
    rating: 4.8,
    students: 38,
    sessions: 10,
    status: "Active",
    email: "sarah.wilson@email.com",
    phone: "+1 234 567 8902",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "MJ",
    specialty: "Basketball",
    rating: 4.7,
    students: 32,
    sessions: 8,
    status: "Active",
    email: "mike.johnson@email.com",
    phone: "+1 234 567 8903",
  },
  {
    id: 4,
    name: "David Lee",
    avatar: "DL",
    specialty: "Tennis",
    rating: 4.6,
    students: 20,
    sessions: 6,
    status: "On Leave",
    email: "david.lee@email.com",
    phone: "+1 234 567 8904",
  },
]

export default function CoachesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coaches</h1>
          <p className="text-muted-foreground">Manage your club&apos;s coaching staff</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Coach
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search coaches..." className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto" />
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <Card key={coach.id} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`/.jpg?height=56&width=56&query=${coach.name} coach`} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-lg font-bold">
                      {coach.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{coach.name}</h3>
                    <p className="text-sm text-muted-foreground">{coach.specialty} Coach</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card border-white/20">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>View Schedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove Coach</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge
                  className={
                    coach.status === "Active" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                  }
                >
                  {coach.status}
                </Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{coach.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{coach.students} students</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{coach.sessions} sessions/week</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{coach.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{coach.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
