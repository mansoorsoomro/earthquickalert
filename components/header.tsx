'use client'

import { useState } from 'react'
import { Bell, Search, LogOut, Menu, X, Users } from 'lucide-react'
import { menuItems } from '@/components/sidebar'
import { menuItems as userMenuItems } from '@/components/user-sidebar'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface HeaderProps {
  userName?: string
  onLogout?: () => void
}

export function Header({ userName = 'Admin User', onLogout }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const displayName = userName || (typeof window !== 'undefined' ? localStorage.getItem('userName') : '') || 'User'
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : ''
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : ''
  const isUserSafe = typeof window !== 'undefined' ? localStorage.getItem('isSafe') !== 'false' : true

  return (
    <header className="border-b border-slate-100 bg-white px-4 md:px-8 py-3 flex items-center justify-between gap-8 h-16 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 md:hidden rounded-md hover:bg-slate-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-sm hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search ....."
              className="pl-10 bg-white border-slate-200 rounded-lg h-10 w-full focus:ring-1 focus:ring-blue-100 transition-all shadow-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-1 hover:bg-slate-50 rounded-full transition-all">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">3</span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <Avatar className="w-9 h-9 border border-slate-100 p-0.5">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" className="rounded-full overflow-hidden object-cover" />
            <AvatarFallback className="rounded-full flex items-center justify-center bg-slate-100 text-[10px] font-bold">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">{displayName}</p>
            <p className="text-[11px] text-slate-400 font-medium">{userEmail || 'user@gmail.com'}</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Logic and ShowMenu dropdown would go here if needed, but keeping it simple for now */}
    </header>
  )
}
