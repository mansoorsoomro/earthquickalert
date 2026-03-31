import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    const userRole = request.cookies.get('userRole')?.value
    const accountStatus = request.cookies.get('accountStatus')?.value
    const { pathname } = request.nextUrl

    // Define public routes that don't need auth
    const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname.startsWith('/_next') || pathname === '/favicon.ico'

    // 1. If no session, only allow public routes or pending-approval
    if (!session && !isPublicRoute && pathname !== '/pending-approval') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. If authenticated, but account status is pending, ONLY allow /pending-approval and logout API
    if (session && accountStatus === 'pending' && pathname !== '/pending-approval') {
        return NextResponse.redirect(new URL('/pending-approval', request.url))
    }

    // 3. If authenticated and status is approved, prevent going to pending-approval
    if (session && accountStatus === 'approved' && pathname === '/pending-approval') {
        return NextResponse.redirect(new URL('/user-dashboard', request.url))
    }

    // 4. Role-based protection for approved users
    if (accountStatus === 'approved') {
        const adminRoutes = [
            '/super-admin-dashboard',
            '/admin-dashboard',
            '/emergency-events',
            '/alerts-communication',
            '/gis-mapping',
            '/responders-agencies',
            '/virtual-eoc-ai-center',
            '/after-action-review',
            '/emergency-plan',
            '/preparedness-information',
            '/virtual-eoc-settings',
            '/admin/users'
        ]

        const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
        const isAdminRole = userRole === 'admin' || userRole === 'super-admin' || userRole === 'sub-admin'

        // Super Admin only routes
        if (pathname.startsWith('/admin/users') && userRole !== 'super-admin') {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url))
        }

        // Restriction: If on admin route but NOT an admin, go to user dashboard
        if (isAdminRoute && !isAdminRole) {
            return NextResponse.redirect(new URL('/user-dashboard', request.url))
        }

        // Restriction: If on user dashboard but IS an admin, go to admin dashboard
        if (pathname === '/user-dashboard' && isAdminRole) {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
