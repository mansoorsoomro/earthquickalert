'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export function ThreatMonitoring() {
    const threats = [
        { id: 1, label: 'NWS Severe Weather Alerts' },
        { id: 2, label: 'News Incident Reports' },
        { id: 3, label: 'Government Emergency Declarations' },
        { id: 4, label: 'Social Media Signals' },
        { id: 5, label: 'Citizen Submitted Reports' },
    ]

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Threat Detection & Monitoring</h3>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live Inputs</h4>
                    <div className="space-y-3">
                        {threats.map((threat) => (
                            <div key={threat.id} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white" />
                                <span className="text-sm font-medium text-slate-600">{threat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">AI Assessment</h4>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-slate-400">Geo-relevance</p>
                            <p className="text-sm font-extrabold text-slate-900">High</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Severity Level</p>
                            <p className="text-sm font-extrabold text-blue-500">Intermediate Event</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Affected Areas</p>
                            <p className="text-sm font-extrabold text-slate-900">Zone A, Zone C</p>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-medium text-slate-400">Confidence Score</p>
                                <p className="text-xs font-bold text-emerald-500">92%</p>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '92%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
