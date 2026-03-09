'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowRight, Users, Star, MapPin, Home, Briefcase,
  Map, Hospital, Pill, Bed, Coffee, DollarSign, Car,
  Cloud, ChevronRight, Activity, CloudFog, CloudLightning,
  AlertTriangle, Navigation, RefreshCw, UserCheck, ShieldCheck, Zap, UserX, Phone, LogOut, Heart, Loader2, MapPinOff
} from 'lucide-react'
import Image from 'next/image'
import { useSafety } from '@/lib/context/safety-context'
import { cn } from '@/lib/utils'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { weatherAPI } from '@/lib/services/weather-api'
import { alertProcessor } from '@/lib/services/alert-processor'
import { openaiService, type EmergencyInsights } from '@/lib/services/openai-service'
import { fetchNearbyResources } from '@/lib/services/places-service'
import { reverseGeocode } from '@/lib/services/mock-map-service'
import { type WeatherData, type EmergencyResource } from '@/lib/types/emergency'
import { AlertSource } from '@/lib/types/api-alerts'

export default function VirtualEOCPage() {
  const router = useRouter()
  const { location: geoLoc, loading: locLoading } = useGeolocation()
  const { myStatus, updateMyStatus } = useSafety()

  const [geoLocName, setGeoLocName] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [earthquakes, setEarthquakes] = useState<any[]>([])
  const [emergencyInsights, setEmergencyInsights] = useState<EmergencyInsights>({
    status: 'All Clear',
    message: 'Critical life-safety information and resources for your area — updated in real time',
    recommendations: []
  })
  const [resources, setResources] = useState<{
    hospitals: EmergencyResource[],
    lodging: EmergencyResource[],
    food: EmergencyResource[],
    gas: EmergencyResource[]
  }>({
    hospitals: [],
    lodging: [],
    food: [],
    gas: []
  })
  const [loading, setLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    const initEOC = async () => {
      if (locLoading || !geoLoc) return

      const { lat, lng } = geoLoc

      try {
        setLoading(true)

        // 1. Fetch Location Name
        const name = await reverseGeocode(lat, lng)
        setGeoLocName(name)

        // 2. Fetch Real-time Weather & Earthquake Data
        const [wData, eqAlerts] = await Promise.all([
          weatherAPI.fetchFullWeatherData(lat, lng),
          alertProcessor.fetchAllAlerts({ lat, lon: lng }, [AlertSource.EARTHQUAKE_API])
        ])

        setWeatherData(wData)
        setEarthquakes(eqAlerts)

        // 3. Fetch Dynamic Content from OpenAI & Resources
        const [insights, hospitals, lodging, food, gas] = await Promise.all([
          openaiService.generateEmergencyInsights(wData, eqAlerts),
          fetchNearbyResources(lat, lng, 'hospital'),
          fetchNearbyResources(lat, lng, 'lodging'),
          fetchNearbyResources(lat, lng, 'food'),
          fetchNearbyResources(lat, lng, 'gas')
        ])

        if (insights) setEmergencyInsights(insights)
        setResources({
          hospitals: hospitals || [],
          lodging: lodging || [],
          food: food || [],
          gas: gas || []
        })

      } catch (error) {
        console.error("Failed to initialize dynamic EOC:", error)
      } finally {
        setLoading(false)
      }
    }

    initEOC()
  }, [locLoading, geoLoc])

  const handleUpdateStatus = async (status: 'SAFE' | 'DANGER') => {
    setIsUpdatingStatus(true)
    await updateMyStatus(status)
    setIsUpdatingStatus(false)
    if (status === 'SAFE') {
      router.push('/user-dashboard')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push('/login')
  }

  const quantifiedResources = [
    { label: 'Pop-up Medical Clinics', count: `${resources.hospitals.length} locations`, icon: UserCheck, color: 'text-blue-500' },
    { label: 'Private and Non-Profit Sector', count: '7 locations', icon: Briefcase, color: 'text-yellow-500' },
    { label: 'FEMA Assistance Booths', count: '2 locations', icon: ShieldCheck, color: 'text-green-500' },
    { label: 'Red Cross Stations', count: `${resources.hospitals.length > 0 ? 5 : 0} locations`, icon: Activity, color: 'text-red-500' },
    { label: 'Family Reunification', count: '1 location', icon: Users, color: 'text-purple-500' }
  ]

  const activeAlert = useMemo(() => {
    if (weatherData?.alerts && weatherData.alerts.length > 0) {
      return {
        title: weatherData.alerts[0].headline,
        description: weatherData.alerts[0].description,
        type: 'Weather',
        severity: weatherData.alerts[0].severity
      }
    }
    if (earthquakes && earthquakes.length > 0) {
      return {
        title: `Earthquake: Magnitude ${earthquakes[0].magnitude}`,
        description: `Detected at ${earthquakes[0].location}`,
        type: 'Earthquake',
        severity: earthquakes[0].magnitude > 5 ? 'extreme' : 'moderate'
      }
    }
    return null
  }, [weatherData, earthquakes])

  return (
    <main className="flex-1 overflow-auto bg-white py-8 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto w-full space-y-8">

        {!geoLoc && !locLoading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <MapPinOff className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-black text-red-900 mb-1">Location Access Required</h3>
              <p className="text-sm font-medium text-red-700 leading-relaxed">
                To provide real-time weather alerts and emergency insights for your area, please enable location services in your browser.
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-red-100 shrink-0"
            >
              Retry Connection
            </Button>
          </div>
        )}

        {/* Banner Section */}
        <div className={cn(
          "relative h-[200px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 transition-colors duration-500",
          emergencyInsights.status === 'Emergency' ? "bg-red-600" :
            emergencyInsights.status === 'Warning' ? "bg-orange-500" :
              "bg-slate-900"
        )}>
          {emergencyInsights.status === 'All Clear' && (
            <Image
              src="/banner_bg.png"
              alt="Virtual EOC Background"
              fill
              className="object-cover brightness-50"
            />
          )}
          <div className="absolute inset-0 p-10 flex flex-col justify-center text-white z-10">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Virtual Emergency Operations Center</h1>
            <p className="text-base opacity-85 max-w-2xl font-medium">{emergencyInsights.message}</p>
          </div>
          <div className="absolute bottom-8 right-10 flex items-center gap-6 z-20">
            <div className={cn(
              "flex items-center gap-2.5 backdrop-blur-xl px-4 py-1.5 rounded-full border shadow-inner",
              emergencyInsights.status === 'Emergency' ? "bg-red-400/20 border-red-400/30" :
                emergencyInsights.status === 'Warning' ? "bg-orange-400/20 border-orange-400/30" :
                  "bg-white/20 border-white/30"
            )}>
              <div className={cn(
                "w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]",
                emergencyInsights.status === 'Emergency' ? "bg-red-400" :
                  emergencyInsights.status === 'Warning' ? "bg-orange-400" :
                    "bg-green-400"
              )}></div>
              <span className="text-[11px] font-black uppercase tracking-widest text-white">{emergencyInsights.status}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-0.5">Last Updated</p>
              <p className="text-xs font-black text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        {/* Hurricane Alert Section */}
        {activeAlert ? (
          <div className={cn(
            "rounded-[2.5rem] border-l-[8px] border border-slate-100 p-8 shadow-sm relative",
            activeAlert.severity === 'extreme' ? "bg-red-50 border-l-red-500" : "bg-white border-l-orange-500"
          )}>
            <div className="absolute top-8 right-8">
              <Button
                onClick={() => handleUpdateStatus('SAFE')}
                disabled={isUpdatingStatus || myStatus === 'SAFE'}
                className={cn(
                  "px-8 py-6 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95",
                  myStatus === 'SAFE'
                    ? "bg-green-500 hover:bg-green-600 text-white cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : myStatus === 'SAFE' ? (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Verified Safe
                  </>
                ) : (
                  "I Am Safe"
                )}
              </Button>
            </div>
            <div className="space-y-6">
              <div className="pr-48">
                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{activeAlert.title}</h2>
                <p className="text-sm text-slate-500 max-w-4xl leading-relaxed font-medium">
                  {activeAlert.description}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-sm">
                    <UserX className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest">Evacuate</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Listen to local authorities</p>
                </div>
                <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4 shadow-sm">
                    <Home className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest italic">Shelter</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">If re-entry is prohibited</p>
                </div>
                <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500 mb-4 shadow-sm">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest">Road Status</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Check local closures</p>
                </div>
                <div className="p-5 rounded-3xl border border-slate-50 bg-slate-50/40 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-4 shadow-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-widest italic">Power Status</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Report outages</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border-l-[8px] border-l-blue-500 border border-slate-100 p-8 shadow-sm relative">
            <div className="absolute top-8 right-8">
              <Button
                onClick={() => handleUpdateStatus('SAFE')}
                disabled={isUpdatingStatus || myStatus === 'SAFE'}
                className={cn(
                  "px-8 py-6 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95",
                  myStatus === 'SAFE'
                    ? "bg-green-500 hover:bg-green-600 text-white cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : myStatus === 'SAFE' ? (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Verified Safe
                  </>
                ) : (
                  "I Am Safe"
                )}
              </Button>
            </div>
            <div className="pr-48">
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Area Status: Normal</h2>
              <p className="text-sm text-slate-500 max-w-4xl leading-relaxed font-medium">
                No major emergency alerts for your current location. Stay informed by checking real-time updates below.
              </p>
            </div>
          </div>
        )}

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
                <button
                  onClick={() => router.push('/user/resources?type=hospital')}
                  className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all text-left bg-white group shadow-sm"
                >
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
                <button
                  onClick={() => router.push('/user/resources?type=lodging')}
                  className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all text-left bg-white group shadow-sm"
                >
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
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-7xl font-black tracking-tighter mb-1">{weatherData?.current.temp || '72'}°F</h3>
                      <p className="text-[15px] font-black text-slate-400 uppercase tracking-widest italic">{weatherData?.current.condition || 'Partly Cloudy'}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/10 shadow-inner">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Active Alerts</span>
                        <span className={cn(
                          "px-3 py-1 rounded text-[9px] font-black italic tracking-widest border",
                          emergencyInsights.status === 'Emergency' ? "bg-red-400/20 text-red-300 border-red-400/20" :
                            emergencyInsights.status === 'Warning' ? "bg-orange-400/20 text-orange-300 border-orange-400/20" :
                              "bg-green-400/20 text-green-300 border-green-400/20"
                        )}>
                          {emergencyInsights.status === 'Emergency' ? 'DANGER' : emergencyInsights.status === 'Warning' ? 'CAUTION' : 'CLEAR'}
                        </span>
                      </div>
                      <ul className="space-y-3 text-[11px] text-slate-300 font-bold tracking-tight">
                        {weatherData?.alerts.length ? weatherData.alerts.slice(0, 3).map((alert, i) => (
                          <li key={i} className="flex gap-2 leading-tight uppercase tracking-tight"><span>•</span> {alert.headline}</li>
                        )) : (
                          <li className="flex gap-2 leading-tight uppercase tracking-tight italic"><span>•</span> Your area is currently clear of weather alerts.</li>
                        )}
                        {earthquakes.length > 0 && (
                          <li key="eq" className="flex gap-2 leading-tight uppercase tracking-tight italic"><span>•</span> Recent seismic activity detected nearby.</li>
                        )}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-3xl p-6 text-slate-800 text-center flex flex-col items-center justify-center aspect-square shadow-lg group-hover:bg-slate-50 transition-colors">
                        <CloudFog className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Visibility</p>
                        <p className="text-sm font-black tracking-tighter italic">{weatherData?.current.visibility || '10'} miles</p>
                      </div>
                      <div className="bg-white rounded-3xl p-6 text-slate-800 text-center flex flex-col items-center justify-center aspect-square shadow-lg group-hover:bg-slate-50 transition-colors">
                        <CloudLightning className="w-6 h-6 text-slate-500 mb-2" />
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Wind Speed</p>
                        <p className="text-sm font-black tracking-tighter italic">{weatherData?.current.windSpeed || '5'} mph</p>
                      </div>
                    </div>
                  </>
                )}
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
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                ) : resources.lodging.length > 0 ? resources.lodging.slice(0, 3).map((hotel, i) => (
                  <div key={i} className="flex justify-between items-center text-[13px] group cursor-pointer">
                    <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors line-clamp-1">{hotel.name}</span>
                    <span className="text-green-500 font-black text-[10px] uppercase tracking-widest italic">Available</span>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-400 uppercase font-black italic">Searching locations...</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
                <Coffee className="w-5 h-5 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest">Food & Essentials</h3>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                ) : resources.food.length > 0 ? resources.food.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[13px] group cursor-pointer">
                    <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors line-clamp-1">{item.name}</span>
                    <span className="text-green-500 font-black text-[10px] uppercase tracking-widest italic">Open</span>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-400 uppercase font-black italic">Searching locations...</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
                <Car className="w-5 h-5 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest">Gas Stations</h3>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                ) : resources.gas.length > 0 ? resources.gas.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[13px] group cursor-pointer">
                    <span className="text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-900 transition-colors line-clamp-1">{item.name}</span>
                    <span className="text-green-500 font-black text-[10px] uppercase tracking-widest italic">Fuel Available</span>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-400 uppercase font-black italic">Searching locations...</p>
                )}
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
            <button
              onClick={() => router.push('https://www.fema.gov/assistance')}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#ef4444] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#f87171] transition-all shadow-lg active:scale-95 italic"
            >
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