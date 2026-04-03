'use client'

import React, { useState } from 'react'
import { FileText, ListTodo, Building2, ShieldCheck, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SituationReportModal } from '@/components/modals/situation-report-modal'
import { NotifyLeadersModal } from '@/components/modals/notify-leaders-modal'
import { GISEOCActivatedModal } from '@/components/modals/gis-eoc-activated-modal'
import { SendCommunityAlertModal } from '@/components/modals/send-community-alert-modal'

export function FirstResponderTools() {
    const [modals, setModals] = useState({
        sitRep: false,
        assignTask: false,
        infrastructure: false,
        resource: false
    });

    const toggleModal = (key: keyof typeof modals, value: boolean) => {
        setModals(prev => ({ ...prev, [key]: value }));
    };

    const tools = [
        // {
        //     icon: FileText,
        //     label: 'Submit Situation Report',
        //     color: 'text-blue-600',
        //     bg: 'bg-blue-50/50',
        //     badge: 'AI Draft Ready',
        //     onClick: () => toggleModal('sitRep', true)
        // },
        // {
        //     icon: ListTodo,
        //     label: 'Assign Task',
        //     color: 'text-amber-600',
        //     bg: 'bg-amber-50/50',
        //     badge: '3 Pending',
        //     onClick: () => toggleModal('assignTask', true)
        // },
        {
            icon: Building2,
            label: 'Update Infrastructure Status',
            color: 'text-purple-600',
            bg: 'bg-purple-50/50',
            onClick: () => toggleModal('infrastructure', true)
        },
        // {
        //     icon: ShieldCheck,
        //     label: 'Approve Resource Activation',
        //     color: 'text-emerald-600',
        //     bg: 'bg-emerald-50/50',
        //     onClick: () => toggleModal('resource', true)
        // }
    ]

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck className="w-24 h-24 rotate-12" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                First Responder Tools
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {tools.map((tool, index) => (
                    <button
                        key={index}
                        onClick={tool.onClick}
                        className={cn(
                            "flex flex-col items-start gap-4 p-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] border border-slate-100 group",
                            tool.bg,
                            "hover:shadow-md hover:border-slate-200"
                        )}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className={cn("p-2.5 rounded-xl bg-white shadow-sm group-hover:shadow transition-all", tool.color)}>
                                <tool.icon className="w-5 h-5" />
                            </div>
                            {tool.badge && (
                                <span className="px-2 py-0.5 rounded-full bg-white/80 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">
                                    {tool.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-bold text-slate-700 text-left leading-tight pr-4">
                            {tool.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Modals Integration */}
            <SituationReportModal
                isOpen={modals.sitRep}
                onClose={() => toggleModal('sitRep', false)}
            />
            <NotifyLeadersModal
                isOpen={modals.assignTask}
                onClose={() => toggleModal('assignTask', false)}
            />
            <GISEOCActivatedModal
                isOpen={modals.infrastructure}
                onClose={() => toggleModal('infrastructure', false)}
            />
            <SendCommunityAlertModal
                isOpen={modals.resource}
                onClose={() => toggleModal('resource', false)}
            />
        </div>
    )
}
