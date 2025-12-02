"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, UserCheck, UserX, Clock, Users, 
  ArrowRight, CheckCircle, QrCode
} from "lucide-react"
import { useState } from "react"

const checkIns = [
  { id: 1, name: "Alex Thompson", type: "Student", time: "9:15 AM", status: "checked-in", session: "Morning Training" },
  { id: 2, name: "Jordan Lee", type: "Student", time: "9:20 AM", status: "checked-in", session: "Morning Training" },
  { id: 3, name: "Coach Sarah", type: "Staff", time: "8:45 AM", status: "checked-in", session: "N/A" },
  { id: 4, name: "Parent - Mr. Wilson", type: "Visitor", time: "9:30 AM", status: "checked-in", session: "N/A" },
  { id: 5, name: "Casey Rivera", type: "Student", time: "9:00 AM", status: "checked-out", session: "Early Session" },
]

const expectedArrivals = [
  { id: 1, name: "Taylor Morgan", time: "10:00 AM", session: "Tennis Practice" },
  { id: 2, name: "Sam Wilson", time: "10:00 AM", session: "Soccer Training" },
  { id: 3, name: "Morgan Smith", time: "10:30 AM", session: "Swimming" },
  { id: 4, name: "Riley Johnson", time: "11:00 AM", session: "Basketball" },
]

export default function CheckInsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const checkedIn = checkIns.filter(c => c.status === "checked-in").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Check-ins</h1>
          <p className="text-muted-foreground">Manage visitor and student check-ins</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <UserCheck className="w-4 h-4 mr-2" />
            Manual Check-in
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Currently In</p>
              <p className="text-2xl font-bold text-green-500">{checkedIn}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expected</p>
              <p className="text-2xl font-bold text-blue-500">{expectedArrivals.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Checked Out</p>
              <p className="text-2xl font-bold">{checkIns.filter(c => c.status === "checked-out").length}</p>
            </div>
            <UserX className="w-8 h-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Today</p>
              <p className="text-2xl font-bold">{checkIns.length}</p>
            </div>
            <Users className="w-8 h-8 text-cyan-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name..." className="pl-10 glass-subtle border-white/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checkIns.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.type} • {person.session}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{person.time}</span>
                  <Badge className={person.status === "checked-in" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}>
                    {person.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-cyan-500">
                    {person.status === "checked-in" ? <UserX className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Expected Arrivals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expectedArrivals.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div>
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.session}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{person.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
