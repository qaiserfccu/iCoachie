import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, TrendingUp, Trophy, Clock, ArrowRight, Star, CheckCircle, Target } from "lucide-react"

const stats = [
  { title: "Upcoming Sessions", value: "4", subtitle: "This week", icon: Calendar, color: "from-indigo-500 to-purple-500" },
  { title: "Overall Progress", value: "78%", subtitle: "+5% this month", icon: TrendingUp, color: "from-green-500 to-green-600" },
  { title: "Badges Earned", value: "12", subtitle: "2 new this month", icon: Trophy, color: "from-yellow-500 to-orange-500" },
  { title: "Attendance", value: "95%", subtitle: "Excellent!", icon: CheckCircle, color: "from-blue-500 to-blue-600" },
]

const upcomingSessions = [
  { sport: "Swimming", coach: "John Smith", time: "Today, 4:00 PM", location: "Pool A", duration: "1h" },
  { sport: "Swimming", coach: "John Smith", time: "Tomorrow, 4:00 PM", location: "Pool A", duration: "1h" },
  { sport: "Fitness Training", coach: "Mike Brown", time: "Wed, 10:00 AM", location: "Gym B", duration: "45min" },
]

const recentEvaluations = [
  { skill: "Freestyle Technique", score: 85, date: "Nov 28", feedback: "Great improvement!" },
  { skill: "Breathing Control", score: 78, date: "Nov 25", feedback: "Keep practicing" },
  { skill: "Endurance", score: 90, date: "Nov 20", feedback: "Excellent progress" },
]

const achievements = [
  { name: "First Lap!", description: "Completed first 50m lap", date: "1 week ago", icon: "🏊" },
  { name: "Perfect Attendance", description: "Attended all sessions this month", date: "2 weeks ago", icon: "⭐" },
  { name: "Skill Master", description: "Mastered freestyle basics", date: "3 weeks ago", icon: "🏆" },
]

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">View Schedule</Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />View Progress
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-indigo-500 mt-1">{stat.subtitle}</p>
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
            <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
            <Button variant="ghost" size="sm" className="text-indigo-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{session.time.split(", ")[1]}</span>
                    <span className="block text-xs text-muted-foreground">{session.time.split(", ")[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{session.sport}</p>
                    <p className="text-sm text-muted-foreground">{session.coach} • {session.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-indigo-500/20 text-indigo-500">{session.duration}</Badge>
                  <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">Details</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Achievements</CardTitle>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-3 rounded-xl glass-subtle">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="font-medium text-sm">{achievement.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2"><CardTitle className="text-lg font-semibold">Recent Evaluations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {recentEvaluations.map((evaluation, index) => (
              <div key={index} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{evaluation.skill}</span>
                  <Badge className={evaluation.score >= 80 ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-600"}>{evaluation.score}%</Badge>
                </div>
                <Progress value={evaluation.score} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{evaluation.feedback}</p>
                  <p className="text-xs text-muted-foreground">{evaluation.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2"><CardTitle className="text-lg font-semibold">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[{ label: "View Full Schedule", icon: Calendar, color: "text-indigo-500" }, { label: "Check Progress Report", icon: TrendingUp, color: "text-green-500" }, { label: "View All Evaluations", icon: Target, color: "text-blue-500" }, { label: "Message My Coach", icon: Star, color: "text-yellow-500" }].map((action) => (
              <Button key={action.label} variant="ghost" className="w-full justify-between glass-subtle hover:bg-white/20">
                <span className="flex items-center gap-3"><action.icon className={`w-5 h-5 ${action.color}`} />{action.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
