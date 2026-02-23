import { EmergencyResource } from '@/lib/types/emergency';

export async function fetchNearbyResources(
    lat: number,
    lng: number,
    type: string = 'hospital',
    radius: number = 5000
): Promise<EmergencyResource[]> {
    try {
        // Map our types to Google Place types
        const googleTypeMap: Record<string, string> = {
            'hospital': 'hospital',
            'pharmacy': 'pharmacy',
            'shelter': 'local_government_office', // Google doesn't have a perfect 'shelter' type
            'gas': 'gas_station',
            'lodging': 'lodging',
        };

        const googleType = googleTypeMap[type] || 'hospital';
        const response = await fetch(`/api/places?lat=${lat}&lng=${lng}&type=${googleType}&radius=${radius}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Places API responded with error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch resources');
        }

        const data = await response.json();

        if (!data.results) {
            return [];
        }

        return data.results.map((place: any) => ({
            id: place.place_id,
            name: place.name,
            type: type as any,
            location: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
                address: place.vicinity || 'Address not available',
            },
            status: 'available', // Google doesn't provide real-time status like this
            contact: place.formatted_phone_number,
            distance: 0, // Will be calculated on the frontend or we can ignore for now
        }));
    } catch (error) {
        console.error('Error in fetchNearbyResources:', error);
        return [];
    }
}
