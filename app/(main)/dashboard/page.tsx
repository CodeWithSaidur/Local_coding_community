'use client'
import { client } from '@/lib/api-client'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'

const COMMUNITIES_QUERY_KEY = ['communities'] as const

// Updated to match your actual API response
interface Community {
  id: string          // Changed from number
  name: string
  description: string | null
  imageUrl: string | null
  createdById: string | null
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { user } = useUser()

  const { data, isLoading, error } = useQuery<Community[]>({
    queryKey: COMMUNITIES_QUERY_KEY,
    queryFn: async (): Promise<Community[]> => {
      const res = await client.api.communities.all.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch communities')
      }
      return res.json() as Promise<Community[]>
    }
  })

  if (isLoading)
    return <div className="text-center p-8">Loading communities...</div>
  
  if (error)
    return (
      <div className="text-center p-8 text-red-500">
        Error: {(error as Error).message}
      </div>
    )

  return (
    <div className="page-wrapper p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back {user?.firstName || 'User'}
        </p>
        <ul className="space-y-2">
          {data?.map((community) => (
            <li key={community.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium">{community.name}</div>
              {community.description && (
                <p className="text-sm text-gray-600 mt-1">{community.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
