"use client"
import { useQuery } from '@tanstack/react-query'

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<{ id: number; name: string }[]>({
    queryKey: ['communities'],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([{ id: 1, name: "Community 1" }])
        }, 1000)
      })
    }
  })

  if (isLoading) return <div>Loading communities...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Communities</h1>
      <ul>
        {data?.map((community) => (
          <li key={community.id}>{community.name}</li>
        ))}
      </ul>
    </div>
  )
}
