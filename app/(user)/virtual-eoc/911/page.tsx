'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Phone, MapPin, User, ShieldAlert, Siren, Activity } from 'lucide-react'
import { useGeolocation } from '@/lib/hooks/use-geolocation'

export default function SpeedDialPage() {
    const router = useRouter()
    const { location } = useGeolocation()
    const [countdown, setCountdown] = useState<number | null>(null)

    const emergencyName = "HURRICANE ERIN"
    const emergencyLevel = "CAT 4 - EXTREME DANGER"

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
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            {/* Command Center Header */}
            <div className="bg-red-700 p-4 shadow-2xl sticky top-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-red-600 animate-pulse opacity-50"></div>
                <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20 rounded-xl">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-xl tracking-tighter uppercase leading-none">911 SPEED DIAL</h1>
                                <span className="bg-white text-red-700 text-[10px] px-2 py-0.5 rounded font-black italic">EMERGENCY</span>
                            </div>
                            <p className="text-[10px] font-bold text-red-100 uppercase tracking-widest opacity-80">{emergencyName} • {emergencyLevel}</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-7xl mx-auto w-full space-y-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32">
                            <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping"></div>
                            <div className="relative z-10 bg-slate-900 border border-red-500/30 w-full h-full rounded-full flex items-center justify-center shadow-2xl">
                                <ShieldAlert className="w-16 h-16 text-red-500 shadow-red-500/50" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Emergency Mode</h2>
                            <p className="text-slate-400 text-sm font-medium">Automatic GPS Tracking Active</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-800 rounded-2xl text-slate-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Live Dispatch Coordinates</p>
                                    <p className="font-mono text-xl text-white font-black tracking-tight">
                                        {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Locating Satellite...'}
                                    </p>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                        </Card>

                        <Button
                            onClick={handleEmergencyCall}
                            className={`w-full h-40 text-4xl font-black shadow-2xl rounded-[2.5rem] transition-all border-b-8 active:border-b-0 active:translate-y-2 ${countdown !== null ? 'bg-red-900 border-red-950 opacity-90' : 'bg-red-600 border-red-800 hover:bg-red-500 hover:scale-[1.02]'} flex flex-col items-center justify-center gap-3`}
                        >
                            <Phone className={`w-14 h-14 ${countdown !== null ? 'animate-bounce' : ''}`} />
                            {countdown !== null ? `CALLING IN ${countdown}...` : 'CALL 911'}
                            {countdown === null && <span className="text-xs font-bold tracking-widest uppercase opacity-60">Tap to dial now</span>}
                        </Button>

                        <div className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-2xl">
                            <p className="text-center text-xs text-slate-500 font-medium leading-relaxed">
                                <span className="text-slate-300 font-bold block mb-1 uppercase tracking-tighter">Silent Call Protocol:</span>
                                If you cannot speak, press 911 and leave the line open. <br />Dispatch will trace your signal and deploy response.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modern High-Tech Footer */}
            <footer className="p-8 border-t border-slate-900 bg-slate-950 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.2em]">OFFICIAL EMERGENCY BROADCAST SYSTEM • EST 2026</p>
                </div>
                <p className="text-[9px] text-slate-700 italic">Smart 911 integration is active. Monitoring ID: DIAL-SF-2026-001</p>
            </footer>
        </div>
    )
}
