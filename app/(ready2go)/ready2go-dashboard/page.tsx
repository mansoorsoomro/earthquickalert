'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Phone,
    MapPin,
    Navigation,
    Home,
    Share2,
    Cloud,
    Wind,
    Eye,
    ChevronRight,
    PlusCircle,
    Stethoscope,
    Briefcase,
    Building2,
    Heart,
    Users
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function Ready2GoDashboard() {
    const [showSubmitModal, setShowSubmitModal] = useState(false)

    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto bg-[#F8FAFC]">

            {/* Search Header Area */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-96">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34385E]/10"
                    />
                </div>
            </div>

            {/* Virtual Emergency Operations Center Banner */}
            <Card className="p-0 bg-transparent rounded-3xl border-0 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/Frame 1618873823 copy.png" alt="EOC Background" fill className="object-cover object-center" />
                </div>
                <div className="relative z-10 p-10 bg-gradient-to-r from-black/60 via-transparent to-black/30 flex items-center justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-2xl font-extrabold mb-3 tracking-tight text-white">Virtual Emergency Operations Center</h1>
                        <p className="text-slate-200 text-xl md:text-2xl mb-4">Critical life-safety information and resources for your area — updated in real time</p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-3 px-5 py-2 bg-white border-2 border-green-400 text-green-600 rounded-full text-sm font-bold">
                                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                ACTIVE
                            </span>
                        </div>

                        <div className="text-right">
                            <div className="text-slate-200 text-sm">Last Updated</div>
                            <div className="text-white text-lg font-bold">12:45 PM EST</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Hurricane Erin Emergency Alert Section */}
            <Card className="p-0 border-0 rounded-3xl shadow-xl overflow-hidden ring-1 ring-slate-200">
                <div className="bg-white p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Hurricane Erin - Category 3</h2>
                    <p className="text-slate-500 mb-8 max-w-3xl">Major Hurricane approaching coastal areas. Immediate evacuation required for zones A, B, and C. Sustained winds of 115 mph with dangerous storm surge expected.</p>

                    <div className="grid grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col items-center text-center group hover:bg-orange-100 transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-orange-600">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-slate-900 mb-1">Evacuate</p>
                            <p className="text-xs text-slate-500 font-medium font-mono uppercase">Zones A, B, C</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col items-center text-center group hover:bg-orange-100 transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-orange-600">
                                <Home className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-slate-900 mb-1">Shelter-in-Place</p>
                            <p className="text-xs text-slate-500 font-medium font-mono uppercase">Zone D</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center group hover:bg-slate-100 transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-amber-500">
                                <span className="text-xl font-bold">〰</span>
                            </div>
                            <p className="font-bold text-slate-900 mb-1">Avoid Travel</p>
                            <p className="text-xs text-slate-500 font-medium font-mono uppercase">All Roads</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center group hover:bg-slate-100 transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-slate-400">
                                <Cloud className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-slate-900 mb-1">Weather Alert</p>
                            <p className="text-xs text-green-500 font-bold font-mono uppercase underline decoration-2 underline-offset-4">Active</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Life-Safety & Weather Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Life-Safety Action Buttons */}
                <div className="col-span-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 px-1">Life-Safety Action Buttons</h3>
                    <p className="text-slate-500 mb-6 px-1">Use these quick options to stay safe during severe weather events.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:shadow-lg transition-all active:scale-[0.98]">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-inner">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-red-600">911 Speed Dial</p>
                                <p className="text-xs text-slate-400 font-medium">Direct connection to local 911</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:shadow-lg transition-all active:scale-[0.98]">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-blue-600">Hospital Locator</p>
                                <p className="text-xs text-slate-400 font-medium">Nearest medical facilities</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:shadow-lg transition-all active:scale-[0.98]">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-inner">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-green-600">Evacuation Routes</p>
                                <p className="text-xs text-slate-400 font-medium">GPS navigation to safety</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:shadow-lg transition-all active:scale-[0.98]">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-inner">
                                <Home className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-purple-600">Shelter Locations</p>
                                <p className="text-xs text-slate-400 font-medium">Safe shelter sites nearby</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl text-left hover:shadow-lg transition-all active:scale-[0.98] col-span-1"
                        >
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">Report Conditions</p>
                                <p className="text-xs text-slate-400 font-medium">Share updates</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Real-Time Weather & Traffic */}
                <div className="col-span-4">
                    <Card className="flex flex-col h-full bg-transparent text-white rounded-3xl border-0 overflow-hidden shadow-xl">
                        <div className="relative w-full h-72 overflow-hidden rounded-3xl">
                            <Image src="/image 89.png" alt="Weather Background" fill className="object-cover object-center" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#4b4268]/70 via-[#34385E]/55 to-[#34385E]/60 flex flex-col justify-between relative overflow-visible">
                                <div className="p-6">
                                    <h3 className="font-bold text-lg md:text-xl text-white">Real-Time Weather & Traffic</h3>
                                </div>

                                <div className="p-6 flex-1 text-white pt-2 pb-28">
                                    <div className="mb-1">
                                        <span className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none">72°F</span>
                                    </div>
                                    <p className="text-slate-200 font-medium mb-6">Partly Cloudy</p>

                                    <div className="mb-6 relative">
                                        <div className="absolute left-6 right-6 top-20 md:top-24 z-40">
                                            <div className="rounded-[28px] bg-rose-50 border border-rose-200 p-6 text-rose-700 shadow-lg">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="font-bold text-2xl leading-tight">
                                                        <span className="block">Active</span>
                                                        <span className="block">Alerts</span>
                                                    </h4>
                                                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-bold border border-pink-200">CRITICAL</span>
                                                </div>
                                                <ul className="list-disc pl-6 text-lg leading-relaxed text-rose-700 mt-4 space-y-3">
                                                    <li>I-95 South: Closed due to flooding</li>
                                                    <li>Downtown: High wind zone - avoid tall buildings</li>
                                                    <li>Storm surge: 8-12 feet above normal</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-20 relative z-20">
                                        <div className="p-5 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                                <Eye className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 mb-1">Visibility</p>
                                            <p className="text-sm font-black text-blue-500">0.5 miles</p>
                                        </div>

                                        <div className="p-5 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                                <Wind className="w-6 h-6 text-slate-700" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 mb-1">Wind Speed</p>
                                            <p className="text-sm font-black text-slate-700">115 mph</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 relative z-10">
                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl py-3">
                                        Full Feed Status
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Activated Emergency Resources */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-5">
                    <Card className="p-8 border-slate-200 rounded-3xl shadow-lg ring-1 ring-slate-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Activated Emergency Resources</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Stethoscope, label: 'Pop-Up Medical Clinics', count: '2 Locations', color: 'blue' },
                                { icon: Briefcase, label: 'Private and Non-Profit Sector', count: '4 Locations', color: 'amber' },
                                { icon: Home, label: 'FEMA Assistance Booths', count: '2 Locations', color: 'green' },
                                { icon: Heart, label: 'Red Cross Stations', count: '5 Locations', color: 'red' },
                                { icon: Users, label: 'Family Reunification', count: '1 Location', color: 'purple' },
                            ].map((res, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-2.5 rounded-lg group-hover:scale-110 transition-transform", {
                                            'bg-blue-100 text-blue-600': res.color === 'blue',
                                            'bg-amber-100 text-amber-600': res.color === 'amber',
                                            'bg-green-100 text-green-600': res.color === 'green',
                                            'bg-red-100 text-red-600': res.color === 'red',
                                            'bg-purple-100 text-purple-600': res.color === 'purple',
                                        })}>
                                            <res.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm">{res.label}</span>
                                    </div>
                                    <span className={cn("text-xs font-bold underline decoration-1 underline-offset-4 decoration-current", {
                                        'text-blue-500': res.color === 'blue',
                                        'text-amber-500': res.color === 'amber',
                                        'text-green-500': res.color === 'green',
                                        'text-red-500': res.color === 'red',
                                        'text-purple-500': res.color === 'purple',
                                    })}>{res.count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Lodging & Essential Resources */}
                <div className="col-span-7">
                    <Card className="p-8 border-slate-200 rounded-3xl shadow-lg ring-1 ring-slate-200/50 h-full flex flex-col">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Lodging & Essential Resources</h3>

                        <div className="space-y-8 flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-[#34385E]">
                                    <Home className="w-4 h-4" />
                                    <h4 className="font-bold text-sm tracking-wide">Available Hotels</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-bold px-1">
                                        <span className="text-slate-600 italic">Home 2 Suites, Newark</span>
                                        <span className="text-green-500 uppercase tracking-tighter underline">Available</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold px-1 py-1">
                                        <span className="text-slate-600 italic">Holiday Inn Express</span>
                                        <span className="text-red-500 uppercase tracking-tighter underline">Limited</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4 text-slate-900">
                                    <span className="text-lg">🥣</span>
                                    <h4 className="font-bold text-sm tracking-wide">Food & Essentials</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-bold px-1">
                                        <span className="text-slate-600 italic">Community Food Pantry</span>
                                        <span className="text-green-500 uppercase tracking-tighter underline">Open</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold px-1 py-1">
                                        <span className="text-slate-600 italic">Walmart Supercenter</span>
                                        <span className="text-green-500 uppercase tracking-tighter underline">Open</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4 text-[#34385E]">
                                    <span>⛽</span>
                                    <h4 className="font-bold text-sm tracking-wide uppercase">Gas Stations</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-bold px-1">
                                        <span className="text-slate-600 italic tracking-tight">Shell Station (Main St)</span>
                                        <span className="text-green-500 uppercase tracking-tighter underline">Fuel Available</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold px-1 py-1">
                                        <span className="text-slate-600 italic tracking-tight">BP (HWY 101)</span>
                                        <span className="text-red-500 uppercase tracking-tighter underline">No Fuel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recovery Resources (Post-Disaster) */}
            <h3 className="text-xl font-bold text-slate-800 mb-0 pt-4 px-1">Recovery Resources (Post-Disaster)</h3>
            <p className="text-slate-400 text-sm mb-6 px-1 italic">This section will be activated once the area is declared safe for re-entry.</p>

            <div className="flex flex-wrap gap-4">
                {[
                    { label: 'Donation Centers', color: 'bg-purple-500' },
                    { label: 'Pharmacy Shifts', color: 'bg-blue-500' },
                    { label: 'View All Clinics', color: 'bg-[#34385E]' },
                    { label: 'FEMA Assistance', color: 'bg-red-500' },
                    { label: 'Red Cross Relief', color: 'bg-green-500' },
                ].map((btn, i) => (
                    <button
                        key={i}
                        className={cn("px-8 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-[0.98] hover:opacity-90", btn.color)}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Submit Update Modal Placeholder */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-1">Submit Update</h2>
                                    <p className="text-sm text-slate-500 font-medium">Share photos, videos, or information from your location to support emergency response efforts.</p>
                                </div>
                                <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <PlusCircle className="w-8 h-8 rotate-45" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">User</label>
                                    <input type="text" placeholder="Enter your name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</label>
                                    <input type="text" placeholder="Enter incident location" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                                <textarea rows={4} placeholder="Briefly describe what you're seeing (damage, roads, hazards, resources)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none resize-none" />
                            </div>

                            <div className="space-y-2 mb-8">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Media</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer group">
                                    <Cloud className="w-10 h-10 text-slate-300 mb-3 group-hover:text-blue-400 transition-colors" />
                                    <p className="text-sm text-slate-400 font-bold mb-4">Drag and drop your media here</p>
                                    <div className="text-xs text-slate-300 font-medium mb-4">— or —</div>
                                    <button className="px-10 py-2.5 bg-[#34385E] text-white rounded-xl font-bold text-xs shadow-md">Browse</button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <button onClick={() => setShowSubmitModal(false)} className="px-8 py-3 text-slate-500 font-bold text-sm hover:underline">Cancel</button>
                                <button className="px-10 py-3 bg-[#34385E] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-900/10">Submit</button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
