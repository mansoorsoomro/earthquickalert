'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Clock, Loader2, MapPin, Activity, Zap, Shield, Radar, Target } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ThreatAssessment {
    relevance: 'High' | 'Medium' | 'Low';
    severity: string;
    affectedAreas: string;
    confidence: number;
    summary: string;
}

export function ThreatMonitoring() {
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState<ThreatAssessment | null>(null);
    const [locationName, setLocationName] = useState('Global Monitoring');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getAssessment(lat: number, lon: number, name: string) {
            try {
                const response = await fetch(`/api/threats/assessment?lat=${lat}&lon=${lon}&locationName=${encodeURIComponent(name)}`);
                const json = await response.json();
                if (json.success) {
                    setAssessment(json.data.assessment);
                }
            } catch (err) {
                console.error('Failed to fetch threat assessment:', err);
                setError('Failed to load real-time assessment.');
            } finally {
                setLoading(false);
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationName('Current Location');
                    getAssessment(latitude, longitude, 'Your current vicinity');
                },
                (err) => {
                    console.warn('Geolocation denied, using default location.');
                    getAssessment(34.0522, -118.2437, 'Los Angeles (Fallback)');
                }
            );
        } else {
            getAssessment(34.0522, -118.2437, 'Global Context');
        }
    }, [])

    const threats = [
        { id: 1, label: 'NWS Severe Weather Alerts', active: true, icon: Zap },
        { id: 2, label: 'USGS Earthquake Feed', active: true, icon: Activity },
        { id: 3, label: 'Regional Incident Reports', active: true, icon: AlertCircle },
        { id: 4, label: 'AI Geo-Spatial Analysis', active: !!assessment, icon: Radar },
        { id: 5, label: 'Citizen Submitted Signals', active: true, icon: CheckCircle2 },
    ]

    return (
        <Card className="bg-white border-slate-100 rounded-[40px] p-8 h-full flex flex-col shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Radar size={120} className="animate-pulse" />
            </div>

            <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">Threat Monitoring</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Real-Time Signal Matrix</p>
                    </div>
                </div>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            <div className="relative z-10 space-y-8 flex-1">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Live Data Ingest</h4>
                         <span className="text-[8px] font-black text-slate-600 uppercase italic">ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {threats.map((threat) => (
                            <div key={threat.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/item hover:bg-slate-100/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", threat.active ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 text-slate-400")}>
                                        <threat.icon size={16} />
                                    </div>
                                    <span className={cn("text-xs font-black uppercase tracking-tight transition-colors", threat.active ? "text-slate-700 group-hover/item:text-slate-900" : "text-slate-400")}>
                                        {threat.label}
                                    </span>
                                </div>
                                {threat.active ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                ) : (
                                    <Clock size={12} className="text-slate-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Core Assessment</h4>
                        <div className="flex items-center gap-2">
                            <Target size={12} className="text-blue-500" />
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Optimized</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl bg-slate-50 border border-slate-100" />)}
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center shadow-2xl italic">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-2">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Geo-relevance</p>
                                    <p className={cn("text-xl font-black tracking-tighter truncate leading-none uppercase", 
                                        assessment?.relevance === 'High' ? 'text-red-600' :
                                        assessment?.relevance === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                                    )}>
                                        {assessment?.relevance || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-2">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Severity Level</p>
                                    <p className="text-xl font-black text-blue-600 tracking-tighter truncate leading-none uppercase">
                                        {assessment?.severity || 'NOMINAL'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Affected Areas</p>
                                <p className="text-sm font-black text-slate-900 tracking-widest uppercase truncate leading-none">
                                    {assessment?.affectedAreas || 'Monitoring Grid...'}
                                </p>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 space-y-5">
                                <div className="flex justify-between items-end mb-1">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Confidence Score</p>
                                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] italic">AI Predictive Logic</p>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-600 tracking-tighter leading-none">{assessment?.confidence || 0}%</p>
                                </div>
                                <div className="w-full bg-blue-100/50 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                        style={{ width: `${assessment?.confidence || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
