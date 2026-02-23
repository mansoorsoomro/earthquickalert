'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Phone, MapPin, User, ShieldAlert, Siren, Activity, Search, Zap, LogOut } from 'lucide-react'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { Badge } from '@/components/ui/badge'

export default function SpeedDialPage() {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push('/login')
    }

    const { location } = useGeolocation()
    const [countdown, setCountdown] = useState<number | null>(null)

    const emergencyName = "HURRICANE ERIN"
    const emergencyLevel = "CAT 3 - EXTREME DANGER"

    // Mock Auto-Dial simulation
    const handleEmergencyCall = () => {
        setCountdown(3)
    }

    useEffect(() => {
        if (countdown === null) return
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            // "Call" executed
            alert('Calling 911... (This is a simulation)')
            setCountdown(null)
        }
    }, [countdown])

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
                            <h1 className="font-black text-xl tracking-tighter uppercase leading-none text-slate-900 italic">911 SPEED DIAL</h1>
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-black italic">EMERGENCY</span>
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

            <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-7xl mx-auto w-full space-y-8">
                <div className="max-w-md w-full space-y-8">
                    <Card className="bg-white border-slate-200 p-8 rounded-[2.5rem] shadow-sm text-center space-y-6">
                        <div className="relative mx-auto w-32 h-32">
                            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
                            <div className="relative z-10 bg-white border border-red-500/20 w-full h-full rounded-full flex items-center justify-center shadow-sm">
                                <ShieldAlert className="w-16 h-16 text-red-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Emergency Mode</h2>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Automatic Satellite Tracking</p>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <Card className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl text-blue-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Live Dispatch Coordinates</p>
                                    <p className="font-mono text-xl text-slate-900 font-black tracking-tight">
                                        {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Locating Satellites...'}
                                    </p>
                                </div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </Card>

                        <Button
                            onClick={handleEmergencyCall}
                            className={`w-full h-40 text-4xl font-black shadow-lg rounded-[2.5rem] transition-all border-b-8 active:border-b-0 active:translate-y-2 ${countdown !== null ? 'bg-red-800 border-red-950 opacity-90' : 'bg-red-600 border-red-800 hover:bg-red-500'} flex flex-col items-center justify-center gap-3 text-white`}
                        >
                            <Phone className={`w-14 h-14 ${countdown !== null ? 'animate-bounce' : ''}`} />
                            {countdown !== null ? `CONNECTING IN ${countdown}...` : 'CALL 911'}
                            {countdown === null && <span className="text-[10px] font-black tracking-widest uppercase opacity-60 italic">Emergency Broadcast Active</span>}
                        </Button>

                        <div className="bg-slate-100/50 border border-slate-200 p-4 rounded-2xl">
                            <p className="text-center text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
                                <span className="text-slate-900 block mb-1">Silent Call Protocol:</span>
                                If you cannot speak, press 911 and leave the line open. <br />Dispatch will trace your signal and deploy response.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-200 bg-white flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-400 italic font-medium">Smart 911 integration is active. Monitoring ID: DIAL-SF-2026-001</p>
            </footer>
        </div>
    )
}
