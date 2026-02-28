'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function VirtualEOCOperations() {
    const operations = [
        { label: 'Incident Command Post (ICP)', status: 'Active', color: 'bg-emerald-500' },
        { label: 'Emergency Operations Center', status: 'Active', color: 'bg-emerald-500' },
        { label: 'Resource Management Unit', status: 'Ready', color: 'bg-emerald-500' },
    ]

    const metrics = [
        { label: 'Incoming Alerts', value: '42 / hr', color: 'text-emerald-500' },
        { label: 'Response Units', value: '18 Active', color: 'text-emerald-500' },
        { label: 'Comm. Channels', value: '7 Active', color: 'text-emerald-500' },
    ]

    return (
        <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Virtual EOC Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">AI-Generated Insights</h4>
                    <div className="space-y-3">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm font-medium text-slate-600">Potential escalation if rainfall continues</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl">
                            <p className="text-sm font-medium text-slate-600">Hospital bed capacity nearing threshold</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm font-medium text-slate-600">Power grid risk in Zone C</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Backend Activity</h4>
                    <div className="space-y-4">
                        {[
                            { label: 'Data ingestion', status: 'Running' },
                            { label: 'Interagency comms', status: 'Active' },
                            { label: 'Community messages', status: 'Open' }
                        ].map((activity, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">{activity.label}</span>
                                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">{activity.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
