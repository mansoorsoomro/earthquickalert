'use client'

import { useState, useMemo } from 'react'
import { Map, List, Navigation, Hospital, AlertCircle, Fuel, Pill, Hotel, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ResourceMapModal } from '@/components/modals/resource-map-modal'
import { EmergencyResource } from '@/lib/types/emergency'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import dynamic from 'next/dynamic'
import { fetchNearbyResources } from '@/lib/services/places-service'
import { calculateDistance } from '@/lib/services/mock-map-service'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Dynamically import LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import('./leaflet-map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading Map Infrastructure...</p>
    </div>
})

// Mock Data for Resources
const MOCK_RESOURCES: EmergencyResource[] = [
    { id: '1', name: 'General Hospital', type: 'hospital', location: { lat: 37.77, lng: -122.42, address: '123 Health St' }, status: 'available', distance: 1.2, contact: '555-0123' },
    { id: '2', name: 'City Pharmacy', type: 'pharmacy', location: { lat: 37.78, lng: -122.41, address: '456 Main St' }, status: 'available', distance: 0.5, hours: '24/7' },
    { id: '3', name: 'Memorial Shelter', type: 'shelter', location: { lat: 37.76, lng: -122.43, address: '789 Safe Ave' }, status: 'limited', distance: 2.1, capacity: 200, currentOccupancy: 150 },
    { id: '4', name: 'Shell Gas Station', type: 'gas', location: { lat: 37.79, lng: -122.40, address: '321 Fuel Rd' }, status: 'available', distance: 3.5 },
    { id: '5', name: 'Grand Hotel', type: 'lodging', location: { lat: 37.75, lng: -122.44, address: '555 Stay Ln' }, status: 'available', distance: 4.0 },
]

interface ResourcesMapSectionProps {
    /** Pass the resolved user location from the parent when available (GPS or geocoded address). */
    location?: { lat: number; lng: number } | null
}

export function ResourcesMapSection({ location: propLocation }: ResourcesMapSectionProps = {}) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<string>('hospital')
    const [resources, setResources] = useState<EmergencyResource[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { location: geoLoc } = useGeolocation()

    // Round to 3 decimal places (~100m precision) to avoid re-fetching on tiny GPS jitter
    // Prefer prop location (GPS or geocoded address from the parent dashboard)
    const userLocation = useMemo(() => {
        const src = propLocation || geoLoc
        return {
            lat: Math.round((src?.lat || 37.7749) * 1000) / 1000,
            lng: Math.round((src?.lng || -122.4194) * 1000) / 1000,
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        propLocation?.lat && Math.round((propLocation?.lat || 0) * 1000),
        propLocation?.lng && Math.round((propLocation?.lng || 0) * 1000),
        geoLoc?.lat && Math.round((geoLoc?.lat || 0) * 1000),
        geoLoc?.lng && Math.round((geoLoc?.lng || 0) * 1000),
    ])

    useEffect(() => {
        async function loadResources() {
            setIsLoading(true)
            try {
                // Determine which type to fetch
                const typesToFetch = [activeFilter];

                let allResults: EmergencyResource[] = [];

                for (const type of typesToFetch) {
                    const results = await fetchNearbyResources(userLocation.lat, userLocation.lng, type);
                    allResults = [...allResults, ...results];
                }

                // Calculate distances and sort
                const resourcesWithDistance = allResults.map(r => ({
                    ...r,
                    distance: calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        r.location.lat,
                        r.location.lng
                    )
                })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

                // Fall back to mock data (filtered by type) if API returned nothing
                if (resourcesWithDistance.length === 0) {
                    const mockFiltered = MOCK_RESOURCES.filter(r => r.type === activeFilter);
                    setResources(mockFiltered);
                } else {
                    setResources(resourcesWithDistance);
                }
            } catch (error) {
                console.error('Error loading real resources:', error);
            } finally {
                setIsLoading(false)
            }
        }

        loadResources()
    }, [userLocation, activeFilter])

    const handleNavigateToResources = () => {
        const queryType = `?type=${activeFilter}`
        router.push(`/user/resources${queryType}`)
    }

    const resourceTypes = [
        { id: 'hospital', label: 'Hospitals', icon: Hospital },
        { id: 'pharmacy', label: 'Pharmacies', icon: Pill },
        { id: 'shelter', label: 'Shelters', icon: AlertCircle },
        { id: 'gas', label: 'Fuel', icon: Fuel },
        { id: 'lodging', label: 'Lodging', icon: Hotel },
    ]

    // Filter logic
    const filteredResources = resources;

    const previewList = resources;

    return (
        <>
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Map className="w-5 h-5 text-blue-500" />
                        Emergency Resources Map
                    </h2>
                    <Button variant="ghost" size="sm" onClick={handleNavigateToResources} className="text-blue-600 hover:text-blue-700 font-black uppercase text-[10px] tracking-widest">
                        View Full Map →
                    </Button>
                </div>

                <Card className="p-0 overflow-hidden border-slate-200 shadow-sm rounded-2xl bg-white">
                    {/* Map Preview Area */}
                    <div className="h-72 relative group cursor-pointer border-b border-slate-100">
                        <LeafletMap
                            center={userLocation}
                            resources={filteredResources}
                            zoom={13}
                            interactive={false}
                        />

                        {/* Overlay Interactive Elements */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-[400] flex items-center justify-center" onClick={handleNavigateToResources}>
                            <Button className="bg-white hover:bg-slate-50 text-slate-900 shadow-xl border-0 font-black uppercase text-[10px] tracking-widest px-6 h-10 rounded-full animate-in zoom-in-90 duration-300">
                                <Search className="w-4 h-4 mr-2" />
                                Explore Area Resources
                            </Button>
                        </div>
                    </div>

                    {/* Quick Filters & List */}
                    <div className="p-5 bg-white">
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {resourceTypes.map((type) => {
                                const Icon = type.icon
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setActiveFilter(type.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tight transition-all border",
                                            activeFilter === type.id
                                                ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                                                : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {type.label}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-xl" />
                                    ))}
                                </div>
                            ) : previewList.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="text-sm font-bold text-slate-400">No resources found in this area.</p>
                                </div>
                            ) : (
                                previewList.map((resource) => (
                                    <div key={resource.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200" onClick={() => setIsModalOpen(true)}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                                                resource.type === 'hospital' ? "bg-red-50 text-red-600" :
                                                    resource.type === 'pharmacy' ? "bg-green-50 text-green-600" :
                                                        "bg-blue-50 text-blue-600"
                                            )}>
                                                {resource.type === 'hospital' ? <Hospital className="w-6 h-6" /> :
                                                    resource.type === 'pharmacy' ? <Pill className="w-6 h-6" /> :
                                                        <Map className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm leading-tight">{resource.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{resource.distance?.toFixed(1)} mi • {resource.status}</p>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-xl">
                                            <Navigation className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))
                            )}
                            {!isLoading && previewList.length > 0 && (
                                <div className="text-center pt-2">
                                    <p className="text-[9px] font-black text-slate-300 uppercase italic">Showing data from OpenStreetMap</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </section>

            <ResourceMapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Nearby ${resourceTypes.find(t => t.id === activeFilter)?.label}`}
                resources={resources}
                userLocation={userLocation}
            />
        </>
    )
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}
