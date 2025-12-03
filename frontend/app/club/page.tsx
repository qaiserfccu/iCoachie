"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  TrendingUp,
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
import { clubAdminService, type ClubDashboardStats, type ClubSession, type TopPerformer, type ClubTransaction } from "@/lib/services"

export default function ClubDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ClubDashboardStats | null>(null)
  const [todaySessions, setTodaySessions] = useState<ClubSession[]>([])
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([])
  const [recentPayments, setRecentPayments] = useState<ClubTransaction[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      setError(null)
      
      const [statsData, sessionsData, performersData, paymentsData] = await Promise.all([
        clubAdminService.getDashboardStats(),
        clubAdminService.getTodaySessions(),
        clubAdminService.getTopPerformers(3),
        clubAdminService.getTransactions({ pageSize: 5 })
      ])
      
      setStats(statsData)
      setTodaySessions(sessionsData)
      setTopPerformers(performersData)
      setRecentPayments(paymentsData.data.slice(0, 5))
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-600'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600'
      default:
        return 'bg-yellow-500/20 text-yellow-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadDashboardData}>Try Again</Button>
      </div>
    )
  }

  const clubStats = [
    {
      title: "Total Members",
      value: stats?.totalMembers.toString() || "0",
      change: stats?.memberChange || "+0",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Coaches",
      value: stats?.activeCoaches.toString() || "0",
      change: stats?.coachChange || "+0",
      icon: UserCog,
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Sessions Today",
      value: stats?.sessionsToday.toString() || "0",
      change: stats?.sessionChange || "0",
      icon: Calendar,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.monthlyRevenue || 0),
      change: stats?.revenueChange || "+0%",
      icon: CreditCard,
      color: "from-yellow-500 to-orange-500",
    },
  ]

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
        {clubStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm">{stat.change}</span>
                  </div>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sessions scheduled for today</p>
            ) : (
              todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">{formatTime(session.startTime)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">Coach: {session.coachName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {session.enrolledCount}/{session.maxCapacity}
                      </p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                    <Badge className={getStatusBadgeClass(session.status)}>
                      {session.status.replace('_', ' ')}
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
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-between glass-subtle hover:bg-white/20"
                >
                  <span className="flex items-center gap-3">
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
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
                <p className="text-muted-foreground text-center py-4">No performance data available</p>
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
          <Button variant="ghost" size="sm" className="text-blue-500">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {recentPayments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No payment records found</p>
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
                      <td className="py-3 px-4">{payment.studentName}</td>
                      <td className="py-3 px-4 font-medium text-green-500">{formatCurrency(payment.amount)}</td>
                      <td className="py-3 px-4">{payment.type}</td>
                      <td className="py-3 px-4 text-muted-foreground">{formatDate(payment.date)}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusBadgeClass(payment.status)}>
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
