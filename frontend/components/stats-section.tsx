import { Users, CalendarDays, Star, Zap } from "lucide-react"

const stats = [
  {
    value: "10K+",
    label: "Organizations",
    description: "Trust iCoachie",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    value: "500K+",
    label: "Students",
    description: "Tracked & managed",
    icon: CalendarDays,
    color: "from-teal-500 to-teal-600",
  },
  {
    value: "98%",
    label: "Satisfaction",
    description: "Customer rating",
    icon: Star,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    value: "50M+",
    label: "Sessions",
    description: "Scheduled monthly",
    icon: Zap,
    color: "from-green-500 to-green-600",
  },
]

export function StatsSection() {
  return (
    <section className="border-y border-white/20 glass relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-20 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div
                className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
