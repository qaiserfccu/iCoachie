"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, BarChart3, Trophy, Target, Video, 
  Download, ArrowRight, TrendingUp, TrendingDown
} from "lucide-react"

const matches = [
  { id: 1, team: "U-12 Soccer Elite", opponent: "City FC", date: "Jan 15, 2024", result: "W 3-1", possession: 58, shots: 12, shotsOnTarget: 7, passes: 324 },
  { id: 2, team: "U-14 Basketball Stars", opponent: "Metro Hawks", date: "Jan 13, 2024", result: "W 68-52", fieldGoal: 45, threePoint: 32, rebounds: 38, assists: 18 },
  { id: 3, team: "U-12 Soccer Elite", opponent: "Valley United", date: "Jan 10, 2024", result: "D 2-2", possession: 52, shots: 10, shotsOnTarget: 5, passes: 298 },
  { id: 4, team: "U-16 Swimming Champions", opponent: "Regional Meet", date: "Jan 8, 2024", result: "1st Place", gold: 5, silver: 3, bronze: 2, records: 2 },
  { id: 5, team: "U-12 Soccer Elite", opponent: "North Stars", date: "Jan 5, 2024", result: "L 1-2", possession: 48, shots: 8, shotsOnTarget: 4, passes: 276 },
]

const insights = [
  { id: 1, type: "strength", title: "Strong Possession Game", description: "U-12 Soccer averaging 53% possession over last 5 matches", icon: TrendingUp },
  { id: 2, type: "improvement", title: "Finishing Efficiency", description: "Shot conversion rate dropped to 35% - recommend shooting drills", icon: Target },
  { id: 3, type: "strength", title: "Defensive Solidity", description: "Only 5 goals conceded in last 5 matches", icon: Trophy },
  { id: 4, type: "concern", title: "Second Half Performance", description: "60% of goals conceded in final 20 minutes", icon: TrendingDown },
]

const getResultColor = (result: string) => {
  if (result.startsWith("W") || result.includes("1st")) return "bg-green-500/20 text-green-500"
  if (result.startsWith("D")) return "bg-yellow-500/20 text-yellow-500"
  if (result.startsWith("L")) return "bg-red-500/20 text-red-500"
  return "bg-blue-500/20 text-blue-500"
}

export default function MatchAnalysisPage() {
  const wins = matches.filter(m => m.result.startsWith("W") || m.result.includes("1st")).length
  const draws = matches.filter(m => m.result.startsWith("D")).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Match Analysis</h1>
          <p className="text-muted-foreground">Review and analyze match performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Match
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Matches</p>
              <p className="text-2xl font-bold">{matches.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Wins</p>
              <p className="text-2xl font-bold text-green-500">{wins}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Draws</p>
              <p className="text-2xl font-bold text-yellow-500">{draws}</p>
            </div>
            <Target className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold text-blue-500">{Math.round((wins / matches.length) * 100)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matches List */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{match.team}</p>
                    <p className="text-sm text-muted-foreground">vs {match.opponent}</p>
                    <p className="text-xs text-muted-foreground">{match.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getResultColor(match.result)}>{match.result}</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-blue-500" title="Video">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-orange-500">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-xl glass-subtle ${insight.type === "concern" ? "border-l-4 border-red-500" : insight.type === "improvement" ? "border-l-4 border-yellow-500" : "border-l-4 border-green-500"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <insight.icon className={`w-4 h-4 ${insight.type === "concern" ? "text-red-500" : insight.type === "improvement" ? "text-yellow-500" : "text-green-500"}`} />
                  <p className="font-medium text-sm">{insight.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
