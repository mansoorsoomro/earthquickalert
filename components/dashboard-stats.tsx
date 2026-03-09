'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CloudRain, Users, Globe, Brain, Shield, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DashboardStats() {
  const [quakeCount, setQuakeCount] = useState(0)
  const [latestQuake, setLatestQuake] = useState('No recent activity')
  const [weatherCount, setWeatherCount] = useState(0)
  const [citizenStats, setCitizenStats] = useState({ totalUsers: 0, safeUsers: 0 })
  const [totalIncidents, setTotalIncidents] = useState(0)
  const [activePersonnel, setActivePersonnel] = useState(0)
  const [aiInsight, setAiInsight] = useState<{ status: string, message: string } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/stats');
        const json = await response.json();
        if (json.success && json.data) {
          const {
            totalUsers,
            safeUsers,
            quakeCount,
            weatherCount,
            latestQuake,
            totalIncidents,
            activePersonnel,
            aiInsight
          } = json.data;
          setCitizenStats({ totalUsers, safeUsers });
          setQuakeCount(quakeCount);
          setWeatherCount(weatherCount);
          setLatestQuake(latestQuake);
          setTotalIncidents(totalIncidents || 0);
          setActivePersonnel(activePersonnel || 0);
          setAiInsight(aiInsight);
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
    <div className="space-y-4">
      {aiInsight && (
        <div className={`p-3 rounded-lg border flex items-center gap-3 animate-pulse ${aiInsight.status === 'Emergency' ? 'bg-red-50 border-red-200 text-red-700' :
            aiInsight.status === 'Warning' ? 'bg-orange-50 border-orange-200 text-orange-700' :
              'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
          <Brain className="w-5 h-5" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              AI Threat Assessment: {aiInsight.status}
            </p>
            <p className="text-sm opacity-90">{aiInsight.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Emergencies (Earthquake API) */}
        <Card className="p-4 border-l-4 border-l-red-500 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Earthquake Alerts</p>
              <AlertTriangle className="w-4 h-4 text-red-600 fill-red-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-600">{quakeCount < 10 ? `0${quakeCount}` : quakeCount}</span>
              <span className="text-xs text-slate-400 font-medium">Last hour</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 truncate italic">
            {latestQuake}
          </div>
        </Card>

        {/* Weather Emergencies (Weather API) */}
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weather Events</p>
              <CloudRain className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-600">{weatherCount < 10 ? `0${weatherCount}` : weatherCount}</span>
              <span className="text-xs text-slate-400 font-medium">Localized</span>
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <p className="text-[10px] text-slate-500 leading-none">• Monitoring conditions</p>
            <p className="text-[10px] text-slate-500 leading-none">• Flood/Wind Alerts active</p>
          </div>
        </Card>

        {/* Incidents (Backend API / MongoDB) */}
        <Card className="p-4 border-l-4 border-l-orange-400 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Incidents</p>
              <Activity className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-400">
                {totalIncidents.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            • Cumulative across all regions
          </div>
        </Card>

        {/* Personnel (Backend API / MongoDB) */}
        <Card className="p-4 border-l-4 border-l-emerald-500 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Responders Online</p>
              <Users className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-emerald-600">
                {activePersonnel}
              </span>
              <span className="text-xs text-slate-400 font-medium">Active</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            • Multi-agency unified command
          </div>
        </Card>
      </div>
    </div>
  )
}
