'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Wrench, Zap, Droplets, Hammer, Phone, Siren, Activity, ShieldCheck, Info, Search, User, LogOut } from 'lucide-react'

export default function MaintenancePage() {
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

    const vendors = [
        { type: 'Electrician', icon: Zap, name: 'PowerSafe Electric', phone: '555-0101', status: 'Available', color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { type: 'Plumbing', icon: Droplets, name: 'Emergency Plumbing Co.', phone: '555-0102', status: 'Busy', color: 'text-blue-600', bg: 'bg-blue-50' },
        { type: 'General Contractor', icon: Hammer, name: 'Rebuild Pros', phone: '555-0103', status: 'Available', color: 'text-orange-600', bg: 'bg-orange-50' },
        { type: 'HVAC', icon: Wrench, name: 'Climate Control Inc.', phone: '555-0104', status: 'Available', color: 'text-sky-600', bg: 'bg-sky-50' },
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
                            <h1 className="font-black text-xl tracking-tighter uppercase leading-none text-slate-900 italic">EMERGENCY MAINTENANCE</h1>
                            <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded font-black italic border border-slate-200 uppercase tracking-widest leading-none">Critical Repair</span>
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

            {/* Maintenance Metadata Bar (Light) */}
            <div className="bg-white border-b border-slate-200 p-3 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vendor Verification:</span>
                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-100 h-5 px-2 font-black italic uppercase">ALL VENDORS PRICE-CAPPED</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-sky-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Response Time:</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase">EST. 2-4 HOURS</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-white rounded-2xl border border-blue-100 shadow-sm">
                        <Info className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-black text-blue-600 text-sm uppercase tracking-widest mb-1 italic">State-Mandated Price Controls</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                            During active EOC status, all maintenance vendors are verified for emergency response and must adhere to pre-disaster pricing tiers.
                            Report any price gouging immediately via the EOC Secure Feed.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vendors.map((vendor, i) => {
                        const Icon = vendor.icon
                        return (
                            <Card key={i} className="bg-white border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all hover:scale-[1.02] flex flex-col items-center text-center group">
                                <div className={`w-20 h-20 ${vendor.bg} rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner`}>
                                    <Icon className={`w-10 h-10 ${vendor.color}`} />
                                </div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1 italic">{vendor.type}</p>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-4 uppercase">{vendor.name}</h3>

                                <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-6 font-bold flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${vendor.status === 'Available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                    <span className={`text-[10px] uppercase font-black tracking-widest ${vendor.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{vendor.status}</span>
                                </div>

                                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-tighter italic">
                                    <Phone className="w-4 h-4 mr-2" />
                                    CALL NOW
                                </Button>
                            </Card>
                        )
                    })}
                </div>

                {/* Logistical Note Widget (Light) */}
                <div className="mt-12 flex flex-col items-center text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Official Dispatch System</p>
                    <div className="p-2 px-6 bg-white rounded-full border border-slate-200 shadow-sm">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">All calls are logged for state reimbursement processing.</p>
                    </div>
                </div>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-200 bg-white flex flex-col items-center gap-4 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-400 italic font-medium">Structural Integrity Monitoring active. Dispatch ID: MAINT-SF-2026-012</p>
            </footer>
        </div>
    )
}
