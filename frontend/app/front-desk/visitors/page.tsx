"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, UserCheck, Clock, Shield, Plus, ArrowRight, IdCard } from "lucide-react"

const visitors = [
  { id: 1, name: "Mr. Robert Wilson", purpose: "Parent Meeting", host: "Coach Sarah", time: "9:30 AM", status: "checked-in", badge: "V-001" },
  { id: 2, name: "Ms. Jennifer Chen", purpose: "Facility Tour", host: "Front Desk", time: "10:00 AM", status: "checked-in", badge: "V-002" },
  { id: 3, name: "Dr. Michael Brown", purpose: "Medical Evaluation", host: "Medical Staff", time: "11:00 AM", status: "expected", badge: null },
  { id: 4, name: "Coach James Taylor", purpose: "Interview", host: "HR Manager", time: "2:00 PM", status: "expected", badge: null },
  { id: 5, name: "Mrs. Amanda Smith", purpose: "Enrollment Inquiry", host: "Admin", time: "Yesterday", status: "checked-out", badge: "V-098" },
]

export default function VisitorsPage() {
  const currentVisitors = visitors.filter(v => v.status === "checked-in").length
  const expectedVisitors = visitors.filter(v => v.status === "expected").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visitor Management</h1>
          <p className="text-muted-foreground">Track and manage facility visitors</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Register Visitor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Currently On-Site</p>
              <p className="text-2xl font-bold text-green-500">{currentVisitors}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expected Today</p>
              <p className="text-2xl font-bold text-blue-500">{expectedVisitors}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Today</p>
              <p className="text-2xl font-bold">{visitors.length}</p>
            </div>
            <Users className="w-8 h-8 text-cyan-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Badges Issued</p>
              <p className="text-2xl font-bold">{visitors.filter(v => v.badge).length}</p>
            </div>
            <IdCard className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Visitor Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visitors.map((visitor) => (
            <div key={visitor.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                    {visitor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{visitor.name}</p>
                  <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                  <p className="text-xs text-muted-foreground">Host: {visitor.host} • {visitor.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {visitor.badge && (
                  <Badge variant="outline" className="font-mono">{visitor.badge}</Badge>
                )}
                <Badge className={visitor.status === "checked-in" ? "bg-green-500/20 text-green-500" : visitor.status === "expected" ? "bg-blue-500/20 text-blue-500" : "bg-gray-500/20 text-gray-500"}>
                  {visitor.status}
                </Badge>
                <Button size="sm" variant="ghost" className="text-cyan-500">
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
