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
        'bg-linear-to-br',
        'from-[#fef6e2] via-[#faa77d] to-[#e86600]',
        className
      )}
    >
      {/* Soft blur layer for depth */}
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[120px]" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
