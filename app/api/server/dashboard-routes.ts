import { db } from '@/db'
import {
    communities,
    communityMembers,
    conversations,
    matches,
    messages,
    users
} from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'

type Variables = {
    userId: string
}

const dashboardApp = new Hono<{ Variables: Variables }>()

    // Get Current User Info
    .get('/me', async c => {
        const userId = c.get('userId')
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
        return c.json(user)
    })

    // Get User Stats
    .get('/stats', async c => {
        const userId = c.get('userId')

        // Count communities joined
        const [communityCount] = await db
            .select({ count: sql<number>`count(*)` })
            .from(communityMembers)
            .where(eq(communityMembers.userId, userId))

        // Count active matches (conversations)
        // joining matches where user is user1 or user2
        const matchesCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(matches)
            .where(
                sql`(${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId})`
            )

        return c.json({
            communities: communityCount.count,
            activeMatches: matchesCount[0]?.count || 0
        })
    })

    // Get Recent Chats (Conversations)
    .get('/recent', async c => {
        const userId = c.get('userId')

        // Complex query to get conversations, last message, and other user details
        // For simplicity in this demo, we'll fetch matches with 'accepted' status
        // and then fetch the latest message for each.

        // 1. Get matches
        const userMatches = await db
            .select({
                matchId: matches.id,
                user1Id: matches.user1Id,
                user2Id: matches.user2Id,
                communityId: matches.communityId,
                communityName: communities.name
            })
            .from(matches)
            .innerJoin(communities, eq(matches.communityId, communities.id))
            .where(
                sql`(${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId})`
            )
            .limit(5)

        // 2. Enrich with other user info and last message
        const recentChats = await Promise.all(
            userMatches.map(async match => {
                const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id
                const [otherUser] = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, otherUserId))
                    .limit(1)

                // Find conversation for this match
                const [conversation] = await db
                    .select()
                    .from(conversations)
                    .where(eq(conversations.matchId, match.matchId))
                    .limit(1)

                let lastMessage = null
                if (conversation) {
                    const [msg] = await db
                        .select()
                        .from(messages)
                        .where(eq(messages.conversationId, conversation.id))
                        .orderBy(desc(messages.createdAt))
                        .limit(1)
                    lastMessage = msg
                }

                return {
                    matchId: match.matchId,
                    otherUser: {
                        id: otherUser.id,
                        name: otherUser.name,
                        imageUrl: otherUser.imageUrl
                    },
                    communityName: match.communityName,
                    lastMessage: lastMessage ? lastMessage.content : "No messages yet",
                    lastMessageAt: lastMessage ? lastMessage.createdAt : null
                }
            })
        )

        // Sort by last message date (descending)
        recentChats.sort((a, b) => {
            const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
            const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
            return dateB - dateA
        })

        return c.json(recentChats)
    })

export { dashboardApp }
