'use client'

import { X, Shield, BookOpen, Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SafetyGuideModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SafetyGuideModal({ isOpen, onClose }: SafetyGuideModalProps) {
    const guides = [
        { title: 'Tornado Safety Protocol', category: 'Weather', size: '1.2 MB' },
        { title: 'Flash Flood Evacuation', category: 'Water', size: '2.4 MB' },
        { title: 'Emergency Shelter Operations', category: 'Resources', size: '0.8 MB' },
        { title: 'Hazardous Material Handling', category: 'Chemical', size: '3.1 MB' },
    ]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="bg-blue-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <Shield className="w-10 h-10 text-blue-200 fill-blue-200" />
                            <div>
                                <h2 className="text-3xl font-black">Safety Guides</h2>
                                <p className="text-blue-100 font-medium">Official Protocols & Training Manuals</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search protocols..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                        />
                    </div>

                    <div className="space-y-3">
                        {guides.map((guide, idx) => (
                            <div key={idx} className="group p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-2xl transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:shadow-blue-500/10 transition-shadow">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{guide.title}</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{guide.category} • {guide.size}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-slate-400 font-medium pt-2">
                        These documents are for authorized responder use only.
                        Do not distribute externally without PR approval.
                    </p>
                </div>
            </div>
        </div>
    )
}
