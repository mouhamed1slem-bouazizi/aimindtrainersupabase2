import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password']

export async function middleware(req: NextRequest) {
  console.log('Middleware - Processing request:', req.nextUrl.pathname)
  
  // Create a response object that we can modify
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  console.log('Middleware - Session check:', { 
    hasSession: !!session,
    sessionError: sessionError?.message,
    path: req.nextUrl.pathname,
    isPublicRoute: publicRoutes.includes(req.nextUrl.pathname),
    cookies: req.cookies.getAll().map(c => c.name)
  })

  // Get the current path
  const path = req.nextUrl.pathname

  // Allow access to public routes
  if (publicRoutes.includes(path)) {
    // If user is already authenticated and tries to access login/register,
    // redirect them to the home page
    if (session && (path === '/login' || path === '/register')) {
      console.log('Middleware - Authenticated user accessing auth page, redirecting to home')
      return NextResponse.redirect(new URL('/', req.url))
    }
    console.log('Middleware - Allowing access to public route')
    return res
  }

  // If there's no session and the route is not public, redirect to login
  if (!session) {
    console.log('Middleware - No session found, redirecting to login')
    const redirectUrl = new URL('/login', req.url)
    // Add the original URL as a query parameter to redirect back after login
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  console.log('Middleware - Session valid, allowing access to protected route')
  return res
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (to prevent middleware from running on API routes)
     * - well-known routes (for browser extensions and other services)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.well-known/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 