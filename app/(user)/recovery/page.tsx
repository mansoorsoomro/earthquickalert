'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Home, DollarSign, ArrowLeft, CheckCircle, ExternalLink, Hammer } from 'lucide-react'

export default function RecoveryPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-emerald-50 text-slate-900 flex flex-col">
            {/* Recovery Header */}
            <div className="bg-emerald-600 p-4 sticky top-0 z-50 flex items-center justify-between shadow-lg text-white">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/user-dashboard')} className="text-white hover:bg-emerald-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="font-bold text-lg uppercase tracking-wider">Recovery Mode</h1>
                        <p className="text-xs text-emerald-100">Disaster Declared Over • Rebuilding in Progress</p>
                    </div>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm font-bold opacity-90">Days Since Event: 3</p>
                </div>
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8">

                {/* Status Banner */}
                <Card className="bg-white border-emerald-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">It is Safe to Return</h2>
                            <p className="text-slate-600">Local authorities have lifted all evacuation orders for your zone.</p>
                        </div>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8">
                        Report Safe Return
                    </Button>
                </Card>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* FEMA */}
                    <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                            <Home className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">FEMA Assistance</h3>
                        <p className="text-slate-500 text-sm mb-4">Apply for individual assistance, housing, and other disaster-related needs.</p>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-between">
                                FEMA Application <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                                Find Disaster Center <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>

                    {/* Relief Funding */}
                    <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Relief Funding</h3>
                        <p className="text-slate-500 text-sm mb-4">Small Business Administration (SBA) loans and state grants available.</p>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-between">
                                SBA Loan Portal <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                                State Grant Info <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>

                    {/* Donations & Volunteers */}
                    <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Community Support</h3>
                        <p className="text-slate-500 text-sm mb-4">Find donation centers or volunteer to help your neighbors rebuild.</p>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-between">
                                Donation Centers <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                                Volunteer Sign-up <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>

                    {/* Health & Safety */}
                    <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Health & Safety</h3>
                        <p className="text-slate-500 text-sm mb-4">Pop-up pharmacies and Red Cross medical stations.</p>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-between">
                                Find Pharmacy <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                                Red Cross Locations <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>

                    {/* Contractors */}
                    <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                            <Hammer className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Verified Contractors</h3>
                        <p className="text-slate-500 text-sm mb-4">Connect with licensed professionals for repairs and debris removal.</p>
                        <Button className="w-full bg-slate-900 text-white" onClick={() => router.push('/virtual-eoc/maintenance')}>
                            Find Contractors
                        </Button>
                    </Card>

                </div>

                {/* News / Updates */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Latest Recovery Updates</h3>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                                <div className="w-2 h-full min-h-[60px] bg-emerald-500 rounded-full"></div>
                                <div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase">City Update • 2 Hours Ago</span>
                                    <h4 className="font-bold text-slate-900">Debris Removal Schedule</h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Trucks will begin clearing Zone A starting tomorrow morning. Please move vehicles from the street.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    )
}
