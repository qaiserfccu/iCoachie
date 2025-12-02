import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, Trophy, Star, MessageSquare, GraduationCap } from "lucide-react"

const kids = [
  {
    id: 1,
    name: "Emma Thompson",
    age: 10,
    avatar: "ET",
    sport: "Swimming",
    coach: "John Smith",
    club: "Champions Swim Club",
    enrolledSince: "Jan 2024",
    sessionsCompleted: 24,
    upcomingSessions: 3,
    progress: 92,
    badges: 5,
    status: "Active",
    recentSkills: ["Freestyle", "Backstroke", "Diving Basics"],
  },
  {
    id: 2,
    name: "Jake Thompson",
    age: 8,
    avatar: "JT",
    sport: "Basketball",
    coach: "Mike Johnson",
    club: "Elite Basketball Academy",
    enrolledSince: "Mar 2024",
    sessionsCompleted: 16,
    upcomingSessions: 2,
    progress: 78,
    badges: 3,
    status: "Active",
    recentSkills: ["Dribbling", "Passing", "Shooting Basics"],
  },
]

export default function KidsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Kids</h1>
          <p className="text-muted-foreground">Manage your children&apos;s profiles and enrollments</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {kids.map((kid) => (
          <Card key={kid.id} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Profile Section */}
                <div className="flex items-start gap-4 lg:w-1/3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`/.jpg?height=80&width=80&query=${kid.name} child portrait`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-2xl">
                      {kid.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-xl">{kid.name}</h3>
                    <p className="text-muted-foreground">{kid.age} years old</p>
                    <Badge className="mt-2 bg-green-500/20 text-green-600">{kid.status}</Badge>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl glass-subtle">
                    <p className="text-xs text-muted-foreground mb-1">Sport</p>
                    <p className="font-medium">{kid.sport}</p>
                    <p className="text-xs text-muted-foreground mt-1">{kid.club}</p>
                  </div>
                  <div className="p-4 rounded-xl glass-subtle">
                    <p className="text-xs text-muted-foreground mb-1">Coach</p>
                    <p className="font-medium">{kid.coach}</p>
                    <p className="text-xs text-muted-foreground mt-1">Since {kid.enrolledSince}</p>
                  </div>
                  <div className="p-4 rounded-xl glass-subtle">
                    <p className="text-xs text-muted-foreground mb-1">Sessions</p>
                    <p className="font-medium">{kid.sessionsCompleted} completed</p>
                    <p className="text-xs text-pink-500 mt-1">{kid.upcomingSessions} upcoming</p>
                  </div>
                  <div className="p-4 rounded-xl glass-subtle">
                    <p className="text-xs text-muted-foreground mb-1">Achievements</p>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{kid.badges} Badges</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold text-pink-500">{kid.progress}%</span>
                </div>
                <Progress value={kid.progress} className="h-3" />

                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Recent Skills Learned</p>
                  <div className="flex flex-wrap gap-2">
                    {kid.recentSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-pink-500/50 text-pink-500">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/20">
                <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  <Calendar className="w-4 h-4 mr-1" />
                  Book Session
                </Button>
                <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  View Progress
                </Button>
                <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message Coach
                </Button>
                <Button size="sm" variant="outline" className="glass-subtle border-white/20 bg-transparent">
                  <Star className="w-4 h-4 mr-1" />
                  Achievements
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
