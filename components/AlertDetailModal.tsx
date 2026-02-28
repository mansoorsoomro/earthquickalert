'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info, ExternalLink, AlertCircle } from 'lucide-react'
import { DamageReportModal } from '@/components/modals/damage-report-modal'
import { cn } from '@/lib/utils'

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


const getHeaderColor = (severity: string) => {
    if (!severity) return 'bg-blue-600'
    const s = severity.toLowerCase()
    if (s.includes('extreme') || s.includes('severe') || s.includes('critical')) return 'bg-red-600'
    if (s.includes('warning')) return 'bg-orange-500'
    if (s.includes('watch') || s.includes('caution')) return 'bg-yellow-500'
    if (s.includes('advisory')) return 'bg-blue-500'
    return 'bg-blue-600'
}

// Returns 1=Localized, 2=Intermediate, 3=Major, 4=Catastrophic
const getSeverityLevel = (severity: string, title: string): number => {
    const s = (severity + ' ' + title).toLowerCase()
    if (s.includes('extreme') || s.includes('catastrophic') || s.includes('hurricane') || s.includes('blizzard') || s.includes('wildfire') || s.includes('nor\'easter')) return 4
    if (s.includes('severe') || s.includes('critical') || s.includes('major') || s.includes('derecho') || s.includes('tornado warning') || s.includes('flooding')) return 3
    if (s.includes('warning') || s.includes('watch') || s.includes('winter storm') || s.includes('tornado') || s.includes('flood')) return 2
    return 1
}

