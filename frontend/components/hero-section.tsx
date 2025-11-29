import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Search, Users, Calendar, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium text-foreground">
              <span className="w-2 h-2 bg-chart-4 rounded-full animate-pulse" />
              Now serving 10,000+ organizations
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              All-in-one platform for <span className="text-gradient">sports coaching</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Discover clubs & coaches, register your kids, book sessions, track progress, and manage payments — all in
              one place.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Search, label: "Find Coaches" },
                { icon: Users, label: "Register Kids" },
                { icon: Calendar, label: "Book Sessions" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm text-foreground hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gradient-primary text-white hover:opacity-90 gap-2 shadow-lg shadow-primary/25 hover-glow"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 glass-card border-white/30 hover:bg-white/30 text-foreground bg-transparent"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`/happy-parent-or-coach-avatar-.jpg?height=40&width=40&query=happy parent or coach avatar ${i}`}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-white/50 object-cover"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.9/5</span> from 2,000+ reviews
              </div>
            </div>
          </div>

          <div className="relative lg:h-[550px]">
            {/* Main dashboard preview */}
            <div className="absolute inset-0 glass-card rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
              <img
                src="/sports-coaching-app-dashboard-with-schedules-and-a.jpg"
                alt="iCoachie dashboard preview"
                className="relative w-full h-full object-cover"
              />
            </div>

            {/* Floating feature cards */}
            <div className="absolute -left-4 top-16 glass-card rounded-xl p-3 shadow-xl animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Active Students</div>
                  <div className="text-lg font-bold text-foreground">2,847</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 top-32 glass-card rounded-xl p-3 shadow-xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sessions Today</div>
                  <div className="text-lg font-bold text-foreground">24</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -left-8 bottom-24 glass-card rounded-xl p-3 shadow-xl animate-float"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`/child-avatar-.jpg?height=24&width=24&query=child avatar ${i}`}
                      alt=""
                      className="w-6 h-6 rounded-full border border-white"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">+12 new registrations</span>
              </div>
            </div>

            <div
              className="absolute right-8 bottom-16 glass-card rounded-xl p-3 shadow-xl animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">98%</span>
                </div>
                <span className="text-xs text-foreground font-medium">Attendance Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
