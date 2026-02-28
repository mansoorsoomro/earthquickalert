'use client'

import React from 'react'
import { FileText, ListTodo, Building2, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const tools = [
    {
        icon: FileText,
        label: 'Submit Situation Report',
        color: 'text-slate-600',
        bg: 'bg-slate-100/50'
    },
    {
        icon: ListTodo,
        label: 'Assign Task',
        color: 'text-slate-600',
        bg: 'bg-slate-100/50'
    },
    {
        icon: Building2,
        label: 'Update Infrastructure Status',
        color: 'text-slate-600',
        bg: 'bg-slate-100/50'
    },
    {
        icon: ShieldCheck,
        label: 'Approve Resource Activation',
        color: 'text-slate-600',
        bg: 'bg-slate-100/50'
    }
]

export function FirstResponderTools() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-6">First Responder Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool, index) => (
                    <button
                        key={index}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-xl transition-all hover:bg-slate-100 border border-slate-50",
                            tool.bg
                        )}
                    >
                        <tool.icon className={cn("w-5 h-5", tool.color)} />
                        <span className="text-sm font-bold text-slate-700 text-left leading-tight">
                            {tool.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
