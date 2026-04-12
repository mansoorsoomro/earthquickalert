'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Wrench, 
    Zap, 
    Droplets, 
    HardHat, 
    AlertTriangle, 
    CheckCircle2, 
    Search, 
    Clock,
    Activity,
    Target,
    Shield,
    ChevronRight,
    ArrowUpRight,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
    <main className="min-h-screen bg-[#0A0B10] p-8 lg:p-12 space-y-12 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-amber-600/20">
                    <Wrench size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Maintenance Matrix</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Infrastructure Restoration & Utility Command</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-amber-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Ticket ID..."
                    className="h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all w-72"
                />
            </div>
            <Button className="h-14 px-8 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-amber-600/20 gap-3">
                 <Plus size={16} /> New Ticket
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { label: 'Critical Faults', value: '14', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10', sub: 'High Priority' },
            { label: 'Electrical Grid', value: '08', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'Active Outages' },
            { label: 'Water Systems', value: '03', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10', sub: 'Supply Integrity' },
            { label: 'Resolved Tickets', value: '42', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: 'Final Closure' }
          ].map((stat, i) => (
            <Card key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] shadow-2xl group hover:bg-white/[0.04] transition-all relative overflow-hidden">
                <div className={cn("absolute right-8 top-8 w-12 h-12 rounded-2xl flex items-center justify-center transition-all", stat.bg, stat.color)}>
                    <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{stat.label}</p>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">{stat.value}</h3>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">{stat.sub}</p>
            </Card>
          ))}
      </div>

      {/* Ticket List Section */}
      <div className="space-y-8 pb-20">
          <div className="flex items-center justify-between px-4">
              <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Active Operations</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Real-time infrastructure repair stream</p>
              </div>
              <Button variant="ghost" className="h-10 px-6 rounded-xl border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 gap-2">
                  <Activity size={14} /> Filter Status
              </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
              {TICKETS.map((ticket, idx) => (
                  <Card key={idx} className="p-10 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-2xl group hover:bg-white/[0.02] transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer overflow-hidden relative">
                      <div className={cn(
                          "absolute top-0 left-0 w-2 h-full transition-all",
                          ticket.priority === 'Critical' ? 'bg-rose-600' : ticket.priority === 'High' ? 'bg-amber-600' : 'bg-blue-600'
                      )} />
                      
                      <div className="flex items-center gap-8">
                          <div className="w-20 h-20 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-slate-500 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xl">
                              {ticket.type === 'Utility' ? <Droplets size={32} /> : ticket.type === 'Electrical' ? <Zap size={32} /> : <HardHat size={32} />}
                              <p className="text-[8px] font-black uppercase mt-1 tracking-widest">{ticket.type.slice(0,3)}</p>
                          </div>
                          <div>
                              <div className="flex items-center gap-3 mb-2">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{ticket.id}</span>
                                  <Badge className={cn(
                                      "border-none font-black text-[8px] px-3 py-1 rounded-full uppercase",
                                      ticket.priority === 'Critical' ? 'bg-rose-600/20 text-rose-500' : 'bg-amber-600/20 text-amber-500'
                                  )}>
                                      {ticket.priority} Priority
                                  </Badge>
                              </div>
                              <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-amber-500 transition-colors uppercase lowercase first-letter:uppercase">{ticket.title}</h3>
                              <div className="flex items-center gap-4 mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                  <Clock size={12} className="text-amber-500" /> {ticket.time}
                                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                                  <Activity size={12} className="text-blue-500" /> {ticket.assigned}
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-12">
                          <div className="text-right">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Operational Status</p>
                              <Badge className={cn(
                                  "text-white border-none py-2 px-6 font-black uppercase text-[10px] tracking-widest rounded-full w-full justify-center shadow-2xl transition-all",
                                  ticket.status === 'In Progress' ? 'bg-blue-600 shadow-blue-600/20' : ticket.status === 'Dispatched' ? 'bg-amber-600 shadow-amber-600/20' : 'bg-slate-700'
                              )}>
                                  {ticket.status}
                              </Badge>
                          </div>
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-600 transition-all">
                              <ArrowUpRight size={24} />
                          </div>
                      </div>
                  </Card>
              ))}
          </div>
      </div>
    </main>
  )
}
