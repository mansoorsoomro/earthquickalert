// Mock map and location service for simulating geocoding and distance calculations

import { EmergencyResource } from '@/lib/types/emergency'

interface Coordinates {
    lat: number
    lng: number
}

// Mock geocoding - convert address to coordinates
export function geocodeAddress(address: string): Coordinates {
    // Simulate geocoding with consistent results for common addresses
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return {
        lat: 37.7749 + (hash % 100) / 1000, // San Francisco area
        lng: -122.4194 + (hash % 100) / 1000,
    }
}

// Mock reverse geocoding - convert coordinates to address
export function reverseGeocode(lat: number, lng: number): string {
    return `${Math.floor(Math.abs(lat * 1000))} Main St, San Francisco, CA 94102`
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 3959 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// Find nearby resources
export function findNearbyResources(
    userLat: number,
    userLng: number,
    resources: EmergencyResource[],
    maxDistance: number = 10 // miles
): EmergencyResource[] {
    return resources
        .map(resource => ({
            ...resource,
            distance: calculateDistance(
                userLat,
                userLng,
                resource.location.lat,
                resource.location.lng
            ),
        }))
        .filter(resource => resource.distance! <= maxDistance)
        .sort((a, b) => a.distance! - b.distance!)
}

// Generate mock route
export function generateRoute(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
): string {
    const distance = calculateDistance(fromLat, fromLng, toLat, toLng)
    const duration = Math.ceil(distance * 2) // Rough estimate: 2 minutes per mile
    return `Route: ${distance.toFixed(1)} miles, approximately ${duration} minutes`
}
