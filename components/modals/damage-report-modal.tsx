'use client'

import { X, ClipboardList, MapPin, Camera, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DamageReportModalProps {
    isOpen: boolean
    onClose: () => void
}

export function DamageReportModal({ isOpen, onClose }: DamageReportModalProps) {
    const reports = [
        { id: 'DR-104', type: 'Residential', severity: 'Major', time: '10 min ago' },
        { id: 'DR-103', type: 'Commercial', severity: 'Moderate', time: '25 min ago' },
        { id: 'DR-102', type: 'Infrastructure', severity: 'Catastrophic', time: '1 hr ago' },
    ]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="bg-slate-800 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="w-7 h-7 text-amber-500" />
                        <h2 className="text-2xl font-bold">Citizen Damage Reports</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex h-[70vh]">
                    {/* List View */}
                    <div className="w-1/2 border-r border-slate-100 overflow-y-auto">
                        {reports.map((report) => (
                            <div key={report.id} className="p-6 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-amber-600 transition-colors uppercase tracking-widest">{report.id}</span>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                        <Clock className="w-3 h-3" />
                                        {report.time}
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{report.type} Damage</h3>
                                <div className="flex items-center gap-3">
                                    <Badge className={`${report.severity === 'Catastrophic' ? 'bg-red-500' :
                                            report.severity === 'Major' ? 'bg-orange-500' : 'bg-yellow-500'
                                        } text-white border-0 text-[10px] font-black uppercase px-2`}>
                                        {report.severity}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                                        <MapPin className="w-3 h-3" />
                                        <span>Zone C</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Individual Report Detail */}
                    <div className="w-1/2 p-8 space-y-6 overflow-y-auto bg-slate-50/50">
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Report Detail</h3>
                            <div className="aspect-video bg-slate-200 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-slate-300">
                                <div className="text-center">
                                    <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-500 uppercase">View Attached Images</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                "Roof extensively damaged by high winds. Water starting to enter the living area. Two windows broken in the master bedroom."
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Verification Status</h4>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Pending Review</p>
                                    <p className="text-xs text-slate-500 font-medium">Waiting for agency confirmation</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <Button size="sm" variant="outline" className="flex-1 rounded-lg font-bold border-2 border-slate-200">Reject</Button>
                            <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold">
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
