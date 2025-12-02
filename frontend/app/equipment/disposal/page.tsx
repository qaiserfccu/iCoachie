"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Calendar } from "lucide-react"

const disposals = [
  { id: 1, item: "Old Treadmill", reason: "Beyond repair", date: "Jan 12, 2025", method: "Recycle", status: "scheduled" },
  { id: 2, item: "Damaged Basketball Hoops (2)", reason: "Safety hazard", date: "Jan 8, 2025", method: "Dispose", status: "completed" },
  { id: 3, item: "Worn Yoga Mats (15)", reason: "End of life", date: "Jan 5, 2025", method: "Recycle", status: "completed" },
  { id: 4, item: "Broken Tennis Rackets (5)", reason: "Damaged", date: "Jan 15, 2025", method: "Dispose", status: "pending" },
]

export default function DisposalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Equipment Disposal</h1><p className="text-muted-foreground">Manage equipment end-of-life</p></div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"><Plus className="w-4 h-4 mr-2" />Request Disposal</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-500">3</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Scheduled</p><p className="text-2xl font-bold text-blue-500">2</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Recycled</p><p className="text-2xl font-bold text-green-500">18</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Disposed</p><p className="text-2xl font-bold text-red-500">12</p></CardContent></Card>
      </div>
      <Card className="glass-card border-white/20">
        <CardHeader><CardTitle>Disposal Records</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {disposals.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><Trash2 className="w-5 h-5 text-red-500" /></div>
                <div>
                  <p className="font-medium">{item.item}</p>
                  <p className="text-sm text-muted-foreground">{item.reason} • {item.method}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={item.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : item.status === 'scheduled' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}>{item.status}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
