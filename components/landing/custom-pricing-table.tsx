'use client'

import { PricingTable } from '@clerk/nextjs'

export function CustomPricingTable() {
  return (
    <PricingTable
      appearance={{
        variables: {
          colorPrimary: '#e86600',
          colorText: '#111827',
          colorTextSecondary: '#6b7280',
          colorBackground: '#ffffff',
          colorDanger: '#dc2626',
          borderRadius: '0.75rem',
          fontFamily: 'var(--font-geist-sans)'
        },

        elements: {
          rootBox: 'w-full',
          card: 'rounded-2xl border shadow-sm',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-sm text-muted-foreground',
          price: 'text-4xl font-extrabold',
          period: 'text-sm text-muted-foreground',
          featureListItem: 'text-sm text-gray-700',
          button:
            'w-full rounded-xl bg-[#e86600] text-white hover:bg-[#cf5b00] transition',
          badge:
            'bg-[#faa77d] text-black px-3 py-1 rounded-full text-xs font-semibold'
        }
      }}
    />
  )
}
