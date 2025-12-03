"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Trophy,
  UserCog,
  CreditCard,
  Loader2,
} from "lucide-react"
import clubDashboardService from "@/lib/services/clubDashboardService"
import clubSessionsService from "@/lib/services/clubSessionsService"
import clubPaymentsService from "@/lib/services/clubPaymentsService"

// Types for dashboard data
interface ClubStats {
  totalMembers: number
  activeCoaches: number
  sessionsToday: number
  monthlyRevenue: number
  revenueChange: string
}

interface TodaySession {
  id: string
  time: string
  name: string
  coach: string
  enrolled: number
  capacity: number
  status: 'completed' | 'ongoing' | 'upcoming'
}

interface TopPerformer {
  id: string
  name: string
  sport: string
  progress: number
  badge: 'Gold' | 'Silver' | 'Bronze'
}

interface RecentPayment {
  id: string
  member: string
  amount: string
  type: string
  date: string
  status: 'completed' | 'pending'
}

// Stats configuration for rendering
const statsConfig = [
  { key: 'totalMembers', title: 'Total Members', icon: Users, color: 'from-blue-500 to-blue-600' },
  { key: 'activeCoaches', title: 'Active Coaches', icon: UserCog, color: 'from-teal-500 to-teal-600' },
  { key: 'sessionsToday', title: 'Sessions Today', icon: Calendar, color: 'from-green-500 to-green-600' },
  { key: 'monthlyRevenue', title: 'Monthly Revenue', icon: CreditCard, color: 'from-yellow-500 to-orange-500' },
]

export default function ClubDashboard() {
  const [stats, setStats] = useState<ClubStats | null>(null)
  const [todaySessions, setTodaySessions] = useState<TodaySession[]>([])
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([])
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch all dashboard data in parallel
        const [statsData, sessionsData, performersData, paymentsData] = await Promise.all([
          clubDashboardService.getClubStats(),
          clubDashboardService.getTodaysSessions(),
          clubDashboardService.getTopPerformers(),
          clubPaymentsService.getPaymentTransactions(),
        ])

        setStats(statsData)
        setTodaySessions(sessionsData)
        setTopPerformers(performersData)
        // Only show the 5 most recent payments
        setRecentPayments(paymentsData.slice(0, 5).map(p => ({
          ...p,
          status: p.status as 'completed' | 'pending'
        })))
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format stats values for display
  const formatStatValue = (key: string, value: number | undefined): string => {
    if (value === undefined) return '0'
    if (key === 'monthlyRevenue') return `$${value.toLocaleString()}`
    return value.toString()
  }

  // Get stat change display
  const getStatChange = (key: string): string => {
    if (key === 'monthlyRevenue' && stats?.revenueChange) {
      return stats.revenueChange
    }
    // For other stats, we don't have change data from API yet
    return ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Club Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your club overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            View Reports
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((statConfig) => {
          const value = stats ? stats[statConfig.key as keyof ClubStats] : 0
          const change = getStatChange(statConfig.key)
          const isPositive = change.startsWith('+') || (!change.startsWith('-') && change !== '')
          
          return (
            <Card key={statConfig.title} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{statConfig.title}</p>
                    <p className="text-2xl font-bold mt-1">{formatStatValue(statConfig.key, typeof value === 'number' ? value : 0)}</p>
                    {change && (
                      <div className="flex items-center gap-1 mt-2">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statConfig.color} flex items-center justify-center`}
                  >
                    <statConfig.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Link href="/club/sessions">
              <Button variant="ghost" size="sm" className="text-blue-500">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No sessions scheduled for today</p>
              </div>
            ) : (
              todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">{session.time}</span>
                    </div>
                    <div>
                      <p className="font-medium">{session.name}</p>
                      <p className="text-sm text-muted-foreground">Coach: {session.coach}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {session.enrolled}/{session.capacity}
                      </p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                    <Badge
                      className={
                        session.status === "completed"
                          ? "bg-green-500/20 text-green-600"
                          : session.status === "ongoing"
                            ? "bg-blue-500/20 text-blue-600"
                            : "bg-yellow-500/20 text-yellow-600"
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Top Performers */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Add New Member", icon: Users, color: "text-blue-500", href: "/club/members/add" },
                { label: "Create Session", icon: Calendar, color: "text-teal-500", href: "/club/sessions/create" },
                { label: "Record Attendance", icon: CheckCircle, color: "text-green-500", href: "/club/attendance" },
                { label: "Send Announcement", icon: AlertCircle, color: "text-yellow-500", href: "/club/announcements" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between glass-subtle hover:bg-white/20"
                  >
                    <span className="flex items-center gap-3">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      {action.label}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              {topPerformers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Star className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No performance data yet</p>
                </div>
              ) : (
                topPerformers.map((performer, index) => (
                  <div key={performer.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/.jpg?height=40&width=40&query=${performer.name}`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                          {performer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{performer.name}</p>
                      <p className="text-xs text-muted-foreground">{performer.sport}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          performer.badge === "Gold"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : performer.badge === "Silver"
                              ? "bg-gray-400/20 text-gray-600"
                              : "bg-orange-500/20 text-orange-600"
                        }
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {performer.badge}
                      </Badge>
                      <Progress value={performer.progress} className="h-1.5 mt-1 w-16" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Payments */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
          <Link href="/club/payments">
            <Button variant="ghost" size="sm" className="text-blue-500">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {recentPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent payments</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 font-medium">Member</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">{payment.member}</td>
                      <td className="py-3 px-4 font-medium text-green-500">{payment.amount}</td>
                      <td className="py-3 px-4">{payment.type}</td>
                      <td className="py-3 px-4 text-muted-foreground">{payment.date}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            payment.status === "completed"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-yellow-500/20 text-yellow-600"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
