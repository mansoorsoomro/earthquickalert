'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, Circle, FileText, Backpack, Map, Users } from 'lucide-react'

export default function EmergencyPlanPage() {
    const router = useRouter()

    const steps = [
        { id: 1, title: 'Build Your Go-Bag', icon: Backpack, status: 'completed' },
        { id: 2, title: 'Evacuation Routes', icon: Map, status: 'current' },
        { id: 3, title: 'Family Communication', icon: Users, status: 'pending' },
        { id: 4, title: 'Shelter Locations', icon: FileText, status: 'pending' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold text-slate-900">Emergency Plan Builder</h1>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full p-6 space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Get Ready Before It Happens</h2>
                    <p className="text-slate-500">Complete these 4 steps to ensure you and your family are prepared for any emergency.</p>
                </div>

                {/* Progress Tracker */}
                <div className="flex justify-between relative mb-12">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${step.status === 'completed' ? 'bg-green-500 border-green-200 text-white' :
                                    step.status === 'current' ? 'bg-blue-600 border-blue-200 text-white' :
                                        'bg-white border-slate-200 text-slate-300'
                                }`}>
                                {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                    step.id}
                            </div>
                            <span className={`text-xs font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Current Step Content */}
                <Card className="p-8 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Map className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Step 2: Evacuation Routes</h3>
                            <p className="text-slate-500 text-sm">Identify primary and secondary escape routes.</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                            <Circle className="w-5 h-5 text-slate-300 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-800">Home to Nearest Highway</h4>
                                <p className="text-xs text-slate-500">Map out the quickest way to I-80.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                            <Circle className="w-5 h-5 text-slate-300 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-800">Alternative Route (Backroads)</h4>
                                <p className="text-xs text-slate-500">In case of highway congestion.</p>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700">
                        Start Route Planner
                    </Button>
                </Card>

            </main>
        </div>
    )
}
