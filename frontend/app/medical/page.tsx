import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, FileText, AlertTriangle, Users, ArrowRight, Stethoscope, Activity, Clock } from "lucide-react"
import { medicalStats, medicalRecentInjuries, medicalUpcomingCheckups, getStatusColor } from "@/lib/services/mockDataService"

const severityColors = { Low: "bg-green-500/20 text-green-500", Moderate: "bg-yellow-500/20 text-yellow-600", High: "bg-red-500/20 text-red-500" }

export default function MedicalDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medical Staff Dashboard</h1>
          <p className="text-muted-foreground">Health records, injury management, and medical clearances</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">View Records</Button>
          <Button className="bg-gradient-to-r from-red-500 to-pink-500 text-white"><AlertTriangle className="w-4 h-4 mr-2" />Report Injury</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {medicalStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">{stat.title}</p><p className="text-2xl font-bold mt-1">{stat.value}</p><p className="text-sm text-red-500 mt-1">{stat.change || stat.subtitle}</p></div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}><stat.icon className="w-7 h-7 text-white" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Injuries</CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-600">{medicalRecentInjuries.length} Active</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicalRecentInjuries.map((injury, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                <div className="flex items-center gap-4">
                  <Activity className="w-5 h-5 text-red-500" />
                  <div><p className="font-medium">{injury.student}</p><p className="text-sm text-muted-foreground">{injury.type}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={severityColors[injury.severity as keyof typeof severityColors]}>{injury.severity}</Badge>
                  <Button size="sm" variant="ghost" className="text-red-500"><ArrowRight className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Checkups</CardTitle>
            <Clock className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            {medicalUpcomingCheckups.map((checkup, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                <div><p className="font-medium">{checkup.student}</p><p className="text-sm text-muted-foreground">{checkup.type}</p></div>
                <div className="text-right"><p className="text-sm font-medium">{checkup.date}</p><p className="text-xs text-muted-foreground">{checkup.doctor}</p></div>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">View All Appointments<ArrowRight className="w-4 h-4 ml-2" /></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
