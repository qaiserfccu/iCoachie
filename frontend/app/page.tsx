import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { AudienceSection } from "@/components/audience-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background gradient-mesh relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="orb orb-blue w-96 h-96 top-20 -left-48 fixed" />
      <div className="orb orb-teal w-80 h-80 top-1/3 -right-40 fixed" style={{ animationDelay: "2s" }} />
      <div className="orb orb-yellow w-72 h-72 bottom-40 left-1/4 fixed" style={{ animationDelay: "4s" }} />
      <div className="orb orb-green w-64 h-64 bottom-20 right-1/3 fixed" style={{ animationDelay: "6s" }} />

      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <HowItWorksSection />
          <AudienceSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
