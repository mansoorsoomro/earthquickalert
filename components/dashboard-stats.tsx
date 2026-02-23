'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CloudRain, Users, Globe } from 'lucide-react'
import { getLatestEarthquakes, getWeatherData } from '@/lib/api-service'

export function DashboardStats() {
  const [quakeCount, setQuakeCount] = useState(0)
  const [latestQuake, setLatestQuake] = useState('No recent activity')
  const [weatherCount, setWeatherCount] = useState(0)
  const [citizenStats, setCitizenStats] = useState({ totalUsers: 0, safeUsers: 0 })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/stats');
        const json = await response.json();
        if (json.success && json.data) {
          const { totalUsers, safeUsers, quakeCount, weatherCount, latestQuake } = json.data;
          setCitizenStats({ totalUsers, safeUsers });
          setQuakeCount(quakeCount);
          setWeatherCount(weatherCount);
          setLatestQuake(latestQuake);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds for admin visibility
    return () => clearInterval(interval)
  }, [])

  const safePercentage = citizenStats.totalUsers > 0
    ? Math.round((citizenStats.safeUsers / citizenStats.totalUsers) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Earthquake Status (Impacted Areas) */}
      <Card className="p-6 border-l-4 border-l-orange-500 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Impacted Zones (Seismic)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{quakeCount < 10 ? `0${quakeCount}` : quakeCount}</span>
              <span className="text-xs text-slate-400">Total Alert</span>
            </div>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <p className="text-xs text-slate-600 italic truncate" title={latestQuake}>Latest: {latestQuake}</p>
      </Card>

      {/* Weather Conditions (Impacted Areas) */}
      <Card className="p-6 border-l-4 border-l-blue-500 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Impacted Zones (Weather)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{weatherCount < 10 ? `0${weatherCount}` : weatherCount}</span>
              <span className="text-xs text-slate-400">Active Alerts</span>
            </div>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <CloudRain className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-slate-600 italic">Localized user-impact monitoring</p>
      </Card>

      {/* Citizen Safety */}
      <Card className="p-6 border-l-4 border-l-green-500 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Citizen Status</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{citizenStats.safeUsers.toLocaleString()}</span>
              <span className="text-xs text-slate-400">Total Safe</span>
            </div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-slate-600 italic">{safePercentage}% of population safe</p>
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
