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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/user-dashboard' },
  { icon: Users, label: 'Are We Safe?', href: '/user/are-we-safe' },
  { icon: LifeBuoy, label: 'Emergency Resources', href: '/user/resources' },
  { icon: BriefcaseMedical, label: 'Emergency Plan', href: '/user/emergency-plan' }, // Added Emergency Plan item
  { icon: ShieldAlert, label: 'Active Shooter Guide', href: '/active-shooter' }, // Added Active Shooter Guide item
  { icon: Bell, label: 'Alerts', href: '/user/alerts' },
  { icon: MapPin, label: 'My Locations', href: '/user/my-locations' },
  { icon: Shield, label: 'Preparedness', href: '/user/preparedness' },
  { icon: Cloud, label: 'Regional Weather', href: '/user/weather' },
]

export function UserSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="w-72 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-border">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/50 flex flex-col items-center">
        <Image
          src={logo}
          alt="Ready2Go Logo"
          width={120}
          height={60}
          className="mb-2"
        />
        {/* <h1 className="text-2xl font-black text-white">
          Ready<span className="text-yellow-400">2</span>Go<span className="text-xs">™</span>
        </h1> */}
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
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                isActive
                  ? 'bg-yellow-400 text-sidebar font-semibold'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-4">
        <button
          onClick={() => {
            localStorage.removeItem('userRole')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userName')
            document.cookie = "userRole=; path=/; max-age=0"
            router.push('/login')
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
