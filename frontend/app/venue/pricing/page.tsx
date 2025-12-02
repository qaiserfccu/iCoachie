"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Edit, TrendingUp } from "lucide-react"

const pricing = [
  { id: 1, venue: "Main Hall", hourly: 500, halfDay: 1800, fullDay: 3000, weekend: 3500, deposit: 1000 },
  { id: 2, venue: "Banquet Hall", hourly: 400, halfDay: 1500, fullDay: 2500, weekend: 3000, deposit: 800 },
  { id: 3, venue: "Conference Room A", hourly: 100, halfDay: 350, fullDay: 600, weekend: 700, deposit: 200 },
  { id: 4, venue: "Conference Room B", hourly: 80, halfDay: 280, fullDay: 500, weekend: 600, deposit: 150 },
  { id: 5, venue: "Outdoor Area", hourly: 300, halfDay: 1000, fullDay: 1800, weekend: 2200, deposit: 600 },
  { id: 6, venue: "Training Room", hourly: 75, halfDay: 260, fullDay: 450, weekend: 550, deposit: 150 },
]

const revenueStats = [
  { period: "This Month", revenue: 45000, bookings: 18 },
  { period: "Last Month", revenue: 38000, bookings: 15 },
  { period: "This Quarter", revenue: 125000, bookings: 52 },
]

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing</h1>
          <p className="text-muted-foreground">Manage venue pricing and rates</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <Edit className="w-4 h-4 mr-2" />Update Pricing
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {revenueStats.map((stat, index) => (
          <Card key={index} className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.period}</p>
                  <p className="text-2xl font-bold">${stat.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.bookings} bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Venue Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Hourly</TableHead>
                <TableHead>Half Day</TableHead>
                <TableHead>Full Day</TableHead>
                <TableHead>Weekend</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.venue}</TableCell>
                  <TableCell>${item.hourly}</TableCell>
                  <TableCell>${item.halfDay}</TableCell>
                  <TableCell>${item.fullDay}</TableCell>
                  <TableCell>${item.weekend}</TableCell>
                  <TableCell>${item.deposit}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Additional Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl glass-subtle">
              <h4 className="font-medium mb-2">Setup Fee</h4>
              <p className="text-2xl font-bold">$150</p>
              <p className="text-sm text-muted-foreground">Per event</p>
            </div>
            <div className="p-4 rounded-xl glass-subtle">
              <h4 className="font-medium mb-2">Cleaning Fee</h4>
              <p className="text-2xl font-bold">$100</p>
              <p className="text-sm text-muted-foreground">Per event</p>
            </div>
            <div className="p-4 rounded-xl glass-subtle">
              <h4 className="font-medium mb-2">Overtime Rate</h4>
              <p className="text-2xl font-bold">1.5x</p>
              <p className="text-sm text-muted-foreground">Hourly rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
