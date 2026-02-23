'use client'

import React, { useMemo, useCallback } from 'react'
import { GoogleMap as GoogleMapComponent, useJsApiLoader, Marker } from '@react-google-maps/api'

interface MapMarker {
    id: string
    position: { lat: number; lng: number }
    title: string
    type: 'user' | 'hazard' | 'earthquake' | 'weather' | 'admin'
    isSafe?: boolean
    mag?: number
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
                }}
            >
                {markers
                    .filter(marker =>
                        marker.position &&
                        typeof marker.position.lat === 'number' &&
                        typeof marker.position.lng === 'number' &&
                        !isNaN(marker.position.lat) &&
                        !isNaN(marker.position.lng)
                    )
                    .map((marker) => (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            title={marker.title}
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
                                } : undefined
                            }
                        />
                    ))}
            </GoogleMapComponent>
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md p-2 text-[10px] text-white/60 rounded-lg border border-white/10 italic">
                Strategic Intelligence Feed • Live GPS Markers
            </div>
        </div>
    )
}
