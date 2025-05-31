import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getMiddlewareConfig } from './lib/env'

export async function middleware(req: NextRequest) {
  try {
    // Skip middleware for static files and API routes
    if (
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/.well-known')
    ) {
      return NextResponse.next()
    }

    console.log('Middleware executing for path:', req.nextUrl.pathname)
    const res = NextResponse.next()
    const { supabaseUrl, supabaseKey } = getMiddlewareConfig()
    
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })

    // Get the session from the cookie
    const authCookie = req.cookies.get('sb-auth-token')
    console.log('Auth cookie:', authCookie?.value)

    let session = null
    if (authCookie?.value) {
      try {
        const cookieValue = JSON.parse(decodeURIComponent(authCookie.value))
        // Use the session data directly from the cookie
        session = {
          access_token: cookieValue.access_token,
          refresh_token: cookieValue.refresh_token,
          user: cookieValue.user,
          expires_at: cookieValue.expires_at
        }
      } catch (error) {
        console.error('Error parsing session cookie:', error)
      }
    }

    console.log('Session status:', session ? 'Authenticated' : 'Not authenticated')
    if (session) {
      console.log('Session details:', {
        user: session.user?.email,
        expires_at: session.expires_at,
        access_token: session.access_token ? 'present' : 'missing',
        refresh_token: session.refresh_token ? 'present' : 'missing'
      })
    }

    // If user is not signed in and trying to access protected routes,
    // redirect to signin
    if (!session && !req.nextUrl.pathname.startsWith('/auth/')) {
      console.log('No session, redirecting to signin from:', req.nextUrl.pathname)
      const redirectUrl = new URL('/auth/signin', req.url)
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access auth pages,
    // redirect to preferences
    if (session && req.nextUrl.pathname.startsWith('/auth/')) {
      console.log('Session exists, redirecting to preferences from:', req.nextUrl.pathname)
      const redirectUrl = new URL('/preferences', req.url)
      console.log('Redirect URL:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    console.log('No redirect needed for path:', req.nextUrl.pathname)
    return res
  } catch (error) {
    // Log the error and redirect to an error page
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/signin).*)',
  ],
} 