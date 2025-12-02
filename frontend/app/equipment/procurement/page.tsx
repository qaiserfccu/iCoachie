"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, DollarSign } from "lucide-react"

const orders = [
  { id: "PO-001", item: "Soccer Balls (50)", vendor: "Sports Pro", amount: "$1,250", date: "Jan 8, 2025", status: "pending" },
  { id: "PO-002", item: "Yoga Mats (20)", vendor: "Fitness Supply", amount: "$480", date: "Jan 5, 2025", status: "approved" },
  { id: "PO-003", item: "Swimming Goggles (100)", vendor: "Aqua Gear", amount: "$850", date: "Jan 3, 2025", status: "ordered" },
  { id: "PO-004", item: "Tennis Nets (4)", vendor: "Court Supply", amount: "$620", date: "Dec 28, 2024", status: "delivered" },
]

export default function ProcurementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Procurement</h1><p className="text-muted-foreground">Equipment purchase orders</p></div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"><Plus className="w-4 h-4 mr-2" />New Order</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Orders</p><p className="text-2xl font-bold text-amber-500">5</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">This Month</p><p className="text-2xl font-bold text-indigo-500">$8,450</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold text-green-500">12</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Delivered</p><p className="text-2xl font-bold text-blue-500">28</p></CardContent></Card>
      </div>
      <Card className="glass-card border-white/20">
        <CardHeader><CardTitle>Purchase Orders</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-indigo-500" /></div>
                <div>
                  <p className="font-medium">{order.item}</p>
                  <p className="text-sm text-muted-foreground">{order.id} • {order.vendor} • {order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-indigo-500">{order.amount}</span>
                <Badge className={order.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : order.status === 'approved' ? 'bg-blue-500/20 text-blue-500' : order.status === 'ordered' ? 'bg-purple-500/20 text-purple-500' : 'bg-green-500/20 text-green-500'}>{order.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
