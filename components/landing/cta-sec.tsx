import { Button } from '@/components/ui/button'

export default function CtaSec() {
  return (
    <section className="py-24 bg-linear-to-br from-[#faa77d] to-[#e86600] text-center text-white z--1">
      <h2 className="text-3xl font-bold">
        Ready to build your private community?
      </h2>

      <Button
        variant="secondary"
        className="mt-8 bg-white text-black hover:bg-neutral-100"
      >
        Get Started
      </Button>
    </section>
  )
}
