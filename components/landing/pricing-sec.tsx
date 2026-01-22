import { Badge } from '@/components/ui/badge'
import { CustomPricingTable } from './custom-pricing-table'

export default function PricingSec() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
        <Badge className="mb-4 bg-[#faa77d] text-black">Simple Pricing</Badge>
        <CustomPricingTable />
      </div>
    </section>
  )
}
