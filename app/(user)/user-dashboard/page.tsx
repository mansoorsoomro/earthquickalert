'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, MapPin, AlertTriangle, Cloud, Navigation, ShieldCheck, Zap, Info } from 'lucide-react'
import { getLatestEarthquakes, getWeatherData } from '@/lib/api-service'

export default function UserDashboard() {
  const router = useRouter()
  const [quakes, setQuakes] = useState<any[]>([])
  const [weather, setWeather] = useState({ temp: 72, condition: 'Clear' })

  useEffect(() => {
    async function fetchData() {
      const quakeData = await getLatestEarthquakes()
      setQuakes(quakeData.slice(0, 3))

      const weatherData = await getWeatherData(37.7749, -122.4194)
      if (weatherData) {
        setWeather(weatherData)
      }
    }
    fetchData()
  }, [])

  return (
    <main className="flex-1 overflow-auto bg-slate-50">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8">

        {/* Simple Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hazard Portal</h1>
            <p className="text-slate-500 text-lg">Your central hub for earthquake alerts and weather safety monitoring.</p>
            <div className="flex gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-6 rounded-xl shadow-lg shadow-blue-200">
                <ShieldCheck className="w-5 h-5 mr-2" />
                I AM SAFE
              </Button>
              <Button variant="outline" className="font-bold px-6 py-6 rounded-xl border-slate-200">
                REPORT HAZARD
              </Button>
            </div>
          </div>
          <div className="w-full md:w-64 aspect-square bg-blue-50 rounded-2xl flex items-center justify-center p-8">
            <div className="text-center">
              <Cloud className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-2xl font-bold text-slate-900">{weather.temp}°F</p>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{weather.condition}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Alerts (Earthquake & Weather) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Real-Time Alerts
                </h2>
                <span className="text-xs font-bold text-slate-400">PAST 24 HOURS</span>
              </div>

              <div className="space-y-3">
                {quakes.length > 0 ? quakes.map((quake, idx) => (
                  <div key={idx} className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-orange-900 text-sm">Earthquake Detected: M{quake.properties.mag}</h3>
                      <p className="text-xs text-orange-800/80 mt-1">{quake.properties.place}</p>
                      <span className="text-[10px] font-bold text-orange-700 uppercase mt-2 block">
                        {new Date(quake.properties.time).toLocaleTimeString()} • USGS Data
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center py-8">
                    <p className="text-sm text-slate-400">No recent earthquake activity detected.</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Cloud className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm">Weather Advisory</h3>
                    <p className="text-xs text-blue-800/80 mt-1">Current conditions: {weather.condition}. No severe warnings active for your primary location.</p>
                    <span className="text-[10px] font-bold text-blue-700 uppercase mt-2 block">Live Update • Weather API</span>
                  </div>
                </div>
              </div>
            </section>

            {/* My Locations */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                Monitored Locations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">Home</p>
                      <p className="text-xs text-slate-500">123 Safe St, San Francisco</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200"></span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">Office</p>
                      <p className="text-xs text-slate-500">456 Work Rd, Palo Alto</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6 border-slate-200 shadow-sm rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Info className="w-24 h-24" />
              </div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Safety Quick Tip
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                During an earthquake, remember: <strong>Drop, Cover, and Hold On.</strong> Move away from windows and heavy furniture.
              </p>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 font-bold h-auto">
                Read Earthquake Guide →
              </Button>
            </Card>

            <section className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Emergency Resources</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start border-slate-200 text-slate-700 font-bold rounded-xl py-6">
                  <Navigation className="w-4 h-4 mr-3 text-slate-400" />
                  Evacuation Routes
                </Button>
                <Button variant="outline" className="justify-start border-slate-200 text-slate-700 font-bold rounded-xl py-6">
                  <Bell className="w-4 h-4 mr-3 text-slate-400" />
                  Alert Settings
                </Button>
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  )
}
