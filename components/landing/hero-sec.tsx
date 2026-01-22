import { Button } from '@/components/ui/button'

export default function HeroSec() {
  return (
    <section className="py-20 md:py-28 text-center px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mx-auto max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Build communities that actually connect
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-xl text-muted-foreground leading-relaxed mb-12">
          Private conversations, real engagement, and zero noise.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 max-w-md mx-auto">
          <Button size="lg" className="bg-[#e86600] hover:bg-[#cf5b00] text-white shadow-lg w-full sm:w-auto">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Learn More
          </Button>
        </div>

        {/* AI Companion Tag - positioned as secondary CTA */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-accent border border-border/50 px-4 py-1.5 rounded-full transition-all duration-200"
          >
            ✨ AI Companion
          </Button>
        </div>
      </div>
    </section>
  )
}
