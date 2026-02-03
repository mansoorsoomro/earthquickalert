'use client'

import { useState } from 'react'
import { X, ShieldAlert, Users, Send, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotifyLeadersModalProps {
    isOpen: boolean
    onClose: () => void
}

export function NotifyLeadersModal({ isOpen, onClose }: NotifyLeadersModalProps) {
    const [isSent, setIsSent] = useState(false)

    const leaders = [
        { name: 'Mayor’s Office', role: 'Executive Authority' },
        { name: 'Police Chief', role: 'Public Safety' },
        { name: 'Fire Commissioner', role: 'Emergency Response' },
        { name: 'City Manager', role: 'Operational Oversight' },
    ]

    const handleSend = () => {
        setIsSent(true)
        setTimeout(() => {
            setIsSent(false)
            onClose()
        }, 2000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="bg-amber-500 p-8 text-white relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <ShieldAlert className="w-10 h-10 text-amber-100 fill-amber-100" />
                            <div>
                                <h2 className="text-3xl font-black">Notify Leaders</h2>
                                <p className="text-amber-100 font-medium">Direct Stakeholder Communication</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Stakeholders</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {leaders.map((leader, idx) => (
                                <label key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-amber-300 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform">
                                            <Users className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{leader.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{leader.role}</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-2 border-slate-200 text-amber-500 focus:ring-amber-500" />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Priority Level</h3>
                        <div className="flex gap-2">
                            {['Standard', 'Urgent', 'Critical'].map((level) => (
                                <button key={level} className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold transition-all ${level === 'Critical' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400'
                                    }`}>
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSend}
                            disabled={isSent}
                            className={`w-full py-7 font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isSent ? 'bg-green-500 hover:bg-green-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                        >
                            {isSent ? (
                                <>
                                    <Check className="w-6 h-6" />
                                    Sent Successfully
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Broaden Notification
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
