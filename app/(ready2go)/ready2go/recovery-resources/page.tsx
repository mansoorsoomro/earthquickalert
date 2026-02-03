'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    HeartHandshake,
    FileText,
    Users,
    MapPin,
    Hammer,
    DollarSign,
    Heart,
    ExternalLink,
    Info,
    ChevronRight,
    ClipboardCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const federalResources = [
    { name: 'FEMA Individual Assistance', desc: 'Apply for disaster-related financial support.', status: 'Active', link: '#' },
    { name: 'SBA Disaster Loans', desc: 'Low-interest loans for businesses and homeowners.', status: 'Open', link: '#' },
]

const localRecovery = [
    { name: 'Main St Donation Center', type: 'Supplies', items: 'Water, Food, Blankets', status: 'Accepting' },
    { name: 'Volunteer Hub (Sector 4)', type: 'Mobilization', items: 'Cleanup Teams', status: 'Full' },
    { name: 'Community Relief Fund', type: 'Financial', items: 'Direct Grants', status: 'Active' },
]

export default function RecoveryResources() {
    return (
        <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-black text-[#34385E] mb-2 tracking-tight">Recovery Resources</h2>
                    <p className="text-slate-500 font-medium italic">Rebuilding together. Access support, cleanup, and financial aid.</p>
                </div>
                <div className="flex bg-blue-50 border border-blue-100 rounded-2xl p-4 gap-4 items-center">
                    <Heart className="w-8 h-8 text-blue-500 fill-blue-500" />
                    <div>
                        <p className="text-sm font-bold text-blue-900 leading-tight">$2.4M Raised</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Community Fund</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Financial & Policy Aid */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2 px-1">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Federal & Financial Aid</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {federalResources.map((res, i) => (
                                <Card key={i} className="p-6 border-slate-200 rounded-3xl hover:shadow-lg transition-all flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black uppercase tracking-tighter">{res.status}</span>
                                            <ClipboardCheck className="w-5 h-5 text-slate-300" />
                                        </div>
                                        <h3 className="font-bold text-slate-900">{res.name}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">{res.desc}</p>
                                    </div>
                                    <Button className="w-full mt-6 bg-[#34385E] hover:bg-[#2A2D4A] text-white font-bold rounded-xl h-10 text-xs">
                                        Start Application
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2 px-1">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                <HeartHandshake className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Cleanup & Rebuilding</h2>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Card className="p-6 border-slate-200 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50">
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Hammer className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800 mb-1">Tool Lending</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">4 Units Available</p>
                            </Card>
                            <Card className="p-6 border-slate-200 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800 mb-1">Labor Match</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">12 Ongoing Jobs</p>
                            </Card>
                            <Card className="p-6 border-slate-200 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50">
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800 mb-1">Debris Sites</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase underline decoration-red-200">View Active Hubs</p>
                            </Card>
                        </div>
                    </div>

                    <Card className="p-8 bg-slate-900 text-white rounded-[32px] border-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <DollarSign className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h3 className="text-2xl font-black italic tracking-tight">Recovery Impact Survey</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Submit your property assessment to help us prioritize neighborhood rebuilding grants and city services.</p>
                            </div>
                            <Button className="px-10 py-7 bg-[#EAB308] hover:bg-yellow-500 text-[#34385E] font-black rounded-2xl shadow-xl shadow-blue-500/10">
                                TAKE SURVEY
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right: Local Donation & Involvement */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="flex items-center gap-3 mb-2 px-1">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Heart className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Community Hubs</h2>
                    </div>

                    <Card className="p-0 overflow-hidden border-slate-200 rounded-2xl shadow-md">
                        <div className="divide-y divide-slate-100">
                            {localRecovery.map((hub, i) => (
                                <div key={i} className="p-5 hover:bg-slate-50/50 transition-all flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900 text-sm">{hub.name}</h4>
                                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter", {
                                            'bg-blue-50 text-blue-600': hub.status === 'Accepting' || hub.status === 'Active',
                                            'bg-slate-100 text-slate-400': hub.status === 'Full',
                                        })}>{hub.status}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{hub.type}</p>
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-xs text-slate-600 font-medium italic">Needs: {hub.items}</p>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-[#34385E] flex justify-center">
                            <Button variant="ghost" className="text-xs font-black text-white tracking-widest uppercase hover:bg-white/10">Open Live Map</Button>
                        </div>
                    </Card>

                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <Info className="w-4 h-4 text-slate-400" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Important Dates</p>
                        </div>
                        <div className="space-y-4 pt-1">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black text-red-500 uppercase leading-none">Feb</span>
                                    <span className="text-sm font-black text-slate-800 leading-none">15</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-800 tracking-tight">FEMA App Deadline</p>
                                    <p className="text-[10px] text-slate-400 font-medium">12 Day remaining</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black text-blue-500 uppercase leading-none">Feb</span>
                                    <span className="text-sm font-black text-slate-800 leading-none">22</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-800 tracking-tight">Town Hall Recovery</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Virtual Attendence Open</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full p-5 bg-white border border-slate-200 rounded-3xl flex items-center justify-between group hover:shadow-xl transition-all border-l-4 border-l-orange-400">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-900 mb-0.5">Become a Volunteer</p>
                                <p className="text-[10px] text-slate-400 font-medium italic">Join the response network</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-orange-400 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    )
}
