import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CtaSec() {
  return (
    <section className="relative py-24 mb-12 mx-4 sm:mx-6 lg:mx-8 rounded-[3rem] overflow-hidden bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to build your private community?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of learners finding their perfect match and building focused study groups today.
        </p>

        <div className="flex justify-center">
          <SignedOut>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-14 px-10 text-lg rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 bg-white text-primary hover:bg-white/90"
            >
              <Link href="/sign-up">
                Get Started Now <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-14 px-10 text-lg rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 bg-white text-primary hover:bg-white/90"
            >
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </section>
  )
}
