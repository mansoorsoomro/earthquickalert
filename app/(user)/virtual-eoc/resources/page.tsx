'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Tent, HeartHandshake, Baby, Siren, Activity, Users, MapPin, ExternalLink } from 'lucide-react'

export default function CommunityResourcesPage() {
    const router = useRouter()

    const emergencyName = "HURRICANE ERIN"
    const emergencyLevel = "CAT 4 - EXTREME DANGER"

    const resources = [
        {
            name: 'FEMA Disaster Recovery Center',
            location: 'City Hall Parking Lot',
            status: 'Open 8am - 6pm',
            detail: 'Registration Required',
            icon: Tent,
            color: 'text-purple-400',
            bg: 'bg-purple-900/20',
            border: 'border-purple-500/30'
        },
        {
            name: 'Red Cross Aid Station',
            location: 'Community Center Gym',
            status: '24/7 Support',
            detail: 'Food, water, and medical triage.',
            icon: HeartHandshake,
            color: 'text-red-400',
            bg: 'bg-red-900/20',
            border: 'border-red-500/30'
        },
        {
            name: 'Family Reunification',
            location: 'Central Library',
            status: 'Active Database',
            detail: 'Register missing persons or report safe status.',
            icon: Baby,
            color: 'text-pink-400',
            bg: 'bg-pink-900/20',
            border: 'border-pink-500/30'
        },
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            {/* Command Center Header */}
            <div className="bg-purple-600 p-4 shadow-2xl sticky top-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20 rounded-xl">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-xl tracking-tighter uppercase leading-none">COMMUNITY CENTER</h1>
                                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-black italic border border-white/20 uppercase tracking-widest leading-none">Mutual Aid</span>
                            </div>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest opacity-80">{emergencyName} • {emergencyLevel}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Community Metadata Bar */}
            <div className="bg-slate-900 border-b border-slate-800 p-3">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Community Status:</span>
                            <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30 h-5 px-2 font-black italic">SHELTER-IN-PLACE ADVISED</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Aid Stations:</span>
                            <span className="text-[10px] font-bold text-white">8 ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((res, i) => {
                        const Icon = res.icon
                        return (
                            <Card key={i} className={`bg-slate-900/50 ${res.border} p-6 rounded-3xl shadow-xl transition-all hover:scale-[1.02] group flex flex-col gap-4 relative overflow-hidden`}>
                                <div className={`absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                    <Icon className="w-40 h-40" />
                                </div>

                                <div className="flex items-start gap-4 relative z-10">
                                    <div className={`p-4 ${res.bg} rounded-2xl border border-white/5`}>
                                        <Icon className={`w-8 h-8 ${res.color}`} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-black text-white text-xl tracking-tight leading-tight">{res.name}</h3>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <MapPin className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{res.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Status</span>
                                        <span className={`text-[10px] font-black uppercase italic ${res.color}`}>{res.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        {res.detail}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-2 mt-auto relative z-10">
                                    <Button variant="outline" className="h-12 border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 font-bold rounded-2xl">
                                        <ExternalLink className="w-4 h-4 mr-2 text-slate-500" />
                                        VIEW FACILITY DETAILS
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-12 bg-slate-900/30 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-2">
                        <h4 className="text-2xl font-black text-white italic tracking-tighter">NEIGHBORHOOD WATCH</h4>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                            All community centers are equipped with satellite internet and backup power.
                            If you have local resources to donate or need urgent neighborhood-specific aid, use the button below.
                        </p>
                    </div>
                    <Button className="w-full md:w-auto h-16 px-10 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-purple-900/20">
                        OFFER ASSISTANCE
                    </Button>
                </div>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-900 bg-slate-950 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-700 italic">Community health & safety feed is active. Integrity ID: COM-SF-2026-008</p>
            </footer>
        </div>
    )
}
