'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Home, MapPin, Navigation, Siren, Activity, Car, Info } from 'lucide-react'
import { GoogleMap } from '@/components/google-map'

export default function EvacuationPage() {
    const router = useRouter()

    const emergencyName = "HURRICANE ERIN"
    const emergencyLevel = "CAT 4 - EXTREME DANGER"

    const shelters = [
        { name: 'Highland High School', address: '1200 Summit Ave, Highland', capacity: '85%', power: true, pets: true, distance: '12 mi' },
        { name: 'Central Community Center', address: '450 Oak St, Inland Valley', capacity: '42%', power: true, pets: false, distance: '18 mi' },
        { name: 'St. Jude Reception Hall', address: '88 Chapel Way, North Hills', capacity: '98%', power: false, pets: true, distance: '22 mi' },
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            {/* Command Center Header */}
            <div className="bg-orange-600 p-4 shadow-2xl sticky top-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/20 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20 rounded-xl">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-xl tracking-tighter uppercase leading-none">EVACUATION & SHELTERS</h1>
                                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-black italic border border-white/20 uppercase tracking-widest leading-none">Logistics</span>
                            </div>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest opacity-80">{emergencyName} • {emergencyLevel}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logistics Metadata Bar */}
            <div className="bg-slate-900 border-b border-slate-800 p-3">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-orange-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Traffic Status:</span>
                            <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-500 border-red-500/30 h-5 px-2 font-black">HEAVY DELAYS ON I-95</Badge>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Open Shelters:</span>
                            <span className="text-[10px] font-bold text-white">12 ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8">

                {/* Primary Evacuation Route & Map */}
                <div className="flex-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden rounded-[2rem] shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <h2 className="font-black text-sm uppercase tracking-[0.2em] text-orange-400 flex items-center gap-3">
                                <Navigation className="w-4 h-4 animate-pulse" />
                                Recommended Safe Route
                            </h2>
                            <Badge className="bg-orange-600 text-[10px] font-black italic">PRIORITY ALPHA</Badge>
                        </div>
                        <div className="h-[400px] relative">
                            <GoogleMap address="Miami Beach to Highland" />
                        </div>
                        <div className="p-6 bg-slate-900/80 backdrop-blur-md">
                            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                                Take <span className="text-white font-black underline decoration-orange-500 underline-offset-4">I-95 NORTH</span> towards Highland.
                                Coastal Highway A1A is CLOSED due to surge. All northbound lanes converted to evacuation-only.
                            </p>
                            <Button className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-xl shadow-orange-900/20 rounded-2xl border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all">
                                START EMERGENCY NAVIGATION
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Shelter Inventory Sidebar */}
                <aside className="lg:w-1/3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-xs text-slate-500 uppercase tracking-[0.3em]">Nearby Safe Havens</h3>
                        <span className="text-[10px] font-bold text-orange-400 underline cursor-pointer">View All</span>
                    </div>

                    <div className="space-y-4">
                        {shelters.map((shelter, i) => (
                            <Card key={i} className="bg-slate-900/50 border-slate-800 p-5 rounded-3xl shadow-xl hover:bg-slate-900 transition-colors group">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-black text-white text-lg tracking-tight group-hover:text-orange-400 transition-colors">{shelter.name}</h4>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{shelter.address}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {shelter.power && <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5 font-black uppercase">Has Power</Badge>}
                                            {shelter.pets && <Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-400 bg-blue-500/5 font-black uppercase">Pets OK</Badge>}
                                            <Badge variant="outline" className="text-[8px] border-slate-700 text-slate-500 font-bold uppercase">{shelter.distance}</Badge>
                                        </div>
                                    </div>
                                    <div className="text-center min-w-[70px]">
                                        <p className={`text-2xl font-black italic tracking-tighter ${parseInt(shelter.capacity) > 90 ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {shelter.capacity}
                                        </p>
                                        <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Cap.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-4 h-11 border-slate-800 bg-slate-950 text-slate-400 font-bold hover:bg-slate-800 rounded-xl">
                                    <MapPin className="w-3 h-3 mr-2" />
                                    GET DIRECTIONS
                                </Button>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-slate-900/30 border-dashed border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                            <Info className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                Shelter capacities are updated every 15 minutes by on-site EOC staff. If a shelter is full, alternate routes will be displayed.
                            </p>
                        </div>
                    </Card>
                </aside>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-900 bg-slate-950 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-700 italic">Logistics sync active. Sector 7 Evacuation ID: EVAC-SF-2026-004</p>
            </footer>
        </div>
    )
}
