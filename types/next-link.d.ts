declare module 'next/link' {
  import { AnchorHTMLAttributes } from 'react'
  export { default } from 'next/link'
  export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string | { pathname: string }
    children?: React.ReactNode
  }
}
