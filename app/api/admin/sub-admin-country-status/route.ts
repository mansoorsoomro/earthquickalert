import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { weatherAPI } from '@/lib/services/weather-api';
import { earthquakeAPI } from '@/lib/services/earthquake-api';
import { openaiService } from '@/lib/services/openai-service';
import { geocodeAddress } from '@/lib/services/mock-map-service';
import { WeatherAlert, EarthquakeAlert } from '@/lib/types/api-alerts';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        // Security check: Only Super Admin can access this
        if (!session || session.user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized. Super-Admin access only.' }, { status: 403 });
        }

        // 1. Fetch all sub-admins
        const subAdmins = await User.find({ role: 'sub-admin' }).lean();
        
        if (subAdmins.length === 0) {
            return NextResponse.json({ countries: [] });
        }

        // 2. Group by country
        const countryGroups: Record<string, any[]> = {};
        subAdmins.forEach((admin: any) => {
            const country = admin.country || 'Unknown';
            if (!countryGroups[country]) countryGroups[country] = [];
            countryGroups[country].push(admin);
        });

        // 3. For each country, get status
        const countryStatuses = await Promise.all(Object.keys(countryGroups).map(async (country) => {
            const admins = countryGroups[country];
            const representativeAdmin = admins[0];
            const locationStr = `${representativeAdmin.city || ''}, ${country}`.trim();

            let weatherAlerts: WeatherAlert[] = [];
            let quakeAlerts: EarthquakeAlert[] = [];

            try {
                // Get coordinates for the representative location
                const coords = await geocodeAddress(locationStr);
                
                // Fetch alerts (weather and earthquake)
                // We use a broader radius for earthquakes (500km)
                [weatherAlerts, quakeAlerts] = await Promise.all([
                    weatherAPI.fetchWeatherAlerts(coords.lat, coords.lng),
                    earthquakeAPI.fetchEarthquakesByLocation(coords.lat, coords.lng, 500)
                ]);
            } catch (err) {
                console.error(`Error fetching data for ${country}:`, err);
            }

            // Generate AI summary
            const statusSummary = await openaiService.generateCountryStatus(country, weatherAlerts, quakeAlerts);

            return {
                country,
                subAdminCount: admins.length,
                status: statusSummary,
                representativeLocation: locationStr,
                alertCount: weatherAlerts.length + quakeAlerts.length,
                lastUpdated: new Date().toISOString()
            };
        }));

        return NextResponse.json({ countries: countryStatuses });
    } catch (error: any) {
        console.error('Sub-admin country status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
