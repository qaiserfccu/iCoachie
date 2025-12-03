/**
 * Parent Achievements Page
 * 
 * Backend Integration:
 * - Children data: GET /api/students (backend/src/controllers/studentController.ts)
 * - Evaluations: GET /api/evaluations/student/:id (backend/src/controllers/evaluationController.ts)
 * - Note: Achievements are derived from evaluation data and session attendance
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Medal, Award, Target, Loader2, AlertCircle, Users, TrendingUp, Calendar } from "lucide-react"
import { parentService, type ParentChild, type ParentEvaluation, type EvaluationStats } from "@/lib/services/parentService"

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Helper to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return dateStr
  }
}

// Derive achievements from stats
function deriveAchievements(child: ParentChild, stats: EvaluationStats | null) {
  const achievements: Array<{
    id: string
    title: string
    description: string
    icon: typeof Trophy
    color: string
    earned: boolean
    earnedDate?: string
  }> = []

  // Attendance achievements
  if ((child.attendanceCount || 0) >= 1) {
    achievements.push({
      id: 'first-session',
      title: 'First Steps',
      description: 'Completed your first training session',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      earned: true,
      earnedDate: child.createdAt
    })
  }

  if ((child.attendanceCount || 0) >= 5) {
    achievements.push({
      id: 'consistent-5',
      title: 'Consistent Learner',
      description: 'Attended 5 training sessions',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      earned: true
    })
  }

  if ((child.attendanceCount || 0) >= 10) {
    achievements.push({
      id: 'dedicated-10',
      title: 'Dedicated Athlete',
      description: 'Completed 10 training sessions',
      icon: Medal,
      color: 'from-purple-500 to-purple-600',
      earned: true
    })
  }

  if ((child.attendanceCount || 0) >= 25) {
    achievements.push({
      id: 'champion-25',
      title: 'Rising Champion',
      description: 'Completed 25 training sessions',
      icon: Trophy,
      color: 'from-pink-500 to-rose-500',
      earned: true
    })
  }

  // Evaluation achievements
  if (stats && stats.totalEvaluations >= 1) {
    achievements.push({
      id: 'first-eval',
      title: 'First Evaluation',
      description: 'Received your first coach evaluation',
      icon: Target,
      color: 'from-green-500 to-green-600',
      earned: true
    })
  }

  if (stats && stats.averageRating >= 4.0) {
    achievements.push({
      id: 'star-performer',
      title: 'Star Performer',
      description: 'Achieved an average rating of 4.0 or higher',
      icon: Star,
      color: 'from-yellow-400 to-yellow-500',
      earned: true
    })
  }

  if (stats && stats.averageRating >= 4.5) {
    achievements.push({
      id: 'excellence',
      title: 'Excellence Award',
      description: 'Maintained an average rating above 4.5',
      icon: Award,
      color: 'from-amber-500 to-yellow-500',
      earned: true
    })
  }

  if (stats && stats.totalEvaluations >= 5) {
    achievements.push({
      id: 'progress-tracker',
      title: 'Progress Tracker',
      description: 'Received 5 evaluations from coaches',
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      earned: true
    })
  }

  // Add potential achievements (not yet earned)
  if ((child.attendanceCount || 0) < 5) {
    achievements.push({
      id: 'consistent-5-locked',
      title: 'Consistent Learner',
      description: `Attend 5 sessions (${child.attendanceCount || 0}/5)`,
      icon: Calendar,
      color: 'from-gray-400 to-gray-500',
      earned: false
    })
  }

  if ((child.attendanceCount || 0) < 10) {
    achievements.push({
      id: 'dedicated-10-locked',
      title: 'Dedicated Athlete',
      description: `Complete 10 sessions (${child.attendanceCount || 0}/10)`,
      icon: Medal,
      color: 'from-gray-400 to-gray-500',
      earned: false
    })
  }

  return achievements
}

interface ChildAchievements {
  child: ParentChild
  achievements: ReturnType<typeof deriveAchievements>
  stats: EvaluationStats | null
}

export default function AchievementsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [childrenAchievements, setChildrenAchievements] = useState<ChildAchievements[]>([])
  const [selectedChild, setSelectedChild] = useState<string>('')

  // Fetch achievements data
  useEffect(() => {
    const loadAchievements = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Get children
        // Backend source: GET /api/students (backend/src/controllers/studentController.ts)
        const childrenResponse = await parentService.getChildren()
        const children = childrenResponse.data || []

        if (children.length === 0) {
          setChildrenAchievements([])
          setIsLoading(false)
          return
        }

        // Fetch stats for each child
        const achievementsData: ChildAchievements[] = await Promise.all(
          children.map(async (child) => {
            try {
              // Backend source: GET /api/evaluations/student/:id/stats
              const stats = await parentService.getChildEvaluationStats(child.id)
              return {
                child,
                achievements: deriveAchievements(child, stats),
                stats
              }
            } catch {
              return {
                child,
                achievements: deriveAchievements(child, null),
                stats: null
              }
            }
          })
        )

        setChildrenAchievements(achievementsData)
        if (achievementsData.length > 0) {
          setSelectedChild(achievementsData[0].child.name)
        }
      } catch (err) {
        console.error('Error loading achievements:', err)
        setError('Unable to load achievements. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAchievements()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground">View your children&apos;s achievements</p>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
            <p className="text-muted-foreground">Loading achievements...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground">View your children&apos;s achievements</p>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (childrenAchievements.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground">View your children&apos;s achievements</p>
        </div>
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">No Children Added Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your children to start tracking their achievements and milestones.
            </p>
            <Link href="/parent/kids/add">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                Add Your First Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground">Celebrate your children&apos;s milestones and accomplishments</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-medium">
            {childrenAchievements.reduce((sum, ca) => sum + ca.achievements.filter(a => a.earned).length, 0)} Total Badges
          </span>
        </div>
      </div>

      <Tabs value={selectedChild} onValueChange={setSelectedChild} className="space-y-6">
        <TabsList className="glass-card border-white/20 p-1">
          {childrenAchievements.map((ca) => (
            <TabsTrigger
              key={ca.child.id}
              value={ca.child.name}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
            >
              {ca.child.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {childrenAchievements.map((ca) => {
          const earnedAchievements = ca.achievements.filter(a => a.earned)
          const lockedAchievements = ca.achievements.filter(a => !a.earned)

          return (
            <TabsContent key={ca.child.id} value={ca.child.name} className="space-y-6">
              {/* Overview */}
              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xl">
                        {getInitials(ca.child.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{ca.child.name}</h2>
                      <p className="text-muted-foreground">{ca.child.sport || 'General Training'}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-3xl font-bold text-yellow-500">
                        <Trophy className="w-8 h-8" />
                        {earnedAchievements.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Badges Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Earned Achievements */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Earned Achievements
                </h3>
                {earnedAchievements.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {earnedAchievements.map((achievement) => (
                      <Card key={achievement.id} className="glass-card border-white/20 hover-lift">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0`}>
                              <achievement.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              {achievement.earnedDate && (
                                <p className="text-xs text-pink-500 mt-2">
                                  Earned {formatDate(achievement.earnedDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card border-white/20">
                    <CardContent className="p-8 text-center">
                      <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No achievements earned yet. Keep training!</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Locked Achievements */}
              {lockedAchievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-muted-foreground" />
                    Up Next
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lockedAchievements.map((achievement) => (
                      <Card key={achievement.id} className="glass-card border-white/20 opacity-60">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0`}>
                              <achievement.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <Badge className="mt-2 bg-gray-500/20 text-gray-400 text-xs">
                                Locked
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
