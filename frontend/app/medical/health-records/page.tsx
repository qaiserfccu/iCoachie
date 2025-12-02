"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, FileHeart, AlertTriangle, Plus, ArrowRight, Heart } from "lucide-react"

const healthRecords = [
  { id: 1, name: "Alex Thompson", age: 12, bloodType: "A+", allergies: ["Peanuts"], conditions: [], lastCheckup: "Jan 10, 2024", status: "cleared" },
  { id: 2, name: "Jordan Lee", age: 14, bloodType: "O+", allergies: [], conditions: ["Asthma"], lastCheckup: "Jan 5, 2024", status: "cleared" },
  { id: 3, name: "Casey Rivera", age: 16, bloodType: "B+", allergies: ["Penicillin"], conditions: [], lastCheckup: "Dec 20, 2023", status: "needs-update" },
  { id: 4, name: "Taylor Morgan", age: 11, bloodType: "AB+", allergies: [], conditions: [], lastCheckup: "Jan 8, 2024", status: "cleared" },
  { id: 5, name: "Sam Wilson", age: 13, bloodType: "O-", allergies: ["Latex"], conditions: ["Diabetes Type 1"], lastCheckup: "Jan 12, 2024", status: "monitoring" },
]

export default function HealthRecordsPage() {
  const clearedCount = healthRecords.filter(r => r.status === "cleared").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
          <p className="text-muted-foreground">Manage student health information</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold">{healthRecords.length}</p>
            </div>
            <FileHeart className="w-8 h-8 text-pink-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cleared</p>
              <p className="text-2xl font-bold text-green-500">{clearedCount}</p>
            </div>
            <Heart className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Needs Update</p>
              <p className="text-2xl font-bold text-yellow-500">{healthRecords.filter(r => r.status === "needs-update").length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monitoring</p>
              <p className="text-2xl font-bold text-blue-500">{healthRecords.filter(r => r.status === "monitoring").length}</p>
            </div>
            <Heart className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search health records..." className="pl-10 glass-subtle border-white/20" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Health Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {healthRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                    {record.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{record.name}</p>
                  <p className="text-sm text-muted-foreground">Age: {record.age} • Blood Type: {record.bloodType}</p>
                  <div className="flex gap-2 mt-1">
                    {record.allergies.length > 0 && <Badge className="bg-red-500/20 text-red-500 text-xs">Allergies</Badge>}
                    {record.conditions.length > 0 && <Badge className="bg-orange-500/20 text-orange-500 text-xs">Conditions</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Last Checkup</p>
                  <p>{record.lastCheckup}</p>
                </div>
                <Badge className={record.status === "cleared" ? "bg-green-500/20 text-green-500" : record.status === "monitoring" ? "bg-blue-500/20 text-blue-500" : "bg-yellow-500/20 text-yellow-500"}>
                  {record.status}
                </Badge>
                <Button size="sm" variant="ghost" className="text-pink-500">
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
