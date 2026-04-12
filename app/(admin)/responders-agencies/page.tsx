'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { 
    Eye, 
    UserPlus, 
    Info, 
    MapPin, 
    Shield, 
    Activity, 
    Settings, 
    Search, 
    Plus, 
    ExternalLink,
    Clock,
    CheckCircle2,
    Briefcase,
    Building2,
    Users,
    MoreHorizontal,
    LayoutGrid,
    List,
    Filter,
    ArrowUpRight
} from 'lucide-react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function RespondersAgenciesPage() {
    const [adminUsers, setAdminUsers] = useState<any[]>([
        { id: 1, name: 'Mayor Helena Rivers', role: 'City Leader', org: 'Municipal Command', access: true, incidentRole: 'Executive Oversight', status: 'Active' },
        { id: 2, name: 'Commander Maria Garcia', role: 'Incident Commander', org: 'Ready2Go HQ', access: true, incidentRole: 'Strategic Lead', status: 'Active' },
        { id: 3, name: 'Director James Wilson', role: 'Operations Chief', org: 'Local EOC', access: true, incidentRole: 'Tactical Director', status: 'Active' },
    ])
    const [activePersonnel, setActivePersonnel] = useState<any[]>([
        { id: 101, name: 'Captain Mark Thompson', role: 'Fire Brigade Lead', agency: 'SF Fire Dept', function: 'Suppression & Rescue', status: 'Active', expertise: 'Hazardous Materials' },
        { id: 102, name: 'Officer Sarah Jenkins', role: 'Police Tactical', agency: 'Metro Police', function: 'Perimeter Control', status: 'Active', expertise: 'Crisis Coordination' },
        { id: 103, name: 'Elena Rodriguez', role: 'Medical Director', agency: 'General Hospital', function: 'Triage Response', status: 'Active', expertise: 'Trauma Operations' },
        { id: 104, name: 'Michael Chen', role: 'GIS Specialist', agency: 'City Planning', function: 'Impact Mapping', status: 'Standby', expertise: 'Surface Analytics' },
        { id: 105, name: 'Commissioner David Blake', role: 'Police Commissioner', agency: 'Law Enforcement', function: 'Public Safety', status: 'Active', expertise: 'Command Strategy' },
    ])
    const [nonprofits, setNonprofits] = useState<any[]>([
        { id: 'N-1', name: 'Red Cross Delta', function: 'Shelter Ops', area: 'Downtown', status: 'Operational', contact: 'Emergency Line 4' },
    ])
    const [businesses, setBusinesses] = useState<any[]>([
        { id: 'B-1', name: 'Safe Logistics Co', sector: 'Supply Chain', support: 'Heavy Transport', area: 'Regional', status: 'Authorized' },
    ])
    const [loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    return (
        <main className="min-h-screen bg-[#0A0B10] p-8 lg:p-12 space-y-12 overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Section */}
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/20">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Personnel Directory</h1>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Multi-Agency Strategic Resource Hub</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <div className="relative group">
                         <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-500 transition-colors" />
                         <input 
                            type="text" 
                            placeholder="Identify Personnel..."
                            className="h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all w-72"
                         />
                     </div>
                     <Button className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-600/20 gap-3">
                         <UserPlus size={16} /> Onboard Unit
                     </Button>
                </div>
            </div>

            <Tabs defaultValue="personnel" className="space-y-8 relative">
                <div className="flex items-center justify-between bg-white/[0.02] p-2 border border-white/5 rounded-[32px] w-fit">
                    <TabsList className="bg-transparent h-12 gap-1 p-0">
                        <TabsTrigger value="personnel" className="h-10 px-8 rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all">
                            <Users size={14} className="mr-2" /> Tactical Personnel
                        </TabsTrigger>
                        <TabsTrigger value="partners" className="h-10 px-8 rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all">
                            <Building2 size={14} className="mr-2" /> Response Partners
                        </TabsTrigger>
                        <TabsTrigger value="access" className="h-10 px-8 rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all">
                            <Shield size={14} className="mr-2" /> Command Access
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="personnel" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activePersonnel.map((person) => (
                            <Card key={person.id} className="group bg-slate-900/40 border-white/5 rounded-[40px] p-8 shadow-2xl hover:bg-slate-900/60 transition-all border-t border-t-white/10 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight size={24} className="text-blue-500" />
                                </div>
                                
                                <div className="flex items-start gap-6 mb-8">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-600 p-[2px]">
                                            <div className="w-full h-full rounded-[30px] bg-slate-900 flex items-center justify-center text-2xl font-black text-white">
                                                {person.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-900",
                                            person.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                                        )} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">{person.name}</h3>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">{person.role}</p>
                                        <div className="flex items-center gap-2 mt-3 p-1.5 px-3 bg-white/5 rounded-xl border border-white/5 w-fit">
                                            <Building2 size={12} className="text-slate-500" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{person.agency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Function</p>
                                            <p className="text-[10px] font-black text-slate-200 uppercase">{person.function}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Expertise</p>
                                            <p className="text-[10px] font-black text-slate-200 uppercase">{person.expertise}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Eye size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Settings size={18} />
                                        </Button>
                                    </div>
                                    <Button className="h-12 px-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                                        Assign Unit
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="partners" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-slate-900/40 border-white/5 rounded-[48px] overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Strategic Partnerships</h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Private & Non-Profit Response Network</p>
                            </div>
                            <Button variant="ghost" className="h-12 px-6 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/5 gap-2 border border-white/10">
                                <Plus size={14} /> Establish Connection
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-10">Entity Identity</th>
                                        <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Sector</th>
                                        <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Support Protocol</th>
                                        <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategic Area</th>
                                        <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right px-10">Integration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[...nonprofits, ...businesses].map((org, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-8 px-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                                        {org.sector ? <Briefcase size={18} /> : <Building2 size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase tracking-tight">{org.name}</p>
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{org.sector ? 'Private Sector' : 'Non-Profit'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                                    {org.sector || org.function}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <span className="text-[11px] font-bold text-slate-500 italic group-hover:text-blue-400 transition-colors">
                                                    {org.support || 'Primary Logistics'}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-blue-500" />
                                                    <span className="text-[11px] font-black text-slate-300 uppercase underline underline-offset-4 decoration-white/10">{org.area || 'Regional'}</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-right px-10">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                                                    Validated
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="access" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-slate-900/40 border-white/5 rounded-[48px] overflow-hidden shadow-2xl p-10">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Command Authorization</h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Administrative Privilege Management</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {adminUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-8 bg-white/[0.03] border border-white/5 rounded-[40px] hover:bg-white/[0.05] transition-all group">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 rounded-[24px] bg-slate-800 flex items-center justify-center text-xl font-black text-white group-hover:bg-blue-600 transition-colors">
                                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight">{user.name}</h3>
                                                <Badge className="bg-blue-600 text-white border-none text-[8px] font-black uppercase tracking-widest h-5">ROOT</Badge>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{user.incidentRole} &bull; {user.org}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Operational Access</p>
                                            <Switch checked={user.access} className="data-[state=checked]:bg-blue-600" />
                                        </div>
                                        <div className="h-12 w-px bg-white/5" />
                                        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <MoreHorizontal size={24} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}
