import CtaSec from '@/components/landing/cta-sec'
import FeaturesSec from '@/components/landing/features-sec'
import HeroSec from '@/components/landing/hero-sec'
import HowItsWorkSec from '@/components/landing/how-its-work-sec'
import PricingSec from '@/components/landing/pricing-sec'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <HeroSec />
      <FeaturesSec />
      <HowItsWorkSec />
      <PricingSec />
      <CtaSec />
    </div>
  )
}
