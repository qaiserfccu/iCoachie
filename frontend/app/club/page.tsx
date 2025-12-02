import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Trophy,
} from "lucide-react"
import { clubStats, clubTodaySessions, clubTopPerformers, clubRecentPayments } from "@/lib/services/mockDataService"

export default function ClubDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Club Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your club overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            View Reports
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clubStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm">{stat.change}</span>
                  </div>
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
        {/* Today's Sessions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {clubTodaySessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[70px]">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{session.time}</span>
                  </div>
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-muted-foreground">Coach: {session.coach}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {session.enrolled}/{session.capacity}
                    </p>
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                  </div>
                  <Badge
                    className={
                      session.status === "completed"
                        ? "bg-green-500/20 text-green-600"
                        : session.status === "ongoing"
                          ? "bg-blue-500/20 text-blue-600"
                          : "bg-yellow-500/20 text-yellow-600"
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Top Performers */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Add New Member", icon: Users, color: "text-blue-500" },
                { label: "Create Session", icon: Calendar, color: "text-teal-500" },
                { label: "Record Attendance", icon: CheckCircle, color: "text-green-500" },
                { label: "Send Announcement", icon: AlertCircle, color: "text-yellow-500" },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-between glass-subtle hover:bg-white/20"
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
              <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              {clubTopPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/.jpg?height=40&width=40&query=${performer.name}`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm">
                        {performer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">{performer.sport}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        performer.badge === "Gold"
                          ? "bg-yellow-500/20 text-yellow-600"
                          : performer.badge === "Silver"
                            ? "bg-gray-400/20 text-gray-600"
                            : "bg-orange-500/20 text-orange-600"
                      }
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {performer.badge}
                    </Badge>
                    <Progress value={performer.progress} className="h-1.5 mt-1 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Payments */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-500">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 font-medium">Member</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {clubRecentPayments.map((payment, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">{payment.member}</td>
                    <td className="py-3 px-4 font-medium text-green-500">{payment.amount}</td>
                    <td className="py-3 px-4">{payment.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{payment.date}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          payment.status === "completed"
                            ? "bg-green-500/20 text-green-600"
                            : "bg-yellow-500/20 text-yellow-600"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
