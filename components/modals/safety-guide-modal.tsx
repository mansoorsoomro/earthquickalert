'use client'

import React, { useState } from 'react'
import { X, Shield, BookOpen, Search, ChevronRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SAFETY_INFO, SafetyInfo } from '@/lib/constants/safety-info'

interface SafetyGuideModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SafetyGuideModal({ isOpen, onClose }: SafetyGuideModalProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    if (!isOpen) return null

    const filteredInfo = Object.entries(SAFETY_INFO).filter(([key, info]) =>
        info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.items.some(item =>
            item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-500">
                {/* Header */}
                <div className="bg-blue-600 p-8 text-white relative shrink-0">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">Citizen Safety Guide</h2>
                                <p className="text-blue-100 font-medium h6 uppercase text-xs tracking-widest mt-1">Operational Preparedness & Life Safety Manual</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Sidebar / Navigation */}
                    <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                        <div className="p-6 border-b border-slate-100 bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search protocols..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {filteredInfo.map(([key, info]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between group ${selectedCategory === key
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'hover:bg-white hover:shadow-md text-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <BookOpen className={`w-4 h-4 ${selectedCategory === key ? 'text-white' : 'text-blue-500'}`} />
                                        <span className="font-bold text-xs uppercase tracking-tight">{info.title}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === key ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white">
                        {selectedCategory ? (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 border-b-4 border-blue-600 pb-4 inline-block mb-8">
                                        {SAFETY_INFO[selectedCategory].title}
                                    </h3>

                                    <div className="space-y-10">
                                        {SAFETY_INFO[selectedCategory].items.map((item, idx) => (
                                            <div key={idx} className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{item.subtitle}</h4>
                                                </div>
                                                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 shadow-sm leading-relaxed whitespace-pre-wrap text-slate-700 font-medium">
                                                    {item.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-4 mt-12">
                                    <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                                        FEMA recommends that you prepare to be on your own without any assistance from community first responders up to 72 hours.
                                        For more information on evacuation preparedness, refer to <a href="https://ready.gov" className="underline font-bold" target="_blank">Ready.gov</a>.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                                <div className="p-6 bg-slate-50 rounded-full">
                                    <Shield className="w-16 h-16 opacity-20" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800">Operational Readiness Center</h3>
                                <p className="max-w-xs text-slate-500 font-medium text-sm">Select a category from the sidebar to view detailed preparedness protocols and safety instructions.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                    <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        Ready2Go™ Emergency Management Framework | Confidential Deployment
                    </p>
                </div>
            </div>
        </div>
    )
}
