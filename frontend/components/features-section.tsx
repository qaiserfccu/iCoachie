import {
  Search,
  UserPlus,
  CalendarCheck,
  ClipboardCheck,
  TrendingUp,
  CreditCard,
  MessageCircle,
  Bell,
  Award,
} from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Clubs & Coaches Discovery",
    description:
      "Find the perfect coach or club near you. Browse profiles, reviews, specializations, and availability.",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/20 to-blue-600/10",
    iconColor: "#3b82f6",
    image: "/search-coaches-clubs-interface.jpg",
  },
  {
    icon: UserPlus,
    title: "Register Kids",
    description: "Easy enrollment for classes, camps, and programs. Add multiple children with customizable profiles.",
    color: "from-teal-500 to-teal-600",
    bgColor: "from-teal-500/20 to-teal-600/10",
    iconColor: "#14b8a6",
    image: "/child-registration-form-interface.jpg",
  },
  {
    icon: CalendarCheck,
    title: "Book Sessions",
    description:
      "Schedule private lessons, group classes, or trial sessions. Real-time availability and instant booking.",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "from-yellow-500/20 to-yellow-600/10",
    iconColor: "#eab308",
    image: "/booking-calendar-interface.png",
  },
  {
    icon: ClipboardCheck,
    title: "Track Attendance",
    description: "Digital check-ins with QR codes. Automatic absence alerts and attendance history for parents.",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-500/20 to-green-600/10",
    iconColor: "#22c55e",
    image: "/attendance-tracking-checkin-interface.jpg",
  },
  {
    icon: TrendingUp,
    title: "View Progress Reports",
    description: "Visual dashboards showing skill development, milestones achieved, and areas for improvement.",
    color: "from-blue-500 to-teal-500",
    bgColor: "from-blue-500/20 to-teal-500/10",
    iconColor: "#3b82f6",
    image: "/progress-chart-dashboard-interface.jpg",
  },
  {
    icon: CreditCard,
    title: "Online Payments",
    description: "Secure payment processing with multiple options. Auto-invoicing, subscriptions, and payment history.",
    color: "from-teal-500 to-green-500",
    bgColor: "from-teal-500/20 to-green-500/10",
    iconColor: "#14b8a6",
    image: "/payment-checkout-interface.png",
  },
  {
    icon: MessageCircle,
    title: "Chat with Coaches",
    description: "Direct messaging with coaches. Share updates, ask questions, and receive feedback in real-time.",
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-500/20 to-orange-500/10",
    iconColor: "#eab308",
    image: "/chat-messaging-interface.jpg",
  },
  {
    icon: Bell,
    title: "Upcoming Classes",
    description: "Never miss a session with smart reminders. View schedules, get alerts, and manage bookings easily.",
    color: "from-green-500 to-blue-500",
    bgColor: "from-green-500/20 to-blue-500/10",
    iconColor: "#22c55e",
    image: "/upcoming-classes-schedule-interface.jpg",
  },
  {
    icon: Award,
    title: "Evaluation & Grading",
    description:
      "Comprehensive skill assessments, certification tracking, and performance grading by qualified coaches.",
    color: "from-blue-600 to-blue-700",
    bgColor: "from-blue-600/20 to-blue-700/10",
    iconColor: "#2563eb",
    image: "/grading-evaluation-certificate-interface.jpg",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium text-foreground mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            All Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything you need, <span className="text-gradient">all in one place</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From discovery to evaluation, iCoachie provides a complete ecosystem for sports coaching.
          </p>
        </div>

        {/* Feature grid with mixed sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group glass-card rounded-2xl overflow-hidden hover-lift cursor-pointer ${
                index === 0 || index === 4 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.iconColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>

                {/* Feature preview image */}
                <div className="mt-auto pt-4">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${feature.bgColor} opacity-20`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
