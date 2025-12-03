"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clubDashboardService, { ClubStats, RecentActivity, UpcomingSession } from "@/lib/services/clubDashboardService"

export default function ClubDashboard() {
  const [stats, setStats] = useState<ClubStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [sessions, setSessions] = useState<UpcomingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)
        const [statsData, activitiesData, sessionsData] = await Promise.all([
          clubDashboardService.getClubStats(),
          clubDashboardService.getRecentActivity(),
          clubDashboardService.getUpcomingSessions(),
        ])
        setStats(statsData)
        setActivities(activitiesData)
        setSessions(sessionsData)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your club overview</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold mt-1">{stats?.totalMembers}</p>
                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Coaches</p>
                <p className="text-2xl font-bold mt-1">{stats?.activeCoaches}</p>
                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+2 new</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Today</p>
                <p className="text-2xl font-bold mt-1">{stats?.sessionsToday}</p>
                <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Next at 2:00 PM</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold mt-1">${stats?.monthlyRevenue.toLocaleString()}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stats?.revenueChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.revenueChange.startsWith('+') ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{stats?.revenueChange}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-2 glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex flex-col items-center justify-center text-blue-500">
                      <span className="text-xs font-bold uppercase">{new Date(session.startTime).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-bold">{new Date(session.startTime).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{session.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>Court {session.court}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="flex -space-x-2 justify-end mb-1">
                        {[...Array(Math.min(3, session.attendees))].map((_, i) => (
                          <Avatar key={i} className="w-6 h-6 border-2 border-background">
                            <AvatarFallback className="text-[10px]">U{i}</AvatarFallback>
                          </Avatar>
                        ))}
                        {session.attendees > 3 && (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background">
                            +{session.attendees - 3}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{session.attendees}/{session.maxCapacity} enrolled</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Session</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Cancel Session</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'booking' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
