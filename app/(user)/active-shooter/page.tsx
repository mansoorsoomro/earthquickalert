'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Phone, ShieldAlert, Footprints, EyeOff, Hand, ChevronRight } from 'lucide-react'

export default function ActiveShooterPage() {
    const router = useRouter()
    const [step, setStep] = useState<number>(0)

    const steps = [
        {
            title: 'RUN',
            icon: Footprints,
            color: 'bg-green-600',
            desc: 'If there is an accessible escape path, attempt to evacuate the premises.',
            points: [
                'Have an escape route and plan in mind',
                'Leave your belongings behind',
                'Keep your hands visible',
                'Follow police instructions'
            ]
        },
        {
            title: 'HIDE',
            icon: EyeOff,
            color: 'bg-blue-600',
            desc: 'If evacuation is not possible, find a place to hide where the active shooter is less likely to find you.',
            points: [
                'Hide in an area out of the active shooter’s view',
                'Block entry to your hiding place and lock the doors',
                'Silence your cell phone and/or pager',
                'Remain quiet'
            ]
        },
        {
            title: 'FIGHT',
            icon: Hand,
            color: 'bg-red-600',
            desc: 'As a last resort, and only when your life is in imminent danger, attempt to disrupt and/or incapacitate the active shooter.',
            points: [
                'Act as aggressively as possible against him/her',
                'Throw items and improvise weapons',
                'Yell',
                'Commit to your actions'
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <div className="bg-slate-800 p-4 sticky top-0 z-50 flex items-center gap-4 shadow-lg border-b border-slate-700">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-slate-700">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg uppercase tracking-wider text-red-500 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    Active Shooter Response
                </h1>
            </div>

            <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">

                <div className="grid grid-cols-3 gap-2 mb-6">
                    {steps.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setStep(i)}
                            className={`p-2 rounded-lg text-center transition-all ${step === i ? s.color + ' ring-2 ring-white scale-105' : 'bg-slate-800 opacity-50'}`}
                        >
                            <s.icon className="w-6 h-6 mx-auto mb-1" />
                            <span className="font-bold text-xs">{s.title}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {/* Proximity Awareness */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Device Proximity Scanning Active</span>
                        </div>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">READY2GO™ AI</span>
                    </div>

                    <div className={`p-6 rounded-2xl ${steps[step].color} shadow-2xl transition-colors duration-500`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                {React.createElement(steps[step].icon, { className: 'w-8 h-8' })}
                            </div>
                            <h2 className="text-4xl font-black italic tracking-tighter">{steps[step].title}</h2>
                        </div>
                        <p className="font-medium text-lg mb-6 leading-relaxed opacity-90">
                            {steps[step].desc}
                        </p>
                        <ul className="space-y-3">
                            {steps[step].points.map((p, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <ChevronRight className="w-5 h-5 mt-0.5 opacity-50" />
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Smart 911 Block */}
                    <div className="space-y-3">
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-16 text-xl shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
                            onClick={() => router.push('/virtual-eoc/911')}
                        >
                            <Phone className="w-6 h-6 mr-3" />
                            CALL 911 NOW
                        </Button>

                        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest">
                                <ShieldAlert className="w-3 h-3" />
                                Smart Dispatch Enabled
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">
                                When you call via Ready2Go, local dispatch automatically receives your <span className="text-white font-bold">Name</span>, current <span className="text-white font-bold">Street Address, City, State, ZIP</span>, and precise <span className="text-white font-bold">GPS Coordinates</span> via the geolocator.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
