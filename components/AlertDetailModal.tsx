'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info, ExternalLink } from 'lucide-react'
import { DamageReportModal } from '@/components/modals/damage-report-modal'

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
                                {content.meaning}
                            </p>
                        </section>

                        {/* What You Need To Do Now */}
                        <section className="bg-red-100 p-6 rounded-xl border border-red-200">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">What You Need To Do Now</h3>
                            <ul className="space-y-3">
                                {content.actions.map((action, index) => (
                                    <li key={index} className="flex gap-3 text-sm text-gray-700">
                                        <span className="flex-shrink-0 text-gray-900 font-semibold">✓</span>
                                        <span>{action}</span>
                                    </li>
                                ))}
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
                                    {content.tip}
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

                        {/* Resources & Assistance - Dynamic by Severity */}
                        {(() => {
                            const level = getSeverityLevel(alert.severity, alert.title)
                            return (
                                <section className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-base text-gray-900">Resources & Assistance</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${level === 4 ? 'bg-red-100 text-red-700' :
                                                level === 3 ? 'bg-orange-100 text-orange-700' :
                                                    level === 2 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                            }`}>
                                            {level === 4 ? '🔴 Catastrophic Event' : level === 3 ? '🟠 Major Event' : level === 2 ? '🟡 Intermediate Event' : '🟢 Localized Event'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                        {/* Always visible: Report Damage */}
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-blue-600"
                                            onClick={() => setIsDamageModalOpen(true)}
                                        >
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-4" /><path d="M8 18v-2" /><path d="M16 18v-6" /></svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900">Report Damage</div>
                                                <div className="text-xs text-gray-500 font-normal">Submit photos & details</div>
                                            </div>
                                        </Button>

                                        {/* Always visible: Contact Virtual EOC */}
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-purple-600"
                                            onClick={() => window.open('/virtual-eoc', '_blank')}
                                        >
                                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900">Contact Virtual EOC</div>
                                                <div className="text-xs text-gray-500 font-normal">Talk to emergency support</div>
                                            </div>
                                        </Button>

                                        {/* Intermediate+ (level >= 2): Shelter & Live Updates */}
                                        {level >= 2 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-green-600"
                                                onClick={() => window.open('/shelters', '_blank')}
                                            >
                                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">Find Shelter</div>
                                                    <div className="text-xs text-gray-500 font-normal">Locations & capacity</div>
                                                </div>
                                            </Button>
                                        )}

                                        {level >= 2 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-indigo-600"
                                                onClick={() => window.open('/live-updates', '_blank')}
                                            >
                                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">Live Coordinator Updates</div>
                                                    <div className="text-xs text-gray-500 font-normal">10-min interval briefings</div>
                                                </div>
                                            </Button>
                                        )}

                                        {/* Major+ (level >= 3): Medical, Evacuation Routes */}
                                        {level >= 3 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-red-600"
                                                onClick={() => window.open('/medical', '_blank')}
                                            >
                                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" /><path d="M16 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">Medical & Pharmacy</div>
                                                    <div className="text-xs text-gray-500 font-normal">Open sites & pop-up clinics</div>
                                                </div>
                                            </Button>
                                        )}

                                        {level >= 3 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-orange-600"
                                                onClick={() => window.open('/evacuation', '_blank')}
                                            >
                                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" /><line x1="15" y1="9" x2="19" y2="5" /><polyline points="15 5 19 5 19 9" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">Evacuation Routes</div>
                                                    <div className="text-xs text-gray-500 font-normal">Real-time route guidance</div>
                                                </div>
                                            </Button>
                                        )}

                                        {level >= 3 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-yellow-700"
                                                onClick={() => window.open('/fema-resources', '_blank')}
                                            >
                                                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">FEMA & State Resources</div>
                                                    <div className="text-xs text-gray-500 font-normal">Assistance & relief programs</div>
                                                </div>
                                            </Button>
                                        )}

                                        {/* Catastrophic (level === 4): Pet Refuge, Reunification, Donations */}
                                        {level >= 4 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-pink-600"
                                                onClick={() => window.open('/pet-refuge', '_blank')}
                                            >
                                                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">Pet Refuge Centers</div>
                                                    <div className="text-xs text-gray-500 font-normal">Safe locations for animals</div>
                                                </div>
                                            </Button>
                                        )}

                                        {level >= 4 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-teal-600"
                                                onClick={() => window.open('/reunification', '_blank')}
                                            >
                                                <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">Family Reunification</div>
                                                    <div className="text-xs text-gray-500 font-normal">Find & reconnect with family</div>
                                                </div>
                                            </Button>
                                        )}

                                        {level >= 4 && (
                                            <Button
                                                variant="outline"
                                                className="h-auto py-3 justify-start gap-3 border-gray-300 hover:bg-gray-50 hover:text-emerald-600 md:col-span-2"
                                                onClick={() => window.open('/donations', '_blank')}
                                            >
                                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">Donations & Volunteer Info</div>
                                                    <div className="text-xs text-gray-500 font-normal">Support recovery efforts</div>
                                                </div>
                                            </Button>
                                        )}

                                    </div>
                                </section>
                            )
                        })()}



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
            <DamageReportModal isOpen={isDamageModalOpen} onClose={() => setIsDamageModalOpen(false)} />
        </>
    )
}

