'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, Users, Star, MapPin, Home, Briefcase,
  Cloud, AlertTriangle, ChevronRight, Hospital, Pill, Bed, Coffee, DollarSign, Car,
  Activity, Map
} from 'lucide-react'
import Link from 'next/link'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { useSafety } from '@/lib/context/safety-context'
import { SafeCheckInModal } from '@/components/modals/safe-check-in-modal'
import { reverseGeocode } from '@/lib/services/mock-map-service'
import { cn } from '@/lib/utils'

export default function UserDashboard() {
  const router = useRouter()
  const { location: geoLoc, loading: locLoading } = useGeolocation()
  const { verifyFamilySafety } = useSafety()

  const [isSafeCheckInOpen, setIsSafeCheckInOpen] = useState(false)
  const [geoLocName, setGeoLocName] = useState<string | null>(null)

  useEffect(() => {
    verifyFamilySafety()
  }, [verifyFamilySafety])

  useEffect(() => {
    const fetchLocation = async () => {
      if (locLoading) return
      if (geoLoc) {
        try {
          const name = await reverseGeocode(geoLoc.lat, geoLoc.lng)
          setGeoLocName(name)
        } catch (error) {
          console.error("Failed to reverse geocode live location:", error)
        }
      }
    }
    fetchLocation()
  }, [locLoading, geoLoc])

  const locations = [
    { id: '1', name: 'Current Location', address: geoLocName || 'San Francisco, CA 94102', icon: MapPin, active: true },
    { id: '2', name: 'Home', address: '123 Main St, San Francisco, CA', icon: Home, active: false },
    { id: '3', name: 'Lincoln High School', address: '456 School Ave, San Francisco, CA', icon: Briefcase, active: false },
    { id: '4', name: 'Office', address: '789 Business Blvd, San Francisco, CA', icon: Briefcase, active: false },
    { id: '5', name: 'Office', address: '789 Business Blvd, San Francisco, CA', icon: Briefcase, active: false },
  ]

  const alertFilters = [
    { label: 'Weather', icon: Cloud, color: 'text-blue-500 bg-blue-50' },
    { label: 'News', icon: Map, color: 'text-purple-500 bg-purple-50' },
    { label: 'Nearby Emergencies', icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
    { label: 'Community Updates', icon: Users, color: 'text-green-500 bg-green-50' },
  ]

  const nearbyResources = [
    { label: 'Hospitals', dist: '0.8 mi away', icon: Hospital, color: 'text-red-500 bg-red-50' },
    { label: 'Pharmacies', dist: '0.3 mi away', icon: Pill, color: 'text-green-500 bg-green-50' },
    { label: 'Lodging', dist: '1.2 mi away', icon: Bed, color: 'text-blue-500 bg-blue-50' },
    { label: 'Food & Essentials', dist: '0.5 mi away', icon: Coffee, color: 'text-orange-500 bg-orange-50' },
    { label: 'Financial Services', dist: '0.4 mi away', icon: DollarSign, color: 'text-purple-500 bg-purple-50' },
    { label: 'Traffic Status', dist: 'Clear', icon: Car, color: 'text-yellow-500 bg-yellow-50' },
  ]

  const newsItems = [
    { title: 'Highway 101 Closure This Weekend', category: 'Traffic', time: '2 hours ago', img: 'https://images.unsplash.com/photo-1510442650500-93217e634e4c?w=600&h=400&fit=crop' },
    { title: 'Free Health Screening Event', category: 'Community', time: '5 hours ago', img: 'https://images.unsplash.com/photo-1511673319455-2117e221146c?w=600&h=400&fit=crop' },
    { title: 'Emergency Drill Scheduled', category: 'Safety', time: '1 day ago', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19440f4?w=600&h=400&fit=crop' },
  ]

  return (
    <div className="flex-1 overflow-auto bg-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2196F3] to-[#42A5F5] h-[160px] flex flex-col justify-center px-10 shadow-sm">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-2 text-white">Ready2Go – Stay Prepared & Protected</h1>
            <p className="text-blue-50 text-sm font-medium opacity-90">Your personalized safety tools, alerts, and preparedness resources — all in one place.</p>
          </div>
          <div className="absolute bottom-6 right-8 flex items-center gap-4">
            <div className="bg-[#E0F2F1] text-teal-700 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm border border-teal-100">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
              <span className="text-[11px] font-bold uppercase tracking-wider">All Clear</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-blue-100 font-semibold uppercase tracking-tight opacity-80">Last Updated</span>
              <span className="text-xs font-bold text-white tracking-tight">12:45 PM EST</span>
            </div>
          </div>
        </section>

        {/* Top 3 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/user/active-shooter" className="block group border-l-4 border-l-[#F87171] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                <Activity className="w-5 h-5" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">Active Shooter Response</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed">Guided steps + direct 911 call with location sharing</p>
            </div>
          </Link>
          <button onClick={() => setIsSafeCheckInOpen(true)} className="block w-full text-left group border-l-4 border-l-[#34D399] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                <Users className="w-5 h-5" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">"Are We Safe?" Check-In</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed">Start check-in or view your group's safety status</p>
            </div>
          </button>
          <Link href="/user/favorite-places" className="block group border-l-4 border-l-[#60A5FA] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Star className="w-5 h-5 fill-blue-500" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">Favorite Places</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed">Quick access to school, daycare, meeting points</p>
            </div>
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* My Locations & Alerts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 pb-2 flex items-center justify-between">
                <h2 className="text-[17px] font-bold text-gray-900">My Locations & Alerts</h2>
                <button className="text-blue-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  + Add Location
                </button>
              </div>

              <div className="p-4 space-y-2.5">
                {locations.map((loc) => (
                  <div key={loc.id} className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group",
                    loc.active ? "bg-[#F0FDF4] border-green-200" : "bg-white border-gray-50 hover:border-gray-200"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", loc.active ? "bg-white border-green-100 text-green-500" : "bg-slate-50 border-gray-100 text-slate-400")}>
                        <loc.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14px] font-bold text-gray-900">{loc.name}</p>
                          {loc.active && (
                            <span className="bg-[#22C55E] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-500 font-medium">{loc.address}</p>
                        {loc.active && <p className="text-[10px] text-gray-400 mt-1">GPS enabled • Real-time alerts active</p>}
                      </div>
                    </div>
                    <div>
                      {!loc.active && <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 pt-4 border-t border-slate-50">
                <h3 className="text-[11px] font-bold text-gray-400 mb-4 tracking-wider uppercase">Alerts Enabled For:</h3>
                <div className="flex flex-wrap gap-2.5">
                  {alertFilters.map((filter) => (
                    <div key={filter.label} className={cn("px-4 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-bold border border-transparent shadow-sm", filter.color)}>
                      <filter.icon className="w-3.5 h-3.5" />
                      {filter.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearby Resources */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[17px] font-bold text-gray-900">Nearby Resources</h2>
                <button className="text-blue-500 text-xs font-bold hover:underline">
                  View Map
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyResources.map((res) => (
                  <div key={res.label} className="border border-gray-50 rounded-xl p-4 flex items-center gap-4 hover:border-blue-100 transition-colors cursor-pointer group bg-slate-50/30">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shadow-sm", res.color)}>
                      <res.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-0.5">{res.label}</p>
                      <p className="text-[12px] text-gray-500 font-medium">{res.dist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Weather Alerts */}
            <div className="bg-[#42A5F5] text-white rounded-[32px] shadow-lg p-8 overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[20px] font-bold">Weather Alerts</h2>
                <Cloud className="w-8 h-8 text-white/90" />
              </div>
              <div className="mb-8">
                <h1 className="text-6xl font-black mb-1">72°F</h1>
                <p className="text-[15px] font-semibold opacity-80 uppercase tracking-[0.2em]">Partly Cloudy</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-8 backdrop-blur-md">
                <h3 className="text-[14px] font-bold mb-1">No Active Warnings</h3>
                <p className="text-[12px] opacity-90 leading-relaxed font-medium">Your area is clear of weather alerts.</p>
              </div>
              <button className="w-full bg-white text-blue-500 text-xs font-black py-4 rounded-xl hover:bg-white/95 transition-all shadow-md active:scale-95 tracking-widest uppercase">
                View Full Forecast
              </button>
            </div>

            {/* Emergency Plan Builder */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-[17px] font-bold text-gray-900 mb-1">Emergency Plan Builder</h2>
              <p className="text-[12px] text-gray-400 mb-8 font-medium">Create and manage your family emergency plan</p>
              <div className="space-y-1 mb-8">
                {[
                  'Family Emergency Plan',
                  'Emergency Kits',
                  'Favorite Places Setup',
                  'Pet Safety Plan'
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3.5 cursor-pointer group border-b border-gray-50 last:border-0 hover:px-2 rounded-lg hover:bg-gray-50 transition-all">
                    <p className="text-[14px] text-gray-700 font-bold">{item}</p>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Completion</p>
                  <p className="text-[11px] font-black text-orange-500">66%</p>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-orange-500 w-[66%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Preparedness Info */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Preparedness Info</h2>
              <div className="space-y-4">
                {[
                  { title: 'Active Shooter Preparedness', desc: 'Essential safety protocols' },
                  { title: 'Severe Weather Tips', desc: 'Stay safe during storms' },
                  { title: 'Wildfire Preparedness', desc: 'Evacuation planning' },
                ].map((info) => (
                  <div key={info.title} className="border border-gray-50 rounded-2xl p-5 hover:border-blue-100 transition-all cursor-pointer group bg-slate-50/20">
                    <h3 className="text-[13px] font-black text-slate-800 group-hover:text-blue-600 transition-colors mb-1 uppercase tracking-tight leading-tight">{info.title}</h3>
                    <p className="text-[11px] text-gray-400 font-medium">{info.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* News & Updates Section */}
        <section className="pt-12 pb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">News &amp; Updates</h2>
            <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <span className="px-6 py-2 bg-blue-500 text-white font-extrabold text-[10px] rounded-lg shadow-sm cursor-pointer uppercase tracking-widest">All</span>
              <span className="px-6 py-2 text-slate-400 font-extrabold text-[10px] hover:text-blue-500 rounded-lg cursor-pointer transition-colors uppercase tracking-widest">Emergency</span>
              <span className="px-6 py-2 text-slate-400 font-extrabold text-[10px] hover:text-blue-500 rounded-lg cursor-pointer transition-colors uppercase tracking-widest">Local</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((news, i) => (
              <div key={i} className="bg-white border border-gray-50 rounded-2xl overflow-hidden shadow-sm group hover:shadow-xl transition-all cursor-pointer flex flex-col h-full">
                <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className={cn(
                      "px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                      news.category === 'Traffic' ? "bg-blue-50 text-blue-600 border-blue-100" :
                        news.category === 'Community' ? "bg-green-50 text-green-600 border-green-100" :
                          "bg-orange-50 text-orange-600 border-orange-100"
                    )}>
                      {news.category}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{news.title}</h3>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{news.time}</span>
                    <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <SafeCheckInModal
        isOpen={isSafeCheckInOpen}
        onClose={() => setIsSafeCheckInOpen(false)}
      />
    </div>
  )
}
