'use client'

import { X, Zap, Heart, Home, DollarSign, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RecoveryToolsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function RecoveryToolsModal({ isOpen, onClose }: RecoveryToolsModalProps) {
    const tools = [
        {
            icon: Home,
            title: 'Housing Assistance',
            desc: 'Connect victims with temporary housing and shelter resources.',
            color: 'bg-blue-500',
        },
        {
            icon: DollarSign,
            title: 'FEMA Grant Links',
            desc: 'Official direct portals for federal disaster assistance applications.',
            color: 'bg-green-500',
        },
        {
            icon: Heart,
            title: 'Mental Health Support',
            desc: 'Rapid routing to crisis counseling and wellness services.',
            color: 'bg-pink-500',
        },
        {
            icon: Zap,
            title: 'Utility Restoration',
            desc: 'Monitor and coordinate water, power, and gas service reconnects.',
            color: 'bg-yellow-500',
        },
    ]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="bg-indigo-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <Zap className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                            <div>
                                <h2 className="text-3xl font-black">Recovery Tools</h2>
                                <p className="text-indigo-100 font-medium">Post-Event Restoration & Citizen Support</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {tools.map((tool, idx) => {
                            const Icon = tool.icon
                            return (
                                <div key={idx} className="group p-6 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex items-center gap-6">
                                    <div className={`p-4 rounded-xl ${tool.color} text-white shadow-lg`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{tool.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{tool.desc}</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                            )
                        })}
                    </div>

                    <div className="pt-4">
                        <Button className="w-full py-7 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 text-lg">
                            Launch Recovery Command Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
