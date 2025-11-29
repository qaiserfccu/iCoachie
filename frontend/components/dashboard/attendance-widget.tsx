"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

const attendanceData = [
  { name: "Emma Wilson", status: "present", time: "09:02 AM", avatar: "EW" },
  { name: "Michael Brown", status: "present", time: "09:05 AM", avatar: "MB" },
  { name: "Sarah Johnson", status: "late", time: "09:18 AM", avatar: "SJ" },
  { name: "James Davis", status: "absent", time: "-", avatar: "JD" },
  { name: "Olivia Martinez", status: "present", time: "08:58 AM", avatar: "OM" },
  { name: "Liam Anderson", status: "present", time: "09:00 AM", avatar: "LA" },
]

const statusConfig = {
  present: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", label: "Present" },
  late: { icon: Clock, color: "text-accent-foreground", bg: "bg-accent/20", label: "Late" },
  absent: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Absent" },
}

export function AttendanceWidget() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Live Attendance</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Present: 4</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">Late: 1</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Absent: 1</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attendanceData.map((member) => {
            const config = statusConfig[member.status as keyof typeof statusConfig]
            return (
              <div
                key={member.name}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-secondary-foreground font-semibold text-sm">{member.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">Check-in: {member.time}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg}`}>
                  <config.icon className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                </div>
              </div>
            )
          })}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View Full Attendance
        </Button>
      </CardContent>
    </Card>
  )
}
