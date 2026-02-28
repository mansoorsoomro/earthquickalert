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
      {/* Active Emergencies */}
      <Card className="p-4 border-l-4 border-l-red-500 bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Emergencies</p>
            <AlertTriangle className="w-4 h-4 text-red-600 fill-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-red-600">{quakeCount < 10 ? `0${quakeCount}` : quakeCount}</span>
            <span className="text-xs text-slate-400 font-medium">Safety Five</span>
          </div>
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="text-[10px] text-slate-500 leading-none">• Evacuation status (Active)</p>
          <p className="text-[10px] text-slate-500 leading-none">• Resources Deployed (24)</p>
        </div>
      </Card>

      {/* Emergencies */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergencies</p>
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-600">{weatherCount < 10 ? `0${weatherCount}` : weatherCount}</span>
            <span className="text-xs text-slate-400 font-medium">Localized</span>
          </div>
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="text-[10px] text-slate-500 leading-none">• Urban Fire / Flood Control</p>
          <p className="text-[10px] text-slate-500 leading-none">• Power Outage Reports</p>
        </div>
      </Card>

      {/* Resources Deployed */}
      <Card className="p-4 border-l-4 border-l-orange-400 bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resources Deployed</p>
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange-400">12,457</span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-[10px] text-slate-500">• Primary Response Vehicles</p>
        </div>
      </Card>

      {/* Personnel Involved */}
      <Card className="p-4 border-l-4 border-l-emerald-500 bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Personnel Involved</p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 uppercase tracking-tight">8+ Available</span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-[10px] text-slate-500">• Multi-agency response coordination active via unified command.</p>
        </div>
      </Card>
    </div>
  )
}
