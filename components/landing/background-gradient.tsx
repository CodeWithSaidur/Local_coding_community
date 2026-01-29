import type { ReactNode } from 'react'
import clsx from 'clsx'

export default function BackgroundGradient({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'relative min-h-screen w-full overflow-hidden',
        'bg-background transition-colors duration-500',
        className
      )}
    >
      {/* Decorative blobs for a modern look */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse delay-700" />

      {/* Subtle grain effect for texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </div>
  )
}
