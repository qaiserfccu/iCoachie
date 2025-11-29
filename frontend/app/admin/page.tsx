import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Building2,
  UserCog,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Active Clubs",
    value: "284",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Verified Coaches",
    value: "1,456",
    change: "+15.3%",
    trend: "up",
    icon: UserCog,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Monthly Revenue",
    value: "$128,450",
    change: "-2.4%",
    trend: "down",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500",
  },
]

const pendingActions = [
  { type: "Club Approval", count: 5, icon: Building2, color: "text-blue-500" },
  { type: "Coach Verification", count: 12, icon: UserCog, color: "text-teal-500" },
  { type: "Refund Requests", count: 3, icon: CreditCard, color: "text-yellow-500" },
  { type: "Support Tickets", count: 8, icon: AlertTriangle, color: "text-red-500" },
]

const recentActivities = [
  {
    user: "Champions FC",
    action: "submitted club registration",
    time: "2 min ago",
    avatar: "CF",
    type: "club",
  },
  {
    user: "John Smith",
    action: "completed coach verification",
    time: "15 min ago",
    avatar: "JS",
    type: "coach",
  },
  {
    user: "Sarah Wilson",
    action: "requested refund for session",
    time: "1 hour ago",
    avatar: "SW",
    type: "payment",
  },
  {
    user: "Elite Sports Academy",
    action: "upgraded to premium plan",
    time: "2 hours ago",
    avatar: "ES",
    type: "subscription",
  },
  {
    user: "Mike Johnson",
    action: "registered as freelancer",
    time: "3 hours ago",
    avatar: "MJ",
    type: "user",
  },
]

const topClubs = [
  { name: "Champions FC", members: 450, revenue: "$12,400", growth: "+18%" },
  { name: "Elite Sports Academy", members: 380, revenue: "$10,800", growth: "+12%" },
  { name: "Victory Athletics", members: 320, revenue: "$9,200", growth: "+8%" },
  { name: "Premier Training", members: 290, revenue: "$8,500", growth: "+15%" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            Download Report
          </Button>
          <Button className="gradient-primary text-white">View Analytics</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground text-sm">vs last month</span>
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
        {/* Pending Actions */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Pending Actions</CardTitle>
            <Badge variant="secondary" className="bg-red-500/20 text-red-600">
              {pendingActions.reduce((acc, item) => acc + item.count, 0)} Total
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingActions.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between p-3 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">{item.count}</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/.jpg?height=40&width=40&query=${activity.user} avatar`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    activity.type === "club"
                      ? "border-blue-500/50 text-blue-500"
                      : activity.type === "coach"
                        ? "border-teal-500/50 text-teal-500"
                        : activity.type === "payment"
                          ? "border-yellow-500/50 text-yellow-600"
                          : "border-green-500/50 text-green-500"
                  }
                >
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Clubs & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Top Performing Clubs</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClubs.map((club, index) => (
                <div key={club.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{club.name}</p>
                    <p className="text-xs text-muted-foreground">{club.members} members</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{club.revenue}</p>
                    <p className="text-xs text-green-500">{club.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">System Health</CardTitle>
            <Badge className="bg-green-500/20 text-green-600">All Systems Operational</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "API Response Time", value: "45ms", status: "good" },
                { name: "Database Performance", value: "99.9%", status: "good" },
                { name: "Payment Gateway", value: "Active", status: "good" },
                { name: "Email Service", value: "Active", status: "good" },
                { name: "Storage Usage", value: "68%", status: "warning" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                  <div className="flex items-center gap-3">
                    {item.status === "good" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <span
                    className={item.status === "good" ? "text-green-500 font-medium" : "text-yellow-500 font-medium"}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
