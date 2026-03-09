'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Clock, Loader2, MapPin } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ThreatAssessment {
    relevance: 'High' | 'Medium' | 'Low';
    severity: string;
    affectedAreas: string;
    confidence: number;
    summary: string;
}

export function ThreatMonitoring() {
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState<ThreatAssessment | null>(null);
    const [locationName, setLocationName] = useState('Global Monitoring');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getAssessment(lat: number, lon: number, name: string) {
            try {
                const response = await fetch(`/api/threats/assessment?lat=${lat}&lon=${lon}&locationName=${encodeURIComponent(name)}`);
                const json = await response.json();
                if (json.success) {
                    setAssessment(json.data.assessment);
                }
            } catch (err) {
                console.error('Failed to fetch threat assessment:', err);
                setError('Failed to load real-time assessment.');
            } finally {
                setLoading(false);
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationName('Current Location');
                    getAssessment(latitude, longitude, 'Your current vicinity');
                },
                (err) => {
                    console.warn('Geolocation denied, using default location.');
                    // Fallback to LA
                    getAssessment(34.0522, -118.2437, 'Los Angeles (Fallback)');
                }
            );
        } else {
            getAssessment(34.0522, -118.2437, 'Global Context');
        }
    }, [])

    const threats = [
        { id: 1, label: 'NWS Severe Weather Alerts', active: true },
        { id: 2, label: 'USGS Earthquake Feed', active: true },
        { id: 3, label: 'Regional Incident Reports', active: true },
        { id: 4, label: 'AI Geo-Spatial Analysis', active: !!assessment },
        { id: 5, label: 'Citizen Submitted Signals', active: true },
    ]

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    Threat Detection & Monitoring
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                {/* <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <MapPin className="w-3 h-3" />
                    {locationName}
                </div> */}
            </div>

            <div className="space-y-6 flex-1">
                <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live Inputs</h4>
                    <div className="space-y-3">
                        {threats.map((threat) => (
                            <div key={threat.id} className="flex items-center gap-2 group">
                                {threat.active ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white" />
                                ) : (
                                    <Clock className="w-4 h-4 text-slate-300" />
                                )}
                                <span className={`text-sm font-medium ${threat.active ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {threat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">AI Assessment</h4>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full rounded-md" />)}
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs text-center">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-slate-400">Geo-relevance</p>
                                    <p className={`text-sm font-extrabold ${assessment?.relevance === 'High' ? 'text-red-500' :
                                        assessment?.relevance === 'Medium' ? 'text-orange-500' : 'text-emerald-500'
                                        }`}>
                                        {assessment?.relevance || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400">Severity Level</p>
                                    <p className="text-sm font-extrabold text-blue-500 truncate">
                                        {assessment?.severity || 'Monitoring'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400">Affected Areas</p>
                                <p className="text-sm font-extrabold text-slate-900 truncate">
                                    {assessment?.affectedAreas || 'Scanning...'}
                                </p>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-xs font-medium text-slate-400">Confidence Score</p>
                                    <p className="text-xs font-bold text-emerald-500">{assessment?.confidence || 0}%</p>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${assessment?.confidence || 0}%` }}
                                    />
                                </div>
                            </div>
                            {assessment?.summary && (
                                <p className="text-[10px] text-slate-500 italic leading-tight border-l-2 border-slate-200 pl-2">
                                    "{assessment.summary}"
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
