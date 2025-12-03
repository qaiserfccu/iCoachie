"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Target,
  Activity,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react"
import { clubAdminService, type ClubAnalytics, type ClubDashboardStats } from "@/lib/services"

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<ClubAnalytics | null>(null)
  const [stats, setStats] = useState<ClubDashboardStats | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  async function loadAnalyticsData() {
    try {
      setLoading(true)
      setError(null)
      
      const [analyticsData, statsData] = await Promise.all([
        clubAdminService.getAnalytics(),
        clubAdminService.getDashboardStats()
      ])
      
      setAnalytics(analyticsData)
      setStats(statsData)
    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError('Failed to load analytics data. Please try again.')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
} from "lucide-react"
import clubDashboardService from "@/lib/services/clubDashboardService"
import clubSessionsService, { SessionStats } from "@/lib/services/clubSessionsService"
import clubPaymentsService, { PaymentStats } from "@/lib/services/clubPaymentsService"
import clubMembersService, { MemberStats } from "@/lib/services/clubMembersService"

interface AnalyticsData {
  clubStats: {
    totalMembers: number
    activeCoaches: number
    sessionsToday: number
    monthlyRevenue: number
    revenueChange: string
  }
  sessionStats: SessionStats
  paymentStats: PaymentStats
  memberStats: MemberStats
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setLoading(true)
        setError(null)

        const [clubStats, sessionStats, paymentStats, memberStats] = await Promise.all([
          clubDashboardService.getClubStats(),
          clubSessionsService.getSessionStats(),
          clubPaymentsService.getPaymentStats(),
          clubMembersService.getMemberStats(),
        ])

        setData({
          clubStats,
          sessionStats,
          paymentStats,
          memberStats,
        })
      } catch (err) {
        console.error('Failed to fetch analytics data:', err)
        setError('Failed to load analytics. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadAnalyticsData}>Try Again</Button>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  // Calculate percentage for progress bars
  const maxMemberGrowth = analytics?.memberGrowth?.length 
    ? Math.max(...analytics.memberGrowth.map(m => m.count))
    : 100

  const maxRevenue = analytics?.revenueByMonth?.length
    ? Math.max(...analytics.revenueByMonth.map(r => r.revenue))
    : 100
  const { clubStats, sessionStats, paymentStats, memberStats } = data!

  // Calculate rates and percentages
  const memberRetentionRate = memberStats.totalMembers > 0 
    ? Math.round((memberStats.activeMembers / memberStats.totalMembers) * 100)
    : 0

  const sessionUtilization = sessionStats.totalCapacity > 0
    ? Math.round((sessionStats.totalEnrolled / sessionStats.totalCapacity) * 100)
    : 0

  const revenueIsPositive = clubStats.revenueChange.startsWith('+')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">View club performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent" onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
          <p className="text-muted-foreground">Track club performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold mt-1">{stats?.totalMembers || 0}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm">{stats?.memberChange || '+0'}</span>
                <p className="text-2xl font-bold mt-1">{memberStats.totalMembers}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="outline" className="text-green-500 border-green-500/30">
                    +{memberStats.newThisMonth} new
                  </Badge>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold mt-1">{analytics?.attendanceRate || 0}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm">+2.5%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold mt-1">{sessionStats.totalSessions}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{sessionStats.thisWeekSessions} this week</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <p className="text-2xl font-bold mt-1">{analytics?.retentionRate || 0}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm">+1.2%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold mt-1">${paymentStats.thisMonthRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  {revenueIsPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${revenueIsPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {clubStats.revenueChange}
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm">{stats?.revenueChange || '+0%'}</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
                <p className="text-sm text-muted-foreground">Session Utilization</p>
                <p className="text-2xl font-bold mt-1">{sessionUtilization}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{sessionStats.totalEnrolled}/{sessionStats.totalCapacity} spots</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Chart */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Member Growth</CardTitle>
            <Badge variant="outline" className="border-green-500/50 text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              Growing
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics?.memberGrowth && analytics.memberGrowth.length > 0 ? (
              analytics.memberGrowth.map((item, index) => (
                <div key={item.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.month}</span>
                    <span className="font-medium">{item.count} members</span>
                  </div>
                  <Progress value={(item.count / maxMemberGrowth) * 100} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No growth data available</p>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Month */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Revenue by Month</CardTitle>
            <Badge variant="outline" className="border-blue-500/50 text-blue-500">
              <BarChart3 className="w-3 h-3 mr-1" />
              Financial
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics?.revenueByMonth && analytics.revenueByMonth.length > 0 ? (
              analytics.revenueByMonth.map((item, index) => (
                <div key={item.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.month}</span>
                    <span className="font-medium text-green-500">{formatCurrency(item.revenue)}</span>
                  </div>
                  <Progress value={(item.revenue / maxRevenue) * 100} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No revenue data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl glass-subtle">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Active Coaches</span>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold mb-2">{stats?.activeCoaches || 0}</div>
              <p className="text-sm text-muted-foreground">Managing training sessions</p>
            </div>
            
            <div className="p-4 rounded-xl glass-subtle">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Sessions This Week</span>
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-2">{stats?.sessionsToday || 0}</div>
              <p className="text-sm text-muted-foreground">Scheduled training sessions</p>
            </div>
            
            <div className="p-4 rounded-xl glass-subtle">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Revenue Target</span>
                <Target className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold mb-2">78%</div>
              <Progress value={78} className="h-2 mt-2" />
              <p className="text-sm text-muted-foreground mt-2">Monthly target progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">New Sign-ups</p>
              <p className="text-xs text-muted-foreground">+15 this week</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card border-white/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Upcoming Sessions</p>
              <p className="text-xs text-muted-foreground">24 sessions planned</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card border-white/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Pending Payments</p>
              <p className="text-xs text-muted-foreground">8 invoices due</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card border-white/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Engagement Score</p>
              <p className="text-xs text-muted-foreground">92% average</p>
            </div>
          </div>
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Member Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Member Retention Rate</span>
                <span className="font-medium">{memberRetentionRate}%</span>
              </div>
              <Progress value={memberRetentionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-xl font-bold">{memberStats.activeMembers}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Pending Renewal</p>
                <p className="text-xl font-bold text-yellow-500">{memberStats.expiringSoon}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-xl font-bold text-green-500">{memberStats.newThisMonth}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Active Coaches</p>
                <p className="text-xl font-bold">{clubStats.activeCoaches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Overview */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-green-500">${paymentStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">${paymentStats.thisMonthRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-xl font-bold text-yellow-500">${paymentStats.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{paymentStats.pendingCount} invoices</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Refunds</p>
                <p className="text-xl font-bold text-red-500">${paymentStats.refundAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{paymentStats.refundCount} requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Statistics */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Session Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Capacity Utilization</span>
                <span className="font-medium">{sessionUtilization}%</span>
              </div>
              <Progress value={sessionUtilization} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-xl font-bold">{sessionStats.totalSessions}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">{sessionStats.thisWeekSessions}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-xl font-bold text-blue-500">{sessionStats.upcomingSessions}</p>
              </div>
              <div className="p-4 rounded-xl glass-subtle">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold text-green-500">{sessionStats.completedSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Member Retention</p>
                    <p className="text-xs text-muted-foreground">Active vs Total</p>
                  </div>
                </div>
                <Badge className={memberRetentionRate >= 80 ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"}>
                  {memberRetentionRate}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Revenue Growth</p>
                    <p className="text-xs text-muted-foreground">Month over month</p>
                  </div>
                </div>
                <Badge className={revenueIsPositive ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"}>
                  {clubStats.revenueChange}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Session Fill Rate</p>
                    <p className="text-xs text-muted-foreground">Enrolled vs Capacity</p>
                  </div>
                </div>
                <Badge className={sessionUtilization >= 70 ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"}>
                  {sessionUtilization}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
