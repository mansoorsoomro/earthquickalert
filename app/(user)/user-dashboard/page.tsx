'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, MapPin, AlertTriangle, Cloud, Navigation, ShieldCheck, Zap, Info, RefreshCw, Users, UserCheck, UserX, FileText } from 'lucide-react'
import { useAPIAlerts } from '@/lib/hooks/use-api-alerts'
import { AlertCard } from '@/components/alert-card'
import { AlertSource } from '@/lib/types/api-alerts'

import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { useSafety, SafetyStatus } from '@/lib/context/safety-context'
import { SafeCheckInModal } from '@/components/modals/safe-check-in-modal'
import { ResourcesMapSection } from '@/components/resources-map-section'

export default function UserDashboard() {
  const router = useRouter()
  const { location: geoLoc, loading: locLoading, error: locError } = useGeolocation()
  const { myStatus, setMyStatus, familyMembers } = useSafety()

  const [isSafeCheckInOpen, setIsSafeCheckInOpen] = useState(false)

  // Default location (San Francisco) - fallback
  const fallbackLocation = React.useMemo(() => ({ lat: 37.7749, lon: -122.4194 }), [])

  // Use geolocation if available, otherwise fallback
  const userLocation = React.useMemo(() => {
    return geoLoc ? { lat: geoLoc.lat, lon: geoLoc.lng } : fallbackLocation
  }, [geoLoc, fallbackLocation])

  // Fetch all alerts with auto-refresh every 30 seconds
  const { alerts, loading, unreadCount, statistics, refresh } = useAPIAlerts({
    location: userLocation,
    autoRefresh: true,
    refreshInterval: 30000,
  })

  // Separate alerts by source
  const earthquakeAlerts = alerts.filter(a => a.source === AlertSource.EARTHQUAKE_API).slice(0, 3)
  const weatherAlerts = alerts.filter(a => a.source === AlertSource.WEATHER_API).slice(0, 2)
  const adminAlerts = alerts.filter(a => a.source === AlertSource.ADMIN_MANUAL).slice(0, 2)

  // Get weather info from latest weather alert
  const latestWeather = weatherAlerts[0]
  const weatherTemp = latestWeather && 'temperature' in latestWeather ? latestWeather.temperature : 72
  const weatherCondition = latestWeather && 'weatherType' in latestWeather
    ? latestWeather.weatherType.charAt(0).toUpperCase() + latestWeather.weatherType.slice(1)
    : 'Clear'

  // Weather Safety Advice Helper
  const getWeatherAdvice = (condition: string) => {
    const c = condition.toLowerCase()
    if (c.includes('heat')) return 'Excessive Heat: Stay hydrated and avoid outdoor activities.'
    if (c.includes('cold') || c.includes('snow') || c.includes('freeze')) return 'Freezing: Bundle up and check on pets/elderly.'
    if (c.includes('storm') || c.includes('rain') || c.includes('flood')) return 'Stormy: Monitor local alerts and avoid flooded roads.'
    if (c.includes('wind') || c.includes('tornado') || c.includes('hurricane')) return 'High Winds: Secure loose objects and stay indoors.'
    if (c.includes('fire') || c.includes('smoke')) return 'Air Quality: Keep windows closed and avoid exertion.'
    return 'Conditions are stable. Have a great day!'
  }

  const weatherAdvice = getWeatherAdvice(weatherCondition)

  // Safety Status Helpers
  const isSafe = myStatus === 'SAFE'
  const isDanger = myStatus === 'DANGER'
  const familySafeCount = familyMembers.filter(m => m.status === 'SAFE').length
  const allFamilySafe = familySafeCount === familyMembers.length

  return (
    <main className="flex-1 overflow-auto bg-slate-50">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blue Sky Monitoring</h1>
              {geoLoc ? (
                <div className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 italic animate-pulse">
                  <RefreshCw className="w-3 h-3" /> TRAVEL MODE ACTIVE
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200 italic">
                  <AlertTriangle className="w-3 h-3" /> GEOLOCATOR OFF
                </div>
              )}
            </div>
            <p className="text-slate-500">{geoLoc ? `Monitoring current location: San Francisco, CA` : 'Geolocation disabled. Please enable for location-specific alerts.'}</p>
          </div>
          <div className="flex gap-3">
            {locError && (
              <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-4 rounded-xl animate-bounce" onClick={() => window.location.reload()}>
                ENABLE GEOLOCATION
              </Button>
            )}
            <Button variant="outline" className="gap-2 font-bold h-10 px-4 rounded-xl border-slate-200" onClick={() => router.push('/user/plan')}>
              <FileText className="w-4 h-4 text-blue-600" />
              My Emergency Plan
            </Button>
          </div>
        </div>

        {/* Safety & Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* My Safety Status */}
          <Card className={`md:col-span-2 p-6 border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden transition-colors ${isDanger ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-2xl font-extrabold mb-2 ${isDanger ? 'text-red-900' : 'text-slate-900'}`}>
                  {isDanger ? 'Emergency Assistance Requested' : 'Safety Status: Active'}
                </h2>
                {isDanger && <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs animate-pulse">LIVE ALERT</span>}
              </div>
              <p className={`${isDanger ? 'text-red-700' : 'text-slate-500'} mb-6`}>
                {isDanger ? 'Your status is set to "NEED HELP". Location shared with emergency contacts.' : 'Monitoring active. No immediate threats detected in your area.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
              <Button
                className={`h-14 font-bold text-lg shadow-lg rounded-xl transition-all ${isSafe ? 'bg-green-700 ring-4 ring-green-200' : 'bg-green-600 hover:bg-green-700'} text-white`}
                onClick={() => setIsSafeCheckInOpen(true)}
              >
                <UserCheck className="w-6 h-6 mr-2" />
                {isSafe ? 'MARKED SAFE' : 'I AM SAFE'}
              </Button>
              <Button
                className={`h-14 font-bold text-lg shadow-lg rounded-xl transition-all ${isDanger ? 'bg-red-700 ring-4 ring-red-200' : 'bg-red-600 hover:bg-red-700'} text-white`}
                onClick={() => {
                  setMyStatus('DANGER')
                  setIsSafeCheckInOpen(true)
                }}
              >
                <UserX className="w-6 h-6 mr-2" />
                NEED HELP
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Users className="w-4 h-4" />
              {familySafeCount}/{familyMembers.length} Family Members Marked Safe
              <button onClick={() => setIsSafeCheckInOpen(true)} className="ml-auto text-blue-600 hover:underline">View Family Status</button>
            </div>
          </Card>

          {/* Quick Actions / Stats Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget (Simplified) */}
            <Card className="p-5 border-slate-200 shadow-sm rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white relative overflow-hidden">
              <Cloud className="absolute -right-4 -top-4 w-32 h-32 text-white opacity-20" />
              <h3 className="font-bold opacity-90 mb-1">Weather Watch</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black">{weatherTemp}°</span>
                <span className="text-lg font-medium opacity-90 mb-1">{weatherCondition}</span>
              </div>
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-xs font-bold uppercase opacity-70 mb-1">Action Required:</p>
                <p className="text-sm font-medium leading-snug">{weatherAdvice}</p>
              </div>
            </Card>

            <Card className="p-5 border-slate-200 shadow-sm rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Alerts Active</span>
                  <span className="font-bold text-slate-900">{alerts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Geo-Fence</span>
                  <span className="font-bold text-green-600">Active</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  Real-Time Alerts
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">AUTO-REFRESH</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Earthquake Alerts from API */}
                {earthquakeAlerts.length > 0 ? (
                  earthquakeAlerts.map((alert) => (
                    <div key={alert.id} className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-orange-900 text-sm">{alert.title}</h3>
                          <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs font-bold rounded">
                            API
                          </span>
                        </div>
                        <p className="text-xs text-orange-800/80 mt-1">{alert.description}</p>
                        <span className="text-[10px] font-bold text-orange-700 uppercase mt-2 block">
                          {new Date(alert.timestamp).toLocaleTimeString()} • USGS Earthquake API
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center py-8">
                    <p className="text-sm text-slate-400">No recent earthquake activity detected.</p>
                  </div>
                )}

                {/* Weather Alerts from API */}
                {weatherAlerts.length > 0 && (
                  weatherAlerts.map((alert) => (
                    <div key={alert.id} className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Cloud className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-blue-900 text-sm">{alert.title}</h3>
                          <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs font-bold rounded">
                            API
                          </span>
                        </div>
                        <p className="text-xs text-blue-800/80 mt-1">{alert.description}</p>
                        <span className="text-[10px] font-bold text-blue-700 uppercase mt-2 block">
                          {new Date(alert.timestamp).toLocaleTimeString()} • Weather API
                        </span>
                      </div>
                    </div>
                  ))
                )}

                {/* Admin Manual Notifications */}
                {adminAlerts.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-600">Admin Notifications</h3>
                    {adminAlerts.map((alert) => (
                      <div key={alert.id} className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-start gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Bell className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-purple-900 text-sm">{alert.title}</h3>
                            <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs font-bold rounded">
                              ADMIN
                            </span>
                          </div>
                          <p className="text-xs text-purple-800/80 mt-1">{alert.description}</p>
                          <span className="text-[10px] font-bold text-purple-700 uppercase mt-2 block">
                            {new Date(alert.timestamp).toLocaleTimeString()} • Manual Notification
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Resources Map Preview Section */}
            <ResourcesMapSection />

            <section className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Quick Links</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start border-slate-200 text-slate-700 font-bold rounded-xl py-6 hover:bg-slate-50" onClick={() => router.push('/user/plan')}>
                  <Navigation className="w-4 h-4 mr-3 text-slate-400" />
                  My Evacuation Plan
                </Button>
                <Button variant="outline" className="justify-start border-slate-200 text-slate-700 font-bold rounded-xl py-6 hover:bg-slate-50">
                  <Info className="w-4 h-4 mr-3 text-slate-400" />
                  Preparedness Guide
                </Button>
              </div>
            </section>
          </div>

        </div>
      </div>

      {/* Modals */}
      <SafeCheckInModal
        isOpen={isSafeCheckInOpen}
        onClose={() => setIsSafeCheckInOpen(false)}
      />
    </main>
  )
}
