'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Zap, Activity, ShieldCheck } from 'lucide-react'

interface EOCData {
    insights: string[];
    activities: { label: string; status: string }[];
    metrics: {
        activeEvents: number;
        alertsPerHour: number;
        responseUnits: number;
    }
}

export function VirtualEOCOperations() {
    const [data, setData] = useState<EOCData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/eoc');
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (err) {
                console.error('Failed to fetch EOC data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const operations = [
        { label: 'Incident Command Post (ICP)', status: (data?.metrics.activeEvents || 0) > 0 ? 'Active' : 'Standby', color: (data?.metrics.activeEvents || 0) > 0 ? 'bg-emerald-500' : 'bg-slate-400' },
        { label: 'Emergency Operations Center', status: 'Active', color: 'bg-emerald-500' },
        { label: 'Resource Management Unit', status: 'Ready', color: 'bg-emerald-500' },
    ]

    return (
        <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Activity className="w-32 h-32" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    Virtual EOC Operations
                </h3>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Units</p>
                        <p className="text-sm font-black text-emerald-600">{loading ? '...' : data?.metrics.responseUnits}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        AI Operational Insights
                    </h4>
                    <div className="space-y-3">
                        {loading ? (
                            [1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
                        ) : (
                            data?.insights.map((insight, idx) => (
                                <div key={idx} className={cn(
                                    "p-4 rounded-xl border transition-all hover:shadow-sm",
                                    idx === 1 ? "bg-red-50/50 border-red-100" : "bg-slate-50 border-slate-100"
                                )}>
                                    <p className="text-sm font-medium text-slate-700 leading-tight">
                                        {insight}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Backend Activity</h4>
                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                            ))
                        ) : (
                            data?.activities.map((activity, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{activity.label}</span>
                                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">{activity.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            <span>Operational Readiness</span>
                            <span className="text-emerald-500">98% Optimal</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[98%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
