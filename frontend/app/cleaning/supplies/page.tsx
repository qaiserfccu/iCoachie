"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Search, AlertTriangle, Edit, ShoppingCart } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const supplies = [
  { id: 1, name: "All-Purpose Cleaner", category: "Cleaning", quantity: 24, unit: "bottles", minStock: 10, status: "in-stock" },
  { id: 2, name: "Disinfectant Spray", category: "Sanitization", quantity: 8, unit: "cans", minStock: 15, status: "low-stock" },
  { id: 3, name: "Paper Towels", category: "Consumables", quantity: 50, unit: "rolls", minStock: 20, status: "in-stock" },
  { id: 4, name: "Floor Polish", category: "Cleaning", quantity: 5, unit: "gallons", minStock: 8, status: "low-stock" },
  { id: 5, name: "Hand Sanitizer", category: "Sanitization", quantity: 0, unit: "bottles", minStock: 20, status: "out-of-stock" },
  { id: 6, name: "Trash Bags", category: "Consumables", quantity: 100, unit: "bags", minStock: 50, status: "in-stock" },
  { id: 7, name: "Mop Heads", category: "Equipment", quantity: 12, unit: "pieces", minStock: 6, status: "in-stock" },
  { id: 8, name: "Glass Cleaner", category: "Cleaning", quantity: 3, unit: "bottles", minStock: 10, status: "low-stock" },
]

export default function SuppliesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supplies Inventory</h1>
          <p className="text-muted-foreground">Track and manage cleaning supplies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-subtle">
            <ShoppingCart className="w-4 h-4 mr-2" />Order Supplies
          </Button>
          <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
            <Plus className="w-4 h-4 mr-2" />Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Package className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <Package className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search supplies..." className="pl-10 glass-subtle" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplies.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>
                    <div className="w-32">
                      <Progress value={Math.min((item.quantity / item.minStock) * 50, 100)} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === "in-stock" ? "default" :
                      item.status === "low-stock" ? "secondary" : "destructive"
                    }>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
