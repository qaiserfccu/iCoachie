"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DollarSign, Edit, Save, Plus, TrendingUp, Tag, Calendar, Percent } from "lucide-react"

const facilityPricing = [
  { 
    id: 1, 
    name: "Main Soccer Field", 
    hourlyRate: 75, 
    peakRate: 100, 
    weekendRate: 90,
    memberDiscount: 20,
    status: "active"
  },
  { 
    id: 2, 
    name: "Indoor Basketball Court", 
    hourlyRate: 60, 
    peakRate: 80, 
    weekendRate: 70,
    memberDiscount: 15,
    status: "active"
  },
  { 
    id: 3, 
    name: "Swimming Pool (per lane)", 
    hourlyRate: 40, 
    peakRate: 55, 
    weekendRate: 50,
    memberDiscount: 25,
    status: "active"
  },
  { 
    id: 4, 
    name: "Tennis Courts", 
    hourlyRate: 35, 
    peakRate: 50, 
    weekendRate: 45,
    memberDiscount: 15,
    status: "active"
  },
  { 
    id: 5, 
    name: "Multi-Purpose Hall", 
    hourlyRate: 150, 
    peakRate: 200, 
    weekendRate: 180,
    memberDiscount: 10,
    status: "active"
  },
]

const packages = [
  { name: "Monthly Pass - Field", price: 500, originalPrice: 600, savings: "17%", bookings: 45 },
  { name: "Quarterly Membership", price: 1200, originalPrice: 1500, savings: "20%", bookings: 32 },
  { name: "Annual Membership", price: 4000, originalPrice: 5500, savings: "27%", bookings: 28 },
  { name: "Corporate Package", price: 2500, originalPrice: 3000, savings: "17%", bookings: 12 },
]

const promotions = [
  { name: "Early Bird Special", discount: "15%", validUntil: "Jan 31, 2025", status: "active", uses: 89 },
  { name: "New Member Welcome", discount: "25%", validUntil: "Feb 15, 2025", status: "active", uses: 34 },
  { name: "Weekend Warrior", discount: "10%", validUntil: "Dec 31, 2024", status: "expired", uses: 156 },
]

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Management</h1>
          <p className="text-muted-foreground">Manage facility rates, packages, and promotions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Tag className="w-4 h-4 mr-2" />
            Add Promotion
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Package
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Hourly Rate</p>
              <p className="text-2xl font-bold">$72</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Packages</p>
              <p className="text-2xl font-bold">{packages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Promotions</p>
              <p className="text-2xl font-bold">{promotions.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Percent className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenue Impact</p>
              <p className="text-2xl font-bold text-green-500">+12%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Facility Pricing</CardTitle>
          <Button variant="ghost" size="sm" className="text-cyan-500">
            <Save className="w-4 h-4 mr-1" />
            Save Changes
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Facility</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hourly Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Peak Hours</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Weekend</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member Discount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilityPricing.map((facility) => (
                  <tr key={facility.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 font-medium">{facility.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          defaultValue={facility.hourlyRate} 
                          className="w-20 h-8 glass-subtle border-white/20 text-center"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          defaultValue={facility.peakRate} 
                          className="w-20 h-8 glass-subtle border-white/20 text-center"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          defaultValue={facility.weekendRate} 
                          className="w-20 h-8 glass-subtle border-white/20 text-center"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Input 
                          type="number" 
                          defaultValue={facility.memberDiscount} 
                          className="w-16 h-8 glass-subtle border-white/20 text-center"
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-500/20 text-green-500">{facility.status}</Badge>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Packages</CardTitle>
            <Button variant="ghost" size="sm" className="text-cyan-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {packages.map((pkg, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                <div>
                  <p className="font-medium">{pkg.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-cyan-500">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${pkg.originalPrice}</span>
                    <Badge className="bg-green-500/20 text-green-500 text-xs">Save {pkg.savings}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{pkg.bookings}</p>
                  <p className="text-xs text-muted-foreground">Active bookings</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Promotions</CardTitle>
            <Button variant="ghost" size="sm" className="text-cyan-500">View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {promotions.map((promo, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl glass-subtle">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{promo.name}</p>
                    <Badge className={promo.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>
                      {promo.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Percent className="w-3 h-3" />
                    <span>{promo.discount} off</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>Until {promo.validUntil}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{promo.uses}</p>
                  <p className="text-xs text-muted-foreground">Uses</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
