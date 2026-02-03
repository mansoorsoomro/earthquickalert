'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserSidebar } from '@/components/user-sidebar'
import { Header } from '@/components/header'

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [userName, setUserName] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const userRole = localStorage.getItem('userRole')
        const storedName = localStorage.getItem('userName')

        if (userRole === 'admin') {
            router.push('/')
            return
        }

        if (!userRole) {
            router.push('/login')
            return
        }

        if (storedName) setUserName(storedName)
        setIsLoading(false)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push('/login')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <UserSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header userName={userName} onLogout={handleLogout} />
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
