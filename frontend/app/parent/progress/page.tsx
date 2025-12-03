/**
 * Parent Progress Page
 * 
 * Backend Integration:
 * - Children data: GET /api/students (backend/src/controllers/studentController.ts)
 * - Evaluations: GET /api/evaluations/student/:id (backend/src/controllers/evaluationController.ts)
 * - Evaluation stats: GET /api/evaluations/student/:id/stats (backend/src/controllers/evaluationController.ts)
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Star, Trophy, Target, ArrowRight, Calendar, Loader2, AlertCircle, Users } from "lucide-react"
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

// Get rating label
function getRatingLabel(score: number): string {
  if (score >= 4.5) return 'Excellent'
  if (score >= 3.5) return 'Good'
  if (score >= 2.5) return 'Average'
  if (score >= 1.5) return 'Developing'
  return 'Needs Work'
}

// Get rating badge class
function getRatingClass(score: number): string {
  if (score >= 4.5) return 'bg-green-500/20 text-green-600'
  if (score >= 3.5) return 'bg-blue-500/20 text-blue-600'
  if (score >= 2.5) return 'bg-yellow-500/20 text-yellow-600'
  return 'bg-gray-500/20 text-gray-600'
}

interface ChildProgress {
  child: ParentChild
  evaluations: ParentEvaluation[]
  stats: EvaluationStats | null
}

export default function ProgressPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [childrenProgress, setChildrenProgress] = useState<ChildProgress[]>([])
  const [selectedChild, setSelectedChild] = useState<string>('')

  // Fetch progress data from backend
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Get children first
        // Backend source: GET /api/students (backend/src/controllers/studentController.ts)
        const childrenResponse = await parentService.getChildren()
        const children = childrenResponse.data || []

        if (children.length === 0) {
          setChildrenProgress([])
          setIsLoading(false)
          return
        }

        // Fetch evaluations and stats for each child
        const progressData: ChildProgress[] = await Promise.all(
          children.map(async (child) => {
            try {
              // Backend source: GET /api/evaluations/student/:id (backend/src/controllers/evaluationController.ts)
              const [evaluations, stats] = await Promise.all([
                parentService.getChildEvaluations(child.id),
                parentService.getChildEvaluationStats(child.id)
              ])
              return {
                child,
                evaluations: evaluations || [],
                stats: stats || null
              }
            } catch (err) {
              console.error(`Error loading progress for child ${child.id}:`, err)
              return {
                child,
                evaluations: [],
                stats: null
              }
            }
          })
        )

        setChildrenProgress(progressData)
        if (progressData.length > 0) {
          setSelectedChild(progressData[0].child.name)
        }
      } catch (err) {
        console.error('Error loading progress data:', err)
        setError('Unable to load progress data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor your children&apos;s development and achievements</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
            <p className="text-muted-foreground">Loading progress data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor your children&apos;s development and achievements</p>
          </div>
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

  if (childrenProgress.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor your children&apos;s development and achievements</p>
          </div>
        </div>
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">No Children Added Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your children first to start tracking their progress and evaluations.
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
          <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your children&apos;s development and achievements</p>
        </div>
        <Link href="/parent/progress/reports">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            Download Reports
          </Button>
        </Link>
      </div>

      <Tabs value={selectedChild} onValueChange={setSelectedChild} className="space-y-6">
        <TabsList className="glass-card border-white/20 p-1">
          {childrenProgress.map((cp) => (
            <TabsTrigger
              key={cp.child.id}
              value={cp.child.name}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
            >
              {cp.child.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {childrenProgress.map((cp) => (
          <TabsContent key={cp.child.id} value={cp.child.name} className="space-y-6">
            {/* Overview Card */}
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={cp.child.user?.profile?.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-2xl">
                        {getInitials(cp.child.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{cp.child.name}</h2>
                      <p className="text-muted-foreground">{cp.child.sport || 'General Training'}</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-2" />
                      <p className="text-2xl font-bold">
                        {cp.stats?.averageRating ? `${cp.stats.averageRating.toFixed(1)}` : 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Rating</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <Target className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-2xl font-bold">{cp.stats?.totalEvaluations || 0}</p>
                      <p className="text-xs text-muted-foreground">Evaluations</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <Star className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                      <p className="text-2xl font-bold">{cp.child.attendanceCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Sessions Attended</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <Trophy className="w-6 h-6 mx-auto text-pink-500 mb-2" />
                      <p className="text-2xl font-bold">{cp.child.level || 'Beginner'}</p>
                      <p className="text-xs text-muted-foreground">Current Level</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Distribution */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cp.stats?.ratingDistribution ? (
                    [5, 4, 3, 2, 1].map((rating) => {
                      const count = cp.stats?.ratingDistribution[rating] || 0
                      const total = cp.stats?.totalEvaluations || 1
                      const percentage = (count / total) * 100
                      return (
                        <div key={rating} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium flex items-center gap-1">
                              {rating} <Star className="w-4 h-4 text-yellow-500" />
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{count} evaluations</span>
                              <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No evaluations yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Evaluations */}
              <Card className="glass-card border-white/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Evaluations</CardTitle>
                  <Link href="/parent/progress/evaluations">
                    <Button variant="ghost" size="sm" className="text-pink-500">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cp.evaluations.length > 0 ? (
                    cp.evaluations.slice(0, 3).map((evaluation) => (
                      <div key={evaluation.id} className="p-4 rounded-xl glass-subtle">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(evaluation.createdAt)}
                          </span>
                          {evaluation.overallScore && (
                            <Badge className={getRatingClass(evaluation.overallScore)}>
                              {getRatingLabel(evaluation.overallScore)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">
                          {evaluation.comments || 'No comments provided'}
                        </p>
                        {evaluation.coach?.name && (
                          <p className="text-xs text-muted-foreground mt-2">
                            By {evaluation.coach.profile?.displayName || evaluation.coach.name}
                          </p>
                        )}
                        <Link href="/parent/progress/evaluations">
                          <Button variant="ghost" size="sm" className="mt-2 text-pink-500 p-0 h-auto">
                            Read Full Report
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No evaluations yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Evaluations from coaches will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
