'use client'

import { client } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'

interface ChatUser {
    matchId: string
    partnerId: string
    partnerName: string
    partnerImage: string | null
    lastMessage: string | null
    lastMessageAt: string | null
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const params = useParams()
    const { data: conversations, isLoading } = useQuery<ChatUser[]>({
        queryKey: ['conversations'],
        queryFn: async () => {
            const res = await client.api.chat.$get()
            if (!res.ok) throw new Error('Failed to fetch chats')
            return res.json() as unknown as Promise<ChatUser[]>
        },
        // Poll for new conversations occasionally
        refetchInterval: 10000
    })

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar: Conversation List */}
            <div className="w-80 border-r bg-muted/20 flex flex-col shrink-0">
                <div className="p-4 border-b font-semibold flex items-center gap-2">
                    <MessageCircle className="size-5" />
                    Messages
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isLoading && <div className="text-center text-muted-foreground text-sm">Loading chats...</div>}
                    {conversations?.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm">
                            No active matches yet.
                            <br />
                            <Link href="/communities" className="text-primary hover:underline">Find a community</Link> to get started.
                        </div>
                    )}
                    {conversations?.map(chat => {
                        const isActive = params?.matchId === chat.matchId
                        return (
                            <Link
                                key={chat.matchId}
                                href={`/chat/${chat.matchId}`}
                                className={cn(
                                    "block p-3 rounded-lg hover:bg-muted transition-colors",
                                    isActive && "bg-muted"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={chat.partnerImage || ''} />
                                        <AvatarFallback>{chat.partnerName?.substring(0, 2)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{chat.partnerName}</div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {chat.lastMessage || 'Start a conversation'}
                                        </div>
                                    </div>
                                    {chat.lastMessageAt && (
                                        <div className="text-[10px] text-muted-foreground self-start">
                                            {new Date(chat.lastMessageAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Main Content (Chat Window or Empty State) */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">
                {children}
            </div>
        </div>
    )
}
