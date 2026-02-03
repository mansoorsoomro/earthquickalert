'use client'

import { useState } from 'react'
import { X, AlertTriangle, Shield, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActivateVirtualEOCModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ActivateVirtualEOCModal({ isOpen, onClose }: ActivateVirtualEOCModalProps) {
    const [severity, setSeverity] = useState('major')
    const [zone, setZone] = useState('Zone A')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="bg-red-600 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Activate Virtual EOC</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-gray-600">
                        Confirm the activation of the Virtual Emergency Operations Center. This will notify all authorized responders and trigger geolocated citizen alerts.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Event Severity</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Major', 'Catastrophic'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSeverity(s.toLowerCase())}
                                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${severity === s.toLowerCase()
                                                ? 'border-red-600 bg-red-50 text-red-600'
                                                : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Impacted Zone</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <select
                                    value={zone}
                                    onChange={(e) => setZone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 appearance-none font-medium text-slate-700"
                                >
                                    <option>Zone A (Coastal District)</option>
                                    <option>Zone B (Industrial Hub)</option>
                                    <option>Zone C (Residential West)</option>
                                    <option>All Zones (Full Scale)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            WARNING: Activating the Virtual EOC for non-emergency purposes may cause public panic and misallocation of resources. Ensure compliance with organization policies.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button variant="outline" onClick={onClose} className="flex-1 py-6 rounded-xl font-bold border-2 border-slate-200 hover:bg-slate-50">
                            Cancel
                        </Button>
                        <Button className="flex-1 py-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95">
                            Confirm Activation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
