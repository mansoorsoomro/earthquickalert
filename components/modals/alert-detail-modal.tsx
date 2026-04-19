'use client'

import React from 'react'
import { X, AlertTriangle, CheckCircle, Info, Shield, Clock, MapPin, Zap, Target, Activity, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertSeverity } from '@/lib/types/emergency'
import { cn } from '@/lib/utils'

interface AlertDetailModalProps {
    isOpen: boolean
    onClose: () => void
    alert?: {
        title: string
        severity: AlertSeverity
        description: string
        whatItMeans: string
        whatToDo: string
        preparedness: string
        issued: string
        expires: string
        source: string
    } | null
}

const getSeverityStyles = (severity: AlertSeverity) => {
    const s = severity.toLowerCase()
    if (s.includes('critical') || s.includes('extreme'))
        return { bg: 'from-rose-600 to-rose-900', text: 'text-rose-500', border: 'border-rose-500/20', shadow: 'shadow-rose-600/20' }
    if (s.includes('severe') || s.includes('warning'))
        return { bg: 'from-amber-600 to-amber-900', text: 'text-amber-500', border: 'border-amber-500/20', shadow: 'shadow-amber-600/20' }
    if (s.includes('watch') || s.includes('caution'))
        return { bg: 'from-yellow-600 to-yellow-900', text: 'text-yellow-500', border: 'border-yellow-500/20', shadow: 'shadow-yellow-600/20' }
    return { bg: 'from-blue-600 to-blue-900', text: 'text-blue-500', border: 'border-blue-500/20', shadow: 'shadow-blue-600/20' }
}

export function AlertDetailModal({ isOpen, onClose, alert }: AlertDetailModalProps) {
    if (!isOpen || !alert) return null

    const styles = getSeverityStyles(alert.severity)

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-[100] p-4 lg:p-12 overflow-hidden">
            <Card className="w-full max-w-4xl max-h-full overflow-hidden bg-white border border-slate-200 rounded-[48px] shadow-2xl flex flex-col relative">
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                {/* Header */}
                <div className={cn("relative p-10 lg:p-14 bg-gradient-to-br transition-all group overflow-hidden", styles.bg)}>
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <Target size={240} />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:rotate-90 transition-all z-20 text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                                Signal: {alert.severity}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/70">
                                <Activity size={12} className="animate-pulse" /> Live Analysis Active
                            </div>
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">{alert.title}</h2>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3 py-2 px-5 bg-white/10 rounded-2xl border border-white/10">
                                <Shield size={14} className="text-white" />
                                <span className="text-[11px] font-black text-white uppercase tracking-widest">{alert.source}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-black text-white/70 uppercase tracking-widest">
                                <Clock size={14} /> Issued {alert.issued} &bull; Expires {alert.expires}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-14 space-y-12 bg-white">
                    {/* Summary Section */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Info size={14} className="text-blue-500" /> Operational Context
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <Card className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] shadow-inner">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tactical Summary</p>
                                <p className="text-lg font-medium text-slate-700 leading-relaxed italic">{alert.description}</p>
                            </Card>
                            <Card className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] shadow-inner">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Strategic Meaning</p>
                                <p className="text-lg font-medium text-slate-700 leading-relaxed italic">{alert.whatItMeans}</p>
                            </Card>
                        </div>
                    </section>

                    {/* Action Log */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Zap size={14} className="text-amber-500" /> Required Maneuvers
                        </h3>
                        <Card className="p-10 bg-red-50 border border-red-100 rounded-[48px] shadow-sm">
                            <div className="space-y-6">
                                {alert.whatToDo.split('\n').map((line, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-8 h-8 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0 mt-1 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                                            <span className="text-xs font-black">{i + 1}</span>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-red-700 transition-colors">{line.replace('•', '').trim()}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </section>

                    {/* Intelligence Matrix */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                                <Shield size={14} className="text-emerald-500" /> Resilience Protocols
                            </h3>
                            <Card className="p-8 bg-slate-50 border border-slate-100 rounded-[40px]">
                                <p className="text-sm font-medium text-slate-500 mb-8 italic">{alert.preparedness}</p>
                                <div className="space-y-4">
                                    {[
                                        "Scan communication artifacts",
                                        "Verify life-safety clusters",
                                        "Seal entry/exit vectors"
                                    ].map((item, i) => (
                                        <label key={i} className="flex items-center gap-4 cursor-pointer group hover:bg-white p-4 rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-200">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg bg-white border-slate-300 text-emerald-600 focus:ring-emerald-500/20" />
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>
                        </section>

                        <Card className="bg-emerald-50 border border-emerald-100 rounded-[48px] p-10 flex flex-col justify-center items-center text-center space-y-6 group cursor-pointer hover:bg-emerald-100/50 transition-all shadow-sm">
                            <div className="w-20 h-20 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 transition-transform group-hover:scale-110">
                                <CheckCircle size={40} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Operational Integrity</h4>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Force Terminal Synchronization</p>
                            </div>
                            <Button className="h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-2xl transition-all active:scale-95 gap-3">
                                Synchronize Node <ArrowUpRight size={18} />
                            </Button>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    )
}
