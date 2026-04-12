// Mock map and location service for simulating geocoding and distance calculations

import { EmergencyResource } from '@/lib/types/emergency'

interface Coordinates {
    lat: number
    lng: number
}

// Real geocoding - convert address to coordinates using OpenStreetMap Nominatim
export async function geocodeAddress(address: string): Promise<Coordinates> {
    // Default fallback coordinates (San Francisco)
    const fallbackCoords = { lat: 37.7749, lng: -122.4194 };

    if (!address) return fallbackCoords;

    // Fast check for placeholders that would surely fail geocoding
    const lowerAddress = address.toLowerCase();
    const placeholders = ['n/a', 'unknown', 'to be determined', 'pending', 'location not provided', 'none'];
    if (placeholders.some(p => lowerAddress.includes(p))) {
        return fallbackCoords;
    }

    try {
        const url = `/api/geocode?address=${encodeURIComponent(address)}`;

        // Add timeout to prevent hanging - increased to 10s
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            // Silently return fallback for 404s or non-ok responses
            if (response.status !== 404) {
                console.warn(`Geocoding API responded with status: ${response.status}. Using fallback.`);
            }
            return fallbackCoords;
        }

        const data = await response.json();
        if (data && data.lat && data.lng) {
            return {
                lat: data.lat,
                lng: data.lng
            };
        }
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.warn('Geocoding request timed out. Using fallback.');
        } else {
            // Log as warning instead of error to keep console clean
            console.warn('Geocoding warning:', error.message || error);
        }
    }

    // Fallback simulated geocoding based on address hash to keep markers distinct but stable
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return {
        lat: 37.7749 + (hash % 100) / 500, // Spread markers slightly more around SF
        lng: -122.4194 + (hash % 100) / 500,
    }
}

// Real reverse geocoding - convert coordinates to address using our API proxy
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const fallbackAddress = `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status !== 404) {
                console.warn(`Reverse geocoding API responded with status: ${response.status}`);
            }
            return fallbackAddress;
        }

        const data = await response.json();
        return data.name || data.address?.city || 'Selected Area';
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.warn(`Reverse geocoding timed out for ${lat},${lng}`);
        } else {
            console.warn('Reverse geocoding warning:', error.message || error);
        }
        return fallbackAddress;
    }
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
