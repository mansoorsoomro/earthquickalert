// API Route: Fetch weather alerts

import { NextResponse } from 'next/server';
import { weatherAPI } from '@/lib/services/weather-api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Get location from query params (required for weather)
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');

        if (!lat || !lon) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Location required',
                    message: 'Please provide lat and lon query parameters',
                },
                { status: 400 }
            );
        }

        // Fetch weather alerts
        const weatherAlerts = await weatherAPI.fetchWeatherAlerts(
            parseFloat(lat),
            parseFloat(lon)
        );

        return NextResponse.json({
            success: true,
            data: weatherAlerts,
            count: weatherAlerts.length,
            location: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
            },
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch weather data',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
