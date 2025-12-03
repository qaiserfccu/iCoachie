"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, MapPin, Users, Wrench, Package, Calendar, ArrowRight, CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react"
import { facilityService, type Facility, type Venue, type FacilityDashboardStats } from "@/lib/services"
import { getStatusColor, getPriorityColor } from "@/lib/services/mockDataService"

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
            <Skeleton className="w-12 h-12 rounded-xl" />
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

// Stats icons mapping based on title
const statsConfig = [
  { title: "Total Venues", icon: Building2, color: "from-blue-500 to-blue-600" },
  { title: "Bookings Today", icon: Calendar, color: "from-green-500 to-green-600" },
  { title: "Maintenance", icon: Wrench, color: "from-yellow-500 to-orange-500" },
  { title: "Utilization", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
]

export default function FacilityDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<FacilityDashboardStats | null>(null)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [venues, setVenues] = useState<Venue[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Load dashboard stats and facilities in parallel
        const [dashboardStats, facilitiesResponse] = await Promise.all([
          facilityService.getFacilityDashboardStats(),
          facilityService.getFacilities({ pageSize: 10 })
        ])

        setStats(dashboardStats)
        setFacilities(facilitiesResponse.data)

        // Load venues from the first facility if available
        if (facilitiesResponse.data.length > 0) {
          const firstFacility = facilitiesResponse.data[0]
          const venuesResponse = await facilityService.getVenues(firstFacility.id, { pageSize: 5 })
          setVenues(venuesResponse.data)
        }
      } catch (err) {
        console.error("Failed to load facility data:", err)
        setError("Failed to load facility data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Convert stats to display format
  const displayStats = stats ? [
    { title: "Total Venues", value: String(stats.totalVenues), subtitle: `${stats.availableVenues} Available`, icon: Building2, color: "from-blue-500 to-blue-600" },
    { title: "Bookings Today", value: String(stats.totalBookings), change: "+5", icon: Calendar, color: "from-green-500 to-green-600" },
    { title: "Maintenance", value: String(stats.maintenanceRequests), subtitle: "Pending", icon: Wrench, color: "from-yellow-500 to-orange-500" },
    { title: "Utilization", value: `${stats.utilizationPercent}%`, change: "+12%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
  ] : []

  // TODO: When maintenance API is available, fetch real maintenance requests
  const maintenanceRequests = [
    { venue: "Tennis Court 2", issue: "Net replacement needed", priority: "High", reportedBy: "Coach David", status: "In Progress" },
    { venue: "Gym", issue: "AC not working", priority: "Medium", reportedBy: "Staff", status: "Pending" },
    { venue: "Pool A", issue: "Tile repair", priority: "Low", reportedBy: "Maintenance", status: "Scheduled" },
  ]

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
          <h1 className="text-2xl font-bold text-foreground">Facility Manager Dashboard</h1>
          <p className="text-muted-foreground">Manage venues, grounds, and facility operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent"><Calendar className="w-4 h-4 mr-2" />View Schedule</Button>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"><Wrench className="w-4 h-4 mr-2" />New Request</Button>
        </div>
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
                    <p className="text-sm text-amber-500 mt-1">{stat.change || stat.subtitle}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}><stat.icon className="w-7 h-7 text-white" /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Venues Overview</CardTitle>
            <Button variant="ghost" size="sm" className="text-amber-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <VenuesSkeleton />
            ) : venues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No venues found. Add your first venue to get started.</p>
              </div>
            ) : (
              venues.map((venue) => (
                <div key={venue.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Building2 className="w-6 h-6 text-amber-500" /></div>
                    <div>
                      <p className="font-medium">{venue.name}</p>
                      <p className="text-sm text-muted-foreground">Capacity: {venue.capacity || 'N/A'} • {venue.type || venue.venueType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{venue.hourlyRate ? `$${venue.hourlyRate}/hr` : 'Contact for pricing'}</p>
                      <Badge className={getStatusColor(venue.isAvailable ? 'Available' : 'Occupied')}>
                        {venue.isAvailable ? 'Available' : 'Occupied'}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="text-amber-500"><ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Maintenance</CardTitle>
            <Badge className="bg-red-500/20 text-red-500">{maintenanceRequests.length} Open</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceRequests.map((req, index) => (
              <div key={index} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{req.venue}</span>
                  <Badge className={getPriorityColor(req.priority)}>{req.priority}</Badge>
                </div>
                <p className="text-sm">{req.issue}</p>
                <p className="text-xs text-muted-foreground mt-1">Reported by: {req.reportedBy}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">View All Requests<ArrowRight className="w-4 h-4 ml-2" /></Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2"><CardTitle className="text-lg font-semibold">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[{ label: "Add New Venue", icon: Building2, color: "text-amber-500" }, { label: "Create Maintenance Request", icon: Wrench, color: "text-red-500" }, { label: "Manage Staff", icon: Users, color: "text-blue-500" }, { label: "Equipment Inventory", icon: Package, color: "text-green-500" }].map((action) => (
              <Button key={action.label} variant="ghost" className="w-full justify-between glass-subtle hover:bg-white/20">
                <span className="flex items-center gap-3"><action.icon className={`w-5 h-5 ${action.color}`} />{action.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2"><CardTitle className="text-lg font-semibold">Facility Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, label: "Venues", value: stats ? `${stats.availableVenues}/${stats.totalVenues}` : "0/0", status: "Available", color: "text-green-500" }, 
                { icon: MapPin, label: "Grounds", value: stats ? `${stats.availableGrounds}/${stats.totalGrounds}` : "0/0", status: "Open", color: "text-green-500" }, 
                { icon: AlertTriangle, label: "Maintenance", value: stats ? String(stats.maintenanceRequests) : "0", status: "Pending", color: "text-yellow-500" }, 
                { icon: Clock, label: "Bookings", value: stats ? String(stats.totalBookings) : "0", status: "Today", color: "text-blue-500" }
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl glass-subtle text-center">
                  <item.icon className={`w-6 h-6 mx-auto ${item.color} mb-2`} />
                  <p className="font-bold text-lg">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`text-xs ${item.color} mt-1`}>{item.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
