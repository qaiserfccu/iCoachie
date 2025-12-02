"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cross, Plus, Clock, AlertTriangle, FileText, ArrowRight } from "lucide-react"

const firstAidLogs = [
  { id: 1, patient: "Alex Thompson", incident: "Minor scrape during practice", treatment: "Cleaned and bandaged", responder: "Coach Sarah", time: "10:30 AM", severity: "minor" },
  { id: 2, patient: "Jordan Lee", incident: "Asthma episode", treatment: "Administered inhaler, monitored", responder: "Medical Staff", time: "11:15 AM", severity: "moderate" },
  { id: 3, patient: "Casey Rivera", incident: "Bee sting", treatment: "Applied ice, monitored for reaction", responder: "Front Desk", time: "2:00 PM", severity: "minor" },
  { id: 4, patient: "Taylor Morgan", incident: "Nosebleed", treatment: "Applied pressure, ice pack", responder: "Coach Mike", time: "3:30 PM", severity: "minor" },
  { id: 5, patient: "Sam Wilson", incident: "Dehydration symptoms", treatment: "Electrolytes, rest in shade", responder: "Medical Staff", time: "4:00 PM", severity: "moderate" },
]

const supplies = [
  { name: "Bandages (Assorted)", quantity: 150, minStock: 50, status: "in-stock" },
  { name: "Antiseptic Wipes", quantity: 45, minStock: 50, status: "low-stock" },
  { name: "Ice Packs", quantity: 12, minStock: 10, status: "in-stock" },
  { name: "First Aid Tape", quantity: 8, minStock: 10, status: "low-stock" },
  { name: "Latex Gloves", quantity: 200, minStock: 100, status: "in-stock" },
]

export default function FirstAidPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">First Aid Logs</h1>
          <p className="text-muted-foreground">Track first aid incidents and supplies</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Log Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Incidents</p>
              <p className="text-2xl font-bold">{firstAidLogs.length}</p>
            </div>
            <Cross className="w-8 h-8 text-pink-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Minor</p>
              <p className="text-2xl font-bold text-green-500">{firstAidLogs.filter(l => l.severity === "minor").length}</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Moderate</p>
              <p className="text-2xl font-bold text-yellow-500">{firstAidLogs.filter(l => l.severity === "moderate").length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-500">{supplies.filter(s => s.status === "low-stock").length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {firstAidLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.severity === "minor" ? "bg-green-500/20" : "bg-yellow-500/20"}`}>
                    <Cross className={`w-5 h-5 ${log.severity === "minor" ? "text-green-500" : "text-yellow-500"}`} />
                  </div>
                  <div>
                    <p className="font-medium">{log.patient}</p>
                    <p className="text-sm text-muted-foreground">{log.incident}</p>
                    <p className="text-xs text-muted-foreground">{log.treatment} • By: {log.responder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {log.time}
                  </span>
                  <Badge className={log.severity === "minor" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}>
                    {log.severity}
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-pink-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Supplies Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {supplies.map((supply, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div>
                  <p className="font-medium text-sm">{supply.name}</p>
                  <p className="text-xs text-muted-foreground">Min: {supply.minStock}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{supply.quantity}</span>
                  <Badge className={supply.status === "in-stock" ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"}>
                    {supply.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full glass-subtle border-white/20">
              Manage Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
