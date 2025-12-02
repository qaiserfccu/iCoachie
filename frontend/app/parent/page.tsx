import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, GraduationCap, CreditCard, Clock, ArrowRight, Trophy, Star, TrendingUp } from "lucide-react"

const stats = [
  { title: "My Kids", value: "2", subtitle: "Active enrollments", icon: Users, color: "from-pink-500 to-rose-500" },
  { title: "Upcoming Sessions", value: "5", subtitle: "This week", icon: Calendar, color: "from-blue-500 to-blue-600" },
  {
    title: "Avg Progress",
    value: "87%",
    subtitle: "+5% this month",
    icon: GraduationCap,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Total Spent",
    value: "$450",
    subtitle: "This month",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500",
  },
]

const kids = [
  {
    name: "Emma Thompson",
    age: 10,
    avatar: "ET",
    sport: "Swimming",
    coach: "John Smith",
    nextSession: "Today, 4:00 PM",
    progress: 92,
    badges: 5,
  },
  {
    name: "Jake Thompson",
    age: 8,
    avatar: "JT",
    sport: "Basketball",
    coach: "Mike Johnson",
    nextSession: "Tomorrow, 10:00 AM",
    progress: 78,
    badges: 3,
  },
]

const upcomingSessions = [
  { kid: "Emma", sport: "Swimming", coach: "John Smith", time: "Today, 4:00 PM", duration: "1h", location: "Pool A" },
  {
    kid: "Jake",
    sport: "Basketball",
    coach: "Mike Johnson",
    time: "Tomorrow, 10:00 AM",
    duration: "1.5h",
    location: "Court 3",
  },
  { kid: "Emma", sport: "Swimming", coach: "John Smith", time: "Dec 2, 4:00 PM", duration: "1h", location: "Pool A" },
  {
    kid: "Jake",
    sport: "Basketball",
    coach: "Mike Johnson",
    time: "Dec 3, 10:00 AM",
    duration: "1.5h",
    location: "Court 3",
  },
]

const recentAchievements = [
  { kid: "Emma", achievement: "Completed 10 Swimming Sessions", date: "2 days ago", type: "milestone" },
  { kid: "Jake", achievement: "First Basket Score!", date: "1 week ago", type: "skill" },
  { kid: "Emma", achievement: "Perfect Attendance Badge", date: "1 week ago", type: "badge" },
]

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Sarah! Here&apos;s how your kids are doing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            View Reports
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Book Session
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
                  <p className="text-sm text-pink-500 mt-1">{stat.subtitle}</p>
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

      {/* Kids Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kids.map((kid) => (
          <Card key={kid.name} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/.jpg?height=64&width=64&query=${kid.name} child`} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xl">
                    {kid.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{kid.name}</h3>
                      <p className="text-sm text-muted-foreground">{kid.age} years old</p>
                    </div>
                    <Badge className="bg-pink-500/20 text-pink-500">{kid.sport}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Coach</p>
                      <p className="text-sm font-medium">{kid.coach}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Next Session</p>
                      <p className="text-sm font-medium">{kid.nextSession}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{kid.progress}%</span>
                    </div>
                    <Progress value={kid.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{kid.badges} Badges</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-pink-500">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
            <Button variant="ghost" size="sm" className="text-pink-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{session.time.split(", ")[1]}</span>
                    <span className="block text-xs text-muted-foreground">{session.time.split(", ")[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {session.kid} - {session.sport}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.coach} • {session.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-600">{session.duration}</Badge>
                  <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Achievements */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Book a Session", icon: Calendar, color: "text-pink-500" },
                { label: "View Progress", icon: TrendingUp, color: "text-green-500" },
                { label: "Message Coach", icon: Users, color: "text-blue-500" },
                { label: "Make Payment", icon: CreditCard, color: "text-yellow-500" },
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
              <CardTitle className="text-lg font-semibold">Recent Achievements</CardTitle>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.map((item, index) => (
                <div key={index} className="p-3 rounded-xl glass-subtle">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-sm">{item.kid}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.achievement}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
