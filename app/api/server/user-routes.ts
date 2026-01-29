import { db } from '@/db'
import { users, matches } from '@/db/schema'
import { and, eq, or, ne } from 'drizzle-orm'
import { Hono } from 'hono'

type Variables = {
    userId: string
}

const usersApp = new Hono<{ Variables: Variables }>()
    .get('/all', async c => {
        const userId = c.get('userId')
        const allUsers = await db
            .select({
                id: users.id,
                name: users.name,
                imageUrl: users.imageUrl,
            })
            .from(users)
            .where(ne(users.id, userId))
            .limit(50)

        return c.json(allUsers)
    })
    .post('/:targetUserId/connect', async c => {
        const targetUserId = c.req.param('targetUserId')
        const userId = c.get('userId')

        if (!targetUserId || !userId) return c.json({ error: 'Invalid' }, 400)
        if (userId === targetUserId) return c.json({ error: 'Cannot connect with self' }, 400)

        // Find if any match exists globally (unbound to community) 
        // Or should matches ALWAYS have a communityId? 
        // Our schema says communityId is NOT NULL. 
        // So global connections might need a "General" community or we allow NULL.
        // Let's check schema again.
        return c.json({ error: 'Global connection requires a general community. Please connect within a community tab for now.' }, 400)
    })

export { usersApp }
