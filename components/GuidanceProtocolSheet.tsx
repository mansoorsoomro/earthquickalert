'use client'

import React from 'react'
import {
    Sheet,
    SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Building2,
    MapPin,
    ClipboardCheck,
    Share2,
    Home,
    ShieldAlert,
    Dog,
    X
} from 'lucide-react'

interface GuidanceProtocolSheetProps {
    isOpen: boolean
    onClose: () => void
    alertTitle: string
}

export function GuidanceProtocolSheet({ isOpen, onClose, alertTitle }: GuidanceProtocolSheetProps) {
    const isTornado = alertTitle.toLowerCase().includes('tornado')
    const isBlizzard = alertTitle.toLowerCase().includes('blizzard')

    const getGuidanceItems = () => {
        if (isTornado) {
            return [
                { label: "Seek Shelter", icon: "🏠", desc: "Move to the basement or interior room on the lowest floor" },
                { label: "Avoid Windows", icon: "🪟", desc: "Stay Away from windows and door" },
                { label: "Pet Safety", icon: "🐾", desc: "Bring pets immediately inside and keep them leashed" }
            ]
        } else if (isBlizzard) {
            return [
                { label: "Stay Indoors", icon: "🏠", desc: "Avoid all non-essential travel" },
                { label: "Stock Supplies", icon: "📦", desc: "Have food, water, and medication ready" },
                { label: "Keep Warm", icon: "🔥", desc: "Ensure heating systems work and have blankets" }
            ]
        }
        return []
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="sm:max-w-lg p-8 overflow-y-auto bg-white border-l border-gray-200 shadow-2xl">
                {/* Header */}
                <div className="mb-8 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                    <p className="text-blue-600 text-sm font-bold mb-2">Guidance Protocol</p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{alertTitle} Preparedness</h1>
                    <p className="text-sm text-gray-600">Protocol Level 1A – Updated Today</p>
                </div>

                <div className="space-y-8">
                    {/* Immediate Actions */}
                    <section>
                        <h2 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                            ✓ Immediate Actions
                        </h2>
                        <div className="space-y-3">
                            {[
                                { label: "Activate Community Sirens", desc: "Siren 4 only" },
                                { label: "Broadcast SMS Alert", desc: "'Take Shelter Immediately'" },
                                { label: "Contact School District", desc: "'Initiate Lockdown Procedures'" }
                            ].map((action, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                                    <Checkbox id={`action-${i}`} className="mt-1 w-5 h-5" />
                                    <label htmlFor={`action-${i}`} className="flex-1 cursor-pointer">
                                        <p className="text-base font-bold text-gray-900">{action.label}</p>
                                        <p className="text-sm text-gray-600 mt-1">{action.desc}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Public Guidance Preview */}
                    <section>
                        <h2 className="font-bold text-lg mb-4 text-gray-900">Public Guidance Preview</h2>
                        <div className="space-y-4 bg-blue-50 p-6 rounded-2xl">
                            {getGuidanceItems().map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Resources */}
                    <section>
                        <h2 className="font-bold text-lg mb-4 text-gray-900">Resources</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Button 
                                variant="outline" 
                                className="h-24 flex flex-col gap-3 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 rounded-lg"
                            >
                                <MapPin className="w-6 h-6 text-gray-700" />
                                <span className="text-sm font-bold text-gray-900">Evacuation Map</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                className="h-24 flex flex-col gap-3 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 rounded-lg"
                            >
                                <ClipboardCheck className="w-6 h-6 text-gray-700" />
                                <span className="text-sm font-bold text-gray-900">Shelter Checklist</span>
                            </Button>
                        </div>
                    </section>

                    {/* Footer Action */}
                    <div className="pt-4">
                        <Button className="w-full border border-gray-400 text-gray-900 bg-white hover:bg-gray-50 text-sm font-bold h-12 rounded-lg transition-colors">
                            Share 'Are We Safe' Status
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

