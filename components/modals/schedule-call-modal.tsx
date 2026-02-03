'use client'

import { useState } from 'react'
import { X, Phone, Calendar, Clock, UserPlus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScheduleCallModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ScheduleCallModal({ isOpen, onClose }: ScheduleCallModalProps) {
    const [isScheduled, setIsScheduled] = useState(false)

    const handleSchedule = () => {
        setIsScheduled(true)
        setTimeout(() => {
            setIsScheduled(false)
            onClose()
        }, 2000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="bg-green-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <Phone className="w-10 h-10 text-green-200 fill-green-200" />
                            <div>
                                <h2 className="text-3xl font-black">Schedule Call</h2>
                                <p className="text-green-100 font-medium">Emergency Coordination Line</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input type="text" defaultValue="Today" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input type="text" defaultValue="4:30 PM" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Participants</label>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 font-bold overflow-hidden flex-shrink-0">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                                </div>
                            ))}
                            <button className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-green-500 hover:border-green-500 transition-colors flex-shrink-0">
                                <UserPlus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Call Topic</h4>
                        <p className="text-sm font-bold text-slate-700">Zone A Resource Re-allocation & Flash Flood Protocol Review</p>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSchedule}
                            disabled={isScheduled}
                            className={`w-full py-7 font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isScheduled ? 'bg-green-500 hover:bg-green-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                        >
                            {isScheduled ? (
                                <>
                                    <Check className="w-6 h-6" />
                                    Call Scheduled
                                </>
                            ) : (
                                'Confirm Schedule'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
