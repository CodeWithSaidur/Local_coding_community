import { Card } from '@/components/ui/card'
import { PricingTable } from '@clerk/nextjs'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <h1>HOME</h1>
       <PricingTable />
       <Card />
    </div>
  )
}

