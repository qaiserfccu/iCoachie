"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, ArrowRight, Plus, Building2, Calendar, Users, DollarSign, AlertTriangle } from "lucide-react"
import { facilityService, DASHBOARD_STATS_CONFIG, type Venue, type VenueDashboardStats } from "@/lib/services"
import { getStatusColor } from "@/lib/services/mockDataService"

// Loading skeleton component
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-14 h-14 rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function VenuesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

export default function VenueDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<VenueDashboardStats | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Load dashboard stats and facilities
        const [dashboardStats, facilitiesResponse] = await Promise.all([
          facilityService.getVenueDashboardStats(),
          facilityService.getFacilities({ pageSize: 10 })
        ])

        setStats(dashboardStats)

        // Load venues from facilities (limited to avoid too many requests)
        const allVenues: Venue[] = []
        const facilitiesToLoad = facilitiesResponse.data.slice(0, DASHBOARD_STATS_CONFIG.MAX_FACILITIES_TO_LOAD)
        for (const facility of facilitiesToLoad) {
          const venuesResponse = await facilityService.getVenues(facility.id, { pageSize: DASHBOARD_STATS_CONFIG.DEFAULT_PAGE_SIZE })
          allVenues.push(...venuesResponse.data)
        }
        setVenues(allVenues.slice(0, DASHBOARD_STATS_CONFIG.DEFAULT_PAGE_SIZE))
      } catch (err) {
        console.error("Failed to load venue data:", err)
        setError("Failed to load venue data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Convert stats to display format
  const displayStats = stats ? [
    { title: "Total Venues", value: String(stats.totalVenues), subtitle: "Managed", icon: Building2, color: "from-purple-500 to-purple-600" },
    { title: "Events Today", value: String(stats.eventsToday), change: "+2", icon: Calendar, color: "from-blue-500 to-blue-600" },
    { title: "Capacity Used", value: `${stats.capacityUsedPercent}%`, subtitle: "Average", icon: Users, color: "from-green-500 to-green-600" },
    { title: "Revenue", value: `$${stats.revenueToday.toLocaleString()}`, subtitle: "Today", icon: DollarSign, color: "from-yellow-500 to-orange-500" },
  ] : []

  // Tasks/events for venues (will be replaced with real data when endpoints are available)
  const venueTasks = venues.map(venue => ({
    title: `${venue.isAvailable ? 'Available' : 'In Use'}: ${venue.name}`,
    venue: venue.name,
    time: venue.hourlyRate ? `$${venue.hourlyRate}/hr` : 'Contact for pricing',
    status: venue.isAvailable ? 'Available' : 'Occupied'
  }))

  if (error) {
    return (
      <div className="p-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Venue Manager Dashboard</h1>
          <p className="text-muted-foreground">Manage venues, events, and booking schedules</p>
        </div>
        <Button className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
          <Plus className="w-4 h-4 mr-2" />New Event
        </Button>
      </div>

      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat) => (
            <Card key={stat.title} className="glass-card border-white/20 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-rose-500 mt-1">{stat.change || stat.subtitle}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Venue Status</CardTitle>
            <Button variant="ghost" size="sm" className="text-rose-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <VenuesSkeleton />
            ) : venueTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No venues found. Add your first venue to get started.</p>
              </div>
            ) : (
              venueTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.venue} • {task.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <Button size="sm" variant="ghost" className="text-rose-500">
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
              <MapPin className="w-4 h-4 mr-2" />View Venues
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Manage Bookings
            </Button>
            <Button variant="outline" className="w-full justify-start glass-subtle border-white/20 bg-transparent">
              <ArrowRight className="w-4 h-4 mr-2" />Capacity Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
