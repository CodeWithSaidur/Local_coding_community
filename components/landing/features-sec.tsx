import { MessageCircle, Shield, Zap, Target, Users, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    title: 'Private by default',
    desc: 'No public search. No spam. Only the people you want in your space.',
    icon: Shield,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Real conversations',
    desc: 'Focused communities with 1:1 matching for deeper learning engagement.',
    icon: MessageCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'AI Companion',
    desc: 'Smart matching system that connects you with the perfect learn partner.',
    icon: Sparkles,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  }
]

export default function FeaturesSec() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to build and grow an engaged learning community.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {FEATURES.map(({ title, desc, icon: Icon, color, bg }) => (
            <div
              key={title}
              className="group relative rounded-3xl border bg-card/50 p-8 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className={`size-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
