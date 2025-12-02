import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, DollarSign, Calendar, Download, ArrowUpRight, ArrowDownLeft, FileText } from "lucide-react"

const paymentStats = [
  {
    title: "Total Spent",
    value: "$1,850",
    subtitle: "This year",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
  },
  {
    title: "This Month",
    value: "$450",
    subtitle: "4 transactions",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
  },
  { title: "Active Plans", value: "2", subtitle: "Monthly subs", icon: CreditCard, color: "from-pink-500 to-rose-500" },
  { title: "Pending", value: "$0", subtitle: "No dues", icon: FileText, color: "from-yellow-500 to-orange-500" },
]

const transactions = [
  {
    id: "TXN001",
    description: "Swimming Lesson - Emma",
    type: "Session",
    amount: "$75",
    date: "Nov 29, 2024",
    status: "completed",
  },
  {
    id: "TXN002",
    description: "Basketball Training - Jake",
    type: "Session",
    amount: "$60",
    date: "Nov 28, 2024",
    status: "completed",
  },
  {
    id: "TXN003",
    description: "Monthly Subscription - Swimming",
    type: "Subscription",
    amount: "$200",
    date: "Nov 1, 2024",
    status: "completed",
  },
  {
    id: "TXN004",
    description: "Monthly Subscription - Basketball",
    type: "Subscription",
    amount: "$150",
    date: "Nov 1, 2024",
    status: "completed",
  },
  {
    id: "TXN005",
    description: "Swimming Gear",
    type: "Equipment",
    amount: "$85",
    date: "Oct 25, 2024",
    status: "completed",
  },
  {
    id: "TXN006",
    description: "Trial Session Refund",
    type: "Refund",
    amount: "-$50",
    date: "Oct 20, 2024",
    status: "refunded",
  },
]

const subscriptions = [
  {
    name: "Swimming Club - Emma",
    coach: "John Smith",
    amount: "$200/month",
    nextBilling: "Dec 1, 2024",
    status: "active",
  },
  {
    name: "Basketball Academy - Jake",
    coach: "Mike Johnson",
    amount: "$150/month",
    nextBilling: "Dec 1, 2024",
    status: "active",
  },
]

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Manage payments, subscriptions, and invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-pink-500 mt-1">{stat.subtitle}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-pink-500">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/10 hover:bg-white/10">
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-white/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              txn.amount.startsWith("-") ? "bg-green-500/20" : "bg-pink-500/20"
                            }`}
                          >
                            {txn.amount.startsWith("-") ? (
                              <ArrowDownLeft className="w-4 h-4 text-green-500" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-pink-500" />
                            )}
                          </div>
                          <span className="font-medium">{txn.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/20">
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                      <TableCell className={`font-medium ${txn.amount.startsWith("-") ? "text-green-500" : ""}`}>
                        {txn.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            txn.status === "completed"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-blue-500/20 text-blue-600"
                          }
                        >
                          {txn.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub.name} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{sub.name}</span>
                  <Badge className="bg-green-500/20 text-green-600">{sub.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Coach: {sub.coach}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-pink-500">{sub.amount}</span>
                  <span className="text-muted-foreground">Next: {sub.nextBilling}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 glass-subtle border-white/20 bg-transparent">
                  Manage Plan
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
