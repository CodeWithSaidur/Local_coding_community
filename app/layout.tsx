import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Headerwraper from '@/components/layout/header-wrapper'
import Footer from '@/components/layout/footer'
import BackgroundGradient from '@/components/landing/background-gradient'
import { QueryProvider } from '@/components/provider'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

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
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <QueryProvider>
              <Headerwraper />
              {children}
              <Footer />
            </QueryProvider>
          </body>
        </html>
      </BackgroundGradient>
    </ClerkProvider>
  )
}
