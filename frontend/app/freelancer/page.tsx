import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  CreditCard,
  Users,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
  DollarSign,
  Eye,
} from "lucide-react"

const stats = [
  {
    title: "Total Earnings",
    value: "$4,850",
    change: "+$620 this week",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
  },
  { title: "Active Clients", value: "28", change: "+5 this month", icon: Users, color: "from-blue-500 to-blue-600" },
  {
    title: "Sessions This Week",
    value: "12",
    change: "4 completed",
    icon: Calendar,
    color: "from-yellow-500 to-orange-500",
  },
  { title: "Rating", value: "4.9", change: "32 reviews", icon: Star, color: "from-purple-500 to-purple-600" },
]

const upcomingBookings = [
  {
    time: "Today, 2:00 PM",
    client: "Emma Davis",
    type: "Swimming Lesson",
    duration: "1h",
    amount: "$75",
    status: "confirmed",
  },
  {
    time: "Today, 4:00 PM",
    client: "Jack Wilson",
    type: "Private Training",
    duration: "1.5h",
    amount: "$100",
    status: "confirmed",
  },
  {
    time: "Tomorrow, 10:00 AM",
    client: "Sophie Miller",
    type: "Swimming Lesson",
    duration: "1h",
    amount: "$75",
    status: "pending",
  },
  {
    time: "Tomorrow, 3:00 PM",
    client: "New Client",
    type: "Trial Session",
    duration: "45m",
    amount: "$50",
    status: "pending",
  },
]

const recentClients = [
  { name: "Emma Davis", sessions: 12, totalSpent: "$900", lastSession: "Today", rating: 5 },
  { name: "Jack Wilson", sessions: 8, totalSpent: "$600", lastSession: "Yesterday", rating: 5 },
  { name: "Sophie Miller", sessions: 6, totalSpent: "$450", lastSession: "2 days ago", rating: 4 },
]

const recentReviews = [
  { client: "Emma Davis", rating: 5, comment: "Excellent coach! Very patient and knowledgeable.", date: "2 days ago" },
  { client: "Jack Wilson", rating: 5, comment: "Great session, learned a lot!", date: "1 week ago" },
]

export default function FreelancerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Mike! Here&apos;s your business overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Clock className="w-4 h-4 mr-2" />
            Set Availability
          </Button>
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
                  <p className="text-sm text-green-500 mt-1">{stat.change}</p>
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
        {/* Upcoming Bookings */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Bookings</CardTitle>
            <Button variant="ghost" size="sm" className="text-yellow-600">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[100px]">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{booking.time}</span>
                  </div>
                  <div>
                    <p className="font-medium">{booking.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.type} ({booking.duration})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-500">{booking.amount}</span>
                  <Badge
                    className={
                      booking.status === "confirmed"
                        ? "bg-green-500/20 text-green-600"
                        : "bg-yellow-500/20 text-yellow-600"
                    }
                  >
                    {booking.status}
                  </Badge>
                  {booking.status === "pending" && (
                    <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      Accept
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats & Reviews */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Update Availability", icon: Clock, color: "text-yellow-500" },
                { label: "View Earnings", icon: CreditCard, color: "text-green-500" },
                { label: "Message Clients", icon: AlertCircle, color: "text-blue-500" },
                { label: "Edit Profile", icon: TrendingUp, color: "text-purple-500" },
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
              <CardTitle className="text-lg font-semibold">Recent Reviews</CardTitle>
              <Star className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReviews.map((review, index) => (
                <div key={index} className="p-3 rounded-xl glass-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{review.client}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Clients */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Top Clients</CardTitle>
          <Button variant="ghost" size="sm" className="text-yellow-600">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentClients.map((client) => (
              <div
                key={client.name}
                className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/.jpg?key=zllm9&height=48&width=48&query=${client.name}`} />
                    <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">Last: {client.lastSession}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sessions</p>
                    <p className="font-medium">{client.sessions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Spent</p>
                    <p className="font-medium text-green-500">{client.totalSpent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
