import { Building2, User, Briefcase, Heart, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const audiences = [
  {
    icon: Building2,
    title: "Clubs & Academies",
    description:
      "Manage multiple programs, locations, and staff with enterprise-grade tools designed for growing organizations.",
    features: ["Multi-location support", "Staff management", "Program analytics", "Custom branding"],
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/20 to-blue-600/10",
    image: "/sports-academy-facility-with-coaches.jpg",
  },
  {
    icon: User,
    title: "Individual Coaches",
    description:
      "Run your independent coaching business efficiently with tools for scheduling, payments, and client management.",
    features: ["Personal scheduling", "Client portal", "Invoice automation", "Session notes"],
    color: "from-teal-500 to-teal-600",
    bgColor: "from-teal-500/20 to-teal-600/10",
    image: "/coach-training-young-athlete.jpg",
  },
  {
    icon: Briefcase,
    title: "Freelancers",
    description:
      "Flexible tools for coaches who work with multiple clubs or manage their own roster of private clients.",
    features: ["Flexible availability", "Multiple client groups", "Expense tracking", "Tax reports"],
    color: "from-yellow-500 to-yellow-600",
    bgColor: "from-yellow-500/20 to-yellow-600/10",
    image: "/freelance-sports-trainer-outdoors.jpg",
  },
  {
    icon: Heart,
    title: "Kids & Parents",
    description: "Easy registration, progress visibility, and seamless communication between coaches and families.",
    features: ["Parent dashboard", "Progress reports", "Easy payments", "Schedule alerts"],
    color: "from-green-500 to-green-600",
    bgColor: "from-green-500/20 to-green-600/10",
    image: "/happy-children-sports-team-with-parent.jpg",
  },
]

export function AudienceSection() {
  return (
    <section id="solutions" className="py-20 lg:py-32 glass relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium text-foreground mb-6">
            <span className="w-2 h-2 bg-accent rounded-full" />
            Built For You
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Solutions for everyone in the <span className="text-gradient">coaching ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're running a large academy or coaching privately, iCoachie adapts to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {audiences.map((audience) => (
            <div key={audience.title} className="group glass-card rounded-3xl overflow-hidden hover-lift">
              {/* Image header */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={audience.image || "/placeholder.svg"}
                  alt={audience.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent`} />
                <div
                  className={`absolute top-4 left-4 w-14 h-14 rounded-xl bg-gradient-to-br ${audience.color} flex items-center justify-center shadow-lg`}
                >
                  <audience.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{audience.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">{audience.description}</p>

                <ul className="space-y-2 mb-6">
                  {audience.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${audience.bgColor} flex items-center justify-center`}
                      >
                        <Check className="w-3 h-3 text-foreground" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className="w-full glass border-white/30 hover:bg-white/20 gap-2 group/btn bg-transparent"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
