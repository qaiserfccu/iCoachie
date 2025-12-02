"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Search, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"

const items = [
  { id: 1, name: "Soccer Balls", category: "Sports", quantity: 50, available: 42, condition: "good", location: "Storage A" },
  { id: 2, name: "Tennis Rackets", category: "Sports", quantity: 30, available: 25, condition: "excellent", location: "Storage B" },
  { id: 3, name: "Basketball Hoops", category: "Equipment", quantity: 8, available: 6, condition: "fair", location: "Gym" },
  { id: 4, name: "Swimming Goggles", category: "Aquatics", quantity: 100, available: 85, condition: "good", location: "Pool House" },
  { id: 5, name: "Yoga Mats", category: "Fitness", quantity: 40, available: 35, condition: "good", location: "Studio" },
]

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Equipment Inventory</h1>
          <p className="text-muted-foreground">Manage all sports equipment</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <Plus className="w-4 h-4 mr-2" />Add Equipment
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Items</p><p className="text-2xl font-bold text-indigo-500">228</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Available</p><p className="text-2xl font-bold text-green-500">193</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Checked Out</p><p className="text-2xl font-bold text-amber-500">35</p></CardContent></Card>
        <Card className="glass-card border-white/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Maintenance</p><p className="text-2xl font-bold text-red-500">12</p></CardContent></Card>
      </div>
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>All Equipment</CardTitle>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-10 w-64 glass-subtle border-white/20" /></div>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead><tr className="border-b border-white/20"><th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Item</th><th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th><th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Qty</th><th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Available</th><th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Condition</th><th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th><th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">{item.quantity}</td>
                  <td className="py-3 px-4">{item.available}</td>
                  <td className="py-3 px-4"><Badge className={item.condition === 'excellent' ? 'bg-green-500/20 text-green-500' : item.condition === 'good' ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500'}>{item.condition}</Badge></td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4"><Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
