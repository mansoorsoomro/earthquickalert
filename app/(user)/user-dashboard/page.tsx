'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, MapPin, MapPinOff, AlertTriangle, Cloud, Navigation, ShieldCheck, Zap, Info, RefreshCw, Users, UserCheck, UserX, FileText } from 'lucide-react'
import Link from 'next/link'
import { useAPIAlerts } from '@/lib/hooks/use-api-alerts'
import { AlertSource, EarthquakeAlert, WeatherAlert } from '@/lib/types/api-alerts'

import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { useSafety } from '@/lib/context/safety-context'
import { SafeCheckInModal } from '@/components/modals/safe-check-in-modal'
import { ResourcesMapSection } from '@/components/resources-map-section'
import { geocodeAddress, reverseGeocode } from '@/lib/services/mock-map-service'
import { cn } from '@/lib/utils'

export default function UserDashboard() {
  const router = useRouter()
  const { location: geoLoc, loading: locLoading, error: locError } = useGeolocation()
  const {
    myStatus,
    updateMyStatus,
    familyMembers,
    verifyFamilySafety,
    loading: safetyLoading,
    syncLocation,
    isSyncing,
    lastSyncedLocation,
    lastSyncedTime
  } = useSafety()

  const [isSafeCheckInOpen, setIsSafeCheckInOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<{ name: string, email: string, location: string } | null>(null)
  const [isInitializingProfile, setIsInitializingProfile] = useState(true)
  const [resolvedLocation, setResolvedLocation] = useState<{ lat: number, lon: number } | undefined>(undefined)
  const [geoLocName, setGeoLocName] = useState<string | null>(null)

  // Default location (San Francisco) - fallback
  const fallbackLocation = useMemo(() => ({ lat: 37.7749, lon: -122.4194 }), [])

  // Load profile and check location on mount
  useEffect(() => {
    const name = localStorage.getItem('userName') || ''
    const email = localStorage.getItem('userEmail') || ''
    const location = localStorage.getItem('userLocation') || ''

    setUserProfile({ name, email, location })

    setUserProfile({ name, email, location })

    // Trigger individual safety verification for family members on dashboard mount
    verifyFamilySafety()
    setIsInitializingProfile(false)
  }, [verifyFamilySafety])

  // Use geolocation if available, otherwise use saved location (geocoded), else fallback
  useEffect(() => {
    const fetchLocation = async () => {
      if (isInitializingProfile || locLoading) return // Wait for true location source

      if (geoLoc) {
        setResolvedLocation({ lat: geoLoc.lat, lon: geoLoc.lng })
        try {
          const name = await reverseGeocode(geoLoc.lat, geoLoc.lng)
          setGeoLocName(name)
        } catch (error) {
          console.error("Failed to reverse geocode live location:", error)
        }
        return
      }

      setResolvedLocation(fallbackLocation)
    }

    fetchLocation()
  }, [isInitializingProfile, locLoading, geoLoc, userProfile?.location, fallbackLocation])

  // Fetch all alerts with auto-refresh every 30 seconds
  const { alerts, loading, unreadCount, refresh } = useAPIAlerts({
    location: resolvedLocation,
    autoRefresh: true,
    refreshInterval: 30000,
  })

  const isContextLoading = isInitializingProfile || locLoading || loading

  // Separate alerts by source
  const earthquakeAlerts = alerts.filter(a => a.source === AlertSource.EARTHQUAKE_API).slice(0, 5)
  const weatherAlerts = alerts.filter(a => a.source === AlertSource.WEATHER_API).slice(0, 3)
  const adminAlerts = alerts.filter(a => a.source === AlertSource.ADMIN_MANUAL).slice(0, 2)

  // Get weather info from latest weather alert
  const latestWeather = weatherAlerts[0]
  const weatherTemp = latestWeather && 'temperature' in latestWeather ? (latestWeather as any).temperature : 72
  const weatherCondition = latestWeather && 'weatherType' in latestWeather
    ? (latestWeather as any).weatherType.charAt(0).toUpperCase() + (latestWeather as any).weatherType.slice(1)
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
  const isSafe = myStatus === 'SAFE' || myStatus === 'true'
  const isDanger = myStatus === 'DANGER' || myStatus === 'false'

  // Automated Safety Check for Dashboard
  const familySafeCount = useMemo(() => {
    return familyMembers.filter(member => {
      return member.status === 'SAFE' || member.status === 'true'
    }).length
  }, [familyMembers])

  const allFamilySafe = familyMembers.length > 0 && familySafeCount === familyMembers.length

  // Global Risk Reasons for Dashboard (Derived from individual verified statuses)
  const activeRisks = useMemo(() => {
    const risks = new Set<string>()
    familyMembers.forEach(m => {
      if ((m.status === 'false' || m.status === 'DANGER') && m.statusReason) {
        risks.add(m.statusReason)
      }
    })
    return Array.from(risks).join(' & ')
  }, [familyMembers])

  return (
    <main className="flex-1 overflow-auto bg-slate-50 relative">

      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personal Safety Portal</h1>
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
            <p className="text-slate-500 font-medium">
              Welcome back, <span className="font-bold text-slate-900 capitalize">{userProfile?.name}</span>! Monitoring {geoLoc ? `Live: ${geoLocName || `${geoLoc.lat.toFixed(4)}, ${geoLoc.lng.toFixed(4)}`}` : userProfile?.location || 'your area'}.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className={cn(
                "gap-2 font-bold h-10 px-4 rounded-xl border-slate-200 bg-white shadow-sm transition-all",
                isSyncing && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => syncLocation()}
              disabled={isSyncing || !geoLoc}
            >
              <RefreshCw className={cn("w-4 h-4 text-green-600", isSyncing && "animate-spin")} />
              {isSyncing ? "Syncing..." : "Sync Live Location"}
            </Button>
            <Button variant="outline" className="gap-2 font-bold h-10 px-4 rounded-xl border-slate-200 bg-white shadow-sm" onClick={() => router.push('/user/plan')}>
              <FileText className="w-4 h-4 text-blue-600" />
              My Emergency Plan
            </Button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {lastSyncedTime && (
          <div className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <Navigation className="w-3 h-3" />
            Last Shared with Command Center: {lastSyncedTime.toLocaleTimeString()} ({lastSyncedLocation})
          </div>
        )}

        {/* Location Denied Alert Banner */}
        {!geoLoc && !locLoading && locError && (
          <div className="flex items-start gap-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-4 shadow-sm">
            <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
              <MapPinOff className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm uppercase tracking-wide">Location Access Denied</p>
              <p className="text-xs font-medium text-amber-800 mt-0.5">
                Emergency Context and Resources Map are using your saved address instead of your live GPS position.
                For accurate nearby resources and alerts, please enable location access in your browser.
              </p>
            </div>
            <button
              onClick={() => {
                // Re-request permission by triggering the browser prompt
                navigator.geolocation?.getCurrentPosition(() => window.location.reload(), () => { })
              }}
              className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              Enable Location
            </button>
          </div>
        )}

        {/* Safety & Status Section (Main Content) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* My Safety Status */}
          <Card className={`md:col-span-3 p-8 border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden transition-colors ${isDanger ? 'bg-red-50 border-red-200' : 'bg-white rounded-3xl'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-2xl font-extrabold mb-2 ${isDanger ? 'text-red-900' : 'text-slate-900'}`}>
                  {isDanger ? 'Emergency Assistance Requested' : 'Safety Check-In'}
                </h2>
                {isDanger && <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs animate-pulse">LIVE ALERT</span>}
              </div>
              <p className={`${isDanger ? 'text-red-700' : 'text-slate-500'} mb-6 font-medium`}>
                {isDanger ? 'Your status is set to "NEED HELP". Location shared with emergency contacts.' : 'Are you safe? Check in to notify your emergency contacts and community.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
              <Button
                className={`h-14 font-black text-lg shadow-lg rounded-2xl transition-all ${isSafe ? 'bg-green-700 ring-4 ring-green-200' : 'bg-green-600 hover:bg-green-700'} text-white`}
                onClick={() => setIsSafeCheckInOpen(true)}
              >
                <UserCheck className="w-6 h-6 mr-2" />
                {isSafe ? 'MARKED SAFE' : 'I AM SAFE'}
              </Button>
              <Button
                className={`h-14 font-black text-lg shadow-lg rounded-2xl transition-all ${isDanger ? 'bg-red-700 ring-4 ring-red-200' : 'bg-red-600 hover:bg-red-700'} text-white`}
                onClick={() => {
                  updateMyStatus('DANGER')
                  setIsSafeCheckInOpen(true)
                }}
              >
                <UserX className="w-6 h-6 mr-2" />
                NEED HELP
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Users className="w-4 h-4" />
              {safetyLoading ? (
                <span className="animate-pulse">Loading contacts...</span>
              ) : (
                <>
                  {familySafeCount}/{familyMembers.length} Family Members Marked Safe
                </>
              )}
              <span className={`ml-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border flex items-center gap-1 ${allFamilySafe ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {allFamilySafe ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                Status: {allFamilySafe ? 'true' : 'false'}
                {!allFamilySafe && activeRisks && (
                  <span className="ml-1 border-l border-red-200 pl-1">
                    ({activeRisks})
                  </span>
                )}
              </span>
              <Link href="/user/are-we-safe" className="ml-auto text-blue-600 hover:underline">See Details</Link>
            </div>
          </Card>

          {/* Redesigned Info Sections */}
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                  <Bell className="w-5 h-5 text-[#34385E]" />
                  Emergency Context
                </h2>
                {loading && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> SYNCING DATA...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Earthquake Feature */}
                <Card className="p-5 border-slate-200 shadow-sm rounded-2xl bg-white border-t-4 border-t-orange-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <Zap className="w-6 h-6 text-orange-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seismic Activity</span>
                  </div>

                  {isContextLoading && earthquakeAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in">
                      <div className="w-8 h-8 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Scanning local faults...
                      </span>
                    </div>
                  ) : earthquakeAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {earthquakeAlerts.map(alert => {
                        const eq = alert as any;
                        return (
                          <div key={alert.id} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-[13px] font-black text-slate-900 leading-tight line-clamp-1">{eq.location || eq.title}</p>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${eq.magnitude >= 5 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                M{eq.magnitude?.toFixed(1) || '?.?'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Depth: {eq.depth?.toFixed(1) || '0'}km
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {eq.tsunami && (
                              <div className="mt-2 text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-wider flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Tsunami Advisory
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-xs font-bold text-slate-400 italic">No significant activity detected</p>
                    </div>
                  )}
                </Card>

                {/* Weather Feature */}
                <Card className="p-5 border-slate-200 shadow-sm rounded-2xl bg-white border-t-4 border-t-blue-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <Cloud className="w-6 h-6 text-blue-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Local Conditions</span>
                  </div>

                  {isContextLoading && !latestWeather ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in">
                      <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Checking local weather...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-end gap-1">
                            <span className="text-4xl font-black text-slate-900 leading-none">{weatherTemp}°</span>
                            <span className="text-sm font-bold text-slate-500 mb-1">C</span>
                          </div>
                          <span className="text-xs font-black text-blue-600 uppercase tracking-tight">{weatherCondition}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-slate-400 uppercase">Humidity</div>
                          <div className="text-sm font-bold text-slate-900">{(latestWeather as any)?.humidity || 0}%</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Wind</p>
                          <p className="text-xs font-bold text-slate-700">{(latestWeather as any)?.windSpeed || 0} km/h</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Precip</p>
                          <p className="text-xs font-bold text-slate-700">{(latestWeather as any)?.precipitation || 0} mm</p>
                        </div>
                      </div>

                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        <p className="text-[9px] font-black text-blue-700 uppercase mb-1">Safety Advisory:</p>
                        <p className="text-xs font-bold text-blue-900 leading-snug">{weatherAdvice}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* General API Alerts List */}
              <div className="space-y-3">
                {weatherAlerts.length > 0 && weatherAlerts.map((alert) => (
                  <div key={alert.id} className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-4 transition-all hover:bg-blue-50">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Cloud className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-blue-900 text-sm">{alert.title}</h3>
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-[10px] font-black rounded uppercase tracking-wider">WEATHER</span>
                      </div>
                      <p className="text-xs text-blue-800/80 mt-1 font-medium">{alert.description}</p>
                    </div>
                  </div>
                ))}

                {adminAlerts.length > 0 && adminAlerts.map((alert) => (
                  <div key={alert.id} className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl flex items-start gap-4 transition-all hover:bg-purple-50">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-purple-900 text-sm">{alert.title}</h3>
                        <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-[10px] font-black rounded uppercase tracking-wider">ADMIN</span>
                      </div>
                      <p className="text-xs text-purple-800/80 mt-1 font-medium italic">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* <Card className="p-5 border-slate-200 shadow-sm rounded-2xl bg-white border-t-4 border-t-green-500">
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Network Integrity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-500">ACTIVE ALERTS</span>
                  <span className="font-black text-sm text-slate-900">{alerts.length}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-500">GEO-FENCE</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-black text-sm text-green-600">SECURE</span>
                  </div>
                </div>
              </div>
            </Card> */}

            <ResourcesMapSection
              location={resolvedLocation ? { lat: resolvedLocation.lat, lng: resolvedLocation.lon } : null}
            />

            {/* <section className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quick Links</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start border-slate-200 text-slate-900 font-black rounded-2xl py-7 hover:bg-slate-50 bg-white" onClick={() => router.push('/user/plan')}>
                  <Navigation className="w-5 h-5 mr-3 text-blue-500" />
                  Evacuation Plan
                </Button>
                <Button variant="outline" className="justify-start border-slate-200 text-slate-900 font-black rounded-2xl py-7 hover:bg-slate-50 bg-white">
                  <Info className="w-5 h-5 mr-3 text-slate-400" />
                  Resources
                </Button>
              </div>
            </section> */}
          </div>

        </div>
      </div >

      {/* Modals */}
      < SafeCheckInModal
        isOpen={isSafeCheckInOpen}
        onClose={() => setIsSafeCheckInOpen(false)
        }
      />
    </main >
  )
}
