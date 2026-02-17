import { User, Community, Match, Conversation, Message, ConversationSummary, LearningGoal, CommunityMember } from '@/db/schema'
import { Hono } from 'hono'

type Variables = {
    userId: string
    role?: string
}

const adminApp = new Hono<{ Variables: Variables }>()
    // Public login endpoint for admin portal
    .post('/login', async c => {
        const { email, password } = await c.req.json<{ email: string, password?: string }>()

        // For now, we validate against the hardcoded admin email
        // and check if it matches the designated administrator
        if (email?.toLowerCase() === 'sabedbarbhuiya3@gmail.com') {
            return c.json({ ok: true })
        }

        return c.json({ ok: false, message: 'Invalid credentials' }, 401)
    })

    // Middleware to protect all other admin routes
    .use('/*', async (c, next) => {
        const userId = c.get('userId')
        const clerkRole = c.get('role')

        // In Mongoose, we usually search by the field, if userId is the ObjectId or a custom field
        // Assuming userId from clerk is stored in clerkId or as the _id if we migrated.
        // For now, let's assume userId is the internal ID.
        const user = await User.findById(userId)

        const isRoleAdmin = clerkRole?.toLowerCase() === 'admin'
        const isEmailAdmin = user?.email?.toLowerCase() === 'sabedbarbhuiya3@gmail.com'

        console.log('[Clerk Admin Auth Check]', {
            dbUserId: userId,
            clerkRole: clerkRole,
            isRoleAdmin,
            isEmailAdmin,
            foundUser: user ? { id: user._id, email: user.email } : null
        })

        if (!isRoleAdmin && !isEmailAdmin) {
            return c.json({
                error: 'Forbidden',
                message: `Admin access denied. Logged in as: ${user?.email || 'Unknown'}. Required: Clerk Admin role or Administrator Email.`
            }, 403)
        }
        return next()
    })

    // Get all communities
    .get('/communities', async c => {
        const allCommunities = await Community.find().sort({ createdAt: -1 })
        return c.json(allCommunities.map((doc: any) => ({ ...doc._doc, id: doc._id })))
    })

    // Update community
    .put('/communities/:id', async c => {
        const id = c.req.param('id')
        const { name, description } = await c.req.json<{ name: string, description: string }>()
        await Community.findByIdAndUpdate(id, { name, description })
        return c.json({ success: true })
    })

    // Delete community
    .delete('/communities/:id', async c => {
        const id = c.req.param('id')

        // Manual Cascade Deletion
        // 1. Find all matches in this community
        const communityMatches = await Match.find({ communityId: id })
        const matchIds = communityMatches.map(m => m._id)

        if (matchIds.length > 0) {
            // 2. Find conversations
            const communityConversations = await Conversation.find({ matchId: { $in: matchIds } })
            const convIds = communityConversations.map(c => c._id)

            if (convIds.length > 0) {
                // 3. Delete messages and summaries
                await Message.deleteMany({ conversationId: { $in: convIds } })
                await ConversationSummary.deleteMany({ conversationId: { $in: convIds } })
                // 4. Delete conversations
                await Conversation.deleteMany({ _id: { $in: convIds } })
            }
            // 5. Delete matches
            await Match.deleteMany({ _id: { $in: matchIds } })
        }

        // 6. Delete learning goals
        await LearningGoal.deleteMany({ communityId: id })
        // 7. Delete memberships
        await CommunityMember.deleteMany({ communityId: id })
        // 8. Delete community
        await Community.findByIdAndDelete(id)

        return c.json({ success: true })
    })

    // Get all users
    .get('/users', async c => {
        const allUsers = await User.find().sort({ createdAt: -1 })
        return c.json(allUsers.map((doc: any) => ({ ...doc._doc, id: doc._id })))
    })

    // Delete user (and their entire footprint)
    .delete('/users/:id', async c => {
        const id = c.req.param('id')

        // 1. Delete messages sent by user
        await Message.deleteMany({ senderId: id })

        // 2. Delete matches user participated in
        const userMatches = await Match.find({ $or: [{ user1Id: id }, { user2Id: id }] })
        const matchIds = userMatches.map(m => m._id)

        if (matchIds.length > 0) {
            const userConversations = await Conversation.find({ matchId: { $in: matchIds } })
            const convIds = userConversations.map(c => c._id)
            if (convIds.length > 0) {
                await Message.deleteMany({ conversationId: { $in: convIds } })
                await ConversationSummary.deleteMany({ conversationId: { $in: convIds } })
                await Conversation.deleteMany({ _id: { $in: convIds } })
            }
            await Match.deleteMany({ _id: { $in: matchIds } })
        }

        // 3. Delete user's learning goals and memberships
        await LearningGoal.deleteMany({ userId: id })
        await CommunityMember.deleteMany({ userId: id })

        // 4. Finally delete the user
        await User.findByIdAndDelete(id)

        return c.json({ success: true })
    })

export { adminApp }

