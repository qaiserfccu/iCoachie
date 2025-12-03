"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Calendar, BarChart3, ArrowUpRight } from "lucide-react"
import { adminAnalyticsData } from "@/lib/services/mockDataService"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights</p>
        </div>
        <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
          <Calendar className="w-4 h-4 mr-2" />
          Last 30 Days
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminAnalyticsData.topMetrics.map((metric, index) => (
          <Card key={index} className="glass-card border-white/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold">{metric.value}</p>
                <Badge className="bg-green-500/20 text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminAnalyticsData.userGrowth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                        style={{ width: `${(item.users / 15000) * 100}%` }}
                      />
                    </div>
                    <span className="font-medium w-16 text-right">{item.users.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminAnalyticsData.revenueBreakdown.map((item, index) => (
                <div key={index} className="p-4 rounded-xl glass-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-green-500 font-bold">{item.amount}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.percentage}% of total</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
