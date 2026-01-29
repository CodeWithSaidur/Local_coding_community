'use client'

import { client } from '@/lib/api-client'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Users,
    Trash2,
    ShieldAlert,
    Loader2,
    Edit3,
    X,
    LogOut,
    AlertCircle
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminCommunity {
    id: string
    name: string
    description: string | null
    createdAt: string
}

interface AdminUser {
    id: string
    name: string
    email: string
    createdAt: string
}

export default function AdminPanel() {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [editingCommunity, setEditingCommunity] = useState<AdminCommunity | null>(null)
    const [editName, setEditName] = useState('')
    const [editDesc, setEditDesc] = useState('')
    const [isAuthorized, setIsAuthorized] = useState(false)
    const { user, isLoaded: userLoaded } = useUser()

    useEffect(() => {
        if (userLoaded) {
            const role = (user?.publicMetadata as any)?.role?.toLowerCase()
            const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
            const isEmailAdmin = email === 'sabedbarbhuiya3@gmail.com'

            if (role !== 'admin' && !isEmailAdmin) {
                router.push('/')
            } else {
                setIsAuthorized(true)
            }
        }
    }, [userLoaded, user, router])

    // 1. Fetch Communities
    const { data: communities, isLoading: communitiesLoading, error: communitiesError } = useQuery<AdminCommunity[]>({
        queryKey: ['admin-communities'],
        queryFn: async () => {
            const res = await (client.api.admin.communities as any).$get()
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Failed to fetch communities')
            }
            return res.json()
        }
    })

    // 2. Fetch Users
    const { data: users, isLoading: usersLoading, error: usersError } = useQuery<AdminUser[]>({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await (client.api.admin.users as any).$get()
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Failed to fetch users')
            }
            return res.json()
        }
    })

    // 3. Delete Community Mutation
    const deleteCommunityMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await (client.api.admin.communities as any)[':id'].$delete({
                param: { id }
            })
            if (!res.ok) throw new Error('Failed to delete')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-communities'] })
        }
    })

    // 4. Update Community Mutation
    const updateCommunityMutation = useMutation({
        mutationFn: async () => {
            if (!editingCommunity) return
            const res = await (client.api.admin.communities as any)[':id'].$put({
                param: { id: editingCommunity.id },
                json: { name: editName, description: editDesc }
            })
            if (!res.ok) throw new Error('Failed to update')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-communities'] })
            setEditingCommunity(null)
        }
    })

    // 5. Delete User Mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await (client.api.admin.users as any)[':id'].$delete({
                param: { id }
            })
            if (!res.ok) throw new Error('Failed to delete user')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
        }
    })

    const startEditing = (community: AdminCommunity) => {
        setEditingCommunity(community)
        setEditName(community.name)
        setEditDesc(community.description || '')
    }

    const handleLogout = () => {
        // Redirection handled by Clerk SignOut
        router.push('/')
    }

    if (!isAuthorized) return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Loader2 className="size-10 animate-spin text-primary" />
        </div>
    )

    return (
        <div className="container max-w-7xl mx-auto py-12 px-4 space-y-12 bg-background">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <ShieldAlert className="size-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">Admin Control Room</h1>
                        <p className="text-muted-foreground text-lg">System-level management of communities and members.</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-2xl gap-2 font-bold" onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Logout
                </Button>
            </div>

            {(communitiesError || usersError) && (
                <div className="p-6 bg-destructive/10 border-2 border-destructive/20 rounded-3xl flex items-center gap-4 text-destructive">
                    <AlertCircle className="size-6 shrink-0" />
                    <div>
                        <p className="font-bold">Access or Connection Error</p>
                        <p className="text-sm opacity-80">{(communitiesError as any)?.message || (usersError as any)?.message}. Ensure you are logged into an admin-authorized account.</p>
                    </div>
                </div>
            )}

            <Tabs defaultValue="communities" className="space-y-8">
                <div className="flex items-center justify-between bg-card p-2 rounded-3xl border shadow-xl backdrop-blur-sm bg-card/50">
                    <TabsList className="bg-transparent border-none p-1">
                        <TabsTrigger value="communities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-8 h-12 text-base font-semibold transition-all">
                            Communities ({communities?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-8 h-12 text-base font-semibold transition-all">
                            Members ({users?.length || 0})
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="communities">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {communitiesLoading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="h-64 rounded-[2.5rem] bg-muted/40 animate-pulse" />
                                ))
                            ) : communities?.map(community => (
                                <motion.div
                                    key={community.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Card className="rounded-[2.5rem] border-muted/50 bg-card/30 hover:bg-card hover:border-primary/50 transition-all group overflow-hidden h-full flex flex-col shadow-lg hover:shadow-primary/5">
                                        <CardHeader className="p-8 pb-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{community.name}</CardTitle>
                                                    <CardDescription className="line-clamp-3 text-base leading-relaxed">{community.description || 'Elevating the community through collaboration.'}</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-end space-y-6">
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                                                Established {new Date(community.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="rounded-2xl h-11 font-bold gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-none"
                                                    onClick={() => startEditing(community)}
                                                >
                                                    <Edit3 className="size-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="rounded-2xl h-11 font-bold gap-2"
                                                    onClick={() => {
                                                        if (confirm('Delete community? This action is irreversible.')) {
                                                            deleteCommunityMutation.mutate(community.id)
                                                        }
                                                    }}
                                                    disabled={deleteCommunityMutation.isPending}
                                                >
                                                    <Trash2 className="size-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <div className="bg-card rounded-[2.5rem] border border-muted/50 overflow-hidden shadow-2xl backdrop-blur-sm bg-card/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 border-b border-muted/50">
                                    <tr>
                                        <th className="p-8 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Information</th>
                                        <th className="p-8 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Enrollment</th>
                                        <th className="p-8 font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">Access Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="popLayout">
                                        {usersLoading ? (
                                            [1, 2, 3].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan={3} className="p-8 h-24 bg-muted/10 border-b border-muted/50" />
                                                </tr>
                                            ))
                                        ) : users?.map(user => (
                                            <motion.tr
                                                key={user.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="border-b border-muted/30 last:border-0 hover:bg-primary/[0.02] transition-colors group"
                                            >
                                                <td className="p-8">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground text-lg">{user.name}</span>
                                                        <span className="text-muted-foreground font-medium">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-muted-foreground font-medium text-base">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-8 text-right">
                                                    {user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="rounded-2xl size-12 text-destructive hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                                                            onClick={() => {
                                                                deleteUserMutation.mutate(user.id)
                                                            }}
                                                            disabled={deleteUserMutation.isPending}
                                                        >
                                                            <Trash2 className="size-5" />
                                                        </Button>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Edit Modal Overlay */}
            <AnimatePresence>
                {editingCommunity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-card w-full max-w-xl rounded-[3rem] border shadow-2xl overflow-hidden p-10 space-y-8"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold tracking-tight">Edit Collective</h2>
                                <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setEditingCommunity(null)}>
                                    <X className="size-6" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-2">Display Name</label>
                                    <Input
                                        className="h-14 rounded-2xl px-6 bg-muted/30 border-none text-lg font-medium focus-visible:ring-primary/50"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-2">Mission Statement</label>
                                    <Textarea
                                        className="min-h-[160px] rounded-3xl p-6 bg-muted/30 border-none text-base leading-relaxed focus-visible:ring-primary/50 resize-none"
                                        value={editDesc}
                                        onChange={e => setEditDesc(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="ghost" className="flex-1 h-14 rounded-2xl text-base font-bold" onClick={() => setEditingCommunity(null)}>
                                    Discard Changes
                                </Button>
                                <Button
                                    className="flex-1 h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                                    onClick={() => updateCommunityMutation.mutate()}
                                    disabled={updateCommunityMutation.isPending}
                                >
                                    {updateCommunityMutation.isPending ? <Loader2 className="size-5 animate-spin" /> : "Save Updates"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
