import { Search, UserCheck, Calendar, Trophy } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Discover",
    description: "Browse clubs, coaches, and programs in your area. Read reviews and find the perfect match.",
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Register",
    description: "Create your profile, add your kids, and enroll in classes with just a few clicks.",
    color: "from-teal-500 to-teal-600",
  },
  {
    step: "03",
    icon: Calendar,
    title: "Schedule & Pay",
    description: "Book sessions, manage your calendar, and handle all payments securely online.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Track Progress",
    description: "Monitor attendance, view progress reports, and celebrate achievements together.",
    color: "from-green-500 to-green-600",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background graphic */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1200 800">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium text-foreground mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Get started in <span className="text-gradient">4 simple steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of families already using iCoachie to manage their coaching journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.title} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-border via-primary/30 to-border" />
              )}

              <div className="relative glass-card rounded-2xl p-6 text-center hover-lift">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {item.step}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 relative">
          <div className="glass-card rounded-3xl p-8 overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Left - Parent view */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    P
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Parent Dashboard</div>
                    <div className="text-xs text-muted-foreground">Sarah Johnson</div>
                  </div>
                </div>
                <img
                  src="/parent-dashboard-with-children-schedule.jpg"
                  alt="Parent Dashboard"
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>

              {/* Center - Connection graphic */}
              <div className="hidden lg:flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gradient">Connected</div>
                  <div className="text-sm text-muted-foreground">Real-time sync</div>
                </div>
              </div>

              {/* Right - Coach view */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                    C
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Coach Dashboard</div>
                    <div className="text-xs text-muted-foreground">Mike Chen</div>
                  </div>
                </div>
                <img
                  src="/coach-dashboard-with-student-list-attendance.jpg"
                  alt="Coach Dashboard"
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
