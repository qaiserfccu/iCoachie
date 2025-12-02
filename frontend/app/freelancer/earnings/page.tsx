import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, CreditCard, ArrowDownLeft, ArrowUpRight, Download } from "lucide-react"

const earningsStats = [
  { title: "Total Earnings", value: "$4,850", change: "+12%", icon: DollarSign, color: "from-green-500 to-green-600" },
  { title: "This Month", value: "$1,250", change: "+8%", icon: TrendingUp, color: "from-blue-500 to-blue-600" },
  {
    title: "Pending Payout",
    value: "$620",
    change: "Next: Dec 1",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Avg. Per Session",
    value: "$78",
    change: "+$3",
    icon: ArrowUpRight,
    color: "from-purple-500 to-purple-600",
  },
]

const transactions = [
  {
    id: "TXN001",
    client: "Emma Davis",
    type: "Swimming Lesson",
    amount: "$75",
    date: "Nov 29, 2024",
    status: "completed",
  },
  {
    id: "TXN002",
    client: "Jack Wilson",
    type: "Private Training",
    amount: "$100",
    date: "Nov 29, 2024",
    status: "completed",
  },
  {
    id: "TXN003",
    client: "Sophie Miller",
    type: "Swimming Lesson",
    amount: "$75",
    date: "Nov 28, 2024",
    status: "completed",
  },
  {
    id: "TXN004",
    client: "Platform Payout",
    type: "Withdrawal",
    amount: "-$500",
    date: "Nov 25, 2024",
    status: "processed",
  },
  {
    id: "TXN005",
    client: "Lucas Brown",
    type: "Trial Session",
    amount: "$50",
    date: "Nov 24, 2024",
    status: "completed",
  },
]

const monthlyEarnings = [
  { month: "Nov 2024", sessions: 18, earnings: "$1,250", payout: "$1,125" },
  { month: "Oct 2024", sessions: 22, earnings: "$1,650", payout: "$1,485" },
  { month: "Sep 2024", sessions: 20, earnings: "$1,500", payout: "$1,350" },
  { month: "Aug 2024", sessions: 16, earnings: "$1,200", payout: "$1,080" },
]

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground">Track your income and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-subtle border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {earningsStats.map((stat) => (
          <Card key={stat.title} className="glass-card border-white/20 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-green-500 mt-1">{stat.change}</p>
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
        {/* Recent Transactions */}
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-yellow-600">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-xl glass-subtle hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      txn.amount.startsWith("-") ? "bg-red-500/20" : "bg-green-500/20"
                    }`}
                  >
                    {txn.amount.startsWith("-") ? (
                      <ArrowDownLeft className="w-5 h-5 text-red-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.client}</p>
                    <p className="text-sm text-muted-foreground">{txn.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${txn.amount.startsWith("-") ? "text-red-500" : "text-green-500"}`}>
                    {txn.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyEarnings.map((month) => (
              <div key={month.month} className="p-4 rounded-xl glass-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{month.month}</span>
                  <Badge variant="outline" className="border-green-500/50 text-green-500">
                    {month.sessions} sessions
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Earnings</p>
                    <p className="font-medium text-green-500">{month.earnings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payout</p>
                    <p className="font-medium">{month.payout}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
