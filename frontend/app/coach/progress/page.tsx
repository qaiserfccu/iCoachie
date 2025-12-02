import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Award, Target, ChevronRight } from "lucide-react"
import { coachStudentProgress } from "@/lib/services/mockDataService"

const skillCategories = [
  { name: "Technique", avgScore: 85, students: 45 },
  { name: "Endurance", avgScore: 78, students: 45 },
  { name: "Speed", avgScore: 82, students: 45 },
  { name: "Form", avgScore: 80, students: 45 },
]

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Progress</h1>
          <p className="text-muted-foreground">Track and monitor student development</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
          <Target className="w-4 h-4 mr-2" />
          Set Goals
        </Button>
      </div>

      {/* Skill Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {skillCategories.map((category) => (
          <Card key={category.name} className="glass-card border-white/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{category.name}</p>
              <p className="text-2xl font-bold mt-1">{category.avgScore}%</p>
              <Progress value={category.avgScore} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{category.students} students</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {coachStudentProgress.map((student) => (
          <Card key={student.name} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={`/.jpg?key=w9h7z&height=56&width=56&query=${student.name} child`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-green-500 text-white text-lg">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          student.overallProgress >= 85
                            ? "bg-green-500/20 text-green-600"
                            : student.overallProgress >= 70
                              ? "bg-blue-500/20 text-blue-600"
                              : "bg-yellow-500/20 text-yellow-600"
                        }
                      >
                        {student.overallProgress}% Overall
                      </Badge>
                      {student.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="glass-subtle">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                {student.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="font-medium">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{student.recentAchievement}</span>
                </div>
                <span className="text-xs text-muted-foreground">Last eval: {student.lastEvaluation}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
