'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, DollarSign, Home, Heart, ShieldCheck, Zap, HandIcon, ChevronRight, FileText, Users, MapPin } from 'lucide-react'

const RECOVERY_PROGRAMS = [
  {
    title: 'Individual Assistance (IA)',
    org: 'FEMA',
    status: 'Applications Open',
    desc: 'Financial assistance and direct services to eligible individuals and households.',
    icon: Home,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    title: 'Disaster Unemployment',
    org: 'State Workforce',
    status: 'Active Feed',
    desc: 'Benefits for individuals whose employment has been impacted by the disaster.',
    icon: DollarSign,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    title: 'Crisis Counseling',
    org: 'Health & Human Services',
    status: 'Ready',
    desc: 'Mental health support and counseling for disaster survivors and responders.',
    icon: Heart,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  }
]

export default function RecoveryPage() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen p-8">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-32">
        
        {/* Banner Section */}
        <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48" />
            <div className="relative z-10 flex-1 space-y-4">
                <Badge className="bg-emerald-100 text-emerald-700 border-none py-1.5 px-4 font-black uppercase text-[10px] tracking-widest rounded-full">Phase: Long-term Restoration</Badge>
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-emerald-500 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                        <RefreshCw size={28} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Recovery Resources</h1>
                </div>
                <p className="text-lg font-medium text-slate-500 max-w-2xl leading-relaxed italic">Essential pathways for individual and community restoration. Access federal aid, local grants, and humanitarian support.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-2 p-8 bg-emerald-50 border border-emerald-100 rounded-[40px] min-w-[280px]">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">IA Declarations</p>
                <p className="text-4xl font-black text-emerald-700 tracking-tighter">S-ZONE 04</p>
                <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-tight italic">Effective Immediately</p>
            </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono">Active Assistance Programs</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {RECOVERY_PROGRAMS.map((program, idx) => (
                        <Card key={idx} className="p-10 rounded-[48px] border-none shadow-xl shadow-slate-200/50 bg-white group hover:shadow-2xl transition-all flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer overflow-hidden">
                            <div className="flex items-center gap-8">
                                <div className={`w-20 h-20 rounded-[32px] ${program.bg} ${program.color} flex items-center justify-center transition-all group-hover:scale-110 shadow-inner`}>
                                    <program.icon size={36} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic leading-none">{program.org}</p>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{program.title}</h3>
                                    <p className="text-sm font-medium text-slate-400 max-w-md leading-relaxed mt-2">{program.desc}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-emerald-500 text-white border-none py-1.5 px-6 font-black uppercase text-[10px] tracking-widest rounded-full mb-4 w-full justify-center">{program.status}</Badge>
                                <button className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl ml-auto">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Sidebar Resources */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono flex items-center gap-2">
                        <FileText size={14} /> Documentation Hub
                    </h2>
                </div>
                <Card className="bg-white rounded-[48px] border-none shadow-xl shadow-slate-200/50 h-full p-10 space-y-10 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Required Documents</h3>
                        <p className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Be ready to provide:</p>
                    </div>
                    
                    <ul className="space-y-6 relative z-10">
                        <li className="flex items-center gap-4 group/item">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-indigo-900 group-hover/item:text-white transition-all shadow-sm">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover/item:text-slate-900 transition-colors">Identification Proof</span>
                        </li>
                        <li className="flex items-center gap-4 group/item">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-indigo-900 group-hover/item:text-white transition-all shadow-sm">
                                <Zap size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover/item:text-slate-900 transition-colors">Insurance Policy Info</span>
                        </li>
                        <li className="flex items-center gap-4 group/item">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-indigo-900 group-hover/item:text-white transition-all shadow-sm">
                                <Users size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover/item:text-slate-900 transition-colors">Household Composition</span>
                        </li>
                        <li className="flex items-center gap-4 group/item">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-indigo-900 group-hover/item:text-white transition-all shadow-sm">
                                <MapPin size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover/item:text-slate-900 transition-colors">Address Prior to Disaster</span>
                        </li>
                    </ul>

                    <div className="bg-[#34385E] p-8 rounded-[32px] text-white space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart size={16} className="text-rose-400 fill-rose-400" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Volunteering</h4>
                        </div>
                        <p className="text-sm font-medium text-indigo-50 leading-relaxed italic">Want to help? Register with the local humanitarian coalition to join authorized restoration teams.</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white hover:text-emerald-400 hover:border-emerald-400 transition-colors pt-2">Join Coalition</button>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </div>
  )
}
