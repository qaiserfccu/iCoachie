"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Plus, CheckCircle, AlertTriangle } from "lucide-react"

const conditions = [
  { id: 1, field: "Main Soccer Field", condition: "excellent", grassHeight: 2.5, moisture: 65, lastInspection: "2 hours ago", issues: [] },
  { id: 2, field: "Practice Field A", condition: "good", grassHeight: 2.8, moisture: 58, lastInspection: "4 hours ago", issues: ["Minor wear in goal area"] },
  { id: 3, field: "Practice Field B", condition: "fair", grassHeight: 3.2, moisture: 72, lastInspection: "6 hours ago", issues: ["Overwatered", "Needs mowing"] },
  { id: 4, field: "Stadium", condition: "excellent", grassHeight: 2.3, moisture: 62, lastInspection: "1 hour ago", issues: [] },
  { id: 5, field: "Training Pitch", condition: "good", grassHeight: 2.6, moisture: 55, lastInspection: "5 hours ago", issues: ["Divots in center"] },
]

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "excellent": return "text-green-500 bg-green-500/20"
    case "good": return "text-blue-500 bg-blue-500/20"
    case "fair": return "text-yellow-500 bg-yellow-500/20"
    case "poor": return "text-red-500 bg-red-500/20"
    default: return "text-gray-500 bg-gray-500/20"
  }
}

export default function ConditionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Field Conditions</h1>
          <p className="text-muted-foreground">Monitor and track field conditions</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />New Inspection
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Excellent</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Good</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fair</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Poor</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {conditions.map((field) => (
          <Card key={field.id} className="glass-card border-white/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{field.field}</CardTitle>
                <Badge className={getConditionColor(field.condition)}>{field.condition}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-lg glass-subtle text-center">
                  <p className="text-xs text-muted-foreground">Grass Height</p>
                  <p className="text-lg font-bold">{field.grassHeight} in</p>
                </div>
                <div className="p-3 rounded-lg glass-subtle text-center">
                  <p className="text-xs text-muted-foreground">Moisture</p>
                  <p className="text-lg font-bold">{field.moisture}%</p>
                </div>
                <div className="p-3 rounded-lg glass-subtle text-center">
                  <p className="text-xs text-muted-foreground">Last Check</p>
                  <p className="text-sm font-medium">{field.lastInspection}</p>
                </div>
              </div>
              {field.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Issues:</p>
                  {field.issues.map((issue, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-yellow-500">
                      <AlertTriangle className="w-4 h-4" />
                      {issue}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
