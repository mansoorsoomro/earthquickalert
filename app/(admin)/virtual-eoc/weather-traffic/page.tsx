'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    CloudRain, 
    Wind, 
    Thermometer, 
    Eye, 
    Car, 
    Navigation, 
    Map as MapIcon, 
    ArrowRight, 
    AlertTriangle, 
    RefreshCw,
    Activity,
    Target,
    ArrowUpRight,
    Search,
    Plus,
    Clock,
    Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const WEATHER_METRICS = [
  { label: 'Wind Speed', value: '115 mph', sub: 'Category 3 Force', icon: Wind, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Cloud Height', value: '2,400 ft', sub: 'Overcast Skies', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Temperature', value: '72.4°F', sub: 'Humidity 88%', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { label: 'Visibility', value: '0.4 miles', sub: 'Severe Fog', icon: Eye, color: 'text-slate-500', bg: 'bg-slate-500/10' }
]

const TRAFFIC_ALERTS = [
  { road: 'Interstate 95 (Both)', status: 'Closed', hazard: 'Structural Flooding', time: '5m ago' },
  { road: 'Harbor Bridge West', status: 'Restricted', hazard: 'Debris Clearance', time: '12m ago' },
  { road: 'Zonal Highway 402', status: 'Clear', hazard: 'Emergency Ops Only', time: '22m ago' }
]

export default function WeatherTrafficPage() {
  return (
    <main className="min-h-screen bg-[#0A0B10] p-8 lg:p-12 space-y-12 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-2xl">
                    <CloudRain size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Atmospheric Matrix</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Meteorological & Logistics Intelligence</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Local Signal Time</span>
                <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4 text-white" />
                     <span className="text-xl font-black text-white tracking-tight uppercase">12:45 PM <span className="text-[10px] text-slate-500 font-bold">EST</span></span>
                </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <Button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all gap-3">
                 <RefreshCw size={16} /> Sync Data Feed
            </Button>
        </div>
      </div>

      {/* Primary Alert Banner */}
      <div className="bg-gradient-to-r from-rose-600/20 to-slate-900 p-12 rounded-[48px] border border-rose-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516912481808-3b0276b200b3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-105 transition-transform duration-[2000ms] pointer-events-none" />
        <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
                <Badge className="bg-rose-600 text-white border-none py-1.5 px-5 font-black uppercase text-[10px] tracking-widest rounded-full shadow-2xl shadow-rose-600/30">Severe Weather Alert</Badge>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500">
                    <Activity size={12} className="animate-pulse" /> Live Atmospheric Feed Active
                </div>
            </div>
            <div className="max-w-4xl space-y-4">
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Hyper-Local Tactical Forecast</h2>
                <p className="text-xl font-medium text-slate-400 leading-relaxed italic">
                    Critical cyclonic force approaching Sector 7. Logistics corridors are transitioning to restricted access. 
                    Real-time precipitation modeling indicates structural threat level 4.
                </p>
            </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {WEATHER_METRICS.map((metric, i) => (
              <Card key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] shadow-2xl group hover:bg-white/[0.04] transition-all relative overflow-hidden">
                  <div className={cn("absolute right-8 top-8 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner", metric.bg, metric.color)}>
                      <metric.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 tracking-[0.2em]">{metric.label}</p>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">{metric.value}</h3>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">{metric.sub}</p>
              </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
          {/* Traffic Feed Area */}
          <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between px-4">
                  <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Logistics Corridor Status</h2>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Real-time road integrity & transport accessibility</p>
                  </div>
                  <Button variant="ghost" className="h-10 px-6 rounded-xl border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 gap-2">
                       Map All Routes
                  </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  {TRAFFIC_ALERTS.map((traffic, idx) => (
                      <Card key={idx} className="p-8 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-2xl group hover:bg-white/[0.02] transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer overflow-hidden relative">
                          <div className={cn(
                              "absolute top-0 left-0 w-2 h-full transition-all",
                              traffic.status === 'Closed' ? 'bg-rose-600' : traffic.status === 'Restricted' ? 'bg-amber-600' : 'bg-emerald-600'
                          )} />
                          
                          <div className="flex items-center gap-8">
                              <div className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-[32px] flex flex-col items-center justify-center text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-900 transition-all shadow-inner">
                                  <Navigation size={32} />
                                  <p className="text-[8px] font-black uppercase mt-1 tracking-widest">MAP</p>
                              </div>
                              <div>
                                  <div className="flex items-center gap-3 mb-2">
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{traffic.time}</span>
                                      <Badge className={cn(
                                          "border-none py-1.5 px-4 font-black uppercase text-[9px] tracking-widest rounded-lg",
                                          traffic.status === 'Closed' ? "bg-rose-600/20 text-rose-500" : 
                                          traffic.status === 'Restricted' ? "bg-amber-600/20 text-amber-500" : 
                                          "bg-emerald-600/20 text-emerald-500"
                                      )}>
                                          {traffic.status}
                                      </Badge>
                                  </div>
                                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors uppercase lowercase first-letter:uppercase italic">{traffic.road}</h3>
                                  <div className="flex items-center gap-3 mt-3">
                                      <AlertTriangle size={14} className="text-amber-500" />
                                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">{traffic.hazard}</p>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-blue-600 transition-all">
                                <ArrowUpRight size={28} />
                          </div>
                      </Card>
                  ))}
              </div>
          </div>

          {/* Sidebar Tactical Radar */}
          <div className="lg:col-span-4 space-y-10">
              <div className="px-4">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Signal Radar</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Satellite uplink & atmospheric overlay</p>
              </div>

              <Card className="bg-[#1e293b]/40 backdrop-blur-3xl rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/10 h-[500px] lg:h-full group cursor-pointer">
                  <div className="absolute top-0 right-0 p-12 text-blue-500/5 group-hover:scale-110 transition-transform duration-1000">
                      <Sparkles size={240} />
                  </div>
                  
                  <div className="relative z-10 space-y-10 flex flex-col h-full">
                      <div className="flex items-center justify-between">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Tactical Feed Overview</h3>
                          <Badge className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 py-1.5 px-4 text-[9px] font-black tracking-widest rounded-full uppercase italic shadow-2xl">Uplink Nominal</Badge>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                           <MapIcon size={140} className="text-blue-400 animate-pulse mb-6" />
                           <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Rendering Terrain Layer...</p>
                      </div>

                      <div className="bg-[#0A0B10]/60 backdrop-blur-md rounded-[32px] p-8 border border-white/5 shadow-2xl">
                          <div className="flex items-center gap-3 mb-6">
                              <Target size={16} className="text-rose-500" />
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 italic">Critical Projections (60m)</p>
                          </div>
                          <ul className="space-y-4">
                              {[
                                  'Wind gusting to 135 mph projection',
                                  'Storm surge expected at Harbor Way',
                                  'Flash flood warning intensified'
                              ].map((point, i) => (
                                  <li key={i} className="flex gap-4 items-start group/item">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 flex-shrink-0 group-hover/item:bg-rose-500 transition-colors" />
                                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-400 group-hover/item:text-white transition-colors">{point}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </main>
  )
}
