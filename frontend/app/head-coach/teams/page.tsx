"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plus, Users, Trophy, TrendingUp, Calendar, 
  ArrowRight, Star, UserPlus, AlertCircle
} from "lucide-react"
import { headCoachService, Team } from "@/lib/services/headCoachService"

interface TopPerformer {
  name: string
  team: string
  position: string
  rating: number
  goals?: number
  points?: number
  medals?: number
}

interface UpcomingMatch {
  team: string
  opponent: string
  date: string
  time: string
  venue: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback mock data
  const fallbackTeams: Team[] = [
    { id: 1, name: "U-12 Soccer Elite", sport: "Soccer", players: 18, coaches: 2, record: "12-3-2", status: "active" },
    { id: 2, name: "U-14 Basketball Stars", sport: "Basketball", players: 12, coaches: 1, record: "8-4-0", status: "active" },
    { id: 3, name: "U-16 Swimming Champions", sport: "Swimming", players: 24, coaches: 3, record: "N/A", status: "active" },
    { id: 4, name: "Junior Tennis Academy", sport: "Tennis", players: 16, coaches: 2, record: "N/A", status: "active" },
    { id: 5, name: "U-10 Soccer Development", sport: "Soccer", players: 20, coaches: 2, record: "6-5-4", status: "active" },
  ]

  const upcomingMatches: UpcomingMatch[] = [
    { team: "U-12 Soccer Elite", opponent: "City FC", date: "Jan 20", time: "10:00 AM", venue: "Main Field" },
    { team: "U-14 Basketball Stars", opponent: "Metro Hawks", date: "Jan 22", time: "2:00 PM", venue: "Indoor Court A" },
    { team: "U-12 Soccer Elite", opponent: "Valley United", date: "Jan 27", time: "11:00 AM", venue: "Away" },
  ]

  const topPerformers: TopPerformer[] = [
    { name: "Alex Thompson", team: "U-12 Soccer Elite", position: "Forward", rating: 4.9, goals: 12 },
    { name: "Jordan Lee", team: "U-14 Basketball Stars", position: "Point Guard", rating: 4.8, points: 156 },
    { name: "Casey Rivera", team: "U-16 Swimming Champions", position: "Freestyle", rating: 4.9, medals: 8 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const teamsData = await headCoachService.getTeams()
        setTeams(teamsData.length > 0 ? teamsData : fallbackTeams)
      } catch (err) {
        console.error('Failed to fetch teams:', err)
        setError('Failed to load teams. Using fallback data.')
        setTeams(fallbackTeams)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalPlayers = teams.reduce((sum, t) => sum + t.players, 0)
  const totalCoaches = teams.reduce((sum, t) => sum + t.coaches, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage all teams under your supervision</p>
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
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage all teams under your supervision</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Teams</p>
              <p className="text-2xl font-bold">{teams.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Athletes</p>
              <p className="text-2xl font-bold">{totalPlayers}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Coaches</p>
              <p className="text-2xl font-bold">{totalCoaches}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Matches</p>
              <p className="text-2xl font-bold">{upcomingMatches.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">All Teams</CardTitle>
            <Button variant="ghost" size="sm" className="text-orange-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-sm text-muted-foreground">{team.sport} • {team.players} players • {team.coaches} coach(es)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="font-medium">{team.record}</p>
                    <p className="text-xs text-muted-foreground">Record</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">{team.status}</Badge>
                  <Button size="sm" variant="ghost" className="text-orange-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Upcoming Matches */}
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Upcoming Matches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMatches.map((match, idx) => (
                <div key={idx} className="p-3 rounded-xl glass-subtle">
                  <p className="font-medium text-sm">{match.team}</p>
                  <p className="text-sm text-muted-foreground">vs {match.opponent}</p>
                  <p className="text-xs text-muted-foreground mt-1">{match.date} • {match.time} • {match.venue}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPerformers.map((player, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl glass-subtle">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.team}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{player.rating}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
