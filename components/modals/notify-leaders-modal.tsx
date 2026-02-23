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
    const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'finishing'>('idle')

    const leaders = [
        { name: 'Mayor’s Office', role: 'Executive Authority', email: 'mayor@city.gov' },
        { name: 'Police Chief', role: 'Public Safety', email: 'chief@city.pd' },
        { name: 'Fire Commissioner', role: 'Emergency Response', email: 'commissioner@city.fd' },
        { name: 'City Manager', role: 'Operational Oversight', email: 'manager@city.gov' },
    ]

    const [deliveryMethods, setDeliveryMethods] = useState({
        email: true,
        sms: true,
        push: true
    })

    const handleSend = () => {
        setSendingStatus('sending')

        // Simulate sending process
        setTimeout(() => {
            setSendingStatus('finishing')
            setTimeout(() => {
                setIsSent(true)
                setSendingStatus('idle')
                setTimeout(() => {
                    setIsSent(false)
                    onClose()
                }, 3000)
            }, 1000)
        }, 2000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="bg-amber-500 p-6 md:p-8 text-white relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <ShieldAlert className="w-10 h-10 text-amber-100 fill-amber-100" />
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black">Notify Leaders</h2>
                                <p className="text-amber-100 font-medium text-sm md:text-base">Direct Stakeholder Communication</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
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
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{leader.role} • {leader.email}</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-2 border-slate-200 text-amber-500 focus:ring-amber-500" />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Priority Level</h3>
                            <div className="flex gap-2">
                                {['Standard', 'Urgent', 'Critical'].map((level) => (
                                    <button key={level} className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-bold transition-all ${level === 'Critical' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400'
                                        }`}>
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Delivery Methods</h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setDeliveryMethods(prev => ({ ...prev, email: !prev.email }))}
                                    className={`px-3 py-2 rounded-lg border-2 text-[10px] font-bold transition-all ${deliveryMethods.email ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                                >
                                    Email
                                </button>
                                <button
                                    onClick={() => setDeliveryMethods(prev => ({ ...prev, sms: !prev.sms }))}
                                    className={`px-3 py-2 rounded-lg border-2 text-[10px] font-bold transition-all ${deliveryMethods.sms ? 'bg-green-50 border-green-500 text-green-600' : 'border-slate-100 text-slate-400'}`}
                                >
                                    SMS
                                </button>
                                <button
                                    onClick={() => setDeliveryMethods(prev => ({ ...prev, push: !prev.push }))}
                                    className={`px-3 py-2 rounded-lg border-2 text-[10px] font-bold transition-all ${deliveryMethods.push ? 'bg-amber-50 border-amber-500 text-amber-600' : 'border-slate-100 text-slate-400'}`}
                                >
                                    Push
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Response Checklist</h3>
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            rows={4}
                            placeholder="Enter the immediate response checklist for leaders..."
                            defaultValue={`- Activate EOC Coordination\n- Review NWS/NOAA Flood Data\n- Initiate Multi-Agency Notification\n- Prepare Public Information Statement`}
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSend}
                            disabled={isSent || sendingStatus !== 'idle'}
                            className={`w-full py-6 md:py-7 font-black text-base md:text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isSent ? 'bg-green-500 hover:bg-green-500 text-white' :
                                    sendingStatus === 'sending' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                                        sendingStatus === 'finishing' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                                            'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                        >
                            {isSent ? (
                                <>
                                    <Check className="w-6 h-6" />
                                    Notifications Dispatched Successfully
                                </>
                            ) : sendingStatus === 'sending' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending Email & Push Notifications...
                                </>
                            ) : sendingStatus === 'finishing' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Finalizing Multi-Channel Delivery...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send message
                                </>
                            )}
                        </Button>

                        {isSent && (
                            <p className="text-center text-[10px] text-green-600 font-bold uppercase tracking-widest mt-4 animate-in fade-in slide-in-from-top-2">
                                Dispatched to stakeholders via {Object.entries(deliveryMethods).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(', ')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
