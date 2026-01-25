declare module 'next' {
  // Core Next.js exports
  export { default as Link } from 'next/link'
  export { default as Image } from 'next/image'
  export { default as Script } from 'next/script'
  export { default as Head } from 'next/head'

  // Navigation types
  export * from 'next/navigation'
  export * from 'next/router'

  // App Router
  export * from 'next/app'
  export * from 'next/document'

  // Types
  export type NextPage<P = {}> = React.FC<P & { children?: React.ReactNode }>
  export type NextConfig = Record<string, any>
}

declare module 'next/link' {
  import { AnchorHTMLAttributes, ReactNode } from 'react'

  interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string | { pathname: string; query?: Record<string, any> }
    children?: ReactNode
    replace?: boolean
    scroll?: boolean
    prefetch?: boolean
  }

  const Link: React.FC<LinkProps>
  export default Link
}
