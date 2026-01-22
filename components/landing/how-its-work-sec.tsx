const STEPS = [
  'Create your space',
  'Invite via private link or QR',
  'Start meaningful conversations',
  'Grow your community',
]

export default function HowItsWorkSec() {
  return (
    <section className="py-20 bg-[#fef6e2]/60">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold">How it works</h2>

        <ol className="mt-10 space-y-6">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center justify-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e86600] text-white">
                {i + 1}
              </span>
              <span className="text-lg">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
