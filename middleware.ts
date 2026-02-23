import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    const userRole = request.cookies.get('userRole')?.value
    const { pathname } = request.nextUrl

    // Define public routes that don't need auth
    const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname.startsWith('/_next') || pathname === '/favicon.ico'

    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based protection example
    if (pathname.startsWith('/(admin)') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/user-dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
