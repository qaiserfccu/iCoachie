"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Search, Plus, AlertTriangle, TrendingDown, TrendingUp, Edit } from "lucide-react"

const inventoryItems = [
  { id: 1, name: "HVAC Filters (20x20)", category: "HVAC", quantity: 24, minStock: 10, location: "Warehouse A", status: "in-stock", lastRestocked: "Jan 5, 2025" },
  { id: 2, name: "LED Light Bulbs", category: "Electrical", quantity: 8, minStock: 15, location: "Warehouse A", status: "low-stock", lastRestocked: "Dec 20, 2024" },
  { id: 3, name: "Pool Chlorine Tablets", category: "Pool", quantity: 50, minStock: 20, location: "Chemical Storage", status: "in-stock", lastRestocked: "Jan 8, 2025" },
  { id: 4, name: "Door Hinges", category: "Hardware", quantity: 0, minStock: 5, location: "Warehouse B", status: "out-of-stock", lastRestocked: "Nov 15, 2024" },
  { id: 5, name: "Paint - White (Gallons)", category: "Paint", quantity: 12, minStock: 5, location: "Warehouse A", status: "in-stock", lastRestocked: "Dec 28, 2024" },
  { id: 6, name: "Electrical Wire (100ft)", category: "Electrical", quantity: 3, minStock: 5, location: "Warehouse B", status: "low-stock", lastRestocked: "Dec 10, 2024" },
]

const stats = [
  { label: "Total Items", value: 156, icon: Package, color: "text-blue-500", bg: "bg-blue-500/20" },
  { label: "Low Stock", value: 8, icon: TrendingDown, color: "text-amber-500", bg: "bg-amber-500/20" },
  { label: "Out of Stock", value: 3, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/20" },
  { label: "Restocked This Month", value: 12, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/20" },
]

const categories = [
  { name: "HVAC", count: 24 },
  { name: "Electrical", count: 32 },
  { name: "Plumbing", count: 18 },
  { name: "Hardware", count: 45 },
  { name: "Paint", count: 12 },
  { name: "Pool", count: 15 },
  { name: "Safety", count: 10 },
]

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Manage maintenance supplies and parts</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="glass-card border-white/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Inventory Items</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items..." className="pl-10 w-64 glass-subtle border-white/20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Item</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Last restocked: {item.lastRestocked}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">{item.category}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${item.quantity <= item.minStock ? 'text-red-500' : ''}`}>
                            {item.quantity}
                          </span>
                          <span className="text-xs text-muted-foreground">/ min: {item.minStock}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{item.location}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          item.status === 'in-stock' ? 'bg-green-500/20 text-green-500' : 
                          item.status === 'low-stock' ? 'bg-amber-500/20 text-amber-500' : 
                          'bg-red-500/20 text-red-500'
                        }>{item.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <span className="text-sm">{cat.name}</span>
                <Badge variant="outline">{cat.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
