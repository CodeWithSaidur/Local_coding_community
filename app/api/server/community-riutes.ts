import { db } from '@/db'
import { communities } from '@/db/schema'
import { Hono } from 'hono'

type Variables = {
  userId: string
}
const communitiesApp = new Hono<{ Variables: Variables }>().get(
  '/all',
  async c => {
    const allCommu = await db.select().from(communities)
    return c.json(allCommu)
  }
)

export { communitiesApp }
