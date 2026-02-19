'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Phone, Hospital, Home, ShoppingBag, Map, Wrench, CloudRain, ArrowLeft, Siren, Megaphone, Wind, Users, Activity, ExternalLink, ShieldAlert } from 'lucide-react'
import { GoogleMap } from '@/components/google-map'

export default function VirtualEOCPage() {
  const router = useRouter()

  const emergencyName = "HURRICANE ERIN"
  const emergencyLevel = "CAT 4 - EXTREME DANGER"

  const menuItems = [
    { icon: Phone, label: '911 Speed Dial', href: '/virtual-eoc/911', color: 'bg-red-600', text: 'text-white' },
    { icon: Hospital, label: 'Medical & Pharmacies', href: '/virtual-eoc/services?type=medical', color: 'bg-blue-600', text: 'text-white' },
    { icon: Home, label: 'Evacuation & Shelters', href: '/virtual-eoc/evacuation', color: 'bg-orange-600', text: 'text-white' },
    { icon: ShoppingBag, label: 'Lodging & Essentials', href: '/virtual-eoc/services?type=essentials', color: 'bg-emerald-600', text: 'text-white' },
    { icon: Map, label: 'Community Center', href: '/virtual-eoc/resources', color: 'bg-purple-600', text: 'text-white' },
    { icon: Wrench, label: 'Emergency Maintenance', href: '/virtual-eoc/maintenance', color: 'bg-slate-600', text: 'text-white' },
    { icon: CloudRain, label: 'Live Weather & Traffic', href: '/user-dashboard', color: 'bg-sky-600', text: 'text-white' },
  ]

  const stats = [
    { icon: Wind, label: 'Wind Speed', value: '145 MPH', subValue: 'Gusts to 160', color: 'text-sky-400' },
    { icon: Users, label: 'Evacuated', value: '72%', subValue: 'Zones A & B', color: 'text-emerald-400' },
    { icon: Activity, label: 'Incidents', value: '14 Active', subValue: 'Search & Rescue', color: 'text-orange-400' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-red-500/30">
      {/* High-Urgency Emergency Header */}
      <div className="bg-red-700 p-4 shadow-2xl sticky top-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-red-600 animate-pulse opacity-50"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Siren className="w-8 h-8 text-white animate-bounce-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl tracking-tighter uppercase leading-none">{emergencyName}</h1>
                <span className="bg-white text-red-700 text-[10px] px-2 py-0.5 rounded font-black italic">LIVE</span>
              </div>
              <p className="text-xs font-bold text-red-100 uppercase tracking-widest opacity-80">{emergencyLevel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 mr-4 border-r border-white/20 pr-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-red-200 uppercase">Current Time</p>
                <p className="text-sm font-black italic">15:47 PST</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/user-dashboard')}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> EXIT TO BLUE SKY
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row max-w-7xl mx-auto gap-6 p-6">

          {/* Left Column: Intelligence & Situational Awareness (Desktop Only Sidebar) */}
          <aside className="hidden lg:flex lg:flex-col lg:w-1/3 space-y-6 overflow-hidden">
            <Card className="flex-1 bg-slate-900 border-slate-800 shadow-2xl flex flex-col overflow-hidden rounded-3xl overflow-hidden group">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <h2 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Map className="w-3 h-3" /> Live Intelligence Map
                </h2>
                <ExternalLink className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white transition-colors" />
              </div>
              <div className="flex-1 relative">
                <GoogleMap address="Miami, FL" />
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-5 rounded-3xl shadow-xl space-y-4 border-t-4 border-t-sky-500/50">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-xs uppercase tracking-widest text-slate-400">EOC Log Feed</h2>
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping"></div>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                {[
                  { time: '1m ago', text: 'Zonal Evacuation completed for Sector 7' },
                  { time: '5m ago', text: 'Search & Rescue helicopters deployed to coast' },
                  { time: '12m ago', text: 'Shelter capacity at 85% - diverting to Sector J' },
                  { time: '20m ago', text: 'Flash flood warning issued for inland basins' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 text-xs border-l border-slate-800 pl-4 py-1">
                    <span className="text-slate-500 font-bold whitespace-nowrap">{log.time}</span>
                    <p className="text-slate-300">{log.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          {/* Right Column: Mission Control & Responsive Grid */}
          <main className="flex-1 flex flex-col space-y-6 overflow-y-auto no-scrollbar">

            {/* Immediate Action Command Panel */}
            <Card className="bg-red-950/20 border-red-500/50 p-6 shadow-2xl relative overflow-hidden rounded-3xl group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert className="w-48 h-48 text-red-500" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-red-500 mb-2 flex items-center gap-3 italic">
                  <Megaphone className="w-6 h-6 animate-pulse" />
                  MANDATORY ACTION PANEL
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed max-w-2xl text-lg font-medium">
                  Hurricane Erin has been upgraded to <span className="text-white font-black underline decoration-red-500 underline-offset-4">CAT 4 POWER</span>.
                  Mandatory evacuation orders are standing for all coastal zones. Seek shelter inland by sunset.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black h-16 text-xl shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
                    onClick={() => router.push('/virtual-eoc/evacuation')}
                  >
                    VIEW EVACUATION ROUTES
                  </Button>
                  <Button
                    variant="outline"
                    className="sm:w-auto h-16 px-8 border-white/20 bg-white/5 text-white font-bold hover:bg-white/10"
                    onClick={() => router.push('/virtual-eoc/services?type=medical')}
                  >
                    <Hospital className="w-5 h-5 mr-2" /> FIND NEAREST ICU
                  </Button>
                </div>
              </div>
            </Card>

            {/* Situational Awareness Metadata Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <Card key={i} className="bg-slate-900/50 border-slate-800 p-4 rounded-2xl flex items-center gap-4 group hover:bg-slate-900 transition-colors">
                  <div className={`p-3 bg-slate-800 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-lg font-black">{stat.value}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{stat.subValue}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Emergency Service Rapid-Navigation Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={() => item.href !== '#' && router.push(item.href)}
                    className={`relative overflow-hidden group h-32 rounded-3xl shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] ${item.color} border border-white/10 p-6 flex flex-col justify-between items-start text-left`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none group-hover:scale-125 transition-transform">
                      <Icon className="w-16 h-16" />
                    </div>
                    <div className="bg-black/10 p-2 rounded-xl backdrop-blur-sm">
                      <Icon className={`w-6 h-6 ${item.text}`} />
                    </div>
                    <span className={`font-black text-sm uppercase tracking-tight ${item.text}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}

              {/* Additional Logistical Context Widget */}
              <div className="col-span-2 lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2 text-sky-400">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-widest uppercase">System Integrity</span>
                </div>
                <h4 className="text-xl font-bold">ALL SYSTEMS GO</h4>
                <p className="text-xs text-slate-500 leading-tight">Ready2Go proprietary AI is syncing data across all sectors.</p>
              </div>
            </div>

            {/* Mobile-Only Map Link (Small screen visibility) */}
            <Button
              className="lg:hidden w-full h-14 bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-700"
              onClick={() => router.push('/virtual-eoc/resources')}
            >
              <Map className="w-4 h-4 mr-2" /> OPEN INTERACTIVE MAP
            </Button>

          </main>
        </div>
      </div>

      {/* Modern High-Tech Footer */}
      <footer className="p-8 border-t border-slate-900 bg-slate-950 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
          <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
        </div>
        <p className="text-[9px] text-slate-700 italic">This session is monitored by the Virtual EOC for training and audit purposes. Monitoring ID: EOC-SF-2026-001</p>
      </footer>
    </div>
  )
}
