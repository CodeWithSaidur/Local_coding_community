import React from 'react'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto">{children}</main>
    </div>
  )
}
