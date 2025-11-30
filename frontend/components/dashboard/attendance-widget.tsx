"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { dashboardService, DashboardAttendance } from "@/lib/services"

const statusConfig = {
  present: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", label: "Present" },
  late: { icon: Clock, color: "text-accent-foreground", bg: "bg-accent/20", label: "Late" },
  absent: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Absent" },
}

export function AttendanceWidget() {
  const [attendanceData, setAttendanceData] = useState<DashboardAttendance[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, late: 0, absent: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [attendance, summary] = await Promise.all([
          dashboardService.getRecentAttendance(6),
          dashboardService.getAttendanceSummary()
        ])
        setAttendanceData(attendance)
        setAttendanceSummary(summary)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
        setAttendanceData([])
        setAttendanceSummary({ present: 0, late: 0, absent: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [])

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Live Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-24" />
                    <div className="h-3 bg-muted animate-pulse rounded w-16" />
                  </div>
                </div>
                <div className="w-20 h-6 bg-muted animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Live Attendance</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Present: {attendanceSummary.present}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">Late: {attendanceSummary.late}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Absent: {attendanceSummary.absent}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attendanceData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent attendance data available</p>
            </div>
          ) : (
            attendanceData.map((member, index) => {
              const config = statusConfig[member.status as keyof typeof statusConfig]
              return (
                <div
                  key={`${member.studentName}-${index}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-secondary-foreground font-semibold text-sm">{member.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.studentName}</p>
                      <p className="text-sm text-muted-foreground">Check-in: {member.checkInTime}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg}`}>
                    <config.icon className={`w-4 h-4 ${config.color}`} />
                    <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View Full Attendance
        </Button>
      </CardContent>
    </Card>
  )
}
