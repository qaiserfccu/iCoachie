import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Star, Trophy, Target, ArrowRight, Calendar } from "lucide-react"

const kidsProgress = [
  {
    name: "Emma Thompson",
    avatar: "ET",
    sport: "Swimming",
    overallProgress: 92,
    trend: "+5%",
    skills: [
      { name: "Freestyle", level: 95, status: "Mastered" },
      { name: "Backstroke", level: 88, status: "Advanced" },
      { name: "Breaststroke", level: 75, status: "Intermediate" },
      { name: "Diving", level: 60, status: "Developing" },
    ],
    recentEvaluations: [
      { date: "Nov 25, 2024", rating: "Excellent", comment: "Great improvement in backstroke technique" },
      { date: "Nov 18, 2024", rating: "Good", comment: "Working on breathing pattern" },
    ],
  },
  {
    name: "Jake Thompson",
    avatar: "JT",
    sport: "Basketball",
    overallProgress: 78,
    trend: "+8%",
    skills: [
      { name: "Dribbling", level: 82, status: "Advanced" },
      { name: "Passing", level: 75, status: "Intermediate" },
      { name: "Shooting", level: 70, status: "Developing" },
      { name: "Defense", level: 65, status: "Developing" },
    ],
    recentEvaluations: [
      { date: "Nov 24, 2024", rating: "Good", comment: "Excellent teamwork, needs to work on shooting accuracy" },
      { date: "Nov 17, 2024", rating: "Good", comment: "Improving ball control" },
    ],
  },
]

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your children&apos;s development and achievements</p>
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Calendar className="w-4 h-4 mr-2" />
          Download Reports
        </Button>
      </div>

      <Tabs defaultValue={kidsProgress[0].name} className="space-y-6">
        <TabsList className="glass-card border-white/20 p-1">
          {kidsProgress.map((kid) => (
            <TabsTrigger
              key={kid.name}
              value={kid.name}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
            >
              {kid.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {kidsProgress.map((kid) => (
          <TabsContent key={kid.name} value={kid.name} className="space-y-6">
            {/* Overview Card */}
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={`/.jpg?height=80&width=80&query=${kid.name} child`} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-2xl">
                        {kid.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{kid.name}</h2>
                      <p className="text-muted-foreground">{kid.sport}</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-2" />
                      <p className="text-2xl font-bold">{kid.overallProgress}%</p>
                      <p className="text-xs text-muted-foreground">Overall Progress</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <Target className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-2xl font-bold text-green-500">{kid.trend}</p>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <Star className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                      <p className="text-2xl font-bold">{kid.skills.filter((s) => s.status === "Mastered").length}</p>
                      <p className="text-xs text-muted-foreground">Mastered Skills</p>
                    </div>
                    <div className="p-4 rounded-xl glass-subtle text-center">
                      <Trophy className="w-6 h-6 mx-auto text-pink-500 mb-2" />
                      <p className="text-2xl font-bold">{kid.name === "Emma Thompson" ? 5 : 3}</p>
                      <p className="text-xs text-muted-foreground">Badges Earned</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Breakdown */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Skills Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {kid.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              skill.status === "Mastered"
                                ? "bg-green-500/20 text-green-600"
                                : skill.status === "Advanced"
                                  ? "bg-blue-500/20 text-blue-600"
                                  : skill.status === "Intermediate"
                                    ? "bg-yellow-500/20 text-yellow-600"
                                    : "bg-gray-500/20 text-gray-500"
                            }
                          >
                            {skill.status}
                          </Badge>
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Evaluations */}
              <Card className="glass-card border-white/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Evaluations</CardTitle>
                  <Button variant="ghost" size="sm" className="text-pink-500">
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {kid.recentEvaluations.map((evaluation, index) => (
                    <div key={index} className="p-4 rounded-xl glass-subtle">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{evaluation.date}</span>
                        <Badge
                          className={
                            evaluation.rating === "Excellent"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-blue-500/20 text-blue-600"
                          }
                        >
                          {evaluation.rating}
                        </Badge>
                      </div>
                      <p className="text-sm">{evaluation.comment}</p>
                      <Button variant="ghost" size="sm" className="mt-2 text-pink-500 p-0 h-auto">
                        Read Full Report
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
