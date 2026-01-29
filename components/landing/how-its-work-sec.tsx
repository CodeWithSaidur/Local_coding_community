const STEPS = [
  { title: 'Create your space', desc: 'Set up your learning community in seconds.' },
  { title: 'Invite peers', desc: 'Share a private link or QR code with your target audience.' },
  { title: 'AI Matching', desc: 'Our AI finds the best study partners for your goals.' },
  { title: 'Start learning', desc: 'Enjoy focused conversations without the noise.' },
]

export default function HowItsWorkSec() {
  return (
    <section className="py-24 bg-accent/30 mb-12 rounded-[3.5rem] mx-4 sm:mx-6 lg:mx-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-muted-foreground text-lg">Four simple steps to start your community journey</p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative text-center group">
              <div className="mb-6 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
