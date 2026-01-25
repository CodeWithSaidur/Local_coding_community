'use client'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'

export default function Dashboard() {
  const { user } = useUser() // get User From clerk

  const { data, isLoading, error } = useQuery<{ id: number; name: string }[]>({
    queryKey: ['communities'], // what is Query Key How can i get it
    queryFn: async () => {
      // axios
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([{ id: 1, name: 'Community 1' }])
        }, 1000)
      })
    }
  })

  if (isLoading)
    return <div className="text-center">Loading communities...</div>
  if (error) return <div className="text-center">Error: {error.message}</div>

  return (
    <div className="page-wrapper">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back {user?.firstName || 'User'}
        </p>
        <ul>
          {data?.map(community => (
            <li key={community.id}>{community.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
