"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Save } from "lucide-react"
import { coachCurrentSession, coachAttendanceStudents, coachAttendanceStats } from "@/lib/services/mockDataService"

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(
    coachAttendanceStudents.reduce(
      (acc, student) => ({
        ...acc,
        [student.id]: student.status,
      }),
      {} as Record<number, string>,
    ),
  )

  const updateAttendance = (id: number, status: string) => {
    setAttendance((prev) => ({ ...prev, [id]: status }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground">Record student attendance for your sessions</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Attendance
        </Button>
      </div>

      {/* Current Session Info */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{coachCurrentSession.name}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {coachCurrentSession.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {coachCurrentSession.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {coachAttendanceStats.map((stat) => (
                <div key={stat.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                  <span className="font-medium">{stat.count}</span>
                  <span className="text-sm hidden sm:inline">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Students ({coachAttendanceStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coachAttendanceStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`/.jpg?key=h3o39&height=48&width=48&query=${student.name} child`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-green-500 text-white">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Student ID: STU00{student.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "present" ? "default" : "outline"}
                    className={
                      attendance[student.id] === "present"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "glass-subtle border-white/20"
                    }
                    onClick={() => updateAttendance(student.id, "present")}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "late" ? "default" : "outline"}
                    className={
                      attendance[student.id] === "late"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "glass-subtle border-white/20"
                    }
                    onClick={() => updateAttendance(student.id, "late")}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Late
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "absent" ? "default" : "outline"}
                    className={
                      attendance[student.id] === "absent"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "glass-subtle border-white/20"
                    }
                    onClick={() => updateAttendance(student.id, "absent")}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
