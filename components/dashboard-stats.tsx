'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CloudRain, Users, Globe } from 'lucide-react'
import { getLatestEarthquakes, getWeatherData } from '@/lib/api-service'

export function DashboardStats() {
  const [quakeCount, setQuakeCount] = useState(0)
  const [latestQuake, setLatestQuake] = useState('No recent activity')
  const [weather, setWeather] = useState({ temp: 72, condition: 'Clear' })

  useEffect(() => {
    async function fetchData() {
      const quakes = await getLatestEarthquakes()
      setQuakeCount(quakes.length)
      if (quakes.length > 0) {
        const first = quakes[0].properties
        setLatestQuake(`M${first.mag} - ${first.place}`)
      }

      const weatherData = await getWeatherData(37.7749, -122.4194) // SF
      if (weatherData) {
        setWeather(weatherData)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 300000) // Update every 5 mins
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Earthquake Status (USGS) */}
      <Card className="p-6 border-l-4 border-l-orange-500 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Earthquake Alerts</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{quakeCount < 10 ? `0${quakeCount}` : quakeCount}</span>
              <span className="text-xs text-slate-400">Past Hour</span>
            </div>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <p className="text-xs text-slate-600 italic truncate" title={latestQuake}>Latest: {latestQuake}</p>
      </Card>

      {/* Weather Conditions (API) */}
      <Card className="p-6 border-l-4 border-l-blue-500 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Weather</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{weather.temp}°F</span>
              <span className="text-xs text-slate-400">{weather.condition}</span>
            </div>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <CloudRain className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-slate-600 italic">SF Bay Area monitoring active</p>
      </Card>

      {/* Citizen Safety */}
      <Card className="p-6 border-l-4 border-l-green-500 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Citizen Status</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">1,402</span>
              <span className="text-xs text-slate-400">Total Safe</span>
            </div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-slate-600 italic">85% of population reached</p>
      </Card>

      {/* API Connectivity */}
      <Card className="p-6 border-l-4 border-l-slate-800 bg-slate-900 text-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">API Systems</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">Live</span>
            </div>
          </div>
          <div className="p-2 bg-slate-800 rounded-lg">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <p className="text-xs text-slate-400 italic">Google Maps & USGS Connected</p>
      </Card>
    </div>
  )
}
