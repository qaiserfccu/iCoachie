"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const progressData = [
  { name: "Emma Wilson", skill: "Dribbling", progress: 85, change: "+5%" },
  { name: "Michael Brown", skill: "Shooting", progress: 72, change: "+8%" },
  { name: "Sarah Johnson", skill: "Passing", progress: 90, change: "+3%" },
  { name: "James Davis", skill: "Defense", progress: 65, change: "+12%" },
]

export function ProgressWidget() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {progressData.map((athlete) => (
          <div key={athlete.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">{athlete.name}</p>
                <p className="text-xs text-muted-foreground">{athlete.skill}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{athlete.progress}%</p>
                <p className="text-xs text-primary">{athlete.change}</p>
              </div>
            </div>
            <Progress value={athlete.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
