'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Phone, Hospital, Home, ShoppingBag, Map, Wrench, CloudRain,
  Search, Bell, User, Zap, ChevronRight, AlertTriangle, Pill, Heart, Users, Shield, Hotel, Gavel, Shirt, LogOut
} from 'lucide-react'

export default function VirtualEOCPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push('/login')
  }

  const originalOptions = [
    { icon: Phone, label: '911 Speed Dial', sub: 'Report location, situation & request AID', href: '/virtual-eoc/911', color: 'bg-red-50 text-red-600', iconColor: 'text-red-600' },
    { icon: Hospital, label: 'Medical & Pharmacies', sub: 'Nearest medical facilities & ICUs', href: '/virtual-eoc/services?type=medical', color: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-600' },
    { icon: Home, label: 'Evacuation & Shelters', sub: 'Your pre-planned and live routes', href: '/virtual-eoc/evacuation', color: 'bg-orange-50 text-orange-600', iconColor: 'text-orange-600' },
    { icon: ShoppingBag, label: 'Lodging & Essentials', sub: 'Hotels, food, and gas stations', href: '/virtual-eoc/services?type=essentials', color: 'bg-emerald-50 text-emerald-600', iconColor: 'text-emerald-600' },
    { icon: Map, label: 'Community Center', sub: 'Red Cross & FEMA resources', href: '/virtual-eoc/resources', color: 'bg-purple-50 text-purple-600', iconColor: 'text-purple-600' },
    { icon: Wrench, label: 'Emergency Maintenance', sub: 'Utility and repair assistance', href: '/virtual-eoc/maintenance', color: 'bg-slate-50 text-slate-600', iconColor: 'text-slate-600' },
    { icon: CloudRain, label: 'Live Weather & Traffic', sub: 'Current conditions & alerts', href: '/user-dashboard', color: 'bg-sky-50 text-sky-600', iconColor: 'text-sky-600' },
  ]

  const quantifiedResources = [
    { label: 'Pop-up Medical Clinics', count: '2 locations', icon: Pill, color: 'text-blue-500' },
    { label: 'Private and non-profit Sector', count: '4 locations', icon: Shield, color: 'text-emerald-500' },
    { label: 'FEMA Assistance Booths', count: '2 locations', icon: Home, color: 'text-orange-500' },
    { label: 'Red Cross Stations', count: '3 locations', icon: Heart, color: 'text-red-500' },
    { label: 'Family Reunification', count: '1 location', icon: Users, color: 'text-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Light Header from Mockup */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Badge className="absolute -top-1 -right-1 p-0 w-4 h-4 flex items-center justify-center bg-red-500 border-2 border-white text-[10px]">2</Badge>
            <Zap className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-black leading-none uppercase tracking-tighter">Mansoor Soomro</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">m.soomro@eoc.gov</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-slate-100 flex items-center justify-center overflow-hidden">
              <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Virtual EOC Title Banner (Dark) */}
        <div className="bg-[#1e293b] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Virtual Emergency Operations Center</h1>
          <p className="text-slate-400 text-sm font-medium">Critical life-safety information and resources for your area — updated in real time</p>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">ACTIVE feed</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SF DEP. HEAD</p>
          </div>
        </div>

        {/* Hurricane Status Grid */}
        <Card className="bg-white border-slate-200 p-8 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-2 italic uppercase tracking-tighter">Hurricane Erin - Category 3</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-3xl leading-relaxed">
            Major hurricane approaching coastal areas. Immediate evacuation required for zones A, B, and C. Sustained winds of 115 mph with dangerous storm surge expected.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-red-100">
              <AlertTriangle className="text-red-600 w-8 h-8 mb-2" />
              <span className="text-red-900 font-black text-xs uppercase tracking-widest mb-1">Evacuate</span>
              <p className="text-[10px] text-red-600 font-bold uppercase">Zones A, B, & C</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-orange-100">
              <Home className="text-orange-600 w-8 h-8 mb-2" />
              <span className="text-orange-900 font-black text-xs uppercase tracking-widest mb-1 italic">Shelter-In-Place</span>
              <p className="text-[10px] text-orange-600 font-bold uppercase">Zone D</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-yellow-100">
              <Map className="text-yellow-600 w-8 h-8 mb-2" />
              <span className="text-yellow-900 font-black text-xs uppercase tracking-widest mb-1">Avoid Travel</span>
              <p className="text-[10px] text-yellow-600 font-bold uppercase">All Areas</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-purple-100">
              <CloudRain className="text-purple-600 w-8 h-8 mb-2" />
              <span className="text-purple-900 font-black text-xs uppercase tracking-widest mb-1">Weather Alert</span>
              <p className="text-[10px] text-purple-600 font-bold uppercase italic">Active</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Functional Menu Items (The "Options") */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 px-2 uppercase tracking-tight italic">Mission Critical Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {originalOptions.map((btn, i) => (
                  <Card
                    key={i}
                    className="p-6 rounded-3xl flex items-center gap-5 transition-all hover:scale-[1.02] cursor-pointer shadow-sm border-none bg-white group"
                    onClick={() => router.push(btn.href)}
                  >
                    <div className={`p-4 rounded-2xl ${btn.color} group-hover:scale-110 transition-transform`}>
                      <btn.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight leading-none mb-1 text-slate-900 uppercase">{btn.label}</h4>
                      <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-wider">{btn.sub}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Activated Emergency Resources List */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 px-2 uppercase tracking-tight italic">Activated Intelligence Feed</h3>
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
                {quantifiedResources.map((res, i) => (
                  <div key={i} className={`p-6 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors ${i < quantifiedResources.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <res.icon className={`w-5 h-5 ${res.color}`} />
                      </div>
                      <span className="font-black text-[15px] tracking-tight uppercase">{res.label}</span>
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${res.color} italic`}>{res.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-[#1e293b] text-white relative overflow-hidden group">
              <CloudRain className="absolute -right-8 -top-8 w-48 h-48 text-white opacity-10 group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-6 font-sans">Sector Intelligence</h3>
              <div className="flex items-end gap-3 mb-6 font-sans">
                <span className="text-6xl font-black tracking-tighter">72°F</span>
                <div className="flex flex-col mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Partly Cloudy</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-700/50">
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-red-100 uppercase tracking-widest">Active Alerts</p>
                    <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded font-black italic border border-red-500/20">CRITICAL</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-3 font-medium">
                    <li className="flex gap-2 leading-tight"><span>•</span> Hi-South Closure due to flooding</li>
                    <li className="flex gap-2 leading-tight"><span>•</span> Downtown: High wind zone</li>
                    <li className="flex gap-2 leading-tight"><span>•</span> Storm surge 4-6 feet above normal</li>
                  </ul>
                </div>
              </div>
            </Card>

            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 italic">Recovery Planning</h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start h-12 rounded-2xl border-slate-200 bg-white text-slate-600 font-bold uppercase text-[10px] w-full shadow-sm hover:bg-slate-50">
                  <Hotel className="w-4 h-4 mr-3 text-purple-500" /> Recover Shelters
                </Button>
                <Button variant="outline" className="justify-start h-12 rounded-2xl border-slate-200 bg-white text-slate-600 font-bold uppercase text-[10px] w-full shadow-sm hover:bg-slate-50">
                  <ShoppingBag className="w-4 h-4 mr-3 text-blue-500" /> Essential Funds
                </Button>
                <Button variant="outline" className="justify-start h-12 rounded-2xl border-slate-200 bg-white text-slate-600 font-bold uppercase text-[10px] w-full shadow-sm hover:bg-slate-50">
                  <Gavel className="w-4 h-4 mr-3 text-emerald-500" /> Legal Planning
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="p-8 border-t border-slate-200 bg-white flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
          <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
        </div>
        <p className="text-[9px] text-slate-400 italic font-medium">This session is monitored by the Virtual EOC for training and audit purposes. Monitoring ID: EOC-SF-2026-001</p>
      </footer>
    </div>
  )
}
