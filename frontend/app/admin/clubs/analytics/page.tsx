"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, TrendingUp, Users, DollarSign } from "lucide-react"
import { adminClubAnalytics } from "@/lib/services/mockDataService"

export default function ClubAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Club Analytics</h1>
        <p className="text-muted-foreground">Detailed analytics and insights for clubs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clubs</p>
                <p className="text-2xl font-bold">{adminClubAnalytics.totalClubs}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clubs</p>
                <p className="text-2xl font-bold">{adminClubAnalytics.activeClubs}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold">{adminClubAnalytics.newThisMonth}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-2xl font-bold">{adminClubAnalytics.churnRate}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Top Regions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminClubAnalytics.topRegions.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div>
                  <p className="font-medium">{region.region}</p>
                  <p className="text-sm text-muted-foreground">{region.clubs} clubs</p>
                </div>
                <Badge className="bg-green-500/20 text-green-600">{region.growth}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminClubAnalytics.revenueByPlan.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                <div>
                  <p className="font-medium">{item.plan}</p>
                  <p className="text-sm text-muted-foreground">{item.clubs} clubs</p>
                </div>
                <span className="font-bold text-green-500">{item.revenue}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
