import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/communities/all',
    '/forgot-password(.*)',
])

const isAuthRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
    const { userId } = await auth()
    const url = request.nextUrl

    // If user is logged in and trying to access public auth routes or landing page, redirect to dashboard
    if (userId && (isPublicRoute(request) && !request.nextUrl.pathname.startsWith('/api'))) {
        // We don't want to redirect if it's an API route even if it's public
        if (url.pathname === '/' || isAuthRoute(request) || url.pathname.startsWith('/forgot-password')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // Protect all non-public routes
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
