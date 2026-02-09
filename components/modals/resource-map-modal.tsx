'use client'

import { X, MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmergencyResource } from '@/lib/types/emergency'
import { findNearbyResources } from '@/lib/services/mock-map-service'

interface ResourceMapModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    resources: EmergencyResource[]
    userLocation?: { lat: number; lng: number }
}

export function ResourceMapModal({
    isOpen,
    onClose,
    title,
    resources,
    userLocation = { lat: 37.7749, lng: -122.4194 }, // Default: SF
}: ResourceMapModalProps) {
    if (!isOpen) return null

    const nearbyResources = findNearbyResources(
        userLocation.lat,
        userLocation.lng,
        resources,
        20 // 20 miles radius
    )

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto">
                    {/* Map Placeholder */}
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
                        <div className="relative z-10 text-center">
                            <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium">Interactive Map</p>
                            <p className="text-sm text-gray-500">Showing {nearbyResources.length} locations</p>
                        </div>
                        {/* Mock map markers */}
                        {nearbyResources.slice(0, 5).map((_, index) => (
                            <div
                                key={index}
                                className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"
                                style={{
                                    left: `${20 + index * 15}%`,
                                    top: `${30 + (index % 2) * 20}%`,
                                }}
                            >
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                            </div>
                        ))}
                    </div>

                    {/* Resource List */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Nearby Locations ({nearbyResources.length})</h3>
                        <div className="space-y-3">
                            {nearbyResources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{resource.location.address}</p>
                                            {resource.contact && (
                                                <p className="text-sm text-gray-600 mt-1">📞 {resource.contact}</p>
                                            )}
                                            {resource.hours && (
                                                <p className="text-sm text-gray-600">🕐 {resource.hours}</p>
                                            )}
                                            {resource.capacity && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Capacity: {resource.currentOccupancy}/{resource.capacity}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${resource.status === 'available'
                                                        ? 'bg-green-100 text-green-700'
                                                        : resource.status === 'limited'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : resource.status === 'full'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {resource.status}
                                            </span>
                                            {resource.distance && (
                                                <p className="text-sm text-gray-600 mt-2">{resource.distance.toFixed(1)} mi</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Navigation className="w-4 h-4 mr-1" />
                                            Directions
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
