'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Box,
    AlertCircle,
    Wrench,
    CloudRain,
    Share2,
    Settings,
    HelpCircle,
    LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import logo from '../public/logo.png'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/ready2go-dashboard' },
    { icon: Box, label: 'Lodging & Essentials', href: '/ready2go/lodging-essentials' },
    { icon: AlertCircle, label: 'Emergency Center', href: '/ready2go/emergency-center' },
    { icon: Wrench, label: 'Emergency Maintenance', href: '/ready2go/emergency-maintenance' },
    { icon: CloudRain, label: 'Weather & Traffic Feed', href: '/ready2go/weather-traffic' },
    { icon: Share2, label: 'Recovery Resources', href: '/ready2go/recovery-resources' },
]

const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/ready2go/settings' },
    { icon: HelpCircle, label: 'Help', href: '#' },
]

export function Ready2GoSidebar() {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push('/login')
    }

    return (
        <div className="w-72 bg-[#34385E] text-white flex flex-col h-full border-r border-white/10">
            {/* Logo Section */}
            <div className="p-8 flex flex-col items-center">
                <Image
                    src={logo}
                    alt="Ready2Go Logo"
                    width={150}
                    height={80}
                    className="mb-6"
                />
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                                isActive
                                    ? 'bg-[#EAB308] text-[#34385E] font-bold shadow-lg shadow-yellow-500/20'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-[#34385E]" : "text-slate-400")} />
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-4 bg-white/5 border-t border-white/10 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-2"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-semibold italic">Logout</span>
                </button>
            </div>
        </div>
    )
}
