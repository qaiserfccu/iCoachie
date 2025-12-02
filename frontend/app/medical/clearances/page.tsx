"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, CheckCircle, AlertTriangle, Clock, Plus, ArrowRight, FileCheck } from "lucide-react"

const clearances = [
  { id: 1, student: "Alex Thompson", type: "Annual Physical", issuedDate: "Jan 5, 2024", expiryDate: "Jan 5, 2025", issuedBy: "Dr. Johnson", status: "valid" },
  { id: 2, student: "Jordan Lee", type: "Return to Play", issuedDate: "Jan 10, 2024", expiryDate: "Feb 10, 2024", issuedBy: "Dr. Smith", status: "valid" },
  { id: 3, student: "Casey Rivera", type: "Annual Physical", issuedDate: "Dec 15, 2023", expiryDate: "Dec 15, 2024", issuedBy: "Dr. Williams", status: "valid" },
  { id: 4, student: "Taylor Morgan", type: "Annual Physical", issuedDate: "Nov 20, 2023", expiryDate: "Jan 20, 2024", issuedBy: "Dr. Brown", status: "expiring" },
  { id: 5, student: "Sam Wilson", type: "Medical Waiver", issuedDate: "Jan 12, 2024", expiryDate: "Jul 12, 2024", issuedBy: "Dr. Davis", status: "valid" },
  { id: 6, student: "Morgan Smith", type: "Annual Physical", issuedDate: "Oct 10, 2023", expiryDate: "Jan 10, 2024", issuedBy: "Dr. Johnson", status: "expired" },
]

const statusConfig = {
  valid: { color: "bg-green-500/20 text-green-500", icon: CheckCircle },
  expiring: { color: "bg-yellow-500/20 text-yellow-500", icon: AlertTriangle },
  expired: { color: "bg-red-500/20 text-red-500", icon: AlertTriangle },
  pending: { color: "bg-blue-500/20 text-blue-500", icon: Clock },
}

export default function ClearancesPage() {
  const validCount = clearances.filter(c => c.status === "valid").length
  const expiringCount = clearances.filter(c => c.status === "expiring").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medical Clearances</h1>
          <p className="text-muted-foreground">Manage participation clearances</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Clearance
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{clearances.length}</p>
            </div>
            <FileCheck className="w-8 h-8 text-pink-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valid</p>
              <p className="text-2xl font-bold text-green-500">{validCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-500">{expiringCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-red-500">{clearances.filter(c => c.status === "expired").length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">All Clearances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {clearances.map((clearance) => {
            const config = statusConfig[clearance.status as keyof typeof statusConfig]
            const StatusIcon = config.icon
            return (
              <div key={clearance.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                      {clearance.student.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{clearance.student}</p>
                    <p className="text-sm text-muted-foreground">{clearance.type}</p>
                    <p className="text-xs text-muted-foreground">By: {clearance.issuedBy} • Expires: {clearance.expiryDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={config.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {clearance.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-pink-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
