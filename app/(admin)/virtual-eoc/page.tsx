'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
    Phone,
    Building2,
    Map,
    Home,
    FileBarChart,
    CloudLightning,
    Navigation,
    ShieldAlert,
    Eye,
    Wind,
    Plus,
    Hotel,
    Coffee,
    Fuel,
    Heart,
    Zap,
    Users,
    AlertCircle,
    Stethoscope,
    Briefcase,
    UserCheck,
    Search,
    ChevronRight,
    RefreshCw,
    Activity,
    Target,
    Navigation2,
    Sparkles,
    Shield,
    Globe,
    Clock
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function VirtualEOCDashboard() {
    const [userName, setUserName] = React.useState('User Name')
    const [userEmail, setUserEmail] = React.useState('email@gmail.com')

    React.useEffect(() => {
        setUserName(localStorage.getItem('userName') || 'User Name')
        setUserEmail(localStorage.getItem('userEmail') || 'email@gmail.com')
    }, [])

    return (
        <main className="min-h-screen bg-slate-50 p-8 lg:p-12 space-y-12 overflow-hidden relative selection:bg-blue-600/10">
            {/* Background Artifacts */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Header Section */}
            <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 border border-slate-200 shadow-sm">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Virtual EOC Hub</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Operational Awareness & Resource Matrix</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Pulse</span>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Protocol</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <Button className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all gap-3 shadow-sm">
                         <RefreshCw size={16} /> Sync Matrix
                    </Button>
                </div>
            </div>

            {/* Major Incident Flashboard */}
            <section className="relative rounded-[48px] bg-gradient-to-br from-red-600/5 to-slate-50 border border-red-500/10 p-10 lg:p-16 overflow-hidden shadow-xl shadow-red-900/5 group">
                <div className="absolute top-0 right-0 p-12 text-red-600/5 grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110">
                    <ShieldAlert size={280} />
                </div>
                
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="w-20 h-20 bg-red-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-red-600/20">
                             <CloudLightning size={44} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Hurricane Erin - Category 3</h2>
                            <p className="text-xl font-medium text-slate-500 max-w-4xl tracking-tight leading-snug">
                                Major cyclonic threat approaching Sector 7. Immediate evacuation prioritized for zones Alpha, Bravo, and Zulu. Storm surge peak estimated at 14ft.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                        {[
                            { icon: Navigation2, label: 'Evacuate', sub: 'Zones A, B, Z', color: 'text-red-500', bg: 'bg-red-500/10' },
                            { icon: Home, label: 'Shelter', sub: 'Sector 3-A', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { icon: ShieldAlert, label: 'No Travel', sub: 'Interstate-95', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            { icon: Zap, label: 'Grid Alert', sub: 'Active Load', color: 'text-purple-500', bg: 'bg-purple-500/10' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-5 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                     <item.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tactical Resource Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Life-Safety Actions */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="px-4">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Tactical Action Commands</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">High-priority civilian safety measures</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { icon: Phone, title: '911 Dispatch', color: 'text-red-500', sub: 'Emergency Signal' },
                            { icon: Building2, title: 'Medical Hubs', color: 'text-blue-500', sub: 'Trauma & Triage' },
                            { icon: Navigation, title: 'Evac Routes', color: 'text-emerald-500', sub: 'Path to Safety' },
                            { icon: Map, title: 'Shelter Grid', color: 'text-purple-500', sub: 'Verified Sites' },
                            { icon: FileBarChart, title: 'Field Intel', color: 'text-amber-500', sub: 'Submit Report' }
                        ].map((btn, i) => (
                            <Card key={i} className="bg-white border border-slate-100 rounded-[32px] p-8 flex items-center gap-8 hover:bg-slate-50 transition-all cursor-pointer group hover:border-blue-500/20 shadow-sm group">
                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <btn.icon className={cn("w-10 h-10 transition-colors", btn.color)} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{btn.title}</h4>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{btn.sub}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Activated Resources */}
                    <div className="space-y-8 pt-8">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight px-4">Activated Resource Stream</h3>
                        <Card className="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-xl shadow-slate-200/50 p-2">
                             {[
                                { icon: UserCheck, label: 'Field Medical Units', count: 'Active', val: '03 Units', color: 'text-blue-500' },
                                { icon: Briefcase, label: 'NGO Support Clusters', count: 'Deployed', val: '04 Blocks', color: 'text-amber-500' },
                                { icon: Stethoscope, label: 'FEMA Intelligence Hubs', count: 'Active', val: '02 Sites', color: 'text-emerald-500' },
                                { icon: Heart, label: 'Red Cross Aid Stations', count: 'Ready', val: '05 Points', color: 'text-red-500' },
                                { icon: Users, label: 'Family Reunification', count: 'Active', val: '01 Center', color: 'text-purple-500' }
                             ].map((res, i) => (
                                <div key={i} className="flex items-center justify-between p-8 px-12 border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-8">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                             <res.icon className={res.color} size={28} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{res.label}</span>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{res.count}</p>
                                        </div>
                                    </div>
                                    <span className={cn("text-xs font-black uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity", res.color)}>{res.val}</span>
                                </div>
                             ))}
                        </Card>
                    </div>
                </div>

                {/* Sidebar Widget: Weather Intelligence */}
                <div className="lg:col-span-4">
                    <Card className="bg-white border border-slate-100 rounded-[64px] p-10 space-y-12 shadow-xl shadow-slate-200/50 relative overflow-hidden h-full flex flex-col group">
                        <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <Sparkles size={300} className="absolute -right-20 -top-20 text-blue-400" />
                        </div>

                        <div className="relative z-10 flex items-center justify-between">
                             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Live Radar Feed</h3>
                             <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                                 <Clock size={10} className="text-slate-400" />
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Real-Time</span>
                             </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <h4 className="text-[92px] font-black text-slate-900 leading-none tracking-tighter">72°F</h4>
                            <div className="flex items-center gap-4">
                                <CloudLightning className="text-blue-600" size={32} />
                                <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Severe Inbound</p>
                            </div>
                        </div>

                        <div className="relative z-10 flex-1 space-y-8">
                            <div className="flex items-center justify-between">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Signal Disruption</h5>
                                <Badge className="bg-red-500 text-white font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none shadow-2xl shadow-red-500/30">LOCKED</Badge>
                            </div>

                            <Card className="bg-slate-50 border border-slate-100 rounded-[40px] p-8 space-y-6">
                                {[
                                    { label: 'Network Stability', val: 'Nominal', color: 'bg-emerald-500' },
                                    { label: 'Propagation Tech', val: 'Low', color: 'bg-amber-500' },
                                    { label: 'Latency Node', val: 'Optimal', color: 'bg-emerald-500' }
                                ].map((alert, i) => (
                                    <div key={i} className="flex items-center gap-6">
                                        <div className={cn("w-2 h-2 rounded-full shadow-lg", alert.color)} />
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{alert.label}</p>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{alert.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-6">
                            {[
                                { icon: Eye, label: 'Visibility', val: '0.5 MI', color: 'text-blue-500' },
                                { icon: Wind, label: 'Wind Arc', val: '115 MPH', color: 'text-slate-400' }
                            ].map((w, i) => (
                                <Card key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] text-center space-y-3 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                                     <w.icon className={w.color} size={24} />
                                     <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{w.label}</p>
                                        <p className="text-lg font-black text-slate-900 italic tracking-tighter">{w.val}</p>
                                     </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Essential Resource Matrix (Bottom Section) */}
            <Card className="bg-white border border-slate-100 rounded-[64px] p-12 lg:p-20 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 text-blue-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                      <Target size={200} />
                 </div>
                 
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-16 px-4">Essential Grid Status</h3>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-20 px-4">
                    {[
                        { icon: Hotel, label: 'Lodging Matrix', items: [{ l: 'Hampton Inn HQ', s: 'Nominal' }, { l: 'Holiday Express', s: 'Limited' }] },
                        { icon: Coffee, label: 'Provision Grid', items: [{ l: 'Central Pantry', s: 'Active' }, { l: 'MegaMart Alpha', s: 'Nominal' }] },
                        { icon: Fuel, label: 'Energy Points', items: [{ l: 'Shell Terminal', s: 'Fuel+' }, { l: 'BP Node 101', s: 'Offline' }] }
                    ].map((sec, i) => (
                        <div key={i} className="space-y-10">
                            <div className="flex items-center gap-6 border-b border-slate-100 pb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                    <sec.icon size={24} />
                                </div>
                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900">{sec.label}</h4>
                            </div>
                            <div className="space-y-8">
                                {sec.items.map((it, j) => (
                                    <div key={j} className="flex justify-between items-center group cursor-pointer">
                                        <span className="text-[13px] font-black text-slate-500 uppercase tracking-tight group-hover:text-blue-400 transition-colors lowercase first-letter:uppercase">{it.l}</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity italic">{it.s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                 </div>
            </Card>

            {/* Recovery Module (Disabled) */}
            <section className="bg-white border border-slate-200 rounded-[48px] p-12 space-y-8 opacity-60 group hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recovery Module</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Activation pending safe-to-return status</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    {[
                        { icon: Zap, label: 'Donation Sync', color: 'bg-blue-600' },
                        { icon: RefreshCw, label: 'Medical Status', color: 'bg-emerald-600' },
                        { icon: Users, label: 'Re-entry Pass', color: 'bg-slate-700' },
                        { icon: AlertCircle, label: 'FEMA Pipeline', color: 'bg-red-600' }
                    ].map((rec, i) => (
                        <Button key={i} className={cn("h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl", rec.color)}>
                             <rec.icon size={16} /> {rec.label}
                        </Button>
                    ))}
                </div>
            </section>
        </main>
    )
}
