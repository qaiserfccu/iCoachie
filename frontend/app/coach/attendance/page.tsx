"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Save } from "lucide-react"
import { coachAttendanceService, type SessionAttendance, type AttendanceStudent } from "@/lib/services"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"

export default function AttendancePage() {
  const [currentSession, setCurrentSession] = useState<SessionAttendance | null>(null)
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const { startLoading, stopLoading } = useLoading()
  const { showError, clearError } = useError()

  useEffect(() => {
    const fetchTodaySessions = async () => {
      try {
        startLoading('fetch-sessions', 'Loading today\'s sessions...')
        const sessions = await coachAttendanceService.getTodaySessions()
        if (sessions.length > 0) {
          const session = sessions[0] // For now, show the first session
          setCurrentSession(session)
          // Initialize attendance state from the session data
          const attendanceState: Record<string, string> = {}
          session.students.forEach(student => {
            attendanceState[student.id] = student.status
          })
          setAttendance(attendanceState)
        }
        clearError()
      } catch (error) {
        console.error('Error fetching today sessions:', error)
        showError('Failed to load today\'s sessions')
      } finally {
        stopLoading('fetch-sessions')
      }
    }

    fetchTodaySessions()
  }, [startLoading, stopLoading, showError, clearError])

  const updateAttendance = (id: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [id]: status }))
  }

  const handleSaveAttendance = async () => {
    if (!currentSession) return

    try {
      setIsSaving(true)
      startLoading('save-attendance', 'Saving attendance...')

      // Prepare attendance data for bulk update
      const attendanceData = currentSession.students.map((student: AttendanceStudent) => ({
        studentId: student.id,
        status: attendance[student.id] as 'present' | 'absent' | 'late'
      }))

      await coachAttendanceService.bulkMarkAttendance(currentSession.sessionId, attendanceData)

      // Refresh the session data to get updated stats
      const sessions = await coachAttendanceService.getTodaySessions()
      const updatedSession = sessions.find(s => s.sessionId === currentSession.sessionId)
      if (updatedSession) {
        setCurrentSession(updatedSession)
      }

      clearError() // Clear any previous errors
    } catch (error) {
      console.error('Error saving attendance:', error)
      showError('Failed to save attendance')
    } finally {
      setIsSaving(false)
      stopLoading('save-attendance')
    }
  }

  if (!currentSession) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
            <p className="text-muted-foreground">Record student attendance for your sessions</p>
          </div>
        </div>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No sessions scheduled for today.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const attendanceStats = [
    { label: "Present", count: currentSession.stats.present, icon: CheckCircle, color: "text-green-500 bg-green-500/20" },
    { label: "Late", count: currentSession.stats.late, icon: AlertCircle, color: "text-yellow-500 bg-yellow-500/20" },
    { label: "Absent", count: currentSession.stats.absent, icon: XCircle, color: "text-red-500 bg-red-500/20" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground">Record student attendance for your sessions</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-teal-500 to-green-500 text-white"
          onClick={handleSaveAttendance}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Attendance'}
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
                <h2 className="text-xl font-bold">{currentSession.sessionName}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {currentSession.sessionDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentSession.sessionTime}
                  </span>
                  {currentSession.location && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {currentSession.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {attendanceStats.map((stat) => (
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
          <CardTitle>Students ({currentSession.students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentSession.students.map((student: AttendanceStudent) => (
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
                    <p className="text-sm text-muted-foreground">Student ID: {student.studentId}</p>
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
