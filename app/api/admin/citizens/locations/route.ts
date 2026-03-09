import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WeatherAlertRecord from '@/models/WeatherAlertRecord';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSource } from '@/lib/types/api-alerts';
import { geocodeLocation, locationMatchesAlertAreas } from '@/lib/services/location-matching';

type WeatherAlertDoc = {
    alertId: string;
    title: string;
    description: string;
    severity: string;
    timestamp: Date;
    expiresAt?: Date;
    affectedAreas?: string[];
    areaDesc?: string;
    zones?: string[];
    coordinates?: { lat: number; lon: number };
};

function unique<T>(values: T[]): T[] {
    return Array.from(new Set(values));
}

function toRadians(value: number): number {
    return value * (Math.PI / 180);
}

function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
    const earthRadiusKm = 6371;
    const dLat = toRadians(bLat - aLat);
    const dLon = toRadians(bLon - aLon);

    const sinLat = Math.sin(dLat / 2);
    const sinLon = Math.sin(dLon / 2);

    const value =
        sinLat * sinLat +
        Math.cos(toRadians(aLat)) * Math.cos(toRadians(bLat)) * sinLon * sinLon;

    const c = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
    return earthRadiusKm * c;
}

export async function GET() {
    try {
        await connectDB();

        const users = await User.find(
            { role: 'user' },
            'name email location isSafe lastLocationUpdate familyMembers'
        ).lean();

        const now = new Date();
        const weatherAlerts = await WeatherAlertRecord.find({
            source: AlertSource.WEATHER_API,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: now } },
            ],
        }).lean() as unknown as WeatherAlertDoc[];

        const earthquakes = await alertProcessor.fetchAllAlerts(undefined, [AlertSource.EARTHQUAKE_API]);
        const relevantAlertIds = new Set<string>();

        const userLocations = [];

        for (const user of users as any[]) {
            const location = user.location || '';
            const familyLocations = Array.isArray(user.familyMembers)
                ? user.familyMembers.map((member: any) => member.location).filter(Boolean)
                : [];

            const scopedLocations = unique([location, ...familyLocations].filter(Boolean));
            const geocoded = location ? await geocodeLocation(location) : null;

            const matchedWeather = weatherAlerts
                .filter(alert =>
                    scopedLocations.some(loc =>
                        locationMatchesAlertAreas(loc, alert.affectedAreas || [], alert.areaDesc, alert.zones || [])
                    )
                )
                .map(alert => ({
                    id: alert.alertId,
                    source: AlertSource.WEATHER_API,
                    title: alert.title,
                    description: alert.description,
                    severity: alert.severity,
                    timestamp: alert.timestamp,
                    expiresAt: alert.expiresAt,
                }));

            const matchedEarthquakes = earthquakes.filter(alert => {
                if (!geocoded || !(alert as any).coordinates) return false;
                const coords = (alert as any).coordinates;
                return distanceKm(geocoded.lat, geocoded.lon, coords.lat, coords.lon) <= 300;
            });

            for (const alert of [...matchedWeather, ...matchedEarthquakes]) {
                relevantAlertIds.add(String(alert.id));
            }

            userLocations.push({
                id: user._id,
                name: user.name,
                location,
                isSafe: user.isSafe,
                alerts: [...matchedWeather, ...matchedEarthquakes],
            });
        }

        const globalAlerts = {
            earthquakes: earthquakes.filter(alert => relevantAlertIds.has(alert.id)),
            weather: weatherAlerts
                .filter(alert => relevantAlertIds.has(alert.alertId))
                .map(alert => ({
                    id: alert.alertId,
                    source: AlertSource.WEATHER_API,
                    title: alert.title,
                    description: alert.description,
                    severity: alert.severity,
                    timestamp: alert.timestamp,
                    expiresAt: alert.expiresAt,
                    affectedAreas: alert.affectedAreas || [],
                })),
        };

        return NextResponse.json({
            success: true,
            data: userLocations,
            globalAlerts,
        });
    } catch (error: any) {
        console.error('Error fetching citizen locations:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