export function AlertDetailModal({ isOpen, onClose, onCheckIn, alert }: AlertDetailModalProps) {
    const [isDamageModalOpen, setIsDamageModalOpen] = useState(false)

    if (!alert) return null

    const getAlertContent = () => {

        const title = alert.title.toLowerCase()
        const isSevere = title.includes('severe') || title.includes('warning')

        if (title.includes('blizzard')) {
            if (title.includes('watch')) {
                return {
                    meaning: "Your geographic area is currently under a blizzard watch. This means that blizzard conditions are expected within 48 hours.",
                    actions: [
                        "Prepared to be stranded in your home for the duration of the blizzard event",
                        "Go to the store and stock up on essentials",
                        "Fill your car with a tank of gas",
                        "Ensure flashlights work and take out warm cloths/blankets",
                        "Charge all devices (cell phones, computers, tablets, etc.)",
                        "Check-in with family/friends via Ready2Go’s are we safe feature",
                        "Prepare for travel delays and/or school/work closings"
                    ],
                    tip: "Charge all electronic devices and keep flashlights, blankets, and warm clothing accessible."
                }
            }
            return {
                meaning: "Your geographic area is currently under a blizzard warning. This means heavy snow, high winds and or ice will impact your area during the warning timeframe.",
                actions: [
                    "Ensure enough medicine and food/water for duration of the storm",
                    "Ensure pet have enough food/water and medicine if applicable",
                    "Cancel all non-essential appointments and stay home",
                    "Delay travel plans if able to",
                    "Be prepared for power outages",
                    "Allow time for snow removal post storm",
                    "Check-in with family/friends via Ready2Go’s are we safe feature"
                ],
                tip: "Charge all electronic devices and keep flashlights, blankets, and warm clothing accessible. Allow extra time for snow removal after the storm."
            }
        }

        if (title.includes('earthquake')) {
            return {
                meaning: "Your geographic area is currently under an earthquake warning. This means that an earthquake is already in progress and aftershocks are expected.",
                actions: [
                    "If inside, immediately drop, take cover protecting your head and neck and hang on until the shaking stops. Once the shaking stops, evacuate the building",
                    "If outside get to an open area away from buildings, powerlines, etc. then proceed to drop, take cover protecting your head and neck and hang onto the ground until the shaking stops",
                    "If in a moving vehicle, immediately stop the vehicle preferably in an open area",
                    "When the shaking stops, assess your space for any damage. If there is damage in the area, stay away until authorities say it is safe to enter",
                    "Check-in with family/friends via Ready2Go’s are we safe feature",
                    "Be prepared for aftershock"
                ],
                tip: "Drop, Cover, and Hold On. Stay away from windows and heavy furniture."
            }
        }

        if (title.includes('heat')) {
            return {
                meaning: "Your geographic area is currently under an excessive heat warning. This means dangerous heat conditions are or will be impacting your region within the next 12 hours.",
                actions: [
                    "Stay indoors, proceed to community shelter if you are considered high risk for heat exhaustion and do not have air conditioning",
                    "Drink plenty of fluids",
                    "Limit outside physical activity during daylight hours"
                ],
                tip: "Stay hydrated and avoid strenuous activities during the hottest part of the day."
            }
        }

        if (title.includes('flash flood')) {
            return {
                meaning: "Your geographic area is currently under a flash flood warning. Due to rain in the area, flash flooding is likely to occur if is have not already occurred.",
                actions: [
                    "Stay away from riverbeds and other areas that are susceptible to flooding as flash floods happen quickly",
                    "Avoid walking through flooded areas as six inches or less can knock you down",
                    "Avoid driving through flooded areas as twelve inches of water can sweep your vehicle away",
                    "If you must travel, avoid flood prone roadways and NEVER attempt to cross a flooded road"
                ],
                tip: "Turn Around, Don't Drown! Never drive through flooded roadways."
            }
        }

        if (title.includes('flood')) {
            return {
                meaning: "Your geographic area is currently under a flood warning. Due to rain in the area, flooding is likely to occur if is have not already occurred.",
                actions: [
                    "Immediately evacuate to higher ground if you are in a flood prone area",
                    "Seek shelter for the duration of the storm and avoid traveling through flood prone areas",
                    "If you must travel, avoid flood prone roadways and NEVER attempt to cross a flooded road"
                ],
                tip: "Know your flood risk and have an evacuation plan ready."
            }
        }

        if (title.includes('hurricane')) {
            if (title.includes('watch')) {
                return {
                    meaning: "Your geographic area is currently under a hurricane watch. This means a hurricane could possibly impact your location within 48 hours. This hurricane may bring dangerous winds exceeding 75 mph, heavy rain, frequent lightening and hail.",
                    actions: [
                        "Know your evacuation route",
                        "Proceed to hardware store and purchase supplies to prepare your home for high winds, heavy surf, etc.",
                        "Proceed to gas station and fill vehicles up with gas",
                        "If choose to evacuate, rule of thumb is to evacuate as far away inland as one tank of gas will get you",
                        "If you decide not to evacuate, be prepared to be self-sufficient for up to 72 hours"
                    ],
                    tip: "Prepare your home and review your evacuation plan."
                }
            }
            return {
                meaning: "Your geographic area is currently under a hurricane warning. This means hurricane conditions are expected to impact your location within 36 hours.",
                actions: [
                    "Complete storm preparations: secure your home, fill your car up with gas, purchase extra food/water",
                    "Immediately evacuate the threatened area if impacted community orders an evacuation order",
                    "If you choose to stay, anticipate loss of power and/or water",
                    "Bookmark FEMA’s disaster assistance https://www.disasterassistance.gov/ link to reference if your property incurs damage",
                    "Take photos before and after photos and save all receipts for insurance purposes",
                    "Be prepared to be self-sufficient for up to 72 hours post impact"
                ],
                tip: "Secure your home and follow evacuation orders immediately if given."
            }
        }

        if (title.includes('shelter')) {
            return {
                meaning: "Your geographic area is under a shelter in place warning. This means that conditions outside are hazardous to your life safety.",
                actions: [
                    "Ensure that family members who are outside come inside",
                    "Lock doors and proceed to an interior room, preferably without windows",
                    "Check-in with family/friends via Ready2Go’s are we safe feature",
                    "Tune into news sources for latest information",
                    "Do not open doors to the exterior of your residence unless instructed to do so by law enforcement",
                    "Stay there until authorities give the all clear"
                ],
                tip: "Stay inside, lock doors/windows, and monitor local news for updates."
            }
        }

        if (title.includes('tornado')) {
            if (title.includes('watch')) {
                return {
                    meaning: "Your geographic area is under a tornado watch. This means that tornados are possible for a set number of hours. This does not mean that they will occur.",
                    actions: [
                        "Stay alert for changing weather conditions throughout the duration of the watch",
                        "Identify shelter in place locations",
                        "Check flashlights and hand crank/battery powered radios",
                        "Check-in with family/friends via Ready2Go’s are we safe feature"
                    ],
                    tip: "Have your emergency kit ready. Ensure your phone is charged and weather alerts are enabled."
                }
            }
            return {
                meaning: "Your geographic area is under a tornado warning. This means that a tornado is imminent.",
                actions: [
                    "Seek immediate shelter. Preferable a windowless room",
                    "Check-in with family/friends via Ready2Go’s are we safe feature",
                    "Stay in your shelter in place location until the warning expires"
                ],
                tip: "Move to a basement or an interior room on the lowest floor. Avoid windows."
            }
        }

        // Default generic content
        return {
            meaning: `A ${alert.title} has been issued for your area. Please stay tuned to local media for updates and follow guidance from local authorities.`,
            actions: [
                "Monitor local weather alerts and forecasts closely",
                "Have multiple ways to receive weather warnings",
                "Be prepared to take action if the situation worsens",
                "Check-in with family/friends via Ready2Go’s are we safe feature"
            ],
            tip: "Stay alert and follow local guidance."
        }
    }

    const content = getAlertContent()

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-xl w-[95vw] sm:w-full p-0 overflow-hidden border-none sm:rounded-[2rem] rounded-2xl shadow-2xl">
                    <DialogTitle className="sr-only">{alert.title} Alert</DialogTitle>

                    {/* Header */}
                    <div className={cn("p-6 sm:p-8 text-white relative", getHeaderColor(alert.severity))}>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                        >
                            <span className="text-xl leading-none">×</span>
                        </button>

                        <div className="space-y-3 sm:space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Action Required</p>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none">{alert.title}</h1>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 sm:gap-x-4 text-[10px] sm:text-[11px] font-bold opacity-90">
                                <span className="bg-white/10 px-2 py-1 rounded">{alert.location}</span>
                                <span className="flex items-center gap-1.5 capitaize">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    Issued {alert.issuedTime}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    ⏱ Expires {alert.expiry}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Container */}
                    <div className="bg-[#F8F9FB] max-h-[85vh] sm:max-h-[75vh] overflow-y-auto">
                        <div className="p-4 sm:p-8 space-y-6">
                            {/* What to know */}
                            <section className="bg-white p-5 sm:p-6 sm:rounded-3xl rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="font-extrabold text-lg mb-2 sm:mb-3 text-gray-900">What to know</h2>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                    {content.meaning}
                                </p>
                            </section>

                            {/* Most Important To Know */}
                            <section className="bg-red-50 p-5 sm:p-6 sm:rounded-3xl rounded-2xl border border-red-100/50 shadow-sm shadow-red-500/5">
                                <h3 className="font-black text-sm uppercase tracking-widest mb-4 text-red-900">Most Important To Know</h3>
                                <ul className="space-y-4">
                                    {content.actions.map((action, index) => (
                                        <li key={index} className="flex gap-3 sm:gap-4 text-sm font-bold text-red-800/80 leading-snug">
                                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-[10px] text-red-600 mt-0.5">
                                                ✓
                                            </div>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Preparedness Tip */}
                            <div className="flex gap-4 p-4 bg-white sm:rounded-[2rem] rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
                                    <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <div className="flex-1 pt-0.5 sm:pt-1">
                                    <h3 className="font-black text-[10px] uppercase tracking-widest mb-1 text-gray-400">Preparedness Tip</h3>
                                    <p className="text-sm font-extrabold text-gray-900 leading-tight">
                                        {content.tip}
                                    </p>
                                </div>
                            </div>

                            {/* Safety Checklist */}
                            <section className="bg-white p-5 sm:p-6 sm:rounded-3xl rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                    <h3 className="font-extrabold text-lg text-gray-900">Safety Checklist</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Mark Safe</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm font-bold text-gray-900">Safety Check-in</span>
                                        </div>
                                        <Button
                                            onClick={onCheckIn}
                                            className="bg-green-600 hover:bg-green-700 text-white text-[11px] font-black uppercase tracking-widest w-full sm:w-auto px-6 h-9 rounded-xl shadow-lg shadow-green-500/20"
                                        >
                                            Check-in
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">Mark yourself safe to notify your organization</p>
                                </div>
                            </section>

                            {/* Official Source */}
                            <footer className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        🌍
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900 uppercase">National Weather Service</p>
                                        <p className="text-[10px] font-bold text-gray-400">Official Alert • Updated 2m ago</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 gap-2">
                                    Official Source <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                            </footer>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <DamageReportModal isOpen={isDamageModalOpen} onClose={() => setIsDamageModalOpen(false)} />
        </>
    )

}

