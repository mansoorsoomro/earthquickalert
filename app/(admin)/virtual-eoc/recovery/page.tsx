'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    RefreshCw, 
    DollarSign, 
    Home, 
    Heart, 
    ShieldCheck, 
    Zap, 
    ChevronRight, 
    FileText, 
    Users, 
    MapPin,
    Activity,
    Target,
    ArrowUpRight,
    Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const RECOVERY_PROGRAMS = [
  {
    title: 'Individual Assistance (IA)',
    org: 'FEMA',
    status: 'Applications Open',
    desc: 'Financial assistance and direct services to eligible individuals and households.',
    icon: Home,
    color: 'text-blue-500',
    bg: 'bg-blue-600/10'
  },
  {
    title: 'Disaster Unemployment',
    org: 'State Workforce',
    status: 'Active Feed',
    desc: 'Benefits for individuals whose employment has been impacted by the disaster.',
    icon: DollarSign,
    color: 'text-emerald-500',
    bg: 'bg-emerald-600/10'
  },
  {
    title: 'Crisis Counseling',
    org: 'Health & Human Services',
    status: 'Ready',
    desc: 'Mental health support and counseling for disaster survivors and responders.',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-600/10'
  }
]

export default function RecoveryPage() {
  return (
    <main className="min-h-screen bg-[#0A0B10] p-8 lg:p-12 space-y-12 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-600/20">
                    <RefreshCw size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Recovery Matrix</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Resource Restoration & Aid Calibration</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 py-3 px-6 bg-white/5 border border-white/10 rounded-2xl text-slate-400">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                    Phase: <span className="text-emerald-500">Long-term Restoration</span>
                </span>
            </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-transparent p-12 rounded-[48px] border border-emerald-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 text-emerald-500/5 grayscale group-hover:grayscale-0 transition-all duration-1000">
          <Target size={200} />
        </div>
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex h-8 px-4 rounded-xl items-center bg-emerald-600/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
             Strategic Recovery Hub
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Unified Assistance Framework</h2>
          <p className="text-slate-400 font-medium leading-relaxed text-lg max-w-2xl">
            Coordinated pathways for individual and community restoration. Synchronize federal aid, local grants, and humanitarian logistics mapping.
          </p>
          <div className="flex items-center gap-4 pt-4">
              <div className="px-6 py-3 bg-emerald-600 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/20">
                  IA Declaration: S-ZONE 04
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
            <div className="px-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active Assistance Streams</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Authorized federal and state aid programs</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {RECOVERY_PROGRAMS.map((program, idx) => (
                    <Card key={idx} className="p-10 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-2xl group hover:bg-white/[0.02] transition-all flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer overflow-hidden relative">
                        <div className="flex items-center gap-8">
                            <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl", program.bg, program.color)}>
                                <program.icon size={36} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{program.org}</p>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-emerald-500 transition-colors uppercase lowercase first-letter:uppercase">{program.title}</h3>
                                <p className="text-sm font-medium text-slate-400 max-w-md leading-relaxed mt-3 lowercase first-letter:uppercase">{program.desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-6">
                            <Badge className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 py-2 px-6 font-black uppercase text-[10px] tracking-widest rounded-full w-full justify-center shadow-2xl">
                                {program.status}
                            </Badge>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-emerald-600 transition-all">
                                <ArrowUpRight size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Sidebar: Documentation Hub */}
        <div className="lg:col-span-4 space-y-8">
            <div className="px-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Hub</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Verification & Onboarding Protocols</p>
            </div>

            <Card className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                    <FileText size={160} />
                </div>
                
                <div className="relative z-10 space-y-2 mb-10">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Mandatory Artifacts</h4>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter">Verification Checklist</p>
                </div>

                <div className="space-y-6 relative z-10 mb-10">
                    {[
                        { icon: ShieldCheck, label: 'Identity Matrix' },
                        { icon: Zap, label: 'Insurance Payload' },
                        { icon: Users, label: 'Household Registry' },
                        { icon: MapPin, label: 'Zonal Verification' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 group/item">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover/item:text-blue-400 group-hover/item:bg-blue-600/10 transition-all">
                                <item.icon size={20} />
                            </div>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-tighter group-hover/item:text-white transition-colors">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="relative z-10 bg-blue-600/10 p-8 rounded-[32px] border border-blue-500/20 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart size={18} className="text-rose-500 fill-rose-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Tactical Volunteering</h4>
                    </div>
                    <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                        Authorize unit deployment with local humanitarian coalitions for rapid restoration operations.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-blue-400 font-black uppercase tracking-widest text-[9px] hover:text-blue-300 transition-colors">
                        Synchronize with Coalition
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </main>
  )
}
