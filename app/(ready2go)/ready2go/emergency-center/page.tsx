'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    ShieldAlert,
    Stethoscope,
    PhoneCall,
    Users,
    Activity,
    AlertTriangle,
    ChevronRight,
    Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const activeIncidents = [
    { id: 'INC-772', type: 'Flooding', location: 'Main St & 5th', status: 'In Progress', severity: 'High', time: '12 min ago' },
    { id: 'INC-771', type: 'Power Line Down', location: 'Oak Avenue', status: 'Dispatched', severity: 'Critical', time: '5 min ago' },
    { id: 'INC-770', type: 'Medical Emergency', location: 'Shelter Hub B', status: 'Contained', severity: 'Medium', time: '28 min ago' },
]

const clinics = [
    { name: 'Pop-Up Medical Clinic A', location: 'Central High Gym', status: 'Open', wait: '15 min' },
    { name: 'Mobile Unit 4', location: 'Harbor Marina', status: 'Active', wait: '5 min' },
    { name: 'Red Cross First Aid', location: 'Downtown Plaza', status: 'Open', wait: '45 min' },
]

export default function EmergencyCenter() {
    return (
        <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black text-[#34385E] mb-2 tracking-tight">Emergency Center</h1>
                    <p className="text-slate-500 font-medium italic">Command center for incident response and medical coordination.</p>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-red-700 font-black text-xs uppercase tracking-widest">Live Operations Mode</span>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Active Incidents */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Active Incidents</h2>
                        </div>
                        <Button variant="link" className="text-xs font-bold text-[#34385E]">View Full Log</Button>
                    </div>

                    <div className="space-y-3">
                        {activeIncidents.map((inc, i) => (
                            <Card key={i} className="p-0 overflow-hidden border-slate-200 rounded-2xl hover:border-slate-300 transition-all group">
                                <div className="flex items-stretch h-24">
                                    <div className={cn("w-2", {
                                        'bg-red-500': inc.severity === 'Critical',
                                        'bg-orange-500': inc.severity === 'High',
                                        'bg-blue-500': inc.severity === 'Medium',
                                    })} />
                                    <div className="flex-1 p-5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black font-mono text-slate-400">ID: {inc.id}</span>
                                                <h3 className="font-bold text-slate-900">{inc.type}</h3>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">{inc.location}</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div className="flex items-center gap-2 justify-end mb-1">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span className="text-xs font-medium text-slate-400">{inc.time}</span>
                                            </div>
                                            <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded", {
                                                'bg-red-100 text-red-600': inc.status === 'Dispatched',
                                                'bg-orange-100 text-orange-600': inc.status === 'In Progress',
                                                'bg-green-100 text-green-600': inc.status === 'Contained',
                                            })}>{inc.status}</span>
                                        </div>
                                    </div>
                                    <div className="w-12 border-l border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors cursor-pointer">
                                        <ChevronRight className="w-5 h-5 text-slate-300" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-6 bg-slate-50 border-slate-200 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#34385E]">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 underline decoration-slate-200">Personnel Status</h4>
                                <p className="text-xs text-slate-500 font-medium">85 Units Dispatched</p>
                            </div>
                        </Card>
                        <Card className="p-6 bg-slate-50 border-slate-200 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#34385E]">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 underline decoration-slate-200">System Vitals</h4>
                                <p className="text-xs text-slate-500 font-medium font-mono uppercase">All Networks Online</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right: Medical & Contacts */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="flex items-center gap-3 mb-2 px-1">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Medical Assets</h2>
                    </div>

                    <Card className="p-0 overflow-hidden border-slate-200 rounded-2xl ring-1 ring-slate-200/50">
                        <div className="divide-y divide-slate-100">
                            {clinics.map((clinic, i) => (
                                <div key={i} className="p-5 hover:bg-slate-50/50 transition-all flex justify-between items-center group cursor-pointer">
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-900 text-sm tracking-tight">{clinic.name}</p>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase">{clinic.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Wait Time</p>
                                        <p className="text-xs font-black text-green-600 group-hover:underline underline-offset-4">{clinic.wait}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                            <Button variant="ghost" className="text-xs font-black text-[#34385E] tracking-widest uppercase">Request Medical Transport</Button>
                        </div>
                    </Card>

                    <div className="space-y-3 pt-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Priority Contacts</h3>
                        <button className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 shadow-inner">
                                    <PhoneCall className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">EOC Dispatch</p>
                                    <p className="text-xs text-slate-400 font-medium italic">Priority Line 1</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-400 transition-colors" />
                        </button>
                        <button className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shadow-inner">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">State Patrol HQ</p>
                                    <p className="text-xs text-slate-400 font-medium italic">Coordination Center</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                        </button>
                    </div>

                    <Card className="p-6 border-amber-200 bg-amber-50 rounded-2xl border-2 border-dashed flex flex-col items-center text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
                        <h3 className="font-bold text-slate-900 text-sm mb-1">Incident Submission</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Manual incident override for field reporters and off-network units.</p>
                        <Button className="w-full bg-[#34385E] text-white hover:bg-slate-800 rounded-xl py-5 text-xs font-bold shadow-xl shadow-blue-900/10 uppercase tracking-widest">
                            Open Report Override
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
