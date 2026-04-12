'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    ShieldCheck, 
    Trash2, 
    Globe, 
    Calendar, 
    Building2, 
    Zap,
    ArrowUpRight,
    Lock,
    Unlock
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function ActiveLicenseList() {
    const [activeLicenses, setActiveLicenses] = useState([
        { id: 'L-001', org: 'San Francisco EOC', city: 'San Francisco, CA', zip: '94105', minted: '2024-03-12', radius: '45 Miles', status: 'active' },
        { id: 'L-002', org: 'Oakland Response Hub', city: 'Oakland, CA', zip: '94601', minted: '2024-03-15', radius: '20 Miles', status: 'active' },
        { id: 'L-003', org: 'Berkeley Safety Node', city: 'Berkeley, CA', zip: '94704', minted: '2024-04-01', radius: '15 Miles', status: 'active' },
    ])

    const handleRevoke = (id: string, org: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: `Revoking Operational License for ${org}...`,
                success: () => {
                    setActiveLicenses(prev => prev.filter(l => l.id !== id))
                    return `Critical Access Revoked for ${org}. Node De-authenticated.`
                },
                error: 'Failed to revoke bridge access.',
            }
        )
    }

    return (
        <Card className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[80px] rounded-full pointer-events-none" />

            <CardHeader className="p-10 border-b border-white/5 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Active Deployments</CardTitle>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Operational EOC Administrative Nodes</p>
                        </div>
                    </div>
                    <Badge className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                        {activeLicenses.length} Verified Licensees
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative z-10">
                <div className="divide-y divide-slate-100">
                    {activeLicenses.map((license) => (
                        <div key={license.id} className="p-10 group flex flex-col xl:flex-row xl:items-center justify-between gap-8 hover:bg-slate-50 transition-all">
                            <div className="flex items-center gap-8">
                                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-200 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all">
                                    <Building2 size={24} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{license.org}</h4>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 border border-slate-100 rounded">{license.id}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex items-center gap-3">
                                            <Globe size={14} className="text-blue-500" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{license.city} &bull; {license.zip}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minted: {license.minted}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10">
                                            <Zap size={12} className="text-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{license.radius} Radius</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 shrink-0">
                                <Button 
                                    variant="ghost" 
                                    className="h-16 px-8 rounded-[24px] border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest gap-3 shadow-sm"
                                >
                                    <ArrowUpRight size={16} /> Inspect Node
                                </Button>
                                <Button 
                                    onClick={() => handleRevoke(license.id, license.org)}
                                    className="h-16 px-8 rounded-[24px] bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-black text-[10px] uppercase tracking-widest gap-3 transition-all active:scale-95 border border-red-100 shadow-sm"
                                >
                                    <Lock size={16} /> Revoke Access
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <div className="bg-emerald-600/5 p-8 flex items-center justify-between relative z-10 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">All Systems Nominal &bull; Real-time Monitoring Active</p>
                </div>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Encrypted Secure Socket Line</p>
            </div>
        </Card>
    )
}
