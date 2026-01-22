'use client'
import Link from 'next/link'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'

type HeaderProps = {
  isPro: boolean
}

export default function Header({ isPro }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:opacity-80"
          >
            👽
          </Link>

          <SignedIn>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/communities">Communities</Link>
              <Link href="/chat">Chat</Link>
            </nav>
          </SignedIn>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <SignedIn>
            {isPro ? (
              <Badge className="gap-1">
                <Trophy className="h-3.5 w-3.5" />
                Pro
              </Badge>
            ) : (
              <Badge variant="secondary">Free</Badge>
            )}

            <UserButton
              appearance={{
                elements: { avatarBox: 'h-9 w-9' }
              }}
            />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton>
                <Button variant="ghost">Sign in</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
