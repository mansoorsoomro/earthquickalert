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
  Loader2
} from 'lucide-react'
import { GoogleMap } from '@/components/google-map'
import { cn } from '@/lib/utils'
import { geocodeAddress, reverseGeocode } from '@/lib/services/mock-map-service'
import { useGeolocation } from '@/lib/hooks/use-geolocation'

interface CitizenLocation {
  id: string
  name: string
  location: string
  isSafe: boolean
  alerts: any[]
  position?: { lat: number; lng: number }
}

export function GISMap() {
  const [citizens, setCitizens] = useState<CitizenLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [globalAlerts, setGlobalAlerts] = useState<{ earthquakes: any[], weather: any[] }>({ earthquakes: [], weather: [] })
  const [adminAddress, setAdminAddress] = useState<string>('')
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined)
  const [hasCentered, setHasCentered] = useState(false)

  const { location: adminLoc } = useGeolocation()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/admin/citizens/locations')
        const json = await res.json()
        if (json.success) {
          const citizenData = json.data as CitizenLocation[]

          // Geocode addresses for map markers
          const withPositions = await Promise.all(citizenData.map(async (c) => {
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

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Resolve Admin Address & Auto-Center
  useEffect(() => {
    if (!adminLoc) return

    const resolveAdminData = async () => {
      try {
        const address = await reverseGeocode(adminLoc.lat, adminLoc.lng)
        if (address) setAdminAddress(address)

        if (!hasCentered) {
          setMapCenter(adminLoc)
          setHasCentered(true)
        }
      } catch (e) {
        console.error("Failed to resolve admin location:", e)
      }
    }
    resolveAdminData()
  }, [adminLoc, hasCentered, reverseGeocode])

  const markers = useMemo(() => {
    const userMarkers = citizens
      .filter(c => c.position)
      .map(c => ({
        id: c.id,
        position: c.position!,
        title: c.name,
        type: 'user' as const,
        isSafe: c.isSafe
      }))

    const adminMarker = adminLoc ? [{
      id: 'admin-self',
      position: adminLoc,
      title: `You (Admin)${adminAddress ? ` - ${adminAddress}` : ''}`,
      type: 'admin' as const
    }] : []

    return [...userMarkers, ...adminMarker]
  }, [citizens, adminLoc, adminAddress])

  const CitizenAlertItem = ({ citizen }: { citizen: CitizenLocation }) => (
    <div className={cn(
      "p-3 rounded-xl border transition-all duration-300",
      citizen.isSafe ? "bg-white border-slate-100" : "bg-red-50 border-red-100 shadow-sm shadow-red-50"
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            citizen.isSafe ? "bg-green-500" : "bg-red-500 animate-pulse"
          )} />
          <span className="font-black text-slate-900 text-[10px] uppercase tracking-tighter">{citizen.name}</span>
        </div>
        <Badge className={cn(
          "text-[7px] font-black uppercase tracking-tighter border-none px-1.5 py-0",
          citizen.isSafe ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {citizen.isSafe ? 'Secure' : 'Needs Help'}
        </Badge>
      </div>
      <p className="text-[9px] font-bold text-slate-500 line-clamp-1 flex items-center gap-1">
        <Navigation className="w-2.5 h-2.5 text-blue-500" />
        {citizen.location}
      </p>
      {citizen.alerts.length > 0 && (
        <div className="mt-2 space-y-1">
          {citizen.alerts.map((a, i) => (
            <div key={i} className="text-[8px] font-black text-red-600 bg-red-100/50 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase">
              <AlertTriangle className="w-2.5 h-2.5" /> {a.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white h-[600px] flex flex-col relative">
      {/* Header Area */}
      <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-center transition-all">
        <h2 className="text-xl font-bold text-slate-900">GIS Impact Map</h2>
        <div className="flex gap-6">
          {['Citizens', 'Responders', 'City Leaders', 'Infrastructure'].map((tab) => (
            <button
              key={tab}
              className={cn(
                "text-xs font-bold transition-colors",
                tab === 'Citizens' ? "text-blue-500" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Map Section */}
        <div className="flex-1 relative">
          <GoogleMap markers={markers} zoom={11} center={mapCenter} />

          {/* Admin Recenter Button */}
          {adminLoc && (
            <button
              onClick={() => setMapCenter(adminLoc)}
              className="absolute bottom-16 right-4 z-30 bg-white shadow-xl rounded-2xl h-10 px-4 flex items-center gap-2 border border-slate-100 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-tighter text-slate-900"
            >
              <Navigation className="w-3 h-3 text-blue-600" />
              Recenter on Me
            </button>
          )}
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 transition-all duration-500 z-30 shadow-2xl rounded-2xl h-10 w-10 flex items-center justify-center",
            "bg-white hover:bg-slate-50 border border-slate-100 text-slate-900 group/btn",
            isSidebarOpen ? "right-[21rem]" : "right-4"
          )}
        >
          {isSidebarOpen ? <ChevronRight className="w-5 h-5 group-hover/btn:scale-110 transition-transform" /> : <ChevronLeft className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />}
        </button>

        {/* Tactical Intel Sidebar */}
        <div className={cn(
          "w-80 bg-slate-50/50 backdrop-blur-xl border-l border-slate-100 flex flex-col transition-all duration-500 overflow-hidden relative z-20",
          isSidebarOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none w-0"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white flex flex-col gap-1 bg-white/40">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Shield className="w-3 h-3 text-blue-600" /> Tactical Intel
            </h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em]">Real-time Status Feed</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Hazards Summary */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-orange-500" /> Seismic Feed
                </h4>
                <span className="text-[8px] font-bold text-slate-300 uppercase">{globalAlerts.earthquakes.length} Events</span>
              </div>
              <div className="space-y-2">
                {globalAlerts.earthquakes.slice(0, 3).map((eq, i) => (
                  <div key={eq.id} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-slate-900 text-[10px] uppercase truncate flex-1">{eq.location}</span>
                      <span className="text-[9px] font-black text-orange-600 ml-2">M{eq.magnitude.toFixed(1)}</span>
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(eq.timestamp).toLocaleTimeString()} • {eq.depth}KM DEPTH
                    </p>
                  </div>
                ))}
                {globalAlerts.earthquakes.length === 0 && (
                  <p className="text-[9px] font-bold text-slate-400 italic text-center py-2 uppercase">No seismic events</p>
                )}
              </div>
            </div>

            {/* Weather Feed */}
            <div className="space-y-3 pt-2 border-t border-white">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Cloud className="w-3 h-3 text-blue-500" /> Weather Feed
                </h4>
                <span className="text-[8px] font-bold text-slate-300 uppercase">{globalAlerts.weather.length} Alerts</span>
              </div>
              <div className="space-y-2">
                {globalAlerts.weather.slice(0, 3).map((w, i) => (
                  <div key={w.id} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-slate-900 text-[10px] uppercase truncate flex-1">{w.title}</span>
                      <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{w.severity}</span>
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-2">
                      {w.description}
                    </p>
                  </div>
                ))}
                {globalAlerts.weather.length === 0 && (
                  <p className="text-[9px] font-bold text-slate-400 italic text-center py-2 uppercase">No active weather alerts</p>
                )}
              </div>
            </div>

            {/* Citizen States */}
            <div className="space-y-3 pt-2 border-t border-white">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-blue-500" /> Citizen Priority
                </h4>
                <span className="text-[8px] font-bold text-slate-300 uppercase">Awaiting Refresh</span>
              </div>
              <div className="space-y-3">
                {citizens.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <span className="text-[8px] font-black uppercase">Scanning Citizens...</span>
                  </div>
                ) : (
                  citizens.map(citizen => <CitizenAlertItem key={citizen.id} citizen={citizen} />)
                )}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-4 bg-slate-900 text-white flex flex-col gap-1 rounded-tl-2xl">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3 h-3 text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Network Secure</span>
            </div>
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.2em]">Operational Command Center v1.0</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(203, 213, 225, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.5);
                }
            `}</style>
    </Card>
  )
}
