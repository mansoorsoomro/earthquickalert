'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CloudRain, Wind, Thermometer, Eye, Car, Navigation, Map as MapIcon, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react'

const WEATHER_METRICS = [
  { label: 'Wind Speed', value: '115 mph', sub: 'Category 3 Force', icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Cloud Height', value: '2,400 ft', sub: 'Overcast Skies', icon: CloudRain, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Temperature', value: '72.4°F', sub: 'Relative Humidity 88%', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: 'Visibility', value: '0.4 miles', sub: 'Severe Fog / Rain', icon: Eye, color: 'text-slate-500', bg: 'bg-slate-50' }
]

const TRAFFIC_ALERTS = [
  { road: 'Interstate 95 (Both)', status: 'Closed', hazard: 'Structural Flooding', time: 'Last checked 5m ago' },
  { road: 'Harbor Bridge West', status: 'Restricted', hazard: 'Debris Clearance', time: 'Last checked 12m ago' },
  { road: 'Zonal Highway 402', status: 'Clear', hazard: 'Emergency Ops Only', time: 'Last checked 22m ago' }
]

export default function WeatherTrafficPage() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen p-8">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-24">
        
        {/* Banner Section */}
        <div className="relative h-[250px] rounded-[48px] overflow-hidden shadow-2xl shadow-slate-300/30 group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-indigo-900 z-10" />
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516912481808-3b0276b200b3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-1000" />
            
            <div className="relative z-20 h-full p-12 flex flex-col justify-center text-white">
                <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-rose-600 text-white border-none py-1.5 px-4 font-black uppercase text-[10px] tracking-widest rounded-full">Severe Weather Alert</Badge>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                        <RefreshCw size={12} className="animate-spin" /> Live Data Feed
                    </div>
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Weather & Traffic Feed</h1>
                <p className="text-xl font-medium text-white/80 max-w-2xl leading-relaxed italic">Hyper-local meteorological monitoring and logistics-critical traffic status.</p>
            </div>
            
            <div className="absolute bottom-8 right-12 z-20 flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Local Time</p>
                    <p className="text-2xl font-black text-white tracking-tight">12:45 PM <span className="text-sm font-medium text-white/40">EST</span></p>
                </div>
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {WEATHER_METRICS.map((metric, idx) => (
                <Card key={idx} className="p-8 rounded-[40px] border-none shadow-xl shadow-slate-200/50 bg-white group hover:shadow-2xl transition-all">
                    <div className={`w-14 h-14 rounded-[24px] ${metric.bg} ${metric.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                        <metric.icon size={28} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</h3>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{metric.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">{metric.sub}</p>
                    </div>
                </Card>
            ))}
        </div>

        {/* Main Content Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Traffic Feed */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono flex items-center gap-2">
                        <Car size={14} /> Critical Road Logistics
                    </h2>
                    <button className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">View All Routes</button>
                </div>
                
                <div className="space-y-4">
                    {TRAFFIC_ALERTS.map((traffic, idx) => (
                        <Card key={idx} className="p-8 rounded-[40px] border-none shadow-xl shadow-slate-200/50 bg-white group hover:shadow-2xl transition-all flex items-center justify-between gap-6 cursor-pointer overflow-hidden relative">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-[24px] bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner`}>
                                    <Navigation size={24} />
                                    <p className="text-[8px] font-black uppercase mt-1 tracking-widest">MAP</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-indigo-600 transition-colors italic">{traffic.road}</h3>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`${traffic.status === 'Closed' ? 'bg-rose-100 text-rose-700' : traffic.status === 'Restricted' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} border-none font-black text-[9px] px-3 py-1 rounded-full uppercase`}>
                                            {traffic.status}
                                        </Badge>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight italic flex items-center gap-1">
                                            <AlertTriangle size={12} className="text-amber-500" /> {traffic.hazard}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{traffic.time}</p>
                                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Sidebar Alerts */}
            <div className="space-y-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono flex items-center gap-2 px-4">
                    <CloudRain size={14} /> Active Radar
                </h2>
                <Card className="bg-[#1e293b] rounded-[48px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 h-[500px] border-none group cursor-pointer">
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Tactical Overlay</h3>
                            <Badge className="bg-emerald-500 text-white border-none py-1 px-3 text-[9px] font-black tracking-widest rounded-full uppercase italic">Uplink OK</Badge>
                        </div>
                        <div className="flex items-center justify-center py-20 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000">
                             <MapIcon size={120} className="text-slate-400 animate-pulse" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-indigo-300 mb-4 italic">Next 60 Minutes Projection</p>
                            <ul className="space-y-3 text-xs font-medium text-slate-300 tracking-tight">
                                <li className="flex gap-3 leading-tight uppercase font-black text-[11px] tracking-tight"><span>•</span> Wind gusting to 135 mph projection</li>
                                <li className="flex gap-3 leading-tight uppercase font-black text-[11px] tracking-tight"><span>•</span> Storm surge expected at Harbor Way</li>
                                <li className="flex gap-3 leading-tight uppercase font-black text-[11px] tracking-tight"><span>•</span> Flash flood warning intensified for S-Zone</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </div>
  )
}
