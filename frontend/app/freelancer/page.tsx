"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  CreditCard,
  Star,
  Clock,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Eye,
  DollarSign,
  Users,
  Calendar,
  Loader2,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/lib/contexts/AuthContext"

/**
 * FreelancerDashboard Component
 * 
 * Displays the dashboard for freelancer users with real-time data from backend.
 * 
 * Backend Endpoints Used:
 * - GET /api/users/me - Fetches current user profile (via AuthContext)
 *   See: backend/src/controllers/userController.ts
 * - GET /api/bookings - Fetches bookings for freelancer
 *   See: backend/src/controllers/bookingController.ts
 * - GET /api/reviews - Fetches reviews for freelancer
 *   See: backend/src/controllers/reviewController.ts
 * - GET /api/reviews/stats/:userId - Fetches review statistics
 *   See: backend/src/controllers/reviewController.ts
 */

/**
 * API Response Types
 */
interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

interface Booking {
  id: number
  sessionDate: string
  startTime: string
  endTime: string
  serviceType: string
  amount: number | null
  notes: string | null
  status: { code: string; name: string } | null
  client: { id: number; name: string; email: string }
  freelancer: { id: number; name: string; email: string }
}

interface BookingsResponse {
  success: boolean
  data: {
    bookings: Booking[]
    pagination: PaginationInfo
  }
}

interface Review {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  reviewer: { id: number; name: string }
}

interface ReviewsResponse {
  success: boolean
  data: {
    reviews: Review[]
    pagination: PaginationInfo
  }
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
}

interface ReviewStatsResponse {
  success: boolean
  data: ReviewStats
}

interface DashboardStats {
  totalEarnings: string
  activeClients: number
  sessionsThisWeek: number
  averageRating: string
}

