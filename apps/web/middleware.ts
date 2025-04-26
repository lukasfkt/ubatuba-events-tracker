import { NextRequest, NextResponse } from 'next/server'

import type { Token } from '@/hooks/useAuthentication'

export function middleware(request: NextRequest) {
  const tokenString = request.cookies.get('token')?.value
  try {
    const token = tokenString ? (JSON.parse(tokenString) as Token) : null
    const isSignInPage = request.nextUrl.pathname === '/'

    if (!token || !token?.access_token) {
      return isSignInPage
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/', request.url))
    }

    if (isSignInPage) {
      return token && token.access_token
        ? NextResponse.redirect(new URL('/events', request.url))
        : NextResponse.next()
    }

    return request.nextUrl.pathname === '/'
      ? NextResponse.redirect(new URL('/events', request.url))
      : NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/', '/((?!api|_next|static|public|favicon.ico).*)'],
}
