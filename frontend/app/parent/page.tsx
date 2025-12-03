/**
 * Parent Dashboard
 * 
 * Backend Integration:
 * - Dashboard stats: Aggregated from multiple endpoints
 * - Children data: GET /api/students (backend/src/controllers/studentController.ts)
 * - Bookings: GET /api/bookings (backend/src/controllers/bookingController.ts)
 * - Messages: GET /api/messages/unread-count (backend/src/controllers/messageController.ts)
 * - Payments: GET /api/payments/stats/overview (backend/src/controllers/paymentController.ts)
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, GraduationCap, CreditCard, Clock, ArrowRight, Trophy, Star, TrendingUp, Loader2, AlertCircle, MessageSquare } from "lucide-react"
import { parentService, type ParentChild, type ParentBooking, type ParentDashboardStats } from "@/lib/services/parentService"
import authService from "@/lib/auth"

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Helper function to format date/time for bookings
function formatBookingTime(startTime: string): string {
  try {
    const date = new Date(startTime)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return startTime
  }
}

export default function ParentDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('Parent')
  const [stats, setStats] = useState<ParentDashboardStats>({
    totalKids: 0,
    upcomingSessions: 0,
    averageProgress: 0,
    totalSpent: 0,
    unreadMessages: 0
  })
  const [children, setChildren] = useState<ParentChild[]>([])
  const [upcomingBookings, setUpcomingBookings] = useState<ParentBooking[]>([])

  // Fetch all dashboard data from backend APIs
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Get current user's name
        const user = authService.getCurrentUser()
        if (user) {
          const displayName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`.trim()
            : user.email?.split('@')[0] || 'Parent'
          setUserName(displayName)
        }

        // Fetch dashboard stats
        // Backend source: Multiple endpoints aggregated in parentService.getDashboardStats()
        const dashboardStats = await parentService.getDashboardStats()
        setStats(dashboardStats)

        // Fetch children
        // Backend source: GET /api/students (backend/src/controllers/studentController.ts)
        const childrenResponse = await parentService.getChildren()
        setChildren(childrenResponse.data || [])

        // Fetch upcoming bookings
        // Backend source: GET /api/bookings (backend/src/controllers/bookingController.ts)
        const bookingsResponse = await parentService.getBookings({ limit: 4 })
        const allBookings = bookingsResponse.data?.bookings || []
        // Filter for upcoming bookings (PENDING or CONFIRMED)
        const upcoming = allBookings.filter(b => 
          b.status?.code === 'PENDING' || b.status?.code === 'CONFIRMED'
        ).slice(0, 4)
        setUpcomingBookings(upcoming)

      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Unable to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Stats configuration with icons
  const statsConfig = [
    { 
      title: "My Kids", 
      value: stats.totalKids.toString(), 
      subtitle: "Active enrollments", 
      icon: Users, 
      color: "from-pink-500 to-rose-500" 
    },
    { 
      title: "Upcoming Sessions", 
      value: stats.upcomingSessions.toString(), 
      subtitle: "This week", 
      icon: Calendar, 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      title: "Avg Progress", 
      value: `${stats.averageProgress}%`, 
      subtitle: "Overall", 
      icon: GraduationCap, 
      color: "from-green-500 to-green-600" 
    },
    { 
      title: "Total Spent", 
      value: formatCurrency(stats.totalSpent), 
      subtitle: "This month", 
      icon: CreditCard, 
      color: "from-yellow-500 to-orange-500" 
    },
  ]

  // Quick actions configuration
  const quickActions = [
    { label: "Book a Session", icon: Calendar, color: "text-pink-500", href: "/parent/bookings/new" },
    { label: "View Progress", icon: TrendingUp, color: "text-green-500", href: "/parent/progress" },
    { label: "Message Coach", icon: MessageSquare, color: "text-blue-500", href: "/parent/messages" },
    { label: "Make Payment", icon: CreditCard, color: "text-yellow-500", href: "/parent/payments" },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName.split(' ')[0]}! Here&apos;s how your kids are doing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/parent/progress/reports">
            <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
              View Reports
            </Button>
          </Link>
          <Link href="/parent/bookings/new">
            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-pink-500 mt-1">{stat.subtitle}</p>
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

      {/* Kids Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children.length === 0 ? (
          <Card className="glass-card border-white/20 lg:col-span-2">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Children Added Yet</h3>
              <p className="text-muted-foreground mb-4">Add your children to start tracking their progress and booking sessions.</p>
              <Link href="/parent/kids/add">
                <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  Add Your First Child
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          children.map((child) => (
            <Card key={child.id} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={child.user?.profile?.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xl">
                      {getInitials(child.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {child.age ? `${child.age} years old` : 'Age not set'}
                        </p>
                      </div>
                      {child.sport && (
                        <Badge className="bg-pink-500/20 text-pink-500">{child.sport}</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Coach</p>
                        <p className="text-sm font-medium">
                          {child.coach?.name || child.coach?.profile?.displayName || 'Not assigned'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Level</p>
                        <p className="text-sm font-medium">{child.level || 'Beginner'}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Sessions Attended</span>
                        <span className="font-medium">{child.attendanceCount || 0}</span>
                      </div>
                      <Progress 
                        value={Math.min((child.attendanceCount || 0) * 5, 100)} 
                        className="h-2" 
                      />
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{child.evaluationCount || 0} Evaluations</span>
                      </div>
                      <Link href={`/parent/kids`}>
                        <Button size="sm" variant="ghost" className="text-pink-500">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
            <Link href="/parent/bookings">
              <Button variant="ghost" size="sm" className="text-pink-500">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming sessions</p>
                <Link href="/parent/bookings/new">
                  <Button size="sm" className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                    Book a Session
                  </Button>
                </Link>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[80px]">
                      <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">
                        {formatBookingTime(booking.startTime)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {booking.serviceType || 'Session'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.freelancer?.name || 'Coach'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      booking.status?.code === 'CONFIRMED' 
                        ? "bg-green-500/20 text-green-600"
                        : "bg-blue-500/20 text-blue-600"
                    }>
                      {booking.status?.name || booking.status?.code || 'Pending'}
                    </Badge>
                    <Link href={`/parent/bookings`}>
                      <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
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
              <CardTitle className="text-lg font-semibold">Messages</CardTitle>
              {stats.unreadMessages > 0 && (
                <Badge className="bg-pink-500 text-white">{stats.unreadMessages} unread</Badge>
              )}
            </CardHeader>
            <CardContent>
              {stats.unreadMessages > 0 ? (
                <div className="p-3 rounded-xl glass-subtle">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-pink-500" />
                    <span className="font-medium text-sm">New Messages</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have {stats.unreadMessages} unread message{stats.unreadMessages > 1 ? 's' : ''}.
                  </p>
                  <Link href="/parent/messages">
                    <Button size="sm" variant="ghost" className="mt-2 text-pink-500 p-0 h-auto">
                      View Messages
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No new messages</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
