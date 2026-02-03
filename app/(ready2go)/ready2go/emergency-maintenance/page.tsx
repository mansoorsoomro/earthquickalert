'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Wrench,
    Droplets,
    Zap,
    Truck,
    Search,
    HardHat,
    Hammer,
    FileSearch,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const maintenanceTickets = [
    { id: 'MNT-1024', type: 'Utility Outage', asset: 'Power Transformer', location: 'Elm Sector', status: 'In Repair', priority: 'High', technician: 'Team Alpha' },
    { id: 'MNT-1025', type: 'Infrastructure', asset: 'Main Bridge Gate', location: 'Harbor Crossing', status: 'Pending', priority: 'Critical', technician: 'Awaiting Dispatch' },
    { id: 'MNT-1023', type: 'Gas Leak', asset: 'Pipeline Valve 4', location: 'Industrial Zone', status: 'Resolved', priority: 'Critical', technician: 'Tech B. Rogers' },
]

export default function EmergencyMaintenance() {
    return (
        <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black text-[#34385E] mb-2 tracking-tight">Emergency Maintenance</h1>
                    <p className="text-slate-500 font-medium italic">Monitor critical infrastructure and coordinate rapid repair teams.</p>
                </div>
                <div className="flex bg-white border border-slate-200 rounded-2xl p-1 overflow-hidden shadow-sm">
                    <button className="px-6 py-2 bg-[#F8FAFC] text-[#34385E] text-xs font-bold rounded-xl shadow-sm">Main View</button>
                    <button className="px-6 py-2 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Team View</button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Active Repair Tickets */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                <Wrench className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Active Repair Tickets</h2>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search ID or Asset..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none w-56" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {maintenanceTickets.map((ticket, i) => (
                            <Card key={i} className="p-6 hover:shadow-lg transition-all border-slate-200 rounded-3xl group cursor-pointer relative overflow-hidden">
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-start gap-5">
                                        <div className={cn("p-4 rounded-2xl shadow-inner", {
                                            'bg-amber-50 text-amber-600': ticket.type === 'Utility Outage',
                                            'bg-blue-50 text-blue-600': ticket.type === 'Infrastructure',
                                            'bg-red-50 text-red-600': ticket.type === 'Gas Leak',
                                        })}>
                                            {ticket.type === 'Utility Outage' ? <Zap className="w-6 h-6" /> : ticket.type === 'Infrastructure' ? <Hammer className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black font-mono text-slate-400 tracking-tighter">{ticket.id}</span>
                                                <h3 className="font-bold text-slate-900">{ticket.asset}</h3>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">{ticket.location} • <span className="text-[#34385E] font-bold underline decoration-slate-200">{ticket.type}</span></p>
                                            <div className="flex items-center gap-4 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <HardHat className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-xs text-slate-500 font-semibold">{ticket.technician}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-xs text-slate-500 font-semibold italic">ETA: 45m</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <span className={cn("text-[10px] font-black uppercase px-3 py-1 rounded-full border-2", {
                                            'border-amber-200 text-amber-600': ticket.priority === 'High',
                                            'border-red-200 text-red-600 animate-pulse': ticket.priority === 'Critical',
                                        })}>{ticket.priority} Priority</span>
                                        <div className="flex gap-2">
                                            <span className={cn("text-[10px] font-bold px-3 py-1 rounded-lg", {
                                                'bg-green-50 text-green-600': ticket.status === 'Resolved',
                                                'bg-blue-50 text-blue-600': ticket.status === 'In Repair' || ticket.status === 'Pending',
                                            })}>{ticket.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-[#34385E] transition-colors" />
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right: Quick Actions & Status */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <Card className="p-8 bg-[#34385E] text-white rounded-3xl border-0 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Wrench className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 tracking-tight">Report Fault</h3>
                        <p className="text-xs text-slate-300 mb-8 font-medium leading-relaxed">Instantly alert maintenance teams about water damage, power issues, or structural concerns.</p>

                        <div className="space-y-3">
                            <Button className="w-full bg-[#EAB308] hover:bg-yellow-500 text-[#34385E] font-extrabold rounded-2xl py-7 shadow-xl shadow-black/20">
                                NEW REPAIR ORDER
                            </Button>
                            <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest py-6">
                                Launch AR Fault Scanner
                            </Button>
                        </div>
                    </Card>

                    <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Infrastructure Vitlas</h3>

                        <Card className="p-5 border-slate-200 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                    <Droplets className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Water System</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Optimal PSI</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </Card>

                        <Card className="p-5 border-slate-200 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Electrical Grid</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">3 Sub-Sectors Down</p>
                                </div>
                            </div>
                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                        </Card>

                        <Card className="p-5 border-slate-200 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                                    <FileSearch className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 underline decoration-slate-200">Asset Registry</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">4,281 Registered Items</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#34385E] transition-colors" />
                        </Card>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">Team Shift Calendar</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium mb-4 italic">6 Teams active • 2 Teams on Standby</p>
                        <Button variant="outline" className="w-full border-slate-300 rounded-xl text-xs font-bold text-slate-600 bg-white">
                            Manage Schedules
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
