'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crosshair, Map as MapIcon, Users, Phone, Zap, Shield, ChevronRight, Activity } from 'lucide-react'

const CENTER_DATA = [
  {
    name: 'Sector 4 Response Hub',
    location: '44 Harbor Way, Marina Dist.',
    status: 'Operational',
    team: 'Alpha Response (12 members)',
    power: 'Grid / Generator Backup',
    critical: 'Yes',
  },
  {
    name: 'Metropolitan Triage Center',
    location: 'Central Plaza Park Bldg.',
    status: 'Critical Loading',
    team: 'Medical Unit 7 (22 members)',
    power: 'Generator Only',
    critical: 'Extreme',
  },
  {
    name: 'Zonal Logistics Depot',
    location: 'Industrial Rd. Warehouse C',
    status: 'Paused',
    team: 'Transport Group B (8 members)',
    power: 'Offline',
    critical: 'No',
  }
]

export default function CenterPage() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen p-8">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#34385E] p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Crosshair size={24} />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">Emergency Centers</h1>
            </div>
            <p className="text-indigo-100/80 font-medium text-lg">Central command oversight and tactical management of all regional response hubs.</p>
          </div>
          <div className="relative z-10 flex gap-4">
             <div className="text-right border-r border-white/10 pr-6 mr-6">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Total Active Hubs</p>
                <p className="text-3xl font-black tracking-tight">12/15</p>
             </div>
             <button className="bg-white text-[#34385E] px-8 py-3 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
                Dispatch Order
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Center Grid */}
            <div className="space-y-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono flex items-center gap-2">
                    <Activity size={14} /> Critical Hub Tracking
                </h2>
                <div className="space-y-4">
                    {CENTER_DATA.map((center, idx) => (
                        <Card key={idx} className="p-6 rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all border-none bg-white group cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${center.status === 'Operational' ? 'bg-indigo-50 text-indigo-600' : center.status === 'Critical Loading' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{center.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-0.5">{center.location}</p>
                                    </div>
                                </div>
                                <Badge className={center.status === 'Operational' ? "bg-emerald-500" : center.status === 'Critical Loading' ? "bg-rose-600" : "bg-slate-400"}>
                                    {center.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Personnel</p>
                                    <p className="text-xs font-bold text-slate-700">{center.team}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">System Power</p>
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={10} className={center.power.includes('Grid') ? 'text-emerald-500' : 'text-amber-500'} />
                                        <p className="text-xs font-bold text-slate-700">{center.status === 'Paused' ? 'None' : center.power}</p>
                                    </div>
                                </div>
                                <button className="w-10 h-10 ml-auto rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Tactical Sidebar */}
            <div className="space-y-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono flex items-center gap-2">
                    <MapIcon size={14} /> Regional Response Map
                </h2>
                <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 h-[500px] relative group">
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                         <MapIcon size={64} className="text-slate-300 animate-pulse" />
                    </div>
                    <div className="absolute top-6 left-6 z-10 space-y-2">
                        <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-none py-1.5 px-4 font-black text-[10px] uppercase tracking-widest rounded-full">
                            Aerial View Active
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
