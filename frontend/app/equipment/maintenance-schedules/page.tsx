"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Calendar, Plus } from "lucide-react"

const schedules = [
  { id: 1, equipment: "Treadmills", lastService: "Dec 15, 2024", nextService: "Mar 15, 2025", frequency: "Quarterly", status: "scheduled" },
  { id: 2, equipment: "Pool Filters", lastService: "Jan 1, 2025", nextService: "Feb 1, 2025", frequency: "Monthly", status: "upcoming" },
  { id: 3, equipment: "Weight Machines", lastService: "Nov 1, 2024", nextService: "Jan 1, 2025", frequency: "Bi-Monthly", status: "overdue" },
  { id: 4, equipment: "Basketball Hoops", lastService: "Jan 10, 2025", nextService: "Apr 10, 2025", frequency: "Quarterly", status: "scheduled" },
]

export default function MaintenanceSchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Maintenance Schedules</h1><p className="text-muted-foreground">Equipment maintenance planning</p></div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"><Plus className="w-4 h-4 mr-2" />Add Schedule</Button>
      </div>
      <Card className="glass-card border-white/20">
        <CardHeader><CardTitle>Scheduled Maintenance</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {schedules.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><Wrench className="w-5 h-5 text-indigo-500" /></div>
                <div>
                  <p className="font-medium">{item.equipment}</p>
                  <p className="text-sm text-muted-foreground">{item.frequency} • Last: {item.lastService}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={item.status === 'overdue' ? 'bg-red-500/20 text-red-500' : item.status === 'upcoming' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}>{item.status}</Badge>
                <p className="text-xs text-muted-foreground mt-1">Next: {item.nextService}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
