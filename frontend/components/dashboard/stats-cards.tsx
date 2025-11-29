import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
  {
    title: "Total Members",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Users,
    gradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600",
  },
  {
    title: "Sessions This Week",
    value: "32",
    change: "+8%",
    trend: "up",
    icon: Calendar,
    gradient: "from-teal-500/20 to-teal-600/10",
    iconColor: "text-teal-600",
  },
  {
    title: "Revenue (MTD)",
    value: "$24,580",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-yellow-500/20 to-yellow-600/10",
    iconColor: "text-yellow-600",
  },
  {
    title: "Attendance Rate",
    value: "94%",
    change: "-2%",
    trend: "down",
    icon: TrendingUp,
    gradient: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass-card border-white/30 hover-lift">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-destructive"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
