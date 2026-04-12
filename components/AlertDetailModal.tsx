'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
    Info, 
    ExternalLink, 
    AlertCircle, 
    Activity, 
    Shield, 
    Clock, 
    MapPin, 
    Zap,
    Target,
    CheckCircle2,
    X,
    ArrowUpRight
} from 'lucide-react'
import { DamageReportModal } from '@/components/modals/damage-report-modal'
import { cn } from '@/lib/utils'

interface AlertDetailModalProps {
    isOpen: boolean
    onClose: () => void
    onCheckIn: () => void
    alert: {
        title: string
        location: string
        type: string
        severity: string
        issuedTime: string
        expiry: string
        message?: string
    } | null
}

const getHeaderStyles = (severity: string) => {
    if (!severity) return { bg: 'bg-blue-600', ring: 'ring-blue-500/20', shadow: 'shadow-blue-600/20' }
    const s = severity.toLowerCase()
    if (s.includes('extreme') || s.includes('severe') || s.includes('critical') || s.includes('red')) 
        return { bg: 'from-rose-600 to-rose-900', ring: 'ring-rose-500/20', shadow: 'shadow-rose-600/20' }
    if (s.includes('warning') || s.includes('orange')) 
        return { bg: 'from-amber-600 to-amber-900', ring: 'ring-amber-500/20', shadow: 'shadow-amber-600/20' }
    if (s.includes('watch') || s.includes('caution') || s.includes('yellow')) 
        return { bg: 'from-yellow-600 to-yellow-900', ring: 'ring-yellow-500/20', shadow: 'shadow-yellow-600/20' }
    return { bg: 'from-blue-600 to-blue-900', ring: 'ring-blue-500/20', shadow: 'shadow-blue-600/20' }
}

export function AlertDetailModal({ isOpen, onClose, onCheckIn, alert }: AlertDetailModalProps) {
    const [isDamageModalOpen, setIsDamageModalOpen] = useState(false)

    if (!alert) return null

    const styles = getHeaderStyles(alert.severity)

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl w-[95vw] sm:w-full p-0 overflow-hidden border border-white/10 bg-[#0A0B10] sm:rounded-[48px] rounded-3xl shadow-2xl backdrop-blur-3xl">
                    <DialogTitle className="sr-only">{alert.title} Analysis</DialogTitle>

                    {/* Header */}
                    <div className={cn("p-10 lg:p-14 text-white relative bg-gradient-to-br overflow-hidden group", styles.bg)}>
                        {/* Decorative Background Icons */}
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                             <Target size={240} />
                        </div>
                        
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:rotate-90 transition-all z-20"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-white/20 text-white border-none py-1.5 px-5 font-black uppercase text-[10px] tracking-widest rounded-full backdrop-blur-md">
                                    Operational Intelligence
                                </Badge>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                                    <Activity size={12} className="animate-pulse" /> Signal Verified
                                </div>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase">{alert.title}</h1>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-2xl border border-white/10">
                                    <MapPin size={14} className="text-white" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{alert.location}</span>
                                </div>
                                <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-2xl border border-white/10">
                                    <Clock size={14} className="text-white" />
                                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                                        Issued {alert.issuedTime} &bull; Expires {alert.expiry === 'N/A' ? 'Monitoring' : alert.expiry}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#0A0B10]">
                        <div className="p-8 sm:p-12 space-y-10">
                            {/* Intel Brief */}
                            <section className="space-y-4">
                                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                                    <Info size={14} className="text-blue-500" /> Situation Briefing
                                </h2>
                                <Card className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Target size={100} />
                                    </div>
                                    <p className="text-lg font-medium text-slate-300 leading-relaxed italic relative z-10">
                                        {alert.message || `A ${alert.title} protocol has been activated for the specified region. High-fidelity monitoring is currently underway to assess structural and community impact levels.`}
                                    </p>
                                </Card>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Protocol Tree */}
                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                                        <Zap size={14} className="text-amber-500" /> Tactical Protocols
                                    </h3>
                                    <Card className="p-8 bg-slate-900 border border-white/5 rounded-[40px] space-y-6">
                                        {[
                                            "Activate regional shelter nodes",
                                            "Sync communication chains",
                                            "Deployment verification active",
                                            "Check-in frequency increase"
                                        ].map((action, i) => (
                                            <div key={i} className="flex gap-4 group/item">
                                                <div className="w-6 h-6 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 mt-0.5 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                                <span className="text-sm font-black text-slate-400 uppercase tracking-tight group-hover/item:text-white transition-colors leading-tight">{action}</span>
                                            </div>
                                        ))}
                                    </Card>
                                </section>

                                {/* System Meta */}
                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                                        <Shield size={14} className="text-emerald-500" /> Integrity Metrics
                                    </h3>
                                    <Card className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-emerald-600/10 border border-emerald-500/20 rounded-[24px] flex items-center justify-center text-emerald-500 shadow-2xl">
                                                <AlertCircle size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Authenticity Scan</p>
                                                <p className="text-sm font-black text-white uppercase tracking-tighter">Official EOC Dispatch</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-500/20">
                                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Commander Directive</p>
                                            <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                                                Mark operational status nominal via the secure check-in channel to synchronize node connectivity.
                                            </p>
                                        </div>
                                    </Card>
                                </section>
                            </div>

                            {/* Check-in Action */}
                            <Card className="p-10 bg-emerald-600/10 border border-emerald-500/20 rounded-[48px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Operational Check-In</h3>
                                    <p className="text-xs font-black text-emerald-500 uppercase tracking-widest leading-none">Terminal Status Synchronization Required</p>
                                </div>
                                <Button
                                    onClick={onCheckIn}
                                    className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-[24px] shadow-2xl shadow-emerald-600/20 transition-all active:scale-95 gap-3"
                                >
                                    Confirm Integrity <ArrowUpRight size={18} />
                                </Button>
                            </Card>

                            {/* Footer */}
                            <footer className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 border border-white/10 group hover:bg-white/10 transition-all">
                                        <ExternalLink size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Intelligence Source</p>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Satellite Link L6 &bull; Nominal</p>
                                    </div>
                                </div>
                                <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                    Access Full Data Payload
                                </Button>
                            </footer>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <DamageReportModal isOpen={isDamageModalOpen} onClose={() => setIsDamageModalOpen(false)} />
        </>
    )
}
