"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ArrowRight, Plus, Clock, AlertTriangle, TrendingUp } from "lucide-react"
import { 
  bookingsCoordinatorService,
  type BookingsCoordinatorStats,
  type BookingTask,
  getOperationsStatusColor
} from "@/lib/services/operationsService"

// Stats configuration with icons
const statsConfig = [
  { key: 'todaysBookings', title: "Today's Bookings", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { key: 'pendingConfirmations', title: "Pending Confirmations", icon: Clock, color: "from-yellow-500 to-orange-500" },
  { key: 'cancellations', title: "Cancellations", icon: AlertTriangle, color: "from-red-500 to-red-600" },
  { key: 'utilizationRate', title: "Utilization", icon: TrendingUp, color: "from-green-500 to-green-600" },
]

export default function BookingsCoordinatorDashboard() {
  const [stats, setStats] = useState<BookingsCoordinatorStats | null>(null)
  const [todaysBookings, setTodaysBookings] = useState<BookingTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        setError(null)
        
        const [statsData, bookingsData] = await Promise.all([
          bookingsCoordinatorService.getDashboardStats(),
          bookingsCoordinatorService.getTodaysBookings()
        ])
        
        setStats(statsData)
        setTodaysBookings(bookingsData)
      } catch (err) {
        console.error('Error loading bookings coordinator dashboard:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getStatValue = (key: string): string => {
    if (!stats) return '0'
    const value = stats[key as keyof BookingsCoordinatorStats]
    if (key === 'utilizationRate') return `${value}%`
    return value.toString()
  }

  const getStatSubtitle = (key: string): string => {
    if (key === 'todaysBookings') return '+5 from yesterday'
    if (key === 'pendingConfirmations') return 'Awaiting response'
    if (key === 'cancellations') return 'Today'
    if (key === 'utilizationRate') return '+5% this week'
    return ''
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings Coordinator Dashboard</h1>
          <p className="text-muted-foreground">Manage facility bookings, reservations, and scheduling</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />New Booking
        </Button>
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
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold mt-1">{getStatValue(stat.key)}</p>
                  )}
                  <p className="text-sm text-blue-500 mt-1">{getStatSubtitle(stat.key)}</p>
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
            <CardTitle className="text-lg font-semibold">Today&apos;s Bookings</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : todaysBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No bookings scheduled for today</p>
              </div>
            ) : (
              todaysBookings.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.facility} • {task.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{task.time}</p>
                      <Badge className={getOperationsStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-500">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />View Calendar
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Create Reservation
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <ArrowRight className="w-4 h-4 mr-2" />Manage Availability
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
