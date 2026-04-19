'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAssessment(lat?: number, lon?: number) {
            setLoading(true);
            setError(null);
            try {
                let url = '/api/threats/assessment';
                if (lat && lon) {
                    url += `?lat=${lat}&lon=${lon}`;
                } else {
                    // Fallback to LA coordinates if no geo
                    url += `?lat=34.0522&lon=-118.2437`;
                }

                const response = await fetch(url);
                const json = await response.json();

                if (json.success) {
                    setAssessment(json.data.assessment);
                } else {
                    setError('Failed to load live data');
                }
            } catch (err) {
                console.error('Error fetching threat assessment:', err);
                setError('Service temporarily unavailable');
            } finally {
                setLoading(false);
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchAssessment(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    fetchAssessment(); // Use fallback
                }
            );
        } else {
            fetchAssessment();
        }
    }, [])

    const liveInputs = [
        "NWS Severe Weather Alerts",
        "News Incident Reports",
        "Government Emergency Declarations",
        "Social Media Signals",
        "Citizen Submitted Reports"
    ]

    return (
        <Card className="bg-white border-slate-200 rounded-3xl p-8 shadow-sm space-y-8 min-h-[600px] flex flex-col">
            {/* Header */}
            <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Threat Detection & Monitoring</h2>
            </div>

            {/* Live Inputs Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Live Inputs</h3>
                <div className="space-y-3">
                    {liveInputs.map((input, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <CheckCircle2 className={cn("shrink-0", loading ? "text-slate-200 animate-pulse" : "text-emerald-500")} size={18} />
                            <span className={cn("text-sm font-bold", loading ? "text-slate-300" : "text-slate-600")}>{input}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Assessment Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100 flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">AI Assessment</h3>
                    {loading && <Loader2 className="animate-spin text-blue-500" size={16} />}
                </div>
                
                {error ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                        <AlertCircle className="text-rose-400" size={32} />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Geo-relevance</p>
                            {loading ? <Skeleton className="h-6 w-16 bg-slate-50" /> : (
                                <p className={cn("text-lg font-black", 
                                    assessment?.relevance === 'High' ? 'text-rose-600' : 
                                    assessment?.relevance === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                                )}>
                                    {assessment?.relevance || 'Low'}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Severity Level</p>
                            {loading ? <Skeleton className="h-6 w-40 bg-slate-50" /> : (
                                <p className="text-lg font-black text-blue-500 uppercase">
                                    {assessment?.severity || 'NOMINAL'}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Affected Areas</p>
                            {loading ? <Skeleton className="h-6 w-32 bg-slate-50" /> : (
                                <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                    {assessment?.affectedAreas || 'None'}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</p>
                                {loading ? <Skeleton className="h-6 w-12 bg-slate-50" /> : (
                                    <p className="text-lg font-black text-emerald-500">{assessment?.confidence || 0}%</p>
                                )}
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${loading ? 0 : (assessment?.confidence || 0)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
