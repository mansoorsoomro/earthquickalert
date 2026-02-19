// API Route: Fetch earthquake alerts

import { NextResponse } from 'next/server';
import { earthquakeAPI } from '@/lib/services/earthquake-api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Get parameters
        const timeframe = (searchParams.get('timeframe') || 'day') as 'hour' | 'day' | 'week' | 'month';
        const minMagnitude = parseFloat(searchParams.get('minMagnitude') || '4.0');
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');
        const radiusKm = parseFloat(searchParams.get('radiusKm') || '500');

        let earthquakes;

        // Fetch by location if provided
        if (lat && lon) {
            earthquakes = await earthquakeAPI.fetchEarthquakesByLocation(
                parseFloat(lat),
                parseFloat(lon),
                radiusKm
            );
        } else {
            earthquakes = await earthquakeAPI.fetchEarthquakes(timeframe, minMagnitude);
        }

        return NextResponse.json({
            success: true,
            data: earthquakes,
            count: earthquakes.length,
            params: {
                timeframe,
                minMagnitude,
                location: lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon), radiusKm } : null,
            },
        });
    } catch (error) {
        console.error('Error fetching earthquake data:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch earthquake data',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