export default function FreelancerDashboard() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { toast } = useToast()
  
  // Dashboard data state
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: "$0",
    activeClients: 0,
    sessionsThisWeek: 0,
    averageRating: "0.0",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch bookings (as freelancer)
        // GET /api/bookings?type=as_freelancer
        const bookingsResponse = await apiClient.get<BookingsResponse>('/bookings?type=as_freelancer&limit=10')
        
        if (bookingsResponse.success) {
          setBookings(bookingsResponse.data.bookings)
          
          // Calculate stats from bookings
          const confirmedBookings = bookingsResponse.data.bookings.filter(
            (b) => b.status?.code === 'CONFIRMED' || b.status?.code === 'COMPLETED'
          )
          const totalEarnings = confirmedBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
          const uniqueClients = new Set(bookingsResponse.data.bookings.map((b) => b.client.id))
          
          // Calculate sessions this week
          const now = new Date()
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 7)
          
          const sessionsThisWeek = bookingsResponse.data.bookings.filter((b) => {
            const sessionDate = new Date(b.sessionDate)
            return sessionDate >= weekStart && sessionDate < weekEnd
          }).length
          
          setStats((prev) => ({
            ...prev,
            totalEarnings: `$${totalEarnings.toLocaleString()}`,
            activeClients: uniqueClients.size,
            sessionsThisWeek,
          }))
        }
        
        // Fetch reviews (received by current user)
        // GET /api/reviews
        try {
          const reviewsResponse = await apiClient.get<ReviewsResponse>('/reviews?type=received&limit=5')
          
          if (reviewsResponse.success) {
            setReviews(reviewsResponse.data.reviews)
          }
        } catch (reviewError) {
          // Reviews might fail if user has no reviews, which is fine
          console.log('No reviews found or error fetching reviews')
        }
        
        // Fetch review stats
        // GET /api/reviews/stats/:userId
        try {
          const statsResponse = await apiClient.get<ReviewStatsResponse>(`/reviews/stats/${user.id}`)
          
          if (statsResponse.success) {
            setStats((prev) => ({
              ...prev,
              averageRating: statsResponse.data.averageRating.toFixed(1),
            }))
          }
        } catch (statsError) {
          // Stats might fail if user has no reviews
          console.log('No review stats found')
        }
        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user) {
      fetchDashboardData()
    }
  }, [user])
  
  // Accept booking action
  const handleAcceptBooking = async (bookingId: number) => {
    try {
      // PATCH /api/bookings/:id/status
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'CONFIRMED' })
      
      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: { code: 'CONFIRMED', name: 'Confirmed' } } : b
        )
      )
      
      toast({
        title: "Booking Accepted",
        description: "The booking has been confirmed successfully.",
      })
    } catch (err) {
      console.error('Failed to accept booking:', err)
      toast({
        title: "Error",
        description: "Failed to accept booking. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Get user display name
  const displayName = user ? user.firstName || user.email?.split('@')[0] : 'Freelancer'
  
  // Format booking time - combines sessionDate with startTime for display
  const formatBookingTime = (booking: Booking): string => {
    const sessionDate = new Date(booking.sessionDate)
    const isToday = sessionDate.toDateString() === new Date().toDateString()
    const isTomorrow = sessionDate.toDateString() === new Date(Date.now() + 86400000).toDateString()
    
    // startTime is expected to be a full ISO date string from backend
    // If it's not valid, fall back to just showing the date
    const startTimeDate = new Date(booking.startTime)
    const timeString = isNaN(startTimeDate.getTime()) 
      ? '' 
      : startTimeDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
    
    if (isToday) return timeString ? `Today, ${timeString}` : 'Today'
    if (isTomorrow) return timeString ? `Tomorrow, ${timeString}` : 'Tomorrow'
    const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return timeString ? `${dateStr}, ${timeString}` : dateStr
  }
  
  // Calculate duration from start and end times
  const calculateDuration = (booking: Booking): string => {
    const start = new Date(booking.startTime)
    const end = new Date(booking.endTime)
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'N/A'
    }
    
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return hours >= 1 ? `${hours}h` : `${hours * 60}m`
  }
  
  // Dashboard stats display configuration
  const statsConfig = [
    {
      title: "Total Earnings",
      value: stats.totalEarnings,
      change: "from completed bookings",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Clients",
      value: stats.activeClients.toString(),
      change: "total clients",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Sessions This Week",
      value: stats.sessionsThisWeek.toString(),
      change: "scheduled sessions",
      icon: Calendar,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Rating",
      value: stats.averageRating,
      change: `${reviews.length} reviews`,
      icon: Star,
      color: "from-purple-500 to-purple-600",
    },
  ]
  
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {displayName}! Here&apos;s your business overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="glass-subtle border-white/20 bg-transparent"
            onClick={() => router.push('/freelancer/profile')}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
            onClick={() => router.push('/freelancer/availability')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Set Availability
          </Button>
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
                  <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
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
        {/* Upcoming Bookings */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Bookings</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-yellow-600"
              onClick={() => router.push('/freelancer/bookings')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming bookings</p>
                <p className="text-sm mt-1">Your bookings will appear here</p>
              </div>
            ) : (
              bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[100px]">
                      <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">{formatBookingTime(booking)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{booking.client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.serviceType || 'Session'} ({calculateDuration(booking)})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {booking.amount && (
                      <span className="font-semibold text-green-500">${booking.amount}</span>
                    )}
                    <Badge
                      className={
                        booking.status?.code === "CONFIRMED"
                          ? "bg-green-500/20 text-green-600"
                          : booking.status?.code === "COMPLETED"
                          ? "bg-blue-500/20 text-blue-600"
                          : "bg-yellow-500/20 text-yellow-600"
                      }
                    >
                      {booking.status?.name || 'Pending'}
                    </Badge>
                    {booking.status?.code === "PENDING" && (
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                        onClick={() => handleAcceptBooking(booking.id)}
                      >
                        Accept
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Stats & Reviews */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Update Availability", icon: Clock, color: "text-yellow-500", href: "/freelancer/availability" },
                { label: "View Earnings", icon: CreditCard, color: "text-green-500", href: "/freelancer/earnings" },
                { label: "Message Clients", icon: AlertCircle, color: "text-blue-500", href: "/freelancer/messages" },
                { label: "Edit Profile", icon: TrendingUp, color: "text-purple-500", href: "/freelancer/profile" },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-between glass-subtle hover:bg-white/20"
                  onClick={() => router.push(action.href)}
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
              <CardTitle className="text-lg font-semibold">Recent Reviews</CardTitle>
              <Star className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No reviews yet</p>
                </div>
              ) : (
                reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="p-3 rounded-xl glass-subtle">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{review.reviewer.name}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-gray-300" />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-xs text-muted-foreground">{review.comment}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Clients */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Clients</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-yellow-600"
            onClick={() => router.push('/freelancer/clients')}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No clients yet</p>
              <p className="text-sm mt-1">Your clients will appear here after bookings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Get unique clients from bookings */}
              {Array.from(
                new Map(bookings.map((b) => [b.client.id, b.client])).values()
              )
                .slice(0, 3)
                .map((client) => {
                  const clientBookings = bookings.filter((b) => b.client.id === client.id)
                  const totalSpent = clientBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
                  const lastBooking = clientBookings[0]
                  
                  return (
                    <div
                      key={client.id}
                      className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last: {lastBooking ? formatBookingTime(lastBooking) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sessions</p>
                          <p className="font-medium">{clientBookings.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Spent</p>
                          <p className="font-medium text-green-500">${totalSpent}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
