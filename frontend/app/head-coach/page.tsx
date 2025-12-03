"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, ArrowRight, Crown, Star, ClipboardList, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { headCoachService, HeadCoachDashboardData } from "@/lib/services/headCoachService"
import { headCoachStats as mockStats, headCoachCoaches as mockCoaches, headCoachUpcomingSessions as mockSessions } from "@/lib/services/mockDataService"

export default function HeadCoachDashboard() {
  const [data, setData] = useState<HeadCoachDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const dashboardData = await headCoachService.getDashboardData()
        setData(dashboardData)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Using fallback data.')
        // Use mock data as fallback
        setData({
          stats: {
            totalCoaches: mockCoaches.length,
            totalPrograms: 12,
            totalSessions: 24,
            totalAthletes: 156
          },
          coaches: mockCoaches.map((c, i) => ({
            id: i + 1,
            userId: i + 1,
            name: c.name,
            email: `${c.name.toLowerCase().replace(' ', '.')}@icoachie.com`,
            specialty: [c.specialty],
            rating: c.rating,
            students: c.students,
            sessions: c.sessions,
            status: 'Active'
          })),
          upcomingSessions: mockSessions
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    { 
      title: "Coaches", 
      value: data?.stats.totalCoaches?.toString() || "0", 
      subtitle: "Under supervision", 
      icon: Users, 
      color: "from-orange-500 to-red-500" 
    },
    { 
      title: "Programs", 
      value: data?.stats.totalPrograms?.toString() || "0", 
      subtitle: "Active training", 
      icon: ClipboardList, 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      title: "Sessions", 
      value: data?.stats.totalSessions?.toString() || "0", 
      subtitle: "This week", 
      icon: Calendar, 
      color: "from-green-500 to-green-600" 
    },
    { 
      title: "Athletes", 
      value: data?.stats.totalAthletes?.toString() || "0", 
      subtitle: "Total roster", 
      icon: TrendingUp, 
      color: "from-purple-500 to-purple-600" 
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Head Coach Dashboard</h1>
            <p className="text-muted-foreground">Manage coaches, programs, and training sessions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Head Coach Dashboard</h1>
          <p className="text-muted-foreground">Manage coaches, programs, and training sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/head-coach/reports">
            <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">View Reports</Button>
          </Link>
          <Link href="/head-coach/training-plans">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <Crown className="w-4 h-4 mr-2" />New Program
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-orange-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">My Coaches</CardTitle>
            <Link href="/head-coach/staff">
              <Button variant="ghost" size="sm" className="text-orange-500">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.coaches && data.coaches.length > 0 ? (
              data.coaches.slice(0, 3).map((coach) => (
                <div key={coach.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">{coach.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(coach.specialty) ? coach.specialty.join(', ') : coach.specialty} • {coach.students} athletes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{coach.rating}</span>
                    </div>
                    <Link href={`/head-coach/staff?coach=${coach.id}`}>
                      <Button size="sm" variant="ghost" className="text-orange-500">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No coaches found</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Badge className="bg-green-500/20 text-green-500">
              {data?.upcomingSessions?.length || 0} Scheduled
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.upcomingSessions && data.upcomingSessions.length > 0 ? (
              data.upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div>
                    <p className="font-medium">{session.program}</p>
                    <p className="text-sm text-muted-foreground">{session.coach}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.time}</p>
                    <p className="text-xs text-muted-foreground">{session.athletes} athletes</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No sessions scheduled for today</p>
            )}
            <Link href="/head-coach/training-plans">
              <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">
                View Full Schedule<ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
