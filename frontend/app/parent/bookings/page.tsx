/**
 * Parent Bookings Page
 * 
 * Backend Integration:
 * - Bookings data: GET /api/bookings (backend/src/controllers/bookingController.ts)
 * - Cancel booking: PATCH /api/bookings/:id/cancel (backend/src/controllers/bookingController.ts)
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, Plus, CheckCircle, Clock, XCircle, Loader2, AlertCircle } from "lucide-react"
import { parentService, type ParentBooking } from "@/lib/services/parentService"

// Helper to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return dateStr
  }
}

// Helper to format time
function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  } catch {
    return dateStr
  }
}

// Helper to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  try {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)}m`
    }
    return `${diffHours}h`
  } catch {
    return '1h'
  }
}

// Helper to format currency
function formatCurrency(amount: number | undefined): string {
  if (!amount) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Get status color class
function getStatusClass(statusCode: string | undefined): string {
  switch (statusCode?.toUpperCase()) {
    case 'CONFIRMED':
      return 'bg-green-500/20 text-green-600'
    case 'PENDING':
      return 'bg-blue-500/20 text-blue-600'
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-600'
    case 'COMPLETED':
      return 'bg-gray-500/20 text-gray-600'
    default:
      return 'bg-blue-500/20 text-blue-600'
  }
}

export default function BookingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<ParentBooking[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  // Stats calculated from bookings
  const stats = {
    upcoming: bookings.filter(b => b.status?.code === 'PENDING' || b.status?.code === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status?.code === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status?.code === 'CANCELLED').length,
    thisMonth: bookings.filter(b => {
      const bookingDate = new Date(b.sessionDate)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear()
    }).length
  }

  const bookingStats = [
    { label: "Upcoming", count: stats.upcoming, icon: Clock, color: "text-blue-500 bg-blue-500/20" },
    { label: "Completed", count: stats.completed, icon: CheckCircle, color: "text-green-500 bg-green-500/20" },
    { label: "Cancelled", count: stats.cancelled, icon: XCircle, color: "text-red-500 bg-red-500/20" },
    { label: "This Month", count: stats.thisMonth, icon: Calendar, color: "text-pink-500 bg-pink-500/20" },
  ]

  // Fetch bookings from backend
  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Backend source: GET /api/bookings (backend/src/controllers/bookingController.ts)
        const response = await parentService.getBookings({ limit: 100 })
        setBookings(response.data?.bookings || [])
      } catch (err) {
        console.error('Error loading bookings:', err)
        setError('Unable to load bookings. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
    setCancellingId(bookingId)
    try {
      // Backend source: PATCH /api/bookings/:id/cancel (backend/src/controllers/bookingController.ts)
      await parentService.cancelBooking(bookingId)
      // Refresh bookings
      const response = await parentService.getBookings({ limit: 100 })
      setBookings(response.data?.bookings || [])
    } catch (err) {
      console.error('Error cancelling booking:', err)
      alert('Failed to cancel booking. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  // Filter bookings by search query
  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      booking.serviceType?.toLowerCase().includes(query) ||
      booking.freelancer?.name?.toLowerCase().includes(query) ||
      booking.status?.name?.toLowerCase().includes(query)
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground">Manage your children&apos;s session bookings</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-4" />
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground">Manage your children&apos;s session bookings</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">Manage your children&apos;s session bookings</p>
        </div>
        <Link href="/parent/bookings/new">
          <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Book New Session
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bookingStats.map((stat) => (
          <Card key={stat.label} className="glass-card border-white/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Bookings</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto w-48"
                />
              </div>
              <Button variant="outline" size="icon" className="glass-subtle border-white/20 bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No bookings match your search.' : 'You haven\'t made any bookings yet.'}
              </p>
              {!searchQuery && (
                <Link href="/parent/bookings/new">
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                    Book Your First Session
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10 hover:bg-white/10">
                    <TableHead>Coach</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-white/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm">
                              {getInitials(booking.freelancer?.name || 'C')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{booking.freelancer?.name || 'Coach'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.serviceType || 'Session'}</p>
                          {booking.notes && (
                            <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                              {booking.notes}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatDate(booking.sessionDate)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(booking.startTime)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {calculateDuration(booking.startTime, booking.endTime)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(booking.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusClass(booking.status?.code)}>
                          {booking.status?.name || booking.status?.code || 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(booking.status?.code === 'PENDING' || booking.status?.code === 'CONFIRMED') && (
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/parent/bookings`}>
                              <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-500 hover:bg-red-500/10 bg-transparent"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancellingId === booking.id}
                            >
                              {cancellingId === booking.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Cancel'
                              )}
                            </Button>
                          </div>
                        )}
                        {booking.status?.code === 'COMPLETED' && (
                          <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                            View Report
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
