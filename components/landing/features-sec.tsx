import { MessageCircle, Shield, Zap } from 'lucide-react'

const FEATURES = [
  {
    title: 'Private by default',
    desc: 'No public search. No spam.',
    icon: Shield
  },
  {
    title: 'Real conversations',
    desc: '1:1 and focused communities.',
    icon: MessageCircle
  },
  {
    title: 'Fast & simple',
    desc: 'No learning curve.',
    icon: Zap
  }
]

export default function FeaturesSec() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURES.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="rounded-xl border bg-background/60 p-6 backdrop-blur"
            >
              <Icon className="h-6 w-6 text-[#e86600]" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
