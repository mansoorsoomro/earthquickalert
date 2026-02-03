'use client'

import { useState } from 'react'
import { Bell, Search, LogOut, Menu, X } from 'lucide-react'
import { menuItems } from '@/components/sidebar'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  userName?: string
  onLogout?: () => void
}

export function Header({ userName = 'Admin User', onLogout }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <header className="border-b border-border bg-background px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 md:hidden rounded-md hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:block flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search ....."
              className="pl-10 bg-background border-2 border-border"
            />
          </div>
        </div>

        {/* mobile search icon */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 md:hidden rounded-md hover:bg-accent transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-80 transition-opacity"
          >
            <div className="text-right">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground">Emergency Coordinator</p>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
              <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>

          {showMenu && onLogout && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setShowMenu(false)
                  onLogout()
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search input dropdown */}
      {showSearch && (
        <div className="absolute top-16 left-4 right-4 z-40 md:hidden">
          <div className="bg-background border border-border rounded-md p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search ....." className="pl-10 bg-background border-0" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="relative w-72 bg-sidebar text-sidebar-foreground h-full p-4">
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 flex items-center">
              <h2 className="text-lg font-bold">Ready2Go</h2>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setShowSidebar(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
