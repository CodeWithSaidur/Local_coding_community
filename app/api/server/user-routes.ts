import { User } from '@/db/schema'
import { Hono } from 'hono'

type Variables = {
    userId: string
}

const usersApp = new Hono<{ Variables: Variables }>()
    .get('/all', async c => {
        const userId = c.get('userId')
        const allUsers = await User.find({ _id: { $ne: userId } })
            .select('name imageUrl')
            .limit(50)

        const formattedUsers = allUsers.map(u => ({
            id: u._id,
            name: u.name,
            imageUrl: u.imageUrl
        }))

        return c.json(formattedUsers)
    })
    .post('/:targetUserId/connect', async c => {
        const targetUserId = c.req.param('targetUserId')
        const userId = c.get('userId')

        if (!targetUserId || !userId) return c.json({ error: 'Invalid' }, 400)
        if (userId === targetUserId) return c.json({ error: 'Cannot connect with self' }, 400)

        return c.json({ error: 'Global connection requires a general community. Please connect within a community tab for now.' }, 400)
    })

export { usersApp }

