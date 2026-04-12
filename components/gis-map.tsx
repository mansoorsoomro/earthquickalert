'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Users,
  Zap,
  Cloud,
  Shield,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Navigation,
  Loader2,
  Globe,
  Map as MapIcon,
  Maximize2,
  Settings,
  Radar
} from 'lucide-react'
import { GoogleMap } from '@/components/google-map'
import { cn } from '@/lib/utils'
import { ShieldCheck, Truck, Siren, Building2, MapPin } from 'lucide-react'
import { geocodeAddress } from '@/lib/services/mock-map-service'
import { useGeolocation } from '@/lib/hooks/use-geolocation'

interface CitizenLocation {
  id: string
  name: string
  location: string
  role: string
  isSafe: boolean
  alerts: any[]
  weather?: { temp: number, code: number, wind: number }
  position?: { lat: number; lng: number }
}

interface IncidentMarker {
  _id: string
  type: string
  location: string
  description: string
  status: string
  lat?: number
  lng?: number
  timestamp?: string
}

interface EventMarker {
  _id: string
  type: string
  title: string
  description: string
  severity: string
  location: { lat: number; lng: number; address: string }
  magnitude?: number
  timestamp?: string
}

export function GISMap() {
  const [citizens, setCitizens] = useState<CitizenLocation[]>([])
  const [incidents, setIncidents] = useState<IncidentMarker[]>([])
  const [events, setEvents] = useState<EventMarker[]>([])
  const [weatherConditions, setWeatherConditions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [globalAlerts, setGlobalAlerts] = useState<{ earthquakes: any[], weather: any[] }>({ earthquakes: [], weather: [] })
  
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 39.8283, lng: -98.5795 })
  const [mapZoom, setMapZoom] = useState(4)
  
  const [activeTab, setActiveTab] = useState<'Citizens' | 'Responders' | 'Infrastructure' | 'Hazards'>('Citizens')
  const [selectionDetails, setSelectionDetails] = useState<{ count: number, location: string } | null>(null)

  const { location: adminLoc } = useGeolocation()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/admin/citizens/locations')
        const json = await res.json()
        if (json.success) {
          const citizenData = json.data as CitizenLocation[]
          setIncidents(json.incidents || [])
          setEvents(json.events || [])
          setWeatherConditions(json.weatherConditions || [])

          const withPositions = await Promise.all(citizenData.map(async (c) => {
            if (c.position) return c;
            try {
              const pos = await geocodeAddress(c.location)
              return { ...c, position: pos }
            } catch (e) {
              return { ...c, position: { lat: 37.7749, lng: -122.4194 } }
            }
          }))

          setCitizens(withPositions)
          setGlobalAlerts(json.globalAlerts)
        }
      } catch (error) {
        console.error('Error fetching admin map data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const markers = useMemo(() => {
    const getWeatherStyle = (code: number, wind: number) => {
      if (code >= 95) return { title: 'Thunderstorm', color: '#4B0082' }; 
      if (code >= 71) return { title: 'Snowy', color: '#00FFFF' }; 
      if (code >= 51) return { title: 'Rainy', color: '#3B82F6' }; 
      if (wind > 30) return { title: 'Strong Wind', color: '#94A3B8' }; 
      return { title: 'Clear', color: '#F59E0B' };
    };

    const userMarkers = citizens
      .filter(c => c.position)
      .map(c => ({
        id: c.id,
        position: c.position!,
        title: c.name,
        type: 'user' as const,
        isSafe: c.isSafe,
        status: c.isSafe ? 'Safe' : 'Danger',
        description: `Role: ${c.role || 'Citizen'} - ${c.location}`,
        alerts: c.alerts,
        timestamp: new Date().toISOString()
      }))

    const responderMarkers = [
      { id: 'r1', position: { lat: 37.7694, lng: -122.4862 }, title: 'Engine 51', type: 'incident' as const, status: 'Active', description: 'Fire Engine Unit.' },
      { id: 'r2', position: { lat: 37.7680, lng: -122.4500 }, title: 'Squad 3', type: 'incident' as const, status: 'On Route', description: 'Patrol Unit.' },
    ]

    const infraMarkers = [
      { id: 'i1', position: { lat: 37.7700, lng: -122.4600 }, title: 'SF General Hospital', type: 'condition' as const, status: 'Full', description: 'Medical facility.', color: '#EF4444' },
    ]

    const incidentMarkers = incidents
      .filter(inc => inc.lat && inc.lng)
      .map(inc => ({
        id: inc._id,
        position: { lat: inc.lat!, lng: inc.lng! },
        title: inc.type,
        type: 'incident' as const,
        status: inc.status,
        description: inc.description || inc.location,
        timestamp: inc.timestamp
      }))

    const filteredMarkers = [
      ...(activeTab === 'Citizens' ? userMarkers : []),
      ...(activeTab === 'Responders' ? responderMarkers : []),
      ...(activeTab === 'Infrastructure' ? infraMarkers : []),
      ...incidentMarkers
    ]

    return filteredMarkers
  }, [citizens, incidents, activeTab])

  const CitizenListItem = ({ citizen }: { citizen: CitizenLocation }) => (
    <div className={cn(
      "p-4 rounded-2xl border transition-all group cursor-pointer",
      citizen.isSafe 
        ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" 
        : "bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-2 rounded-full",
            citizen.isSafe ? "bg-emerald-500" : "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          )} />
          <span className="text-[11px] font-black text-white uppercase tracking-tight">{citizen.name}</span>
        </div>
        <Badge className={cn(
          "text-[8px] font-black uppercase tracking-widest border-none px-2 py-0.5",
          citizen.isSafe ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500 text-white"
        )}>
          {citizen.isSafe ? 'Secure' : 'Needs Help'}
        </Badge>
      </div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
        <Navigation size={10} className="text-blue-500" />
        {citizen.location}
      </p>
    </div>
  )

  return (
    <Card className="bg-[#0A0B10] border-white/5 rounded-[40px] overflow-hidden h-[700px] flex flex-col relative shadow-2xl">
      {/* Dynamic Background Blur */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Overlay */}
      <div className="absolute top-8 left-8 z-40 flex items-center gap-6">
        <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
             <Radar size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">GIS Strategic Map</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Live Sector Analysis</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(['Citizens', 'Responders', 'Infrastructure'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-2xl border",
                activeTab === tab 
                  ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-slate-900/60 border-white/10 text-slate-400 hover:bg-slate-900/80 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex relative">
        <div className="flex-1 relative">
          <GoogleMap markers={markers} zoom={mapZoom} center={mapCenter} />
          
          {selectionDetails && (
            <div className="absolute top-32 left-8 z-40 bg-slate-900/90 backdrop-blur-3xl p-6 rounded-[32px] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 w-64">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase leading-none mb-1">Impact Analysis</h4>
                  <p className="text-[9px] font-black text-slate-500 uppercase truncate">{selectionDetails.location}</p>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-black text-white tracking-tighter">{selectionDetails.count}</span>
                <span className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Impacted</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="bg-red-500 h-full w-[70%] shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              </div>
              <button onClick={() => setSelectionDetails(null)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-colors border border-white/5">Dismiss Intelligence</button>
            </div>
          )}

          <div className="absolute bottom-8 right-8 z-30 flex flex-col gap-3">
            <button
               onClick={() => adminLoc && setMapCenter(adminLoc)}
               className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 text-white hover:bg-blue-600 transition-all shadow-2xl group"
            >
               <Navigation size={18} className="group-hover:rotate-45 transition-transform" />
            </button>
            <button className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 text-white hover:bg-slate-800 transition-all shadow-2xl">
               <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Tactical Intel Sidebar */}
        <div className={cn(
          "bg-slate-900/40 backdrop-blur-[60px] border-l border-white/5 flex flex-col transition-all duration-700 overflow-hidden relative z-40",
          isSidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0"
        )}>
          <div className="p-8 border-b border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <Activity size={14} className="text-blue-500" /> Sector Intel
              </h3>
              <Badge className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0">Live</Badge>
            </div>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">System Signal Optimized</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
            {/* Hazards Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                   <Cloud size={14} className="text-amber-500" /> Weather Matrix
                </h4>
                <span className="text-[9px] font-black text-slate-600 uppercase italic">{globalAlerts.weather.length} Alerts</span>
              </div>
              <div className="space-y-3">
                {globalAlerts.weather.slice(0, 3).map((w) => (
                  <div key={w.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 hover:bg-white/[0.04] transition-colors">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-white uppercase tracking-tight truncate flex-1 leading-none">{w.title}</span>
                       <Badge className="bg-amber-500/10 text-amber-500 text-[8px] border-none px-1.5 py-0">{w.severity}</Badge>
                    </div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose line-clamp-2">{w.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Citizens Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                   <Users size={14} className="text-blue-500" /> Personnel Feed
                </h4>
                <span className="text-[9px] font-black text-slate-600 uppercase italic">Awaiting Sync</span>
              </div>
              <div className="space-y-3">
                {citizens.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                     <Loader2 size={32} className="animate-spin text-blue-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest mt-4">Scanning Grid...</span>
                  </div>
                ) : (
                  citizens.slice(0, 10).map(c => <CitizenListItem key={c.id} citizen={c} />)
                )}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 bg-blue-600 text-white space-y-1">
             <div className="flex items-center gap-3">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Signal Integrity: 100%</span>
             </div>
             <p className="text-[8px] font-black text-blue-200 uppercase tracking-widest italic opacity-50">Operational Node Alpha-9</p>
          </div>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "absolute top-8 transition-all duration-700 z-50 p-2 rounded-xl bg-slate-900 border border-white/10 text-white shadow-2xl hover:bg-blue-600 hover:border-blue-400 group",
            isSidebarOpen ? "right-[19rem]" : "right-8"
          )}
        >
          {isSidebarOpen ? <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />}
        </button>
      </div>

      <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
          }
      `}</style>
    </Card>
  )
}
