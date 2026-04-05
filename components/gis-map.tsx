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
          setIncidents(json.incidents || [])
          setEvents(json.events || [])
          setWeatherConditions(json.weatherConditions || [])

          // Geocode addresses for citizen markers if positions missing
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

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Auto-Center on Admin Location once
  useEffect(() => {
    if (!adminLoc || hasCentered) return

    setMapCenter(adminLoc)
    setHasCentered(true)
  }, [adminLoc, hasCentered])

  const markers = useMemo(() => {
    // Helper to get weather text and color from code
    const getWeatherStyle = (code: number, wind: number) => {
      if (code >= 95) return { title: 'Thunderstorm', color: '#4B0082' }; // Indigo
      if (code >= 71) return { title: 'Snowy', color: '#00FFFF' }; // Cyan/White
      if (code >= 51) return { title: 'Rainy', color: '#0000FF' }; // Blue
      if (wind > 30) return { title: 'Strong Wind', color: '#808080' }; // Grey
      if (wind > 15) return { title: 'Moderate Breeze', color: '#20B2AA' }; // Light Sea Green
      if (code <= 3) return { title: 'Fair / Cloudy', color: '#FFD700' }; // Gold/Yellow
      return { title: 'Clear', color: '#FFD700' };
    };

    const getWeatherText = (code: number) => getWeatherStyle(code, 0).title;

    const userMarkers = citizens
      .filter(c => c.position)
      .map(c => {
        let weatherDesc = '';
        if (c.weather) {
          weatherDesc = ` | Weather: ${Math.round(c.weather.temp)}°C, ${getWeatherText(c.weather.code)}, Wind: ${Math.round(c.weather.wind)}km/h`;
        }

        return {
          id: c.id,
          position: c.position!,
          title: c.name,
          type: 'user' as const,
          isSafe: c.isSafe,
          status: c.isSafe ? 'Safe' : 'Danger',
          description: `Role: ${c.role || 'Citizen'} - Current Location: ${c.location}${weatherDesc}`,
          alerts: c.alerts,
          timestamp: new Date().toISOString() // Current status
        };
      })

    const incidentMarkers = incidents
      .filter(inc => inc.lat && inc.lng)
      .map(inc => ({
        id: inc._id,
        position: { lat: inc.lat!, lng: inc.lng! },
        title: inc.type,
        type: 'incident' as const,
        status: inc.status,
        description: inc.description || `Reported at ${inc.location}`,
        timestamp: inc.timestamp
      }))

    const eventMarkers = events.map(ev => ({
      id: ev._id,
      position: { lat: ev.location.lat, lng: ev.location.lng },
      title: ev.title,
      type: (ev.type === 'earthquake' ? 'earthquake' : 'weather') as any,
      mag: ev.magnitude,
      description: ev.description,
      status: ev.severity,
      radius: ev.type === 'earthquake' ? (ev.magnitude ? ev.magnitude * 10000 : 50000) : 30000,
      timestamp: ev.timestamp
    }))

    const quakeAlertMarkers = globalAlerts.earthquakes.map(eq => {
      const coords = eq.coordinates || { lat: 0, lon: 0 };
      return {
        id: eq.id,
        position: { lat: coords.lat, lng: coords.lon || coords.lng },
        title: eq.title || `Magnitude ${eq.magnitude} Earthquake`,
        type: 'earthquake' as const,
        mag: eq.magnitude,
        description: eq.location || eq.description,
        radius: (eq.magnitude || 5) * 15000,
        status: (eq.magnitude || 0) > 5 ? 'Danger' : 'Advisory',
        timestamp: eq.timestamp
      };
    })

    const weatherAlertMarkers = globalAlerts.weather.map(w => {
      const coords = w.coordinates || { lat: 37.7749, lng: -122.4194 };
      const isTornado = w.title?.toLowerCase().includes('tornado') || w.description?.toLowerCase().includes('tornado');

      return {
        id: w.id,
        position: { lat: coords.lat, lng: coords.lon || coords.lng },
        title: w.title,
        type: 'weather' as const,
        description: w.description,
        status: w.severity,
        radius: isTornado ? 60000 : 40000,
        timestamp: w.timestamp
      };
    })

    const condMarkers = weatherConditions.map(wc => {
      const style = getWeatherStyle(wc.code, wc.wind);
      return {
        id: wc.id,
        position: wc.position,
        title: `${style.title} (${Math.round(wc.temp)}°C)`,
        type: 'condition' as const,
        description: `Current ${style.title}. Wind speed: ${Math.round(wc.wind)} km/h.`,
        color: style.color,
        timestamp: new Date().toISOString()
      };
    })

    const adminMarker = adminLoc ? [{
      id: 'admin-self',
      position: adminLoc,
      title: 'Your Command Post',
      type: 'admin' as const,
      status: 'Online'
    }] : []

    return [
      ...userMarkers,
      ...incidentMarkers,
      ...eventMarkers,
      ...quakeAlertMarkers,
      ...weatherAlertMarkers,
      ...condMarkers,
      ...adminMarker
    ]
  }, [citizens, incidents, events, globalAlerts, weatherConditions, adminLoc])

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
