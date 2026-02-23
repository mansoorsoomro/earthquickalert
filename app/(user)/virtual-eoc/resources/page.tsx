'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Tent, HeartHandshake, Baby, Siren, Activity, Users, MapPin, ExternalLink, Search, User, Zap, LogOut } from 'lucide-react'

export default function CommunityResourcesPage() {
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

    const resources = [
        {
            name: 'FEMA Disaster Recovery Center',
            location: 'City Hall Parking Lot',
            status: 'Open 8am - 6pm',
            detail: 'Registration Required',
            icon: Tent,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            name: 'Red Cross Aid Station',
            location: 'Community Center Gym',
            status: '24/7 Support',
            detail: 'Food, water, and medical triage.',
            icon: HeartHandshake,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-100'
        },
        {
            name: 'Family Reunification',
            location: 'Central Library',
            status: 'Active Database',
            detail: 'Register missing persons or report safe status.',
            icon: Baby,
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            border: 'border-pink-100'
        },
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
                            <h1 className="font-black text-xl tracking-tighter uppercase leading-none text-slate-900 italic">COMMUNITY CENTER</h1>
                            <span className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded font-black italic uppercase tracking-widest leading-none">Mutual Aid</span>
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

            {/* Community Metadata Bar (Light) */}
            <div className="bg-white border-b border-slate-200 p-3 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Community Status:</span>
                            <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-600 border-purple-100 h-5 px-2 font-black italic">SHELTER-IN-PLACE ADVISED</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aid Stations:</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase">8 ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((res, i) => {
                        const Icon = res.icon
                        return (
                            <Card key={i} className={`bg-white border-slate-200 p-6 rounded-3xl shadow-sm transition-all hover:scale-[1.02] group flex flex-col gap-4 relative overflow-hidden`}>
                                <div className={`absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                    <Icon className="w-40 h-40" />
                                </div>

                                <div className="flex items-start gap-4 relative z-10">
                                    <div className={`p-4 ${res.bg} rounded-2xl border border-slate-100`}>
                                        <Icon className={`w-8 h-8 ${res.color}`} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-black text-slate-900 text-xl tracking-tight leading-tight uppercase">{res.name}</h3>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{res.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                        <span className={`text-[10px] font-black uppercase italic ${res.color}`}>{res.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                                        {res.detail}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-2 mt-auto relative z-10">
                                    <Button variant="outline" className="h-12 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-black rounded-2xl uppercase text-[10px] tracking-widest italic">
                                        <ExternalLink className="w-4 h-4 mr-2 text-slate-300" />
                                        VIEW FACILITY DETAILS
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-12 bg-[#1e293b] rounded-[2.5rem] p-8 shadow-xl text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-10">
                        <Users className="w-64 h-64 text-white" />
                    </div>
                    <div className="flex-1 space-y-2 relative z-10">
                        <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">NEIGHBORHOOD WATCH</h4>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium">
                            All community centers are equipped with satellite internet and backup power.
                            If you have local resources to donate or need urgent neighborhood-specific aid, use the button below.
                        </p>
                    </div>
                    <Button className="w-full md:w-auto h-16 px-10 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg rounded-2xl shadow-xl transition-all uppercase tracking-tighter italic relative z-10">
                        OFFER ASSISTANCE
                    </Button>
                </div>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-200 bg-white flex flex-col items-center gap-4 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-400 italic font-medium">Community health & safety feed is active. Integrity ID: COM-SF-2026-008</p>
            </footer>
        </div>
    )
}
