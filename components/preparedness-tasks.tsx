'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function PreparednessTasks() {
    const tasks = [
        { id: 1, label: 'Collect Damage Reports', status: '42 pending', color: 'bg-orange-50 text-orange-600' },
        { id: 2, label: 'Activate FEMA Resource Links', status: 'Ready', color: 'bg-blue-50 text-blue-600' },
        { id: 3, label: 'Update Status Notifications', status: 'In Progress', color: 'bg-amber-50 text-amber-600' },
        { id: 4, label: 'Prepare After-Action Summary', status: 'Scheduled', color: 'bg-emerald-50 text-emerald-600' },
    ]

    return (
        <Card className="p-6 border border-slate-100 shadow-sm rounded-2xl bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Post-Event & Recovery Tasks</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pending Items</p>
            <div className="space-y-2">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-600">{task.label}</span>
                        <div className={cn("px-3 py-1 rounded-full", task.color)}>
                            <span className="text-[10px] font-bold uppercase">{task.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
