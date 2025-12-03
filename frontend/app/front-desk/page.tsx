"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCheck, Clock, ArrowRight, CheckCircle, Calendar, Users, AlertTriangle } from "lucide-react"
import { 
  frontDeskService,
  type FrontDeskStats,
  type FrontDeskSession,
  type FrontDeskCheckin
} from "@/lib/services/operationsService"

// Stats configuration with icons
const statsConfig = [
  { key: 'checkedInToday', subKey: 'pendingCheckIns', title: "Checked In Today", icon: UserCheck, color: "from-cyan-500 to-blue-500" },
  { key: 'todaysSessions', subKey: 'inProgressSessions', title: "Today's Sessions", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { key: 'walkIns', subKey: 'waitingVisitors', title: "Walk-ins", icon: Users, color: "from-teal-500 to-teal-600" },
  { key: 'inquiries', subKey: 'unreadInquiries', title: "Inquiries", icon: AlertTriangle, color: "from-purple-500 to-purple-600" },
]

export default function FrontDeskDashboard() {
  const [stats, setStats] = useState<FrontDeskStats | null>(null)
  const [sessions, setSessions] = useState<FrontDeskSession[]>([])
  const [recentCheckins, setRecentCheckins] = useState<FrontDeskCheckin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        setError(null)
        
        const [statsData, sessionsData, checkinsData] = await Promise.all([
          frontDeskService.getDashboardStats(),
          frontDeskService.getTodaysSessions(),
          frontDeskService.getRecentCheckins()
        ])
        
        setStats(statsData)
        setSessions(sessionsData)
        setRecentCheckins(checkinsData)
      } catch (err) {
        console.error('Error loading front desk dashboard:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getStatValue = (key: keyof FrontDeskStats): number => {
    if (!stats) return 0
    return stats[key]
  }

  const getStatSubtitle = (key: string, subKey: string): string => {
    if (!stats) return ''
    const subValue = stats[subKey as keyof FrontDeskStats]
    if (key === 'checkedInToday') return `${subValue} pending`
    if (key === 'todaysSessions') return `${subValue} in progress`
    if (key === 'walkIns') return `${subValue} waiting`
    if (key === 'inquiries') return `${subValue} unread`
    return ''
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Front Desk</h1>
          <p className="text-muted-foreground">Welcome! Manage check-ins and inquiries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">View Schedule</Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <UserCheck className="w-4 h-4 mr-2" />Quick Check-in
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4 text-red-500">
            {error}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <Card key={stat.key} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold mt-1">{getStatValue(stat.key as keyof FrontDeskStats)}</p>
                  )}
                  <p className="text-sm text-cyan-500 mt-1">{getStatSubtitle(stat.key, stat.subKey)}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Button variant="ghost" size="sm" className="text-cyan-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-[70px] h-8" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No sessions scheduled for today</p>
              </div>
            ) : (
              sessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">{session.time}</span>
                    </div>
                    <div>
                      <p className="font-medium">{session.name}</p>
                      <p className="text-sm text-muted-foreground">{session.coach} • {session.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={session.checkedIn > 0 ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}>
                      {session.checkedIn}/{session.expected}
                    </Badge>
                    <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">Check-in</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Check-ins</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))
            ) : recentCheckins.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent check-ins</p>
              </div>
            ) : (
              recentCheckins.map((checkin, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm">{checkin.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{checkin.name}</p>
                    <p className="text-xs text-muted-foreground">{checkin.session}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{checkin.time}</span>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">
              View All Check-ins<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
