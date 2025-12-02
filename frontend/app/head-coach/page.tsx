import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowRight, Crown, Star } from "lucide-react"
import { headCoachStats, headCoachCoaches, headCoachUpcomingSessions } from "@/lib/services/mockDataService"

export default function HeadCoachDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Head Coach Dashboard</h1>
          <p className="text-muted-foreground">Manage coaches, programs, and training sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">View Reports</Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Crown className="w-4 h-4 mr-2" />New Program
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {headCoachStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-orange-500 mt-1">{stat.subtitle}</p>
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
            <CardTitle className="text-lg font-semibold">My Coaches</CardTitle>
            <Button variant="ghost" size="sm" className="text-orange-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {headCoachCoaches.map((coach, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium">{coach.name}</p>
                    <p className="text-sm text-muted-foreground">{coach.specialty} • {coach.students} athletes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{coach.rating}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-orange-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Badge className="bg-green-500/20 text-green-500">{headCoachUpcomingSessions.length} Scheduled</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {headCoachUpcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                <div>
                  <p className="font-medium">{session.program}</p>
                  <p className="text-sm text-muted-foreground">{session.coach}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{session.time}</p>
                  <p className="text-xs text-muted-foreground">{session.athletes} athletes</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">
              View Full Schedule<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
