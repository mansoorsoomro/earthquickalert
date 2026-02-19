'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Wrench, Zap, Droplets, Hammer, Phone, Siren, Activity, ShieldCheck, Info } from 'lucide-react'

export default function MaintenancePage() {
    const router = useRouter()

    const emergencyName = "HURRICANE ERIN"
    const emergencyLevel = "CAT 4 - EXTREME DANGER"

    const vendors = [
        { type: 'Electrician', icon: Zap, name: 'PowerSafe Electric', phone: '555-0101', status: 'Available', color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
        { type: 'Plumbing', icon: Droplets, name: 'Emergency Plumbing Co.', phone: '555-0102', status: 'Busy', color: 'text-blue-400', bg: 'bg-blue-900/20' },
        { type: 'General Contractor', icon: Hammer, name: 'Rebuild Pros', phone: '555-0103', status: 'Available', color: 'text-orange-400', bg: 'bg-orange-900/20' },
        { type: 'HVAC', icon: Wrench, name: 'Climate Control Inc.', phone: '555-0104', status: 'Available', color: 'text-sky-400', bg: 'bg-sky-900/20' },
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            {/* Command Center Header */}
            <div className="bg-slate-800 p-4 shadow-2xl sticky top-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-slate-700/20 backdrop-blur-md"></div>
                <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20 rounded-xl">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-xl tracking-tighter uppercase leading-none">EMERGENCY MAINTENANCE</h1>
                                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-black italic border border-white/20 uppercase tracking-widest leading-none">Critical Repair</span>
                            </div>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest opacity-80">{emergencyName} • {emergencyLevel}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maintenance Metadata Bar */}
            <div className="bg-slate-900 border-b border-slate-800 p-3">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Vendor Verification:</span>
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 h-5 px-2 font-black italic">ALL VENDORS PRICE-CAPPED</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-sky-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Response Time:</span>
                            <span className="text-[10px] font-bold text-white">EST. 2-4 HOURS</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <div className="mb-8 p-6 bg-blue-900/10 border border-blue-500/20 rounded-3xl flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Info className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-black text-blue-400 text-sm uppercase tracking-widest mb-1">State-Mandated Price Controls</h4>
                        <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
                            During active EOC status, all maintenance vendors are verified for emergency response and must adhere to pre-disaster pricing tiers.
                            Report any price gouging immediately via the EOC Secure Feed.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vendors.map((vendor, i) => {
                        const Icon = vendor.icon
                        return (
                            <Card key={i} className="bg-slate-900/50 border-slate-800 p-6 rounded-[2.5rem] shadow-xl hover:bg-slate-900 transition-all hover:scale-[1.02] flex flex-col items-center text-center group">
                                <div className={`w-20 h-20 ${vendor.bg} rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner`}>
                                    <Icon className={`w-10 h-10 ${vendor.color}`} />
                                </div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{vendor.type}</p>
                                <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-4">{vendor.name}</h3>

                                <div className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-6 font-bold flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${vendor.status === 'Available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                    <span className={`text-[10px] uppercase tracking-widest ${vendor.status === 'Available' ? 'text-green-400' : 'text-red-400'}`}>{vendor.status}</span>
                                </div>

                                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all">
                                    <Phone className="w-4 h-4 mr-2" />
                                    CALL NOW
                                </Button>
                            </Card>
                        )
                    })}
                </div>

                {/* Logistical Note Widget */}
                <div className="mt-12 flex flex-col items-center text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Official Dispatch System</p>
                    <div className="p-1 px-4 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
                        <p className="text-[9px] text-slate-400 font-medium italic">All calls are logged for state reimbursement processing.</p>
                    </div>
                </div>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-900 bg-slate-950 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-700 italic">Structural Integrity Monitoring active. Dispatch ID: MAINT-SF-2026-012</p>
            </footer>
        </div>
    )
}
