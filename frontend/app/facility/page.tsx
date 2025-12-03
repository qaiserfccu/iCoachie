import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Users, Wrench, Package, Calendar, ArrowRight, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { facilityStats, facilityVenues, facilityMaintenanceRequests, getStatusColor, getPriorityColor } from "@/lib/services/mockDataService"

export default function FacilityDashboard() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facilityStats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Venues Overview</CardTitle>
            <Button variant="ghost" size="sm" className="text-amber-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {facilityVenues.map((venue) => (
              <div key={venue.name} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Building2 className="w-6 h-6 text-amber-500" /></div>
                  <div>
                    <p className="font-medium">{venue.name}</p>
                    <p className="text-sm text-muted-foreground">Capacity: {venue.capacity} • {venue.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">Next: {venue.nextBooking}</p>
                    <Badge className={getStatusColor(venue.status)}>{venue.status}</Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="text-amber-500"><ArrowRight className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Maintenance</CardTitle>
            <Badge className="bg-red-500/20 text-red-500">{facilityMaintenanceRequests.length} Open</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {facilityMaintenanceRequests.map((req, index) => (
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
              {[{ icon: CheckCircle, label: "Venues", value: "10/12", status: "Available", color: "text-green-500" }, { icon: MapPin, label: "Grounds", value: "4/5", status: "Open", color: "text-green-500" }, { icon: AlertTriangle, label: "Maintenance", value: "3", status: "Pending", color: "text-yellow-500" }, { icon: Clock, label: "Bookings", value: "24", status: "Today", color: "text-blue-500" }].map((item) => (
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
