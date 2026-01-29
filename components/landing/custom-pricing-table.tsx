'use client'

import { PricingTable } from '@clerk/nextjs'

export function CustomPricingTable() {
  return (
    <PricingTable
      appearance={{
        variables: {
          colorPrimary: '#6366f1',
          colorText: 'var(--foreground)',
          colorTextSecondary: 'var(--muted-foreground)',
          colorBackground: 'var(--background)',
          colorDanger: '#ef4444',
          borderRadius: '1rem',
          fontFamily: 'var(--font-geist-sans)'
        },

        elements: {
          rootBox: 'w-full',
          card: 'rounded-3xl border shadow-xl bg-card text-card-foreground',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-sm text-muted-foreground',
          price: 'text-4xl font-extrabold text-primary',
          period: 'text-sm text-muted-foreground',
          featureListItem: 'text-sm text-muted-foreground',
          button:
            'w-full rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/20 h-12 font-bold',
          badge:
            'bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold'
        }
      }}
    />
  )
}
