import { NextResponse } from 'next/server';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSource } from '@/lib/types/api-alerts';
import { openaiService } from '@/lib/services/openai-service';
import { getSession } from '@/lib/auth';
import User from '@/models/User';
import { geocodeLocation } from '@/lib/services/location-matching';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');
        const locationName = searchParams.get('locationName') || 'Current Location';

        let location = { lat: parseFloat(lat || '0'), lon: parseFloat(lon || '0') };
        let finalLocationName = locationName;

        const session = await getSession();
        if (session && session.user.role === 'sub-admin') {
            const subAdmin: any = await User.findById(session.user.id).lean();
            if (subAdmin) {
                // If sub-admin has an assigned address, we should use that or at least prioritize it
                const fullAddress = [subAdmin.city, subAdmin.state, subAdmin.zipcode].filter(Boolean).join(', ');
                if (fullAddress) {
                    const geocoded = await geocodeLocation(fullAddress);
                    if (geocoded) {
                        location = { lat: geocoded.lat, lon: geocoded.lon };
                        finalLocationName = fullAddress;
                    }
                }
            }
        } else if (!lat || !lon) {
            return NextResponse.json(
                { success: false, error: 'Latitude and Longitude are required' },
                { status: 400 }
            );
        }

        // 1. Fetch live alerts for this location
        const alerts = await alertProcessor.fetchAllAlerts(location);

        // 2. Separate data types for AI context
        const weatherData = alerts.filter(a => a.source === AlertSource.WEATHER_API);
        const earthquakeData = alerts.filter(a => a.source === AlertSource.EARTHQUAKE_API);

        // 3. Generate structured threat assessment via OpenAI
        const assessment = await openaiService.generateThreatAssessment(
            finalLocationName,
            weatherData,
            earthquakeData
        );

        return NextResponse.json({
            success: true,
            data: {
                assessment,
                rawAlertsCount: alerts.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error in threat assessment API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate threat assessment' },
            { status: 500 }
        );
    }
}
