'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wrench, Zap, Droplets, HardHat, AlertTriangle, CheckCircle2, Search, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'

const TICKETS = [
  {
    id: 'MNT-442',
    title: 'Water Main Break - Sector 4',
    priority: 'Critical',
    status: 'In Progress',
    assigned: 'Tactical Team A',
    time: '24m ago',
    type: 'Utility'
  },
  {
    id: 'MNT-445',
    title: 'Backup Generator Fault - Triage 2',
    priority: 'High',
    status: 'Dispatched',
    assigned: 'Eng Team 7',
    time: '45m ago',
    type: 'Electrical'
  },
  {
    id: 'MNT-448',
    title: 'Debris Removal - Harbor Way',
    priority: 'Medium',
    status: 'Pending',
    assigned: 'Public Works 3',
    time: '1h 12m ago',
    type: 'Infrastructure'
  }
]

export default function MaintenancePage() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen p-8">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-24">
        
        {/* Page Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-2">
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-4 py-1 font-black text-[10px] uppercase tracking-widest rounded-full mb-2">Emergency Hub</Badge>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                        <Wrench size={24} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Emergency Maintenance</h1>
                </div>
                <p className="text-slate-500 font-medium text-lg max-w-2xl">Infrastructure restoration and utility repair management for disaster recovery zones.</p>
            </div>
            <div className="flex gap-4">
                <div className="relative group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                    <Input 
                        className="h-14 pl-12 pr-4 bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm"
                        placeholder="Search Ticket ID..."
                    />
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
                        <AlertTriangle size={24} />
                    </div>
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200">Critical</Badge>
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Critical Faults</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">14</p>
            </Card>
            <Card className="p-6 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                        <Zap size={24} />
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-black text-[9px]">Grid Active</Badge>
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Power Issues</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">08</p>
            </Card>
            <Card className="p-6 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                        <Droplets size={24} />
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-black text-[9px]">Water Static</Badge>
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Water Leaks</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">03</p>
            </Card>
            <Card className="p-6 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={24} />
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-black text-[9px]">24h Res</Badge>
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolved</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">42</p>
            </Card>
        </div>

        {/* Ticket List */}
        <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono">Active Maintenance Tickets</h2>
                <div className="flex gap-4">
                    <button className="text-[10px] h-10 px-6 rounded-xl border border-slate-200 bg-white font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Filter</button>
                    <button className="text-[10px] h-10 px-6 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">New Ticket</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {TICKETS.map((ticket, idx) => (
                    <Card key={idx} className="p-8 rounded-[40px] border-none shadow-xl shadow-slate-200/50 bg-white group hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer overflow-hidden relative">
                        <div className={`absolute top-0 left-0 w-2 h-full ${ticket.priority === 'Critical' ? 'bg-rose-500' : ticket.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                {ticket.type === 'Utility' ? <Droplets size={24} /> : ticket.type === 'Electrical' ? <Zap size={24} /> : <HardHat size={24} />}
                                <p className="text-[8px] font-black uppercase mt-1 tracking-widest">{ticket.type.slice(0,3)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{ticket.id}</p>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-amber-600 transition-colors">{ticket.title}</h3>
                                <div className="flex items-center gap-4 mt-3">
                                    <Badge className={`${ticket.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : ticket.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'} border-none font-black text-[9px] px-3 py-1`}>
                                        {ticket.priority} Priority
                                    </Badge>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                        <Clock size={12} /> {ticket.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 md:text-right">
                            <div className="hidden lg:block">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Assigned Unit</p>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{ticket.assigned}</p>
                            </div>
                            <div className="min-w-[140px]">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Internal Status</p>
                                <Badge className={`${ticket.status === 'In Progress' ? 'bg-indigo-600' : ticket.status === 'Dispatched' ? 'bg-amber-500' : 'bg-slate-400'} text-white border-none py-1.5 px-4 font-black uppercase text-[10px] tracking-widest rounded-full w-full justify-center`}>
                                    {ticket.status}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
