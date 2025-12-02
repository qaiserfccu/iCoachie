"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Building2, Search, Plus, Phone, Mail, MapPin, Star, Edit, FileText } from "lucide-react"

const vendors = [
  { 
    id: 1, 
    name: "HVAC Solutions Inc", 
    category: "HVAC",
    contact: "John Wilson",
    phone: "+1 555-0101",
    email: "john@hvacsolutions.com",
    address: "123 Industrial Way, City",
    rating: 4.8,
    activeContracts: 2,
    status: "active"
  },
  { 
    id: 2, 
    name: "ElectroPro Services", 
    category: "Electrical",
    contact: "Sarah Chen",
    phone: "+1 555-0102",
    email: "sarah@electropro.com",
    address: "456 Tech Drive, City",
    rating: 4.5,
    activeContracts: 1,
    status: "active"
  },
  { 
    id: 3, 
    name: "Plumbing Masters", 
    category: "Plumbing",
    contact: "Mike Brown",
    phone: "+1 555-0103",
    email: "mike@plumbingmasters.com",
    address: "789 Service Road, City",
    rating: 4.2,
    activeContracts: 0,
    status: "inactive"
  },
  { 
    id: 4, 
    name: "Safety First Equipment", 
    category: "Safety",
    contact: "Lisa Davis",
    phone: "+1 555-0104",
    email: "lisa@safetyfirst.com",
    address: "321 Safety Lane, City",
    rating: 4.9,
    activeContracts: 3,
    status: "active"
  },
  { 
    id: 5, 
    name: "Pool Tech Services", 
    category: "Pool",
    contact: "Tom Miller",
    phone: "+1 555-0105",
    email: "tom@pooltech.com",
    address: "654 Aqua Street, City",
    rating: 4.6,
    activeContracts: 1,
    status: "active"
  },
]

const recentOrders = [
  { vendor: "HVAC Solutions Inc", item: "HVAC Filters (100 units)", amount: "$2,500", date: "Jan 10, 2025", status: "delivered" },
  { vendor: "ElectroPro Services", item: "LED Lighting Service", amount: "$800", date: "Jan 8, 2025", status: "completed" },
  { vendor: "Safety First Equipment", item: "Fire Extinguishers (10)", amount: "$1,200", date: "Jan 5, 2025", status: "delivered" },
]

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground">Manage suppliers and service providers</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Vendors</p>
            <p className="text-2xl font-bold text-blue-500">{vendors.length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Vendors</p>
            <p className="text-2xl font-bold text-green-500">{vendors.filter(v => v.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Contracts</p>
            <p className="text-2xl font-bold text-amber-500">{vendors.reduce((sum, v) => sum + v.activeContracts, 0)}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
            <p className="text-2xl font-bold text-purple-500">
              {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">All Vendors</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search vendors..." className="pl-10 w-64 glass-subtle border-white/20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{vendor.name}</p>
                        <Badge className={vendor.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}>
                          {vendor.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{vendor.category} • {vendor.contact}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {vendor.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {vendor.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {vendor.address}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{vendor.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{vendor.activeContracts} contracts</p>
                    <div className="flex gap-1 mt-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="p-3 rounded-xl glass-subtle">
                <p className="font-medium text-sm">{order.vendor}</p>
                <p className="text-xs text-muted-foreground mt-1">{order.item}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-amber-500">{order.amount}</span>
                  <Badge className="bg-green-500/20 text-green-500 text-xs">{order.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
