"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  MessageSquare,
  FileText,
  Star,
  Calendar,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  studentService,
  attendanceService,
  evaluationService,
  sessionService,
  type Student,
} from "@/lib/services"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"

interface StudentWithStats extends Student {
  attendanceRate: number
  progressScore: number
  nextSession?: {
    id: string
    title: string
    startTime: string
    location?: string
  }
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithStats[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  const { setLoading } = useLoading()
  const { showError } = useError()

  // Fetch students with stats on component mount
  useEffect(() => {
    fetchStudentsWithStats()
  }, [])

  const fetchStudentsWithStats = async () => {
    try {
      setLoading(true)

      // Get all students (coach can see students in their tenant)
      const studentsData = await studentService.getStudents()

      // Get additional data for each student
      const studentsWithStats: StudentWithStats[] = await Promise.all(
        studentsData.map(async (student) => {
          try {
            // Get attendance stats
            const attendanceStats = await attendanceService.getStudentAttendanceStats(student.id)

            // Get evaluation stats
            const evaluationStats = await evaluationService.getStudentEvaluationStats(student.id)

            // Get upcoming sessions for this student
            const studentSessions = await studentService.getStudentSessions(student.id)
            const upcomingSessions = studentSessions
              .filter(session => new Date(session.startTime) > new Date())
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

            // Calculate progress score from evaluation stats
            const progressScore = evaluationStats?.averageRating
              ? Math.round(evaluationStats.averageRating * 20) // Convert to percentage
              : 0

            // Determine level based on progress and attendance
            const level = getStudentLevel(progressScore, attendanceStats.attendanceRate)

            return {
              ...student,
              attendanceRate: attendanceStats.attendanceRate,
              progressScore,
              nextSession: upcomingSessions[0],
              level,
            }
          } catch (error) {
            // If stats fail, return student with default values
            return {
              ...student,
              attendanceRate: 0,
              progressScore: 0,
              level: 'Beginner' as const,
            }
          }
        })
      )

      setStudents(studentsWithStats)
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  const getStudentLevel = (progress: number, attendance: number): 'Beginner' | 'Intermediate' | 'Advanced' => {
    const combinedScore = (progress + attendance) / 2
    if (combinedScore >= 85) return 'Advanced'
    if (combinedScore >= 70) return 'Intermediate'
    return 'Beginner'
  }

  const calculateAge = (dateOfBirth?: string): number => {
    if (!dateOfBirth) return 0
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatNextSession = (session?: StudentWithStats['nextSession']): string => {
    if (!session) return 'No upcoming sessions'

    const sessionDate = new Date(session.startTime)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (sessionDate.toDateString() === today.toDateString()) {
      return `Today, ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return sessionDate.toLocaleDateString() + ', ' + sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  // Filter students based on search and level
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || student.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  // Calculate summary stats
  const totalStudents = students.length
  const averageAttendance = students.length > 0
    ? Math.round(students.reduce((sum, student) => sum + student.attendanceRate, 0) / students.length)
    : 0
  const averageProgress = students.length > 0
    ? Math.round(students.reduce((sum, student) => sum + student.progressScore, 0) / students.length)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground">View and manage your assigned students</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageAttendance}%</p>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageProgress}%</p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
          />
        </div>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="glass-input rounded-xl px-4 py-2 bg-transparent border-white/20 text-foreground"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}${student.lastName}`} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-green-500 text-white text-lg">
                      {student.firstName[0]}{student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Age: {calculateAge(student.dateOfBirth) || 'N/A'}
                    </p>
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
                    <span className="font-medium">{student.progressScore}%</span>
                  </div>
                  <Progress value={student.progressScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-medium">{student.attendanceRate}%</span>
                  </div>
                  <Progress value={student.attendanceRate} className="h-2" />
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatNextSession(student.nextSession)}
                </p>
                {student.emergencyContact && (
                  <p>Parent: {student.emergencyContact.name}</p>
                )}
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

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No students found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || selectedLevel !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'You don\'t have any students assigned yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
