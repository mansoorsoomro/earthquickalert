'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Home, MapPin, Navigation, Siren, Activity, Car, Info, Search, User, Zap, LogOut } from 'lucide-react'
import { GoogleMap } from '@/components/google-map'

export default function EvacuationPage() {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push('/login')
    }

    const emergencyName = "HURRICANE ERIN"
    const emergencyLevel = "CAT 3 - EXTREME DANGER"

    const shelters = [
        { name: 'Highland High School', address: '1200 Summit Ave, Highland', capacity: '85%', power: true, pets: true, distance: '12 mi' },
        { name: 'Central Community Center', address: '450 Oak St, Inland Valley', capacity: '42%', power: true, pets: false, distance: '18 mi' },
        { name: 'St. Jude Reception Hall', address: '88 Chapel Way, North Hills', capacity: '98%', power: false, pets: true, distance: '22 mi' },
    ]

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
            {/* Light Header from Mockup */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:bg-slate-100 rounded-xl">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-black text-xl tracking-tighter uppercase leading-none text-slate-900 italic">EVACUATION & SHELTERS</h1>
                            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded font-black italic uppercase tracking-widest leading-none">Logistics</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emergencyName} • {emergencyLevel}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <Search className="w-5 h-5" />
                    <div className="relative">
                        <Badge className="absolute -top-1 -right-1 p-0 w-4 h-4 flex items-center justify-center bg-red-500 border-2 border-white text-[10px]">2</Badge>
                        <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-black leading-none uppercase tracking-tighter text-slate-900 italic">Mansoor Soomro</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">m.soomro@eoc.gov</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-slate-100 flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Logistics Metadata Bar (Light) */}
            <div className="bg-white border-b border-slate-200 p-3 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-orange-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Traffic Status:</span>
                            <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-100 h-5 px-2 font-black">HEAVY DELAYS ON I-95</Badge>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Open Shelters:</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase">12 ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8">
                {/* Primary Evacuation Route & Map */}
                <div className="flex-1 space-y-6">
                    <Card className="bg-white border-slate-200 overflow-hidden rounded-[2rem] shadow-sm flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <h2 className="font-black text-sm uppercase tracking-[0.2em] text-orange-600 flex items-center gap-3 italic">
                                <Navigation className="w-4 h-4 animate-pulse" />
                                Recommended Safe Route
                            </h2>
                            <Badge className="bg-[#1e293b] text-white text-[10px] font-black italic tracking-widest py-1 px-3">PRIORITY ALPHA</Badge>
                        </div>
                        <div className="h-[400px] relative border-y border-slate-100">
                            <GoogleMap address="Miami Beach to Highland" />
                        </div>
                        <div className="p-8 bg-white">
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium uppercase tracking-tight">
                                Take <span className="text-slate-900 font-black underline decoration-orange-500 underline-offset-4">I-95 NORTH</span> towards Highland.
                                Coastal Highway A1A is CLOSED due to surge. All northbound lanes converted to evacuation-only.
                            </p>
                            <Button className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-xl shadow-orange-900/10 rounded-2xl transition-all uppercase tracking-tighter italic">
                                START EMERGENCY NAVIGATION
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Shelter Inventory Sidebar */}
                <aside className="lg:w-1/3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em] italic">Nearby Safe Havens</h3>
                        <span className="text-[10px] font-black text-orange-600 underline cursor-pointer uppercase tracking-widest">View All</span>
                    </div>

                    <div className="space-y-4">
                        {shelters.map((shelter, i) => (
                            <Card key={i} className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-orange-600 transition-colors uppercase leading-none">{shelter.name}</h4>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{shelter.address}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {shelter.power && <Badge variant="outline" className="text-[8px] border-emerald-100 text-emerald-600 bg-emerald-50 font-black uppercase">Has Power</Badge>}
                                            {shelter.pets && <Badge variant="outline" className="text-[8px] border-blue-100 text-blue-600 bg-blue-50 font-black uppercase">Pets OK</Badge>}
                                            <Badge variant="outline" className="text-[8px] border-slate-200 text-slate-400 font-black uppercase">{shelter.distance}</Badge>
                                        </div>
                                    </div>
                                    <div className="text-center min-w-[70px] bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                        <p className={`text-2xl font-black italic tracking-tighter leading-none mb-1 ${parseInt(shelter.capacity) > 90 ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {shelter.capacity}
                                        </p>
                                        <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Cap.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-6 h-12 border-slate-200 bg-white text-slate-600 font-black hover:bg-slate-50 rounded-xl uppercase text-[10px] tracking-widest">
                                    <MapPin className="w-3 h-3 mr-2 text-slate-400" />
                                    GET DIRECTIONS
                                </Button>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-white border-dashed border-slate-200 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <Info className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic uppercase tracking-tight">
                                Shelter capacities are updated every 15 minutes by on-site EOC staff. If a shelter is full, alternate routes will be displayed.
                            </p>
                        </div>
                    </Card>
                </aside>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-200 bg-white flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-400 italic font-medium">Logistics sync active. Sector 7 Evacuation ID: EVAC-SF-2026-004</p>
            </footer>
        </div>
    )
}
