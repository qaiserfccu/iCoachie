"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, FileText, Calendar, DollarSign, ArrowRight,
  Send, Eye, Clock
} from "lucide-react"

const statements = [
  { id: 1, name: "January 2024 Statement", period: "Jan 1 - Jan 31, 2024", balance: 12500.00, status: "generated", generatedDate: "2024-02-01" },
  { id: 2, name: "December 2023 Statement", period: "Dec 1 - Dec 31, 2023", balance: 15200.00, status: "sent", generatedDate: "2024-01-01", sentDate: "2024-01-02" },
  { id: 3, name: "November 2023 Statement", period: "Nov 1 - Nov 30, 2023", balance: 11800.00, status: "sent", generatedDate: "2023-12-01", sentDate: "2023-12-02" },
  { id: 4, name: "October 2023 Statement", period: "Oct 1 - Oct 31, 2023", balance: 14300.00, status: "sent", generatedDate: "2023-11-01", sentDate: "2023-11-02" },
  { id: 5, name: "Q3 2023 Summary", period: "Jul 1 - Sep 30, 2023", balance: 42500.00, status: "sent", generatedDate: "2023-10-01", sentDate: "2023-10-01" },
  { id: 6, name: "Q2 2023 Summary", period: "Apr 1 - Jun 30, 2023", balance: 38900.00, status: "sent", generatedDate: "2023-07-01", sentDate: "2023-07-01" },
]

const clientStatements = [
  { id: 1, client: "Elite Sports Academy", email: "billing@elite.com", lastStatement: "Jan 2024", balance: 2500.00, status: "current" },
  { id: 2, client: "John Smith", email: "john@email.com", lastStatement: "Jan 2024", balance: 0.00, status: "current" },
  { id: 3, client: "Sarah Wilson", email: "sarah@email.com", lastStatement: "Jan 2024", balance: 175.00, status: "overdue" },
  { id: 4, client: "Mike Johnson", email: "mike@email.com", lastStatement: "Jan 2024", balance: 350.00, status: "current" },
  { id: 5, client: "Lisa Garcia", email: "lisa@email.com", lastStatement: "Dec 2023", balance: 450.00, status: "pending" },
]

const statusColors = {
  generated: "bg-yellow-500/20 text-yellow-500",
  sent: "bg-green-500/20 text-green-500",
  current: "bg-green-500/20 text-green-500",
  overdue: "bg-red-500/20 text-red-500",
  pending: "bg-orange-500/20 text-orange-500",
}

export default function StatementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Statements</h1>
          <p className="text-muted-foreground">Generate and manage account statements</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-subtle border-white/20">
            <Send className="w-4 h-4 mr-2" />
            Bulk Send
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Generate Statement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Statements</p>
            <p className="text-2xl font-bold">{statements.length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending to Send</p>
            <p className="text-2xl font-bold text-yellow-500">{statements.filter(s => s.status === "generated").length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Clients with Balance</p>
            <p className="text-2xl font-bold text-orange-500">{clientStatements.filter(c => c.balance > 0).length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Overdue Accounts</p>
            <p className="text-2xl font-bold text-red-500">{clientStatements.filter(c => c.status === "overdue").length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated Statements */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Generated Statements</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {statements.map((statement) => (
              <div
                key={statement.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">{statement.name}</p>
                    <p className="text-sm text-muted-foreground">{statement.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold">${statement.balance.toLocaleString()}</p>
                    <Badge className={statusColors[statement.status as keyof typeof statusColors]}>
                      {statement.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-blue-500" title="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-emerald-500" title="Download">
                      <Download className="w-4 h-4" />
                    </Button>
                    {statement.status === "generated" && (
                      <Button size="sm" variant="ghost" className="text-purple-500" title="Send">
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Statements */}
        <Card className="glass-card border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Client Accounts</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-500">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {clientStatements.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{client.client}</p>
                    <Badge className={statusColors[client.status as keyof typeof statusColors]}>
                      {client.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  <p className="text-xs text-muted-foreground">Last: {client.lastStatement}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`font-bold ${client.balance > 0 ? "text-orange-500" : "text-green-500"}`}>
                      ${client.balance.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Balance</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-emerald-500">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Generate Monthly", icon: Calendar, color: "from-blue-500 to-blue-600" },
              { label: "Generate Quarterly", icon: FileText, color: "from-purple-500 to-indigo-500" },
              { label: "Send Reminders", icon: Send, color: "from-orange-500 to-red-500" },
              { label: "Export All", icon: Download, color: "from-emerald-500 to-green-600" },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 flex-col gap-2 glass-subtle border-white/20 hover:bg-white/20"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
