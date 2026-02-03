'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    CloudRain,
    Wind,
    CloudSun,
    Map as MapIcon,
    Navigation,
    AlertCircle,
    Eye,
    Thermometer,
    Waves,
    ArrowRight,
    TrendingUp,
    Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const forecast = [
    { day: 'Today', temp: '72°F', condition: 'Storms', icon: CloudRain, color: 'blue' },
    { day: 'Wed', temp: '68°F', condition: 'Rain', icon: CloudRain, color: 'blue' },
    { day: 'Thu', temp: '74°F', condition: 'Cloudy', icon: CloudSun, color: 'amber' },
    { day: 'Fri', temp: '79°F', condition: 'Clear', icon: CloudSun, color: 'amber' },
]

const trafficAlerts = [
    { road: 'HWY 101 South', status: 'Closed', cause: 'Flooding', time: '2h ago' },
    { road: 'Main St Bridge', status: 'Restricted', cause: 'High Winds', time: '45m ago' },
    { road: 'Airport Blvd', status: 'Heavy Traffic', cause: 'Evacuation', time: '5m ago' },
]

export default function WeatherTraffic() {
    return (
        <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black text-[#34385E] mb-2 tracking-tight">Weather & Traffic</h1>
                    <p className="text-slate-500 font-medium italic">Real-time atmospheric data and critical transit intelligence.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Live Satellite Data</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Weather Dashboard */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    <Card className="p-8 bg-gradient-to-br from-[#34385E] to-[#1E213A] text-white rounded-[32px] border-0 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="bg-white/10 px-4 py-1 rounded-full border border-white/10 inline-flex items-center gap-2">
                                    <CloudRain className="w-4 h-4 text-blue-300" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Severe Weather Warning</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-7xl font-black tracking-tighter">72°F</span>
                                    <div className="space-y-0.5">
                                        <p className="text-xl font-bold text-blue-100">Partly Cloudy</p>
                                        <p className="text-sm text-slate-400 font-medium">Feels like 78°F</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Humidity</span>
                                        <span className="text-lg font-bold">88%</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">UV Index</span>
                                        <span className="text-lg font-bold">Low (2)</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pressure</span>
                                        <span className="text-lg font-bold">1012 hPa</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                    <Wind className="w-8 h-8 text-blue-400 mb-2 ml-auto" />
                                    <p className="text-2xl font-black">115</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Mph Sustained</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                    <Waves className="w-8 h-8 text-blue-400 mb-2 ml-auto" />
                                    <p className="text-2xl font-black">6-8</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Ft Storm Surge</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-4 gap-4">
                        {forecast.map((f, i) => (
                            <Card key={i} className="p-5 flex flex-col items-center text-center border-slate-200 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
                                <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">{f.day}</p>
                                <f.icon className={cn("w-10 h-10 mb-3", {
                                    'text-blue-500': f.color === 'blue',
                                    'text-amber-500': f.color === 'amber',
                                })} />
                                <p className="text-lg font-black text-slate-800">{f.temp}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">{f.condition}</p>
                            </Card>
                        ))}
                    </div>

                    <Card className="p-6 bg-slate-50 border-slate-200 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-5 h-5 text-[#34385E]" />
                            <h3 className="font-bold text-slate-800 text-sm">Precipitation Trend</h3>
                        </div>
                        <div className="flex items-end gap-2 h-32 px-4">
                            {[40, 65, 30, 85, 45, 90, 60, 20, 55, 75, 50, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm hover:bg-blue-500 transition-all relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>6 AM</span>
                            <span>12 PM</span>
                            <span>6 PM</span>
                            <span>12 AM</span>
                        </div>
                    </Card>
                </div>

                {/* Right: Traffic Intel */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                <Navigation className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Traffic Intel</h2>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-[#34385E] font-bold">
                            <MapIcon className="w-3.5 h-3.5 mr-2" /> Live Map
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {trafficAlerts.map((alert, i) => (
                            <Card key={i} className="p-0 overflow-hidden border-slate-200 rounded-2xl hover:border-slate-300 transition-all cursor-pointer">
                                <div className="flex items-center p-5">
                                    <div className={cn("p-3 rounded-xl mr-4", {
                                        'bg-red-50 text-red-600': alert.status === 'Closed',
                                        'bg-orange-50 text-orange-600': alert.status === 'Restricted',
                                        'bg-blue-50 text-blue-600': alert.status === 'Heavy Traffic',
                                    })}>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{alert.road}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{alert.cause}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded", {
                                            'bg-red-100 text-red-700': alert.status === 'Closed',
                                            'bg-orange-100 text-orange-700': alert.status === 'Restricted',
                                            'bg-blue-100 text-blue-700': alert.status === 'Heavy Traffic',
                                        })}>{alert.status}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="p-8 bg-[#EAB308] border-0 rounded-3xl shadow-xl shadow-yellow-500/10">
                        <h3 className="text-xl font-black text-[#34385E] mb-2 tracking-tight">Active Evacuation</h3>
                        <p className="text-xs text-[#34385E]/70 mb-6 font-bold leading-relaxed">Routes A3 and B1 are currently prioritizing outbound traffic only. Tolls suspended.</p>
                        <Button className="w-full bg-[#34385E] text-white hover:bg-slate-800 rounded-2xl py-7 shadow-lg">
                            EVACUATION GUIDANCE
                        </Button>
                    </Card>

                    <div className="space-y-4 pt-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Critical Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <Eye className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Visibility</span>
                                </div>
                                <p className="text-2xl font-black text-slate-800">2.5 <span className="text-sm font-bold text-slate-400 ml-1">Mi</span></p>
                            </div>
                            <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <Thermometer className="w-4 h-4 text-red-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Track Temp</span>
                                </div>
                                <p className="text-2xl font-black text-slate-800">84 <span className="text-sm font-bold text-slate-400 ml-1">°F</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
