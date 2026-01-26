import { db } from '@/db'
import { communities, communityMembers } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { handle } from 'hono/vercel'

type Variables = {
  userId: string | null
}

const app = new Hono<{ Variables: Variables }>().basePath('/api')

app.onError((err, c) => {
  console.error('API Error:', err)

  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  if (
    err instanceof Error &&
    (err.message.includes('violates') ||
      err.message.includes('constraint') ||
      err.message.includes('duplicate key'))
  ) {
    return c.json({ error: 'Invalid data' }, 400)
  }
  if (err instanceof Error && err.message.includes('not found')) {
    return c.json({ error: 'Not found' }, 404)
  }

  return c.json({ error: 'Internal Server Error' }, 500)
})

app.use(async (c, next) => {
  const publicPaths = ['/com/all']
  if (publicPaths.includes(c.req.path)) {
    return next()
  }

  const { userId } = await auth()
  if (!userId) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  c.set('userId', userId)
  return next()
})

app.get('/com/all', async c => {
  const com = await db.select().from(communities)
  return c.json(com)
})

app.post('/com/:comId/join', async c => {
  const userId = c.get('userId')
  if (!userId) throw new HTTPException(401, { message: 'Unauthorized' })

  const comId = c.req.param('comId')
  const [com] = await db
    .select()
    .from(communities)
    .where(eq(communities.id, comId))

  if (!com) {
    throw new HTTPException(404, { message: 'Community Not Found' })
  }

  await db.insert(communityMembers).values({
    userId,
    communityId: comId
  })

  return c.json({ message: 'Joined community' })
})

export const dynamic = 'force-dynamic'
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)