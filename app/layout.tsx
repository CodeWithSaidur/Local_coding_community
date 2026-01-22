import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Headerwraper from '@/components/layout/header-wrapper'
import Footer from '@/components/layout/footer'
import BackgroundGradient from '@/components/landing/background-gradient'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'learning-platform',
  description: 'learning-platform by Code With Saidur'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <BackgroundGradient>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Headerwraper />
            {children}
            <Footer />
          </body>
        </html>
      </BackgroundGradient>
    </ClerkProvider>
  )
}
