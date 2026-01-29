import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSec() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="size-4" />
          <span>The future of community learning</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          Communities that actually <span className="text-primary italic">connect</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
          EduAliens provides private conversations, real engagement, and zero noise.
          The ultimate platform for meaningful peer-to-peer learning.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <SignedOut>
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/sign-up">
                Get Started <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm transition-all hover:bg-accent/50">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </SignedIn>
        </div>

        {/* AI Companion Tag */}
        <div className="flex justify-center animate-bounce duration-3000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold backdrop-blur-md">
            ✨ AI Powered Matching
          </div>
        </div>
      </div>
    </section>
  )
}
