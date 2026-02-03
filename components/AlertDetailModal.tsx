'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info, ExternalLink } from 'lucide-react'

interface AlertDetailModalProps {
    isOpen: boolean
    onClose: () => void
    onCheckIn: () => void
    alert: {
        title: string
        location: string
        type: string
        severity: string
        issuedTime: string
        expiry: string
    } | null
}

export function AlertDetailModal({ isOpen, onClose, onCheckIn, alert }: AlertDetailModalProps) {
    if (!alert) return null

    const isTornado = alert.title.toLowerCase().includes('tornado')
    const isBlizzard = alert.title.toLowerCase().includes('blizzard')
    const isSevere = alert.title.toLowerCase().includes('severe')

    const getHeaderColor = (severity: string) => {
        switch (severity) {
            case 'red': return 'bg-red-600'
            case 'orange': return 'bg-red-600'
            case 'yellow': return 'bg-red-600'
            default: return 'bg-gray-600'
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-lg">
                {/* Visually Hidden Title for Accessibility */}
                <DialogTitle className="sr-only">{alert.title} Alert</DialogTitle>
                
                {/* Header */}
                <div className={`${getHeaderColor(alert.severity)} p-6 text-white relative`}>
                    <p className="text-sm font-medium opacity-90 mb-2">Action Required</p>
                    <h1 className="text-4xl font-bold mb-3">{alert.title}</h1>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                        <span>{alert.location}</span>
                        <span>•</span>
                        <span>Issued {alert.issuedTime}</span>
                        <span>•</span>
                        <span>⏱ Expires {alert.expiry}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[70vh]">
                    {/* What This Means */}
                    <section>
                        <h2 className="font-bold text-xl mb-3 text-gray-900">What This Means</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {isTornado && !isSevere ? (
                                "A tornado watch means conditions are favorable for tornado formation. Stay alert and monitor weather updates closely."
                            ) : isTornado && isSevere ? (
                                "A tornado has been sighted or indicated by weather radar. There is imminent danger to life and property. Move to an interior room on the lowest floor of a sturdy building immediately."
                            ) : isBlizzard ? (
                                "Severe winter weather is impacting your area. Heavy snow, strong winds, and dangerously low visibility are expected, making travel extremely hazardous."
                            ) : (
                                `A ${alert.title} has been issued for your area. Please stay tuned to local media for updates and follow guidance from local authorities.`
                            )}
                        </p>
                    </section>

                    {/* What You Need To Do Now */}
                    <section className="bg-red-100 p-6 rounded-xl border border-red-200">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">What You Need To Do Now</h3>
                        <ul className="space-y-3">
                            {isTornado && !isSevere ? (
                                <>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Monitor local weather alerts and forecasts closely</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Have multiple ways to receive weather warnings</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Know where your safe room is located</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Be prepared to take shelter immediately if a warning is issued</span>
                                    </li>
                                </>
                            ) : isTornado && isSevere ? (
                                <>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Move to a basement or an interior room on the lowest floor</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Avoid Windows and cover your head/neck</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>If outdoors/in vehicle, find substantial shelter immediately</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Protect yourself from flying debris</span>
                                    </li>
                                </>
                            ) : isBlizzard ? (
                                <>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Stay indoors and avoid all non-essential travel</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Ensure you have enough food, water, and medication</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Keep pets indoors and make sure they have supplies</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>Use caution if you must go outside</span>
                                    </li>
                                </>
                            ) : (
                                <li className="flex gap-3 text-sm text-gray-700">
                                    <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                    <span>Stay alert and follow local guidance.</span>
                                </li>
                            )}
                        </ul>
                    </section>

                    {/* Preparedness Tip */}
                    <section className="flex gap-4">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Info className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-base mb-1 text-gray-900">Preparedness Tip</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {isTornado && !isSevere ? (
                                    "Have your emergency kit ready. Ensure your phone is charged and weather alerts are enabled."
                                ) : isTornado && isSevere ? (
                                    "Have your emergency kit ready. Ensure your phone is charged and weather alerts are enabled."
                                ) : isBlizzard ? (
                                    "Charge all electronic devices and keep flashlights, blankets, and warm clothing accessible. Allow extra time for snow removal after the storm."
                                ) : (
                                    "Review your emergency plan and check your supplies."
                                )}
                            </p>
                        </div>
                    </section>

                    {/* Safety Check-in */}
                    <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-gray-900">Safety Check-in</h3>
                                <p className="text-sm text-gray-600">Mark yourself safe to notify your team.</p>
                            </div>
                            <Button
                                onClick={onCheckIn}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 h-10"
                            >
                                Check-in Now
                            </Button>
                        </div>
                    </section>

                    {/* NWS Footer */}
                    <footer className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">🌍</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">National Weather Service</p>
                                <p className="text-xs text-gray-500">Official Alert = Updated 3 min ago</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-sm h-10 flex items-center gap-2 border-gray-300">
                            View Official NWS Update <ExternalLink className="w-4 h-4" />
                        </Button>
                    </footer>
                </div>
            </DialogContent>
        </Dialog>
    )
}

