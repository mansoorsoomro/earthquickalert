'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  AlertCircle,
  Bell,
  Map,
  Users,
  Brain,
  ClipboardList,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import logo from '../public/logo.png'
import { Button } from '@/components/ui/button'

export const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin-dashboard' },
  { icon: AlertCircle, label: 'Emergency Events', href: '/emergency-events' },
  { icon: Bell, label: 'Alerts & Communication', href: '/alerts-communication' },
  { icon: Map, label: 'GIS & Mapping', href: '/gis-mapping' },
  { icon: Users, label: 'Responders & Agencies', href: '/responders-agencies' },
  { icon: ClipboardList, label: 'After Action Review', href: '/after-action-review' },
  { icon: FileText, label: 'Emergency Plan', href: '/emergency-plan' },
  { icon: FileText, label: 'Preparedness Information', href: '/preparedness-information' },
]

export const bottomItems = [
  // { icon: Settings, label: 'Settings', href: '/virtual-eoc-settings' },
  { icon: HelpCircle, label: 'Help', href: '#' },
  { icon: LogOut, label: 'Log out', href: '#' },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [showHelpModal, setShowHelpModal] = useState(false)

  return (
    <div className="w-72 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-border">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/50 flex flex-col items-center">
        <Image
          src={logo}
          alt="Ready2Go Logo"
          width={120}
          height={60}
          className="mb-4"
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

      {/* Bottom Navigation */}
      <div className="border-t border-border/50 p-4 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          // Handle Help button specially
          if (item.label === 'Help') {
            return (
              <button
                key={item.label}
                onClick={() => setShowHelpModal(true)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                  'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          }

          if (item.label === 'Log out') {
            return (
              <button
                key={item.label}
                onClick={async () => {
                  try {
                    await fetch('/api/logout', { method: 'POST' })
                  } catch (error) {
                    console.error('Logout failed:', error)
                  }
                  localStorage.removeItem('userRole')
                  localStorage.removeItem('userEmail')
                  localStorage.removeItem('userName')
                  router.push('/login')
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                  'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          }

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
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#34385E' }}>
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-md transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Ready2Go Logo - Placeholder */}
            <div className="mb-8 flex justify-center">
              <Image
                src={logo}
                alt="Ready2Go Logo"
                width={200}
                height={100}
                className="h-auto"
              />
            </div>

            {/* Title and Description */}
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-200 mb-8 max-w-lg text-lg">
              Have questions or want to learn more? Get in touch with our team
              <br />
              or schedule a demo.
            </p>

            {/* Schedule Demo Button */}
            <Button className="bg-white text-slate-800 hover:bg-gray-100 px-8 py-2 text-base">
              Schedule a Demo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
