'use client'
import { useState } from 'react'

import Link from 'next/link'
import {
  SignedIn,
  SignedOut,
  useUser
} from '@clerk/nextjs'
import { Trophy, Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import UserProfileDropdown from './user-profile-dropdown'

type HeaderProps = {
  isPro: boolean
}

export default function Header({ isPro }: HeaderProps) {
  const { user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAdminRole = (user?.publicMetadata as any)?.role?.toLowerCase() === 'admin'
  const isAdminEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === 'sabedbarbhuiya3@gmail.com'
  const isAdmin = isAdminRole || isAdminEmail

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center gap-2 text-xl font-bold tracking-tight transition-all hover:scale-105"
          >
            <span className="text-2xl">👽</span>
            <span className="hidden sm:inline-block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              EduAliens
            </span>
          </Link>

          <SignedIn>
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-1 text-sm font-medium"
            >
              <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/communities" className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Communities
              </Link>
              <Link href="/chat" className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Chat
              </Link>
              {isAdmin && (
                <Link href="/admin" className="px-3 py-2 rounded-md hover:bg-accent text-primary font-bold transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </SignedIn>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          <SignedIn>
            <div className="hidden sm:flex items-center gap-3 mr-2">
              {isPro ? (
                <Badge className="gap-1 bg-amber-500 text-black border-none shadow-sm">
                  <Trophy className="h-3 w-3" />
                  Pro
                </Badge>
              ) : (
                <Badge variant="secondary" className="font-medium">Free</Badge>
              )}
            </div>

            <UserProfileDropdown />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign in</Link>
              </Button>

              <Button
                asChild
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all active:scale-95 px-5"
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <SignedIn>
          <div className="md:hidden border-b bg-background/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg hover:bg-accent transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/communities"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg hover:bg-accent transition-colors font-medium"
              >
                Communities
              </Link>
              <Link
                href="/chat"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg hover:bg-accent transition-colors font-medium"
              >
                Chat
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-accent text-primary transition-colors font-bold"
                >
                  Admin
                </Link>
              )}
              <div className="pt-4 mt-4 border-t flex items-center justify-between px-4">
                <span className="text-sm text-muted-foreground font-medium">Plan</span>
                {isPro ? (
                  <Badge className="bg-amber-500 text-black border-none">Pro</Badge>
                ) : (
                  <Badge variant="secondary">Free</Badge>
                )}
              </div>
            </nav>
          </div>
        </SignedIn>
      )}
    </header>
  )
}
