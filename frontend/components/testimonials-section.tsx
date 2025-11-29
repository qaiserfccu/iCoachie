import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "iCoachie transformed how we manage our soccer academy. Registration that used to take weeks now happens in days.",
    author: "Sarah Mitchell",
    role: "Director, Elite Soccer Academy",
    rating: 5,
  },
  {
    quote:
      "The parent portal is a game-changer. Parents love seeing their kids' progress and we've reduced admin calls by 80%.",
    author: "James Rodriguez",
    role: "Head Coach, Youth Tennis Club",
    rating: 5,
  },
  {
    quote:
      "As a freelance swimming instructor, iCoachie helps me manage 40+ students across 3 different pools effortlessly.",
    author: "Emily Chen",
    role: "Independent Swim Coach",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Trusted by coaches worldwide
          </h2>
          <p className="text-lg text-muted-foreground">See what organizations and coaches are saying about iCoachie.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 border border-border">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</blockquote>
              <div>
                <div className="font-semibold text-foreground">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
