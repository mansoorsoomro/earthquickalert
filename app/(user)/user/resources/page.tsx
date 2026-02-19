'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GoogleMap } from '@/components/google-map'
import { Hospital, Fuel, Bed, Pill, Search, List, Map as MapIcon, X, DollarSign, Car } from 'lucide-react'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export default function ResourcesPage() {
    const { location } = useGeolocation()
    const [activeCategory, setActiveCategory] = useState<'hospitals' | 'pharmacies' | 'gas' | 'shelters' | 'atms' | 'traffic'>('hospitals')

    // Fallback to SF if no location
    const mapAddress = location ? `${location.lat},${location.lng}` : "San Francisco, CA"

    const ResourceItem = ({ i }: { i: number }) => (
        <div className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 bg-white cursor-pointer transition-all">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-900 text-sm">General Hospital {i}</h4>
                <Badge variant="outline" className="text-[10px] border-green-200 bg-green-50 text-green-700">OPEN</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-2">1001 Potrero Ave, San Francisco</p>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Hospital className="w-3 h-3" />
                <span>{(1.2 + i * 0.5).toFixed(1)} miles away</span>
            </div>
        </div>
    )

    return (
        <main className="flex-1 overflow-hidden flex flex-col h-full bg-slate-50 relative">
            <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900">Emergency Resources</h1>
                            <p className="text-slate-500 text-sm">Find nearby help and supplies</p>
                        </div>
                        {/* Mobile List Toggle */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <List className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl">
                                <SheetHeader>
                                    <SheetTitle>Nearby Resources</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4 overflow-y-auto h-full pb-8 space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => <ResourceItem key={i} i={i} />)}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        <Button
                            variant={activeCategory === 'hospitals' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('hospitals')}
                            className={`gap-2 rounded-full ${activeCategory === 'hospitals' ? 'bg-red-600 hover:bg-red-700 text-white border-0' : 'border-slate-300'}`}
                        >
                            <Hospital className="w-4 h-4" />
                            Hospitals
                        </Button>
                        <Button
                            variant={activeCategory === 'pharmacies' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('pharmacies')}
                            className={`gap-2 rounded-full ${activeCategory === 'pharmacies' ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' : 'border-slate-300'}`}
                        >
                            <Pill className="w-4 h-4" />
                            Pharmacies
                        </Button>
                        <Button
                            variant={activeCategory === 'gas' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('gas')}
                            className={`gap-2 rounded-full ${activeCategory === 'gas' ? 'bg-orange-600 hover:bg-orange-700 text-white border-0' : 'border-slate-300'}`}
                        >
                            <Fuel className="w-4 h-4" />
                            Gas Stations
                        </Button>
                        <Button
                            variant={activeCategory === 'shelters' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('shelters')}
                            className={`gap-2 rounded-full ${activeCategory === 'shelters' ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-0' : 'border-slate-300'}`}
                        >
                            <Bed className="w-4 h-4" />
                            Shelters
                        </Button>
                        <Button
                            variant={activeCategory === 'atms' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('atms')}
                            className={`gap-2 rounded-full ${activeCategory === 'atms' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-0' : 'border-slate-300'}`}
                        >
                            <DollarSign className="w-4 h-4" />
                            ATMs
                        </Button>
                        <Button
                            variant={activeCategory === 'traffic' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('traffic')}
                            className={`gap-2 rounded-full ${activeCategory === 'traffic' ? 'bg-slate-600 hover:bg-slate-700 text-white border-0' : 'border-slate-300'}`}
                        >
                            <Car className="w-4 h-4" />
                            Traffic
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                {/* Map Wrapper */}
                <div className="absolute inset-0 z-0">
                    <GoogleMap address={mapAddress} />
                </div>

                {/* Floating List Panel (Desktop) */}
                <div className="absolute top-4 left-4 bottom-4 w-80 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg flex flex-col overflow-hidden hidden md:flex z-10">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900">Nearby Results</h3>
                            <p className="text-xs text-slate-500">Showing 5 locations within 5 miles</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => <ResourceItem key={i} i={i} />)}
                    </div>
                </div>
            </div>
        </main>
    )
}
