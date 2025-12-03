"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plus, ClipboardList, Calendar, Target, Clock,
  ArrowRight, CheckCircle, Play, Edit, AlertCircle
} from "lucide-react"
import { headCoachService, TrainingPlan } from "@/lib/services/headCoachService"

interface TodaySession {
  id: number
  plan: string
  team: string
  time: string
  duration: string
  focus: string
}

const statusConfig = {
  "in-progress": { color: "bg-blue-500/20 text-blue-500" },
  "completed": { color: "bg-green-500/20 text-green-500" },
  "scheduled": { color: "bg-yellow-500/20 text-yellow-500" },
}

export default function TrainingPlansPage() {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([])
  const [todaySessions, setTodaySessions] = useState<TodaySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback mock data
  const fallbackPlans: TrainingPlan[] = [
    { id: 1, name: "Pre-Season Conditioning", team: "U-12 Soccer Elite", duration: "4 weeks", progress: 75, status: "in-progress", sessions: 16, completed: 12 },
    { id: 2, name: "Technical Skills Development", team: "U-14 Basketball Stars", duration: "6 weeks", progress: 45, status: "in-progress", sessions: 24, completed: 11 },
    { id: 3, name: "Endurance Training Program", team: "U-16 Swimming Champions", duration: "8 weeks", progress: 30, status: "in-progress", sessions: 32, completed: 10 },
    { id: 4, name: "Match Preparation", team: "U-12 Soccer Elite", duration: "2 weeks", progress: 100, status: "completed", sessions: 8, completed: 8 },
    { id: 5, name: "Speed & Agility", team: "Junior Tennis Academy", duration: "4 weeks", progress: 0, status: "scheduled", sessions: 12, completed: 0 },
  ]

  const fallbackTodaySessions: TodaySession[] = [
    { id: 1, plan: "Pre-Season Conditioning", team: "U-12 Soccer Elite", time: "10:00 AM", duration: "90 min", focus: "Cardio & Strength" },
    { id: 2, plan: "Technical Skills Development", team: "U-14 Basketball Stars", time: "2:00 PM", duration: "120 min", focus: "Ball Handling" },
    { id: 3, plan: "Endurance Training Program", team: "U-16 Swimming Champions", time: "4:00 PM", duration: "60 min", focus: "Lap Training" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const plans = await headCoachService.getTrainingPlans()
        setTrainingPlans(plans.length > 0 ? plans : fallbackPlans)
        
        // Get today's sessions
        const sessionsResponse = await headCoachService.getSessions({ page: 1, pageSize: 10 })
        const today = new Date().toISOString().split('T')[0]
        const todaySessionsData = sessionsResponse.data
          .filter(s => s.sessionDate.startsWith(today))
          .slice(0, 5)
          .map((s, idx) => ({
            id: s.id,
            plan: s.title,
            team: 'General',
            time: new Date(s.startTime).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            }),
            duration: `${Math.round((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000)} min`,
            focus: s.description || 'Training Session'
          }))
        
        setTodaySessions(todaySessionsData.length > 0 ? todaySessionsData : fallbackTodaySessions)
      } catch (err) {
        console.error('Failed to fetch training plans:', err)
        setError('Failed to load training plans. Using fallback data.')
        setTrainingPlans(fallbackPlans)
        setTodaySessions(fallbackTodaySessions)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const activePlans = trainingPlans.filter(p => p.status === "in-progress").length
  const completedPlans = trainingPlans.filter(p => p.status === "completed").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Training Plans</h1>
            <p className="text-muted-foreground">Create and manage training programs</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <Skeleton className="h-60 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Plans</h1>
          <p className="text-muted-foreground">Create and manage training programs</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Plans</p>
              <p className="text-2xl font-bold">{trainingPlans.length}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Plans</p>
              <p className="text-2xl font-bold text-blue-500">{activePlans}</p>
            </div>
            <Play className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-500">{completedPlans}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Sessions</p>
              <p className="text-2xl font-bold">{todaySessions.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Plans */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">All Training Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainingPlans.map((plan) => (
              <div key={plan.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{plan.name}</p>
                      <Badge className={statusConfig[plan.status as keyof typeof statusConfig].color}>
                        {plan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.team} • {plan.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-orange-500">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{plan.completed}/{plan.sessions} sessions</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Sessions */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Badge className="bg-orange-500/20 text-orange-500">{todaySessions.length} Scheduled</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySessions.length > 0 ? (
              todaySessions.map((session) => (
                <div key={session.id} className="p-4 rounded-xl glass-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{session.plan}</p>
                    <Badge variant="outline" className="text-xs">{session.time}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.team}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {session.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" /> {session.focus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No sessions scheduled for today</p>
            )}
            <Button variant="outline" className="w-full glass-subtle border-white/20">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
