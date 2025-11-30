"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Plus, Clock, Loader2 } from "lucide-react"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"
import { coachEvaluationsService, PendingEvaluation, EvaluationStats, QuickEvaluationData } from "@/lib/services"
import { Student } from "@/lib/services"

const pendingEvaluations = [
  {
    student: "Emma Davis",
    avatar: "ED",
    type: "Monthly Progress",
    dueDate: "Nov 30, 2024",
    priority: "high",
  },
  {
    student: "Jack Wilson",
    avatar: "JW",
    type: "Skill Assessment",
    dueDate: "Dec 1, 2024",
    priority: "medium",
  },
  {
    student: "Sophie Miller",
    avatar: "SM",
    type: "Monthly Progress",
    dueDate: "Dec 2, 2024",
    priority: "medium",
  },
  {
    student: "Lucas Brown",
    avatar: "LB",
    type: "Performance Review",
    dueDate: "Dec 3, 2024",
    priority: "low",
  },
]

const evaluationTypes = [
  { name: "Monthly Progress", count: 12 },
  { name: "Skill Assessment", count: 8 },
  { name: "Performance Review", count: 5 },
  { name: "Level Upgrade", count: 3 },
]

export default function EvaluationsPage() {
  const { setLoading } = useLoading()
  const { setError } = useError()

  const [pendingEvaluations, setPendingEvaluations] = useState<PendingEvaluation[]>([])
  const [evaluationStats, setEvaluationStats] = useState<EvaluationStats[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick evaluation form state
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [rating, setRating] = useState<number>(0)
  const [notes, setNotes] = useState<string>("")

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [pendingEvals, stats, studentList] = await Promise.all([
          coachEvaluationsService.getPendingEvaluations(),
          coachEvaluationsService.getEvaluationStats(),
          coachEvaluationsService.getStudentsForEvaluation()
        ])

        setPendingEvaluations(pendingEvals)
        setEvaluationStats(stats)
        setStudents(studentList)
      } catch (error) {
        console.error('Error loading evaluations data:', error)
        setError('Failed to load evaluations data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setLoading, setError])

  // Handle quick evaluation submission
  const handleSubmitEvaluation = async () => {
    if (!selectedStudent || !selectedType || !notes.trim()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const evaluationData: QuickEvaluationData = {
        studentId: selectedStudent,
        title: selectedType,
        content: notes,
        rating: rating > 0 ? rating : undefined,
        isPrivate: false
      }

      await coachEvaluationsService.createQuickEvaluation(evaluationData)

      // Reset form
      setSelectedStudent("")
      setSelectedType("")
      setRating(0)
      setNotes("")

      // Reload data to show updated stats
      const [pendingEvals, stats] = await Promise.all([
        coachEvaluationsService.getPendingEvaluations(),
        coachEvaluationsService.getEvaluationStats()
      ])

      setPendingEvaluations(pendingEvals)
      setEvaluationStats(stats)
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      setError('Failed to submit evaluation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evaluations</h1>
          <p className="text-muted-foreground">Assess and grade student performance</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Evaluation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {evaluationStats.map((stat) => (
          <Card key={stat.name} className="glass-card border-white/20 hover-lift cursor-pointer">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-bold mt-1">{stat.count}</p>
              <p className="text-xs text-teal-500 mt-1">Pending</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Evaluations List */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Pending Evaluations</CardTitle>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
              {pendingEvaluations.length} Pending
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingEvaluations.map((eval_) => (
              <div
                key={eval_.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`/.jpg?key=fjy97&height=48&width=48&query=${eval_.studentName} child`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-green-500 text-white">
                      {eval_.studentAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{eval_.studentName}</p>
                    <p className="text-sm text-muted-foreground">{eval_.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Due: {eval_.dueDate}
                    </div>
                    <Badge
                      className={
                        eval_.priority === "high"
                          ? "bg-red-500/20 text-red-600"
                          : eval_.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : "bg-green-500/20 text-green-600"
                      }
                    >
                      {eval_.priority} priority
                    </Badge>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Evaluation Form */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Evaluation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Evaluation Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {coachEvaluationsService.getEvaluationTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Overall Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starRating) => (
                  <button
                    key={starRating}
                    onClick={() => setRating(starRating)}
                    className={`w-10 h-10 rounded-lg glass-subtle flex items-center justify-center transition-colors ${
                      starRating <= rating ? 'bg-yellow-500/20' : 'hover:bg-yellow-500/20'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${starRating <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add evaluation notes..."
                className="glass-input min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white"
              onClick={handleSubmitEvaluation}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Evaluation'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
