import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the mp_session cookie exists
  const sessionCookie = request.cookies.get('mp_session')

  if (!sessionCookie) {
    // Redirect unauthenticated users to the sign-in page
    const signInUrl = new URL('/auth/sign-in', request.url)
    
    // We can also attach the original url to redirect back after sign in
    // signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)

    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Add all protected routes here. 
  // Any route matching these paths will trigger the middleware.
  matcher: [
    '/dashboard/:path*',
    '/scanner/:path*',
    '/scanner-ltd/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/stock/:path*',
    '/help/:path*',
    '/whats-new/:path*'
  ],
}
