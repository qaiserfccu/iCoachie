"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight, Plus, User, Calendar, Clock } from "lucide-react"

const checkouts = [
  { id: 1, equipment: "Soccer Balls (5)", user: "Coach Smith", date: "Jan 10, 2025", returnDate: "Jan 15, 2025", status: "active" },
  { id: 2, equipment: "Tennis Rackets (4)", user: "Sarah Johnson", date: "Jan 8, 2025", returnDate: "Jan 12, 2025", status: "overdue" },
  { id: 3, equipment: "Yoga Mats (10)", user: "Fitness Class", date: "Jan 12, 2025", returnDate: "Jan 12, 2025", status: "returned" },
  { id: 4, equipment: "Basketball (3)", user: "Coach Miller", date: "Jan 11, 2025", returnDate: "Jan 18, 2025", status: "active" },
]

export default function CheckoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Equipment Checkouts</h1><p className="text-muted-foreground">Track equipment loans and returns</p></div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"><Plus className="w-4 h-4 mr-2" />New Checkout</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-blue-500">12</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-red-500">3</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Returned Today</p><p className="text-2xl font-bold text-green-500">5</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Due Today</p><p className="text-2xl font-bold text-amber-500">4</p></CardContent></Card>
      </div>
      <Card className="glass-card border-white/20">
        <CardHeader><CardTitle>All Checkouts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {checkouts.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><ArrowLeftRight className="w-5 h-5 text-indigo-500" /></div>
                <div>
                  <p className="font-medium">{item.equipment}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.user}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Return: {item.returnDate}</span>
                  </div>
                </div>
              </div>
              <Badge className={item.status === 'active' ? 'bg-blue-500/20 text-blue-500' : item.status === 'overdue' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}>{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
