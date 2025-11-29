import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

const benefits = ["Free 14-day trial", "No credit card required", "Full feature access", "Cancel anytime"]

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left - Content */}
            <div className="p-8 lg:p-12 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-secondary opacity-90" />
              <div className="absolute top-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
                  Ready to transform your coaching business?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                  Join thousands of coaches and organizations already using iCoachie to streamline operations and focus
                  on what matters most.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-white/90">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-semibold shadow-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative hidden lg:block">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Coaching success"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent" />

              {/* Floating testimonial */}
              <div className="absolute bottom-8 left-8 right-8 glass-card rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-foreground italic">
                      "iCoachie transformed how we manage our academy. Registration is up 40% and parents love the
                      progress tracking!"
                    </p>
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-foreground">David Martinez</div>
                      <div className="text-xs text-muted-foreground">Elite Soccer Academy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
