import { db } from '@/db'
import { communities, communityMembers } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { eq } from 'drizzle-orm'

type Variables = {
  usdrId: string
}

const app = new Hono<{ Variables: Variables }>().basePath('/api')

app.onError((err, c) => {
  console.error(err)
  return c.json({ err: 'Internal Server Error' }, 500)
})

// Middleware (your existing one - fixed path check if needed)
app.get('/*', async (c, next) => {
  const publicRoute = ['/api/communities/all']
  if (publicRoute.includes(c.req.path)) {
    return next()
  }

  // prevent unauth user to access communities
  const session = await auth()
  if (!session?.userId) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  c.set('usdrId', session.userId)
  return await next()
})

app.get('/communities/all', async c => {
  const allCommu = await db.select().from(communities)
  return c.json(allCommu)
})

app.post('/communities/:communityId/join', async c => {
  const clerkId = c.get('usdrId') as string
  const communityId = c.req.param('communityId')

  // Fetch community (fix: destructure result, add .limit(1))
  const [community] = await db
    .select()
    .from(communities)
    .where(eq(communities.id, communityId))
    .limit(1)

  if (!community) {
    throw new HTTPException(404, { message: 'Community Not Found' })
  }

  // Insert membership (handles duplicates via unique constraint or check)
  await db
    .insert(communityMembers)
    .values({
      userId: clerkId,
      communityId
    })
    .onConflictDoNothing() // Optional: prevents duplicate errors

  return c.json({ message: 'Joined community successfully' }, 201)
})

export const dynamic = 'force-dynamic' // Ensure Node.js runtime for Drizzle
export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch