'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bell,
  MapPin,
  FileText,
  Shield,
  Cloud,
  Newspaper,
  Users,
  LifeBuoy,
  BriefcaseMedical, // Added BriefcaseMedical icon
  ShieldAlert,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'

export const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/user-dashboard' },
  { icon: Users, label: 'Are We Safe?', href: '/user/are-we-safe' },
  { icon: LifeBuoy, label: 'Emergency Resources', href: '/user/resources' },
  { icon: BriefcaseMedical, label: 'Emergency Plan', href: '/user/emergency-plan' }, // Added Emergency Plan item
  { icon: ShieldAlert, label: 'Active Shooter Guide', href: '/active-shooter' }, // Added Active Shooter Guide item
  { icon: Bell, label: 'Alerts', href: '/user/alerts' },
  { icon: MapPin, label: 'My Locations', href: '/user/my-locations' },
  { icon: Shield, label: 'Preparedness', href: '/user/preparedness' },
  { icon: Newspaper, label: 'News Updates', href: '/user/news-updates' },
  { icon: Cloud, label: 'Regional Weather', href: '/user/weather' },
]

export function UserSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="hidden md:flex w-72 bg-[#33375D] text-white flex-col h-full border-r border-white/5">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/5 flex flex-col items-center">
        <Image
          src={logo}
          alt="Ready2Go Logo"
          width={120}
          height={60}
          className="mb-2"
        />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group',
                isActive
                  ? 'bg-yellow-400 text-[#33375D] shadow-lg shadow-yellow-500/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-[#33375D]" : "text-slate-400 group-hover:text-white")} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/5 p-4 mt-auto">
        <button
          onClick={async () => {
            try {
              await fetch('/api/logout', { method: 'POST' })
            } catch (error) {
              console.error('Logout failed:', error)
            }
            localStorage.removeItem('userRole')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userName')
            document.cookie = "userRole=; path=/; max-age=0"
            router.push('/login')
          }}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-left text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-white" />
          <span className="text-sm font-bold tracking-tight">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
