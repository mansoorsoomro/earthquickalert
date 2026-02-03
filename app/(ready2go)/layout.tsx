'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Ready2GoSidebar } from '@/components/ready2go-sidebar'
import { Header } from '@/components/header'

export default function ReadyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [userName, setUserName] = useState('User Name')
    const [userEmail, setUserEmail] = useState('email@yopmail.com')

    useEffect(() => {
        const userRole = localStorage.getItem('userRole')
        const storedName = localStorage.getItem('userName')
        const storedEmail = localStorage.getItem('userEmail')

        if (userRole !== 'ready2go') {
            router.push('/login')
        } else {
            if (storedName) setUserName(storedName)
            if (storedEmail) setUserEmail(storedEmail)
            setIsLoading(false)
        }
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
            <div className="flex items-center justify-center h-screen bg-[#34385E]">
                <div className="flex flex-col items-center gap-4 text-white">
                    <div className="h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <p className="font-medium">Initializing Security Suite...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 border-t-[12px] border-[#34385E]">
            <Ready2GoSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header userName={userName} onLogout={handleLogout} />
                <div className="flex-1 overflow-auto bg-[#F8FAFC]">
                    {children}
                </div>
            </div>
        </div>
    )
}
