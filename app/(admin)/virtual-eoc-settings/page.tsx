'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'

export default function VirtualEOCSettingsPage() {
    const [activationType, setActivationType] = useState('all')
    const [customSeverities, setCustomSeverities] = useState({
        minor: false,
        moderate: false,
        major: false,
        catastrophic: false,
    })

    const [alertFeeds, setAlertFeeds] = useState({
        nws: true,
        local: true,
        other: true,
    })

    return (
        <main className="p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen">
            {/* Header Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden p-6 md:px-8 md:py-7">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900" />
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Virtual EOC Activation Settings</h1>
                <p className="text-slate-600 text-[15px]">Configure when the Virtual Emergency Operations Center activates for your organization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Activation Criteria */}
                    <Card className="p-6 md:p-8 border-slate-200 shadow-sm rounded-xl">
                        <h2 className="text-[17px] font-bold text-slate-900 mb-2">Activation Criteria</h2>
                        <p className="text-[14px] text-slate-600 mb-6 leading-[1.4]">
                            Choose the incident severity levels that will trigger the Virtual EOC experience.
                        </p>

                        <div className="space-y-3 mb-8">
                            {/* All Events */}
                            <label className="flex items-start gap-3 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                <div className="relative flex items-start mt-0.5">
                                    <input
                                        type="radio"
                                        name="activationType"
                                        checked={activationType === 'all'}
                                        onChange={() => setActivationType('all')}
                                        className="peer appearance-none w-4 h-4 min-w-[1rem] border-2 border-[#2d325a] rounded-sm bg-white checked:bg-[#2d325a] transition-colors cursor-pointer"
                                    />
                                    <svg className="absolute inset-0 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 p-[1.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-[14px] font-bold text-slate-900 mb-0.5">All Events</div>
                                    <div className="text-[13px] text-slate-500 leading-snug">Activate the Virtual EOC for every incident, regardless of severity.</div>
                                </div>
                            </label>

                            {/* Major & Catastrophic */}
                            <label className="flex items-start gap-3 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                <div className="relative flex items-start mt-0.5">
                                    <input
                                        type="radio"
                                        name="activationType"
                                        checked={activationType === 'major'}
                                        onChange={() => setActivationType('major')}
                                        className="peer appearance-none w-4 h-4 min-w-[1rem] border-2 border-slate-300 rounded-sm bg-white checked:bg-[#2d325a] checked:border-[#2d325a] transition-colors cursor-pointer"
                                    />
                                    {activationType === 'major' && (
                                        <svg className="absolute inset-0 w-4 h-4 text-white pointer-events-none opacity-100 p-[1.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <div className="text-[14px] font-bold text-slate-900 mb-0.5">Major &amp; Catastrophic Events Only</div>
                                    <div className="text-[13px] text-slate-500 leading-snug">Activate the Virtual EOC only for high-impact incidents.</div>
                                </div>
                            </label>

                            {/* Custom */}
                            <label className="flex items-start gap-3 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                <div className="relative flex items-start mt-0.5">
                                    <input
                                        type="radio"
                                        name="activationType"
                                        checked={activationType === 'custom'}
                                        onChange={() => setActivationType('custom')}
                                        className="peer appearance-none w-4 h-4 min-w-[1rem] border-2 border-slate-300 rounded-sm bg-white checked:bg-[#2d325a] checked:border-[#2d325a] transition-colors cursor-pointer"
                                    />
                                    {activationType === 'custom' && (
                                        <svg className="absolute inset-0 w-4 h-4 text-white pointer-events-none opacity-100 p-[1.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <div className="text-[14px] font-bold text-slate-900 mb-0.5">Custom Severity Levels</div>
                                    <div className="text-[13px] text-slate-500 leading-snug">Select specific incident severities that will activate the Virtual EOC.</div>
                                </div>
                            </label>
                        </div>

                        {/* Custom Sev Subset Container */}
                        <div className={`transition-opacity duration-200 ${activationType === 'custom' ? 'opacity-100 pointer-events-auto' : 'opacity-40 pointer-events-none'}`}>
                            <h3 className="text-[14px] font-bold text-slate-900 mb-1">If Custom is selected:</h3>
                            <p className="text-[13px] text-slate-500 mb-4 leading-[1.4]">Select specific incident severities that will activate the Virtual EOC.</p>

                            <div className="space-y-2.5">
                                {[
                                    { id: 'minor', label: 'Minor' },
                                    { id: 'moderate', label: 'Moderate' },
                                    { id: 'major', label: 'Major' },
                                    { id: 'catastrophic', label: 'Catastrophic' },
                                ].map(({ id, label }) => (
                                    <label key={id} className="flex items-center gap-3 cursor-pointer group w-fit">
                                        <div className="relative flex items-start">
                                            <input
                                                type="checkbox"
                                                disabled={activationType !== 'custom'}
                                                checked={customSeverities[id as keyof typeof customSeverities]}
                                                onChange={(e) => setCustomSeverities(prev => ({ ...prev, [id]: e.target.checked }))}
                                                className="peer appearance-none w-4 h-4 min-w-[1rem] border-2 border-slate-300 rounded-[3px] bg-white checked:bg-slate-400 checked:border-slate-400 disabled:opacity-50 transition-colors cursor-pointer"
                                            />
                                            <svg className="absolute inset-0 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Location-Based Activation */}
                    <Card className="p-6 md:p-8 border-slate-200 shadow-sm rounded-xl">
                        <h2 className="text-[17px] font-bold text-slate-900 mb-2">Location-Based Activation</h2>
                        <p className="text-[14px] text-slate-600 mb-6 leading-[1.4]">
                            Virtual EOC activation is automatically limited to users within the affected geographic area.
                        </p>

                        <div className="space-y-3">
                            <div className="p-4 bg-slate-50/50 rounded-lg text-[13px] text-slate-600 leading-snug">
                                Alerts and EOC views are geolocated using official data sources such as the National Weather Service
                            </div>
                            <div className="p-4 bg-slate-50/50 rounded-lg text-[13px] text-slate-600 leading-snug">
                                Only users within the alert boundary will see the activated Virtual EOC view
                            </div>
                            <div className="p-4 bg-slate-50/50 rounded-lg text-[13px] text-slate-600 leading-snug">
                                Users outside the affected area will continue to see the standard application experience
                            </div>
                        </div>
                    </Card>

                    {/* Official Alert Feeds */}
                    <Card className="p-6 md:p-8 border-slate-200 shadow-sm rounded-xl">
                        <h2 className="text-[17px] font-bold text-slate-900 mb-2">Official Alert Feeds</h2>
                        <p className="text-[14px] text-slate-600 mb-6 leading-[1.4]">
                            Select which trusted sources are used to trigger Virtual EOC activation.
                        </p>

                        <div className="space-y-3">
                            {[
                                { id: 'nws', label: 'National Weather Service (NWS)' },
                                { id: 'local', label: 'Local Emergency Management' },
                                { id: 'other', label: 'Other Authorized Alert Sources' },
                            ].map(({ id, label }) => (
                                <label key={id} className="flex items-center gap-3 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100 group">
                                    <div className="relative flex items-start">
                                        <input
                                            type="checkbox"
                                            checked={alertFeeds[id as keyof typeof alertFeeds]}
                                            onChange={(e) => setAlertFeeds(prev => ({ ...prev, [id]: e.target.checked }))}
                                            className="peer appearance-none w-[15px] h-[15px] min-w-[15px] border-2 border-[#2d325a] rounded-sm bg-white checked:bg-[#2d325a] transition-colors cursor-pointer"
                                        />
                                        <svg className="absolute inset-0 w-[15px] h-[15px] text-white pointer-events-none opacity-0 peer-checked:opacity-100 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
                                </label>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Footer Administrative Details */}
            <div className="mt-8 p-6 rounded-xl bg-yellow-50/80 border border-yellow-100/60 text-[13px] text-slate-700 space-y-3 shadow-sm">
                <h3 className="font-bold text-[15px] text-slate-900 mb-1 flex items-center gap-2">Administrative Controls</h3>
                <p className="text-slate-800">These settings apply at the organization level</p>
                <p className="text-slate-800">Only users with Admin access can modify activation criteria</p>
                <p className="text-slate-800">Changes take effect immediately for future incidents</p>
            </div>
        </main>
    )
}
