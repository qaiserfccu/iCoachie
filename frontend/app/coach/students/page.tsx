"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, MessageSquare, FileText, Star } from "lucide-react"

const students = [
  {
    id: 1,
    name: "Emma Davis",
    avatar: "ED",
    age: 12,
    level: "Advanced",
    progress: 92,
    attendance: 98,
    nextSession: "Today, 11:00 AM",
    parentContact: "Robert Davis",
  },
  {
    id: 2,
    name: "Jack Wilson",
    avatar: "JW",
    age: 14,
    level: "Intermediate",
    progress: 85,
    attendance: 95,
    nextSession: "Today, 2:00 PM",
    parentContact: "Sarah Wilson",
  },
  {
    id: 3,
    name: "Sophie Miller",
    avatar: "SM",
    age: 10,
    level: "Intermediate",
    progress: 78,
    attendance: 90,
    nextSession: "Tomorrow, 10:00 AM",
    parentContact: "Tom Miller",
  },
  {
    id: 4,
    name: "Lucas Brown",
    avatar: "LB",
    age: 13,
    level: "Beginner",
    progress: 65,
    attendance: 82,
    nextSession: "Tomorrow, 3:00 PM",
    parentContact: "Mike Brown",
  },
  {
    id: 5,
    name: "Olivia Johnson",
    avatar: "OJ",
    age: 11,
    level: "Intermediate",
    progress: 80,
    attendance: 92,
    nextSession: "Today, 4:00 PM",
    parentContact: "Lisa Johnson",
  },
  {
    id: 6,
    name: "Noah Williams",
    avatar: "NW",
    age: 15,
    level: "Advanced",
    progress: 88,
    attendance: 96,
    nextSession: "Dec 1, 9:00 AM",
    parentContact: "James Williams",
  },
]

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground">View and manage your assigned students</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto" />
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={`/.jpg?key=s0f9l&height=56&width=56&query=${student.name} child`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-green-500 text-white text-lg">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">Age: {student.age}</p>
                  </div>
                </div>
                <Badge
                  className={
                    student.level === "Advanced"
                      ? "bg-green-500/20 text-green-600"
                      : student.level === "Intermediate"
                        ? "bg-blue-500/20 text-blue-600"
                        : "bg-yellow-500/20 text-yellow-600"
                  }
                >
                  {student.level}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-medium">{student.attendance}%</span>
                  </div>
                  <Progress value={student.attendance} className="h-2" />
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                <p>Next session: {student.nextSession}</p>
                <p>Parent: {student.parentContact}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                <Button size="sm" variant="outline" className="flex-1 glass-subtle border-white/20 bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1 glass-subtle border-white/20 bg-transparent">
                  <FileText className="w-4 h-4 mr-1" />
                  Progress
                </Button>
                <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
