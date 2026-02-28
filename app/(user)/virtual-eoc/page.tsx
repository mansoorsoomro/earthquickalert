'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowRight, Users, Star, MapPin, Home, Briefcase,
  Map, Hospital, Pill, Bed, Coffee, DollarSign, Car,
  Cloud, ChevronRight, Activity, CloudFog, CloudLightning,
  AlertTriangle, Navigation, RefreshCw, UserCheck, ShieldCheck, Zap, UserX, Phone, LogOut, Heart
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function VirtualEOCPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push('/login')
  }

  const quantifiedResources = [
    { label: 'Pop-up Medical Clinics', count: '5 locations', icon: UserCheck, color: 'text-blue-500' },
    { label: 'Private and Non-Profit Sector', count: '7 locations', icon: Briefcase, color: 'text-yellow-500' },
    { label: 'FEMA Assistance Booths', count: '2 locations', icon: ShieldCheck, color: 'text-green-500' },
    { label: 'Red Cross Stations', count: '5 locations', icon: Activity, color: 'text-red-500' },
    { label: 'Family Reunification', count: '1 location', icon: Users, color: 'text-purple-500' }
  ]

  return (
    <main className="flex-1 overflow-auto bg-white py-8 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto w-full space-y-8">

        {/* Banner Section */}
        <div className="relative h-[200px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <Image
            src="/banner_bg.png"
            alt="Virtual EOC Background"
            fill
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 p-10 flex flex-col justify-center text-white z-10">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Virtual Emergency Operations Center</h1>
            <p className="text-base opacity-85 max-w-2xl font-medium">Critical life-safety information and resources for your area — updated in real time</p>
          </div>
          <div className="absolute bottom-8 right-10 flex items-center gap-6 z-20">
            <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/30 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
              <span className="text-[11px] font-black uppercase tracking-widest text-white">Active</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-0.5">Last Updated</p>
              <p className="text-xs font-black text-white">12:45 PM EST</p>
            </div>
          </div>
        </div>

        {/* Hurricane Alert Section */}
        <div className="bg-white rounded-[2.5rem] border-l-[8px] border-l-[#EF4444] border border-slate-100 p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Hurricane Erin - Category 3</h2>
              <p className="text-sm text-slate-500 max-w-4xl leading-relaxed font-medium">
                Major hurricane approaching coastal areas. Immediate evacuation required for zones A, B, and C. Sustained winds of 115 mph with dangerous storm surge expected.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-sm">
                  <UserX className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest">Evacuate</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Zones A, B, C</p>
              </div>
              <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4 shadow-sm">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest italic">Shelter-in-Place</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Zone D</p>
              </div>
              <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500 mb-4 shadow-sm">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest">Avoid Travel</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">All Roads</p>
              </div>
              <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-4 shadow-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest italic">Weather Alert</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-10">

            {/* Life-Safety Action Buttons */}
            <div className="space-y-6">
              <div className="px-2">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">Life-Safety Action Buttons</h2>
                <p className="text-sm text-slate-400 font-medium">Use these quick actions to stay safe during severe weather events.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 hover:border-red-200 hover:shadow-md transition-all text-left bg-white group shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-red-600 uppercase tracking-tight leading-none mb-1">911 Speed Dial</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct connection to local 911</p>
                  </div>
                </button>
                <button className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all text-left bg-white group shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Hospital className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-blue-600 uppercase tracking-tight leading-none mb-1">Hospital Locator</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nearest medical facilities</p>
                  </div>
                </button>
                <button className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 hover:border-green-200 hover:shadow-md transition-all text-left bg-white group shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Navigation className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-green-600 uppercase tracking-tight leading-none mb-1">Evacuation Routes</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">GPS navigation to safety</p>
                  </div>
                </button>
                <button className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all text-left bg-white group shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Home className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-purple-600 uppercase tracking-tight leading-none mb-1">Shelter Locations</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Safe shelter sites nearby</p>
                  </div>
                </button>
                <button className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 hover:border-yellow-200 hover:shadow-md transition-all text-left bg-white group shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <RefreshCw className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-yellow-600 uppercase tracking-tight leading-none mb-1">Report Conditions</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Share status updates</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Activated Emergency Resources */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm overflow-hidden">
              <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight px-2 italic">Activated Emergency Resources</h2>
              <div className="space-y-1">
                {quantifiedResources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-all rounded-3xl cursor-pointer group">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <res.icon className={cn("w-5 h-5", res.color)} />
                      </div>
                      <span className="text-[15px] font-black text-slate-800 uppercase tracking-tight">{res.label}</span>
                    </div>
                    <span className={cn("text-[11px] font-black uppercase tracking-[0.1em] italic", res.color)}>{res.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-10">
            <div className="bg-[#1e293b] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Real-Time Weather & Traffic</h2>
                <div className="mb-8">
                  <h3 className="text-7xl font-black tracking-tighter mb-1">72°F</h3>
                  <p className="text-[15px] font-black text-slate-400 uppercase tracking-widest italic">Partly Cloudy</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/10 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Active Alerts</span>
                    <span className="px-3 py-1 rounded bg-red-400/20 text-red-300 text-[9px] font-black italic tracking-widest border border-red-400/20">DANGER</span>
                  </div>
                  <ul className="space-y-3 text-[11px] text-slate-300 font-bold tracking-tight">
                    <li className="flex gap-2 leading-tight uppercase tracking-tight"><span>•</span> Hi-95 South Closed due to flooding</li>
                    <li className="flex gap-2 leading-tight uppercase tracking-tight"><span>•</span> Downtown: High wind zone - avoid tall buildings</li>
                    <li className="flex gap-2 leading-tight uppercase tracking-tight italic"><span>•</span> Storm surge: 8–12 feet above normal</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl p-6 text-slate-800 text-center flex flex-col items-center justify-center aspect-square shadow-lg group-hover:bg-slate-50 transition-colors">
                    <CloudFog className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Visibility</p>
                    <p className="text-sm font-black tracking-tighter italic">3.5 miles</p>
                  </div>
                  <div className="bg-white rounded-3xl p-6 text-slate-800 text-center flex flex-col items-center justify-center aspect-square shadow-lg group-hover:bg-slate-50 transition-colors">
                    <CloudLightning className="w-6 h-6 text-slate-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Wind Speed</p>
                    <p className="text-sm font-black tracking-tighter italic">115 mph</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Lodging & Essential Resources */}
        <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm overflow-hidden">
          <h2 className="text-xl font-black text-slate-900 mb-10 uppercase tracking-tight italic">Lodging & Essential Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
                <Bed className="w-5 h-5 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest">Available Hotels</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[13px] group cursor-pointer">
                  <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors">Hampton Inn Downtown</span>
                  <span className="text-green-500 font-black text-[10px] uppercase tracking-widest italic">Available</span>
                </div>
                <div className="flex justify-between items-center text-[13px] group cursor-pointer">
                  <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors">Holiday Inn Express</span>
                  <span className="text-yellow-500 font-black text-[10px] uppercase tracking-widest italic">Limited</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
                <Coffee className="w-5 h-5 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest">Food & Essentials</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[13px] group cursor-pointer">
                  <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors">Community Food Pantry</span>
                  <span className="text-green-500 font-black text-[10px] uppercase tracking-widest italic">Open</span>
                </div>
                <div className="flex justify-between items-center text-[13px] group cursor-pointer">
                  <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors">Walmart Supercenter</span>
                  <span className="text-green-500 font-black text-[10px] uppercase tracking-widest italic">Open</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
                <Car className="w-5 h-5 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest">Gas Stations</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[13px] group cursor-pointer">
                  <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors">Shell Station (Main St)</span>
                  <span className="text-green-500 font-black text-[10px] uppercase tracking-widest italic">Fuel Available</span>
                </div>
                <div className="flex justify-between items-center text-[13px] group cursor-pointer">
                  <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors">BP Gas (Highway 101)</span>
                  <span className="text-red-500 font-black text-[10px] uppercase tracking-widest italic">No Fuel</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Resources (Post-Disaster) */}
        <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm pb-16">
          <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Recovery Resources (Post-Disaster)</h2>
          <p className="text-xs text-slate-400 mb-10 font-medium">This section will be activated once the area is declared safe for re-entry.</p>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#9333ea] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#a855f7] transition-all shadow-lg active:scale-95 italic">
              <Zap className="w-4 h-4 fill-white" />
              Donation Centers
            </button>
            <button className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#3b82f6] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#60a5fa] transition-all shadow-lg active:scale-95 italic">
              <ShieldCheck className="w-4 h-4" />
              Pharmacy Status
            </button>
            <button className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#334155] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#475569] transition-all shadow-lg active:scale-95 italic">
              <Users className="w-4 h-4" />
              View All Events
            </button>
            <button className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#ef4444] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#f87171] transition-all shadow-lg active:scale-95 italic">
              <Activity className="w-4 h-4" />
              FEMA Assistance
            </button>
            <button className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#4ade80] transition-all shadow-lg active:scale-95 italic">
              <DollarSign className="w-4 h-4" />
              Relief Funding
            </button>
          </div>
        </div>

      </div>

      <footer className="mt-16 p-10 border-t border-slate-100 bg-white flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
          <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Official Emergency Broadcast System • 2026</p>
        </div>
        <p className="text-[9px] text-slate-300 italic font-medium">Session Monitored under Virtual EOC Protocol • Monitoring ID: EOC-SF-2026-001</p>
      </footer>
    </main>
  )
}
