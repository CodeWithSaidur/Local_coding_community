'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { client } from '@/lib/api-client'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { Group, MessageCircle, User2Icon, UserIcon } from 'lucide-react'
import Link from 'next/link'

const COMMUNITIES_QUERY_KEY = ['communities'] as const

// Matches your API response shape
interface Community {
  id: string
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

        {/* Recent Chat Card - Fixed incomplete structure */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageCircle className="size-5 mr-2 text-primary" />
                Recent Chat
              </CardTitle>
              <Link href="/communities">
                <Button>
                  <UserIcon className="size-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>Communities you're part of</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add recent chat content here */}
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>

        {/* Communities Card - Fixed map syntax and added key/proper JSX return */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Group className="size-5 mr-2 text-primary" />
                Communities
              </CardTitle>
              <Link href="/communities">
                <Button variant="outline">
                  <User2Icon className="size-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
            <CardDescription>Communities you're part of</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.map(c => (
                <Link href={`/communities${c.id}`} key={c.id}>
                  <Card className="p-4 m-4">
                    <CardTitle className="font-medium text-lg mb-1">
                      {c.name}
                    </CardTitle>
                    {c.description && (
                      <CardDescription className="text-sm">
                        {c.description}
                      </CardDescription>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                </Link>
              )) || (
                <p className="text-sm text-muted-foreground">
                  No communities yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
