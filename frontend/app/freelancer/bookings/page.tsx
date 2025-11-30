"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { freelancerBookingsService, FreelancerBooking, BookingStats } from "@/lib/services/freelancerBookingsService"
import { useLoading } from "@/lib/contexts/LoadingContext"
import { useError } from "@/lib/contexts/ErrorContext"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<FreelancerBooking[]>([])
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBookings, setFilteredBookings] = useState<FreelancerBooking[]>([])
  const { setLoading } = useLoading()
  const { setError } = useError()

  useEffect(() => {
    const loadBookingsData = async () => {
      try {
        setLoading(true)
        const [bookingsData, statsData] = await Promise.all([
          freelancerBookingsService.getFreelancerBookings(),
          freelancerBookingsService.getBookingStats()
        ])
        setBookings(bookingsData)
        setFilteredBookings(bookingsData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading bookings data:', error)
        setError('Failed to load bookings data')
      } finally {
        setLoading(false)
      }
    }

    loadBookingsData()
  }, [setLoading, setError])

  useEffect(() => {
    const searchBookings = async () => {
      try {
        if (searchQuery.trim()) {
          const filtered = await freelancerBookingsService.searchBookings(searchQuery)
          setFilteredBookings(filtered)
        } else {
          setFilteredBookings(bookings)
        }
      } catch (error) {
        console.error('Error searching bookings:', error)
        setError('Failed to search bookings')
      }
    }

    searchBookings()
  }, [searchQuery, bookings, setError])

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      setLoading(true)
      await freelancerBookingsService.acceptBooking(bookingId)

      // Update local state
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ))
      setFilteredBookings(prev => prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ))

      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          confirmed: prev.confirmed + 1,
          pending: prev.pending - 1
        } : null)
      }
    } catch (error) {
      console.error('Error accepting booking:', error)
      setError('Failed to accept booking')
    } finally {
      setLoading(false)
    }
  }

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      setLoading(true)
      await freelancerBookingsService.declineBooking(bookingId)

      // Update local state
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ))
      setFilteredBookings(prev => prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ))

      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          cancelled: prev.cancelled + 1,
          pending: prev.pending - 1
        } : null)
      }
    } catch (error) {
      console.error('Error declining booking:', error)
      setError('Failed to decline booking')
    } finally {
      setLoading(false)
    }
  }

  const statsCards = stats ? [
    { label: "Confirmed", count: stats.confirmed, icon: CheckCircle, color: "text-green-500 bg-green-500/20" },
    { label: "Pending", count: stats.pending, icon: AlertCircle, color: "text-yellow-500 bg-yellow-500/20" },
    { label: "Completed", count: stats.completed, icon: Calendar, color: "text-blue-500 bg-blue-500/20" },
    { label: "Cancelled", count: stats.cancelled, icon: XCircle, color: "text-red-500 bg-red-500/20" },
  ] : []
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">Manage your session bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
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
          <div className="rounded-xl overflow-hidden border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10 hover:bg-white/10">
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
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
                          <AvatarImage
                            src={`/.jpg?key=lqfad&height=40&width=40&query=${booking.client}`}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-sm">
                            {booking.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{booking.client}</span>
                      </div>
                    </TableCell>
                    <TableCell>{booking.type}</TableCell>
                    <TableCell>
                      <div>
                        <p>{booking.date}</p>
                        <p className="text-sm text-muted-foreground">{booking.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.duration}</TableCell>
                    <TableCell className="font-medium text-green-500">${booking.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-500/20 text-green-600"
                            : booking.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-600"
                              : booking.status === "completed"
                                ? "bg-blue-500/20 text-blue-600"
                                : "bg-red-500/20 text-red-600"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleAcceptBooking(booking.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10 bg-transparent"
                            onClick={() => handleDeclineBooking(booking.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                      {booking.status === "confirmed" && (
                        <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
