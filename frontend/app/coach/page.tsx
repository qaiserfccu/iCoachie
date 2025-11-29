import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, UserCheck, GraduationCap, Clock, ArrowRight, AlertCircle, TrendingUp } from "lucide-react"

const stats = [
  { title: "My Students", value: "45", change: "+3 this week", icon: Users, color: "from-teal-500 to-teal-600" },
  { title: "Sessions Today", value: "4", change: "2 completed", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { title: "Attendance Rate", value: "94%", change: "+2%", icon: UserCheck, color: "from-green-500 to-green-600" },
  {
    title: "Pending Evaluations",
    value: "8",
    change: "Due this week",
    icon: GraduationCap,
    color: "from-yellow-500 to-orange-500",
  },
]

const todaySessions = [
  { time: "09:00 AM", name: "Junior Swimming", students: 15, status: "completed", duration: "1h" },
  { time: "11:00 AM", name: "Intermediate Swimming", students: 12, status: "ongoing", duration: "1.5h" },
  { time: "02:00 PM", name: "Advanced Techniques", students: 8, status: "upcoming", duration: "1h" },
  { time: "04:00 PM", name: "Private Lesson", students: 1, status: "upcoming", duration: "45m" },
]

const recentStudents = [
  { name: "Emma Davis", avatar: "ED", lastSession: "Today", progress: 92, status: "Excellent" },
  { name: "Jack Wilson", avatar: "JW", lastSession: "Yesterday", progress: 85, status: "Good" },
  { name: "Sophie Miller", avatar: "SM", lastSession: "Today", progress: 78, status: "Improving" },
  { name: "Lucas Brown", avatar: "LB", lastSession: "2 days ago", progress: 65, status: "Needs Focus" },
]

const pendingEvaluations = [
  { student: "Emma Davis", type: "Monthly Progress", dueDate: "Nov 30" },
  { student: "Jack Wilson", type: "Skill Assessment", dueDate: "Dec 1" },
  { student: "Sophie Miller", type: "Monthly Progress", dueDate: "Dec 2" },
]

export default function CoachDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coach Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John! Here&apos;s your day overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            View Reports
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
            <UserCheck className="w-4 h-4 mr-2" />
            Mark Attendance
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
                  <p className="text-sm text-teal-500 mt-1">{stat.change}</p>
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
        {/* Today's Schedule */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today&apos;s Schedule</CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-500">
              View Full Schedule
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{session.time}</span>
                    <span className="block text-xs text-muted-foreground">{session.duration}</span>
                  </div>
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-muted-foreground">{session.students} students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
                  <Button size="sm" variant="ghost" className="glass-subtle">
                    {session.status === "ongoing" ? "View" : session.status === "upcoming" ? "Start" : "Details"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Mark Attendance", icon: UserCheck, color: "text-teal-500" },
                { label: "Add Evaluation", icon: GraduationCap, color: "text-blue-500" },
                { label: "Send Message", icon: AlertCircle, color: "text-green-500" },
                { label: "View Reports", icon: TrendingUp, color: "text-yellow-500" },
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
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Pending Evaluations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingEvaluations.map((eval_, index) => (
                <div key={index} className="p-3 rounded-xl glass-subtle">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{eval_.student}</p>
                    <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-600">
                      Due: {eval_.dueDate}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{eval_.type}</p>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-teal-500">
                View All Evaluations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Students */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Students</CardTitle>
          <Button variant="ghost" size="sm" className="text-teal-500">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentStudents.map((student) => (
              <div
                key={student.name}
                className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`/.jpg?key=pn1mi&height=48&width=48&query=${student.name} child`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-green-500 text-white">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Last: {student.lastSession}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                  <Badge
                    className={
                      student.status === "Excellent"
                        ? "bg-green-500/20 text-green-600"
                        : student.status === "Good"
                          ? "bg-blue-500/20 text-blue-600"
                          : student.status === "Improving"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : "bg-orange-500/20 text-orange-600"
                    }
                  >
                    {student.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
