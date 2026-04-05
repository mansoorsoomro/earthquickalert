'use client'

import React, { useMemo, useCallback, useState } from 'react'
import { GoogleMap as GoogleMapComponent, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api'

interface MapMarker {
    id: string
    position: { lat: number; lng: number }
    title: string
    type: 'user' | 'hazard' | 'earthquake' | 'weather' | 'admin' | 'incident' | 'condition'
    isSafe?: boolean
    mag?: number
    description?: string
    status?: string
    alerts?: any[]
    radius?: number // For highlighting hazard zones
    timestamp?: string
    color?: string
}

interface GoogleMapProps {
    address?: string
    markers?: MapMarker[]
    center?: { lat: number; lng: number }
    zoom?: number
}

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px'
}

const defaultCenter = {
    lat: 37.7749,
    lng: -122.4194
}

export function GoogleMap({ address, markers = [], center, zoom = 10 }: GoogleMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBq2yjNcUbJoOOwyLa3HzO4xRPVGD9EQI4"
    })

    const mapCenter = useMemo(() => {
        if (center) return center
        return defaultCenter
    }, [center])

    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
    const [map, setMap] = React.useState<google.maps.Map | null>(null)

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, [])

    // Smooth pan when center changes
    React.useEffect(() => {
        if (map && center) {
            map.panTo(center)
        }
    }, [map, center])

    if (!isLoaded) return <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse flex items-center justify-center rounded-xl border border-slate-200">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Initalizing Satellite Feed...</p>
    </div>

    const validMarkers = markers.filter(marker =>
        marker.position &&
        typeof marker.position.lat === 'number' &&
        typeof marker.position.lng === 'number' &&
        !isNaN(marker.position.lat) &&
        !isNaN(marker.position.lng)
    );

    return (
        <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-inner border border-slate-200 relative">
            <GoogleMapComponent
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                        { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                        { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
                        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] }
                    ]
                }}
            >
                {validMarkers.map((marker) => (
                    <React.Fragment key={marker.id}>
                        <Marker
                            position={marker.position}
                            title={marker.title}
                            onClick={() => setSelectedMarker(marker)}
                            icon={
                                marker.type === 'user' ? (
                                    marker.isSafe ? {
                                        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                        scaledSize: new google.maps.Size(32, 32)
                                    } : {
                                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                        scaledSize: new google.maps.Size(32, 32)
                                    }
                                ) : marker.type === 'earthquake' ? {
                                    url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                                    scaledSize: new google.maps.Size(40, 40)
                                } : marker.type === 'weather' ? {
                                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                    scaledSize: new google.maps.Size(32, 32)
                                } : marker.type === 'admin' ? {
                                    url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                                    scaledSize: new google.maps.Size(42, 42)
                                } : marker.type === 'incident' ? {
                                    url: 'https://maps.google.com/mapfiles/ms/icons/caution.png', // Fallback
                                    scaledSize: new google.maps.Size(32, 32)
                                } : marker.type === 'condition' ? {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    fillColor: marker.color || '#4169E1',
                                    fillOpacity: 0.8,
                                    scale: 8,
                                    strokeColor: 'white',
                                    strokeWeight: 2,
                                } : undefined
                            }
                        />

                        {/* Area Highlighting for Hazards */}
                        {(marker.type === 'earthquake' || marker.type === 'weather') && marker.radius && (
                            <Circle
                                center={marker.position}
                                radius={marker.radius}
                                onClick={() => setSelectedMarker(marker)}
                                options={{
                                    strokeColor: marker.type === 'earthquake' ? '#FF8C00' : '#4169E1',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: marker.type === 'earthquake' ? '#FF8C00' : '#4169E1',
                                    fillOpacity: 0.35,
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={selectedMarker.position}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-2 min-w-[200px] max-w-[300px] bg-white text-slate-900 rounded-lg">
                            <h3 className="font-extrabold text-sm mb-1 uppercase tracking-tight flex items-center gap-2">
                                {selectedMarker.type === 'user' ? '👤 Citizen' :
                                    selectedMarker.type === 'earthquake' ? '🌋 Earthquake' :
                                        selectedMarker.type === 'weather' ? '🌦️ Weather Alert' :
                                            selectedMarker.type === 'incident' ? '⚠️ Incident' : '📍 Admin'}
                            </h3>
                            <div className="font-bold text-lg mb-1">{selectedMarker.title}</div>

                            {selectedMarker.status && (
                                <div className={`text-[10px] font-black uppercase mb-1 inline-block px-2 py-0.5 rounded ${selectedMarker.isSafe === false || selectedMarker.status === 'Danger' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    Status: {selectedMarker.status}
                                </div>
                            )}

                            {selectedMarker.timestamp && (
                                <div className="text-[10px] text-slate-400 font-bold mb-2">
                                    Date: {new Date(selectedMarker.timestamp).toLocaleString()}
                                </div>
                            )}

                            {selectedMarker.description && (
                                <p className="text-xs text-slate-600 mb-2 leading-relaxed whitespace-pre-line">
                                    {selectedMarker.description}
                                </p>
                            )}

                            {selectedMarker.mag && (
                                <p className="text-xs font-bold text-orange-600 mb-2">
                                    Magnitude: {selectedMarker.mag.toFixed(1)}
                                </p>
                            )}

                            {selectedMarker.alerts && selectedMarker.alerts.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Active Alerts</p>
                                    <div className="space-y-1">
                                        {selectedMarker.alerts.map((a, i) => (
                                            <div key={i} className="text-[10px] font-bold text-red-600 bg-red-50 p-1.5 rounded border border-red-100 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                {a.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMapComponent>
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md p-2 text-[10px] text-white/60 rounded-lg border border-white/10 italic">
                Strategic Intelligence Feed • Live GPS Markers
            </div>
        </div>
    )
}
