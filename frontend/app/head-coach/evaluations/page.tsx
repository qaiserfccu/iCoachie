"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plus, Star, TrendingUp, TrendingDown, ArrowRight, 
  Filter, Download, Users, AlertCircle
} from "lucide-react"
import { headCoachService, PlayerEvaluation } from "@/lib/services/headCoachService"

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-500"
  if (score >= 80) return "text-blue-500"
  if (score >= 70) return "text-yellow-500"
  return "text-red-500"
}

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<PlayerEvaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback mock data
  const fallbackEvaluations: PlayerEvaluation[] = [
    { id: 1, player: "Alex Thompson", team: "U-12 Soccer Elite", date: "Jan 15, 2024", overall: 92, technical: 88, tactical: 90, physical: 95, mental: 94, trend: "up" },
    { id: 2, player: "Jordan Lee", team: "U-14 Basketball Stars", date: "Jan 14, 2024", overall: 88, technical: 92, tactical: 85, physical: 88, mental: 87, trend: "up" },
    { id: 3, player: "Casey Rivera", team: "U-16 Swimming Champions", date: "Jan 14, 2024", overall: 95, technical: 96, tactical: 92, physical: 97, mental: 95, trend: "stable" },
    { id: 4, player: "Taylor Morgan", team: "Junior Tennis Academy", date: "Jan 13, 2024", overall: 78, technical: 80, tactical: 72, physical: 82, mental: 78, trend: "down" },
    { id: 5, player: "Sam Wilson", team: "U-12 Soccer Elite", date: "Jan 12, 2024", overall: 85, technical: 84, tactical: 88, physical: 82, mental: 86, trend: "up" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const evals = await headCoachService.getPlayerEvaluations()
        setEvaluations(evals.length > 0 ? evals : fallbackEvaluations)
      } catch (err) {
        console.error('Failed to fetch evaluations:', err)
        setError('Failed to load evaluations. Using fallback data.')
        setEvaluations(fallbackEvaluations)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const avgOverall = evaluations.length > 0 
    ? Math.round(evaluations.reduce((sum, e) => sum + e.overall, 0) / evaluations.length)
    : 0
  const improvingCount = evaluations.filter(e => e.trend === "up").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Player Evaluations</h1>
            <p className="text-muted-foreground">Track and assess player performance</p>
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
          <h1 className="text-2xl font-bold text-foreground">Player Evaluations</h1>
          <p className="text-muted-foreground">Track and assess player performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Evaluation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Evaluations</p>
              <p className="text-2xl font-bold">{evaluations.length}</p>
            </div>
            <Star className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Overall Score</p>
              <p className="text-2xl font-bold text-blue-500">{avgOverall}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Improving</p>
              <p className="text-2xl font-bold text-green-500">{improvingCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Players Evaluated</p>
              <p className="text-2xl font-bold">{evaluations.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Evaluations List */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Evaluations</CardTitle>
          <Button variant="ghost" size="sm" className="text-orange-500">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {evaluations.length > 0 ? (
            evaluations.map((evaluation) => (
              <div key={evaluation.id} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        {evaluation.player.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{evaluation.player}</p>
                        {evaluation.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {evaluation.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{evaluation.team} • {evaluation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(evaluation.overall)}`}>{evaluation.overall}%</p>
                      <p className="text-xs text-muted-foreground">Overall</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-orange-500">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Technical</span>
                      <span className={getScoreColor(evaluation.technical)}>{evaluation.technical}%</span>
                    </div>
                    <Progress value={evaluation.technical} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Tactical</span>
                      <span className={getScoreColor(evaluation.tactical)}>{evaluation.tactical}%</span>
                    </div>
                    <Progress value={evaluation.tactical} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Physical</span>
                      <span className={getScoreColor(evaluation.physical)}>{evaluation.physical}%</span>
                    </div>
                    <Progress value={evaluation.physical} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Mental</span>
                      <span className={getScoreColor(evaluation.mental)}>{evaluation.mental}%</span>
                    </div>
                    <Progress value={evaluation.mental} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No evaluations found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
