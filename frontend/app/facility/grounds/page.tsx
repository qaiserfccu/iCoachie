"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trees, MapPin, Sun, Cloud, Droplets, ArrowRight } from "lucide-react"

const grounds = [
  { id: 1, name: "Main Soccer Field", condition: "excellent", lastInspection: "Jan 12", grassHeight: "3.2cm", moisture: "65%", nextMaintenance: "Jan 20" },
  { id: 2, name: "Practice Field A", condition: "good", lastInspection: "Jan 10", grassHeight: "2.8cm", moisture: "58%", nextMaintenance: "Jan 18" },
  { id: 3, name: "Practice Field B", condition: "fair", lastInspection: "Jan 8", grassHeight: "4.1cm", moisture: "72%", nextMaintenance: "Jan 15" },
  { id: 4, name: "Training Ground", condition: "good", lastInspection: "Jan 11", grassHeight: "3.0cm", moisture: "60%", nextMaintenance: "Jan 22" },
]

const conditionColors = { excellent: "bg-green-500/20 text-green-500", good: "bg-blue-500/20 text-blue-500", fair: "bg-yellow-500/20 text-yellow-500", poor: "bg-red-500/20 text-red-500" }

export default function GroundsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grounds</h1>
          <p className="text-muted-foreground">Monitor ground conditions</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <MapPin className="w-4 h-4 mr-2" />
          New Inspection
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Grounds</p>
              <p className="text-2xl font-bold">{grounds.length}</p>
            </div>
            <Trees className="w-8 h-8 text-teal-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Excellent</p>
              <p className="text-2xl font-bold text-green-500">{grounds.filter(g => g.condition === "excellent").length}</p>
            </div>
            <Sun className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Good</p>
              <p className="text-2xl font-bold text-blue-500">{grounds.filter(g => g.condition === "good").length}</p>
            </div>
            <Cloud className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
              <p className="text-2xl font-bold text-yellow-500">{grounds.filter(g => g.condition === "fair" || g.condition === "poor").length}</p>
            </div>
            <Droplets className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Ground Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {grounds.map((ground) => (
            <div key={ground.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Trees className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <p className="font-medium">{ground.name}</p>
                  <p className="text-sm text-muted-foreground">Last inspection: {ground.lastInspection}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>Grass: {ground.grassHeight}</span>
                    <span>Moisture: {ground.moisture}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Next Maintenance</p>
                  <p>{ground.nextMaintenance}</p>
                </div>
                <Badge className={conditionColors[ground.condition as keyof typeof conditionColors]}>{ground.condition}</Badge>
                <Button size="sm" variant="ghost" className="text-teal-500">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
