'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Phone, Hospital, ShoppingBag, CheckCircle, Search, User, Zap, Info, LogOut } from 'lucide-react'

function ServicesContent() {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push('/login')
    }

    const searchParams = useSearchParams()
    const type = searchParams.get('type') || 'medical'

    const emergencyName = "HURRICANE ERIN"
    const emergencyLevel = "CAT 3 - EXTREME DANGER"

    const title = type === 'medical' ? 'Medical Services' : type === 'community' ? 'Community Emergency Center' : 'Lodging & Essentials'
    const colorClass = type === 'medical' ? 'text-blue-600' : type === 'community' ? 'text-slate-600' : 'text-emerald-600'

    const items = type === 'medical'
        ? [
            { name: 'City General Hospital', address: '500 Health Blvd', status: 'Operational', wait: '45 min', preferred: false },
            { name: 'CVS Pharmacy #442', address: '12 Main St', status: 'Limited Hours', wait: '10 min', preferred: false }
        ]
        : type === 'community'
            ? [
                { name: 'Family Reunification Center', address: 'City Hall - East Wing', status: 'Open 24/7', wait: 'Active', preferred: true },
                { name: 'Red Cross Pop-up Clinic', address: 'Central High Gym', status: 'Supplies Low', wait: '10 min', preferred: false },
                { name: 'FEMA Disaster Assistance', address: 'Library Parking Lot', status: 'Walk-ins', wait: '20 min', preferred: false }
            ]
            : [
                { name: 'Community Food Pantry', address: '300 Help Ln', status: 'Priority Center', wait: 'FREE', preferred: true },
                { name: 'Whole Foods Market', address: '200 Organic Way', status: 'Gluten-Free/Specialty', wait: 'Open', preferred: false },
                { name: 'Holiday Inn Express', address: '100 Hotel Cir', status: '3 Rooms Left', wait: '$120/night', preferred: false },
                { name: 'Shell Gas Station', address: '4400 Highway 1', status: 'Has Fuel', wait: 'No Line', preferred: false },
            ]

    // Priority sorting: Preferred items (like Food Pantries) always first
    const sortedItems = [...items].sort((a, b) => (b.preferred ? 1 : 0) - (a.preferred ? 1 : 0))

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
                            <h1 className="font-black text-xl tracking-tighter uppercase leading-none text-slate-900 italic">{title}</h1>
                            <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded font-black italic border border-slate-200 uppercase tracking-widest leading-none">Intelligence Feed</span>
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

            {/* Metadata Awareness Bar (Light) */}
            <div className="bg-white border-b border-slate-200 p-3 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Radius:</span>
                            <Badge variant="outline" className="text-[10px] bg-slate-50 text-blue-600 border-slate-200 h-5 px-2 font-black">25 MILES</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Updated:</span>
                            <span className="text-[10px] font-bold text-slate-500 italic uppercase">Just Now</span>
                        </div>
                    </div>
                    {type === 'essentials' && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                            <Badge variant="outline" className="text-[9px] border-emerald-200 text-emerald-600 whitespace-nowrap bg-emerald-50 uppercase font-bold">Gluten-Free</Badge>
                            <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-400 whitespace-nowrap uppercase font-bold">Specialty Items</Badge>
                            <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-400 whitespace-nowrap uppercase font-bold">Dairy-Free</Badge>
                        </div>
                    )}
                </div>
            </div>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedItems.map((item, i) => (
                        <Card key={i} className={`bg-white border-slate-200 p-6 rounded-3xl shadow-sm transition-all hover:scale-[1.02] group ${item.preferred ? 'ring-2 ring-emerald-500/50 relative overflow-hidden' : ''}`}>
                            {item.preferred && (
                                <div className="absolute top-0 right-0 bg-emerald-500 px-3 py-1 rounded-bl-xl shadow-lg">
                                    <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Priority Center</span>
                                </div>
                            )}
                            <div className="flex flex-col h-full gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-black text-slate-900 text-xl tracking-tight leading-none uppercase">{item.name}</h4>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.address}</p>
                                    </div>
                                    <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 text-center min-w-[80px]">
                                        <p className="text-sm text-slate-900 font-black italic">{item.wait}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Status</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 py-2 border-y border-slate-100">
                                    <CheckCircle className={`w-4 h-4 ${colorClass}`} />
                                    <span className={`text-xs font-black uppercase tracking-widest ${colorClass}`}>{item.status}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                                    <Button variant="outline" size="lg" className="h-12 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-2xl font-bold uppercase text-[10px]">
                                        <Phone className="w-4 h-4 mr-2 text-slate-400" /> Phone
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-12 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-2xl font-bold uppercase text-[10px]">
                                        <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Directions
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Proactive Help Widget (Light) */}
                    <Card className="bg-slate-50 border-dashed border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-slate-100 transition-colors">
                        <div className="p-4 bg-white rounded-full mb-4 border border-slate-200 shadow-sm">
                            <Info className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-[0.2em] italic">Need something else?</h4>
                        <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed mb-4 italic font-medium">
                            Our AI is constantly indexing local resources. Contact the EOC if a facility is missing.
                        </p>
                        <Button variant="ghost" size="sm" className="text-blue-600 font-black hover:bg-blue-500/10 uppercase tracking-widest text-[10px]">MESSAGE EOC</Button>
                    </Card>
                </div>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-200 bg-white flex flex-col items-center gap-4 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-400 italic font-medium">Real-time resource validation active. Monitoring ID: SERV-SF-2026-001</p>
            </footer>
        </div>
    )
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-400 font-black tracking-widest text-sm italic animate-pulse uppercase">Syncing EOC Data Feed...</div>}>
            <ServicesContent />
        </Suspense>
    )
}
