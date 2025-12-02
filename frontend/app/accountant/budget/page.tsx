"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, TrendingUp, TrendingDown, DollarSign, PieChart,
  AlertTriangle, CheckCircle, ArrowRight
} from "lucide-react"

const budgetCategories = [
  { id: 1, name: "Staff Salaries", allocated: 50000, spent: 48500, color: "bg-blue-500" },
  { id: 2, name: "Equipment & Supplies", allocated: 15000, spent: 12300, color: "bg-green-500" },
  { id: 3, name: "Facility Maintenance", allocated: 10000, spent: 11200, color: "bg-orange-500" },
  { id: 4, name: "Marketing", allocated: 8000, spent: 5500, color: "bg-purple-500" },
  { id: 5, name: "Utilities", allocated: 5000, spent: 4800, color: "bg-cyan-500" },
  { id: 6, name: "Insurance", allocated: 6000, spent: 6000, color: "bg-pink-500" },
  { id: 7, name: "Training Programs", allocated: 12000, spent: 8900, color: "bg-indigo-500" },
  { id: 8, name: "Miscellaneous", allocated: 4000, spent: 2100, color: "bg-gray-500" },
]

const recentTransactions = [
  { id: 1, description: "Coach Training Certification", category: "Training Programs", amount: -1500, date: "Today" },
  { id: 2, description: "New Sports Equipment", category: "Equipment & Supplies", amount: -2800, date: "Yesterday" },
  { id: 3, description: "Monthly Rent Payment", category: "Facility Maintenance", amount: -3500, date: "2 days ago" },
  { id: 4, description: "Marketing Campaign", category: "Marketing", amount: -1200, date: "3 days ago" },
  { id: 5, description: "Utility Bills", category: "Utilities", amount: -850, date: "1 week ago" },
]

export default function BudgetPage() {
  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0)
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const remaining = totalAllocated - totalSpent
  const overBudgetCategories = budgetCategories.filter(cat => cat.spent > cat.allocated)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget Management</h1>
          <p className="text-muted-foreground">Track and manage budget allocations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <PieChart className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Budget Item
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${(totalAllocated / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-orange-500">${(totalSpent / 1000).toFixed(1)}K</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${remaining >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${(remaining / 1000).toFixed(1)}K
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${remaining >= 0 ? "bg-green-500/20" : "bg-red-500/20"} flex items-center justify-center`}>
                {remaining >= 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Over Budget</p>
                <p className="text-2xl font-bold text-red-500">{overBudgetCategories.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Overall Budget Utilization</h3>
            <span className="text-lg font-bold">{((totalSpent / totalAllocated) * 100).toFixed(1)}%</span>
          </div>
          <Progress value={(totalSpent / totalAllocated) * 100} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            ${totalSpent.toLocaleString()} spent of ${totalAllocated.toLocaleString()} allocated
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Categories */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Budget Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetCategories.map((category) => {
              const percentage = (category.spent / category.allocated) * 100
              const isOverBudget = category.spent > category.allocated
              return (
                <div key={category.id} className="p-4 rounded-xl glass-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOverBudget && (
                        <Badge className="bg-red-500/20 text-red-500">Over Budget</Badge>
                      )}
                      <span className={`font-bold ${isOverBudget ? "text-red-500" : "text-foreground"}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOverBudget ? "[&>div]:bg-red-500" : ""}`} 
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${category.spent.toLocaleString()} spent</span>
                    <span>${category.allocated.toLocaleString()} allocated</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Expenses</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-3 rounded-xl glass-subtle"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{transaction.description}</span>
                  <span className="font-bold text-red-500">${Math.abs(transaction.amount)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
