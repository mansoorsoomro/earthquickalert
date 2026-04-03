'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthProviderProps {
  children: ReactNode
  requiredRole?: 'admin' | 'user'
}

export function AuthProvider({ children, requiredRole = 'admin' }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')

    // Allow access to login/signup pages without auth
    if (pathname === '/login' || pathname === '/signup') {
      return
    }

    // If not logged in, redirect to login
    if (!userRole) {
      router.push('/login')
      return
    }

    // If admin-only pages and user is not admin
    const adminPages = [
      '/',
      '/admin-dashboard',
      '/super-admin-dashboard',
      '/emergency-plan',
      '/preparedness-information',
      '/virtual-eoc-settings',
      '/alerts-communication',
      '/gis-mapping',
      '/emergency-events',
      '/responders-agencies',
      '/after-action-review',
      '/virtual-eoc-ai-center',
      '/eoc-mode-dashboard',
    ]

    const isAdminRole = userRole === 'admin' || userRole === 'super-admin' || userRole === 'sub-admin' || userRole === 'observer' || userRole === 'responder' || userRole === 'manager'

    if (pathname && adminPages.includes(pathname) && !isAdminRole) {
      router.push('/user-dashboard')
      return
    }

    // If user-only pages and user is admin
    if (pathname === '/user-dashboard' && isAdminRole) {
      router.push('/admin-dashboard')
      return
    }

    // If EOC mode pages and not authorized
    if (pathname === '/eoc-mode-dashboard' && userRole === 'user') {
      router.push('/user-dashboard')
      return
    }
  }, [pathname, router])

  return <>{children}</>
}
