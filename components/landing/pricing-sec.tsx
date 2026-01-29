import { Badge } from '@/components/ui/badge'
import { CustomPricingTable } from './custom-pricing-table'

export default function PricingSec() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-bold mb-8">
          Simple Pricing
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
        <p className="text-muted-foreground text-lg mb-12">Upgrade to Pro for unlimited communities and AI features.</p>

        <div className="mx-auto max-w-xl">
          <CustomPricingTable />
        </div>
      </div>
    </section>
  )
}
