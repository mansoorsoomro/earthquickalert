'use client'

import { useState } from 'react'
import { Map, List, Navigation, Hospital, AlertCircle, Fuel, Pill, Hotel, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ResourceMapModal } from '@/components/modals/resource-map-modal'
import { EmergencyResource } from '@/lib/types/emergency'

// Mock Data for Resources
const MOCK_RESOURCES: EmergencyResource[] = [
    { id: '1', name: 'General Hospital', type: 'hospital', location: { lat: 37.77, lng: -122.42, address: '123 Health St' }, status: 'available', distance: 1.2, contact: '555-0123' },
    { id: '2', name: 'City Pharmacy', type: 'pharmacy', location: { lat: 37.78, lng: -122.41, address: '456 Main St' }, status: 'available', distance: 0.5, hours: '24/7' },
    { id: '3', name: 'Memorial Shelter', type: 'shelter', location: { lat: 37.76, lng: -122.43, address: '789 Safe Ave' }, status: 'limited', distance: 2.1, capacity: 200, currentOccupancy: 150 },
    { id: '4', name: 'Shell Gas Station', type: 'gas', location: { lat: 37.79, lng: -122.40, address: '321 Fuel Rd' }, status: 'available', distance: 3.5 },
    { id: '5', name: 'Grand Hotel', type: 'lodging', location: { lat: 37.75, lng: -122.44, address: '555 Stay Ln' }, status: 'available', distance: 4.0 },
]

export function ResourcesMapSection() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<string>('all')

    const resourceTypes = [
        { id: 'all', label: 'All Resources', icon: Map },
        { id: 'hospital', label: 'Hospitals', icon: Hospital },
        { id: 'pharmacy', label: 'Pharmacies', icon: Pill },
        { id: 'shelter', label: 'Shelters', icon: AlertCircle },
        { id: 'gas', label: 'Fuel', icon: Fuel },
        { id: 'lodging', label: 'Lodging', icon: Hotel },
    ]

    // Filter logic (visual only for preview)
    const filteredPreview = activeFilter === 'all'
        ? MOCK_RESOURCES.slice(0, 3)
        : MOCK_RESOURCES.filter(r => r.type === activeFilter).slice(0, 3)

    return (
        <>
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Map className="w-5 h-5 text-blue-500" />
                        Emergency Resources Map
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-700">
                        View Full Map →
                    </Button>
                </div>

                <Card className="p-0 overflow-hidden border-slate-200 shadow-sm rounded-xl">
                    {/* Map Preview Area */}
                    <div className="h-48 bg-slate-100 relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                        {/* Mock Map Image Background */}
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4194,37.7749,12/800x400?access_token=mock')] bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity"></div>

                        {/* Overlay Interactive Elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button className="bg-white/90 hover:bg-white text-slate-900 shadow-lg backdrop-blur-sm border-0 font-bold">
                                <Search className="w-4 h-4 mr-2" />
                                Explore Area Resources
                            </Button>
                        </div>

                        {/* Mock Pins */}
                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md z-10"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Quick Filters & List */}
                    <div className="p-4 bg-white">
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {resourceTypes.map((type) => {
                                const Icon = type.icon
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setActiveFilter(type.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border",
                                            activeFilter === type.id
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {type.label}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="space-y-3">
                            {filteredPreview.map((resource) => (
                                <div key={resource.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center",
                                            resource.type === 'hospital' ? "bg-red-100 text-red-600" :
                                                resource.type === 'pharmacy' ? "bg-green-100 text-green-600" :
                                                    "bg-blue-100 text-blue-600"
                                        )}>
                                            {resource.type === 'hospital' ? <Hospital className="w-5 h-5" /> :
                                                resource.type === 'pharmacy' ? <Pill className="w-5 h-5" /> :
                                                    <Map className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{resource.name}</h4>
                                            <p className="text-xs text-slate-500">{resource.distance} mi • {resource.status}</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-slate-400 group-hover:text-blue-500">
                                        <Navigation className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </section>

            <ResourceMapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={activeFilter === 'all' ? 'Nearby Emergency Resources' : `Nearby ${resourceTypes.find(t => t.id === activeFilter)?.label}`}
                resources={MOCK_RESOURCES} // Pass full list, modal handles filtering if implemented
            />
        </>
    )
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}
