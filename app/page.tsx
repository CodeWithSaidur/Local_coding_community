import { Card } from '@/components/ui/card'
import { PricingTable } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      <h1>HOME</h1>
       <PricingTable />
       <Card />
    </div>
  )
}

