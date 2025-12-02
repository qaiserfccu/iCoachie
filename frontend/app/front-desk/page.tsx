import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCheck, Clock, ArrowRight, CheckCircle } from "lucide-react"
import { frontDeskPageStats, frontDeskPageUpcomingSessions, frontDeskPageRecentCheckins } from "@/lib/services/mockDataService"

export default function FrontDeskDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Front Desk</h1>
          <p className="text-muted-foreground">Welcome! Manage check-ins and inquiries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">View Schedule</Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <UserCheck className="w-4 h-4 mr-2" />Quick Check-in
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {frontDeskPageStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-cyan-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Button variant="ghost" size="sm" className="text-cyan-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {frontDeskPageUpcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[70px]">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{session.time}</span>
                  </div>
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-muted-foreground">{session.coach} • {session.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={session.checkedIn > 0 ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}>
                    {session.checkedIn}/{session.expected}
                  </Badge>
                  <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">Check-in</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Check-ins</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            {frontDeskPageRecentCheckins.map((checkin, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm">{checkin.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{checkin.name}</p>
                  <p className="text-xs text-muted-foreground">{checkin.session}</p>
                </div>
                <span className="text-xs text-muted-foreground">{checkin.time}</span>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">
              View All Check-ins<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
