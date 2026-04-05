import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WeatherAlertRecord from '@/models/WeatherAlertRecord';
import IncidentReport from '@/models/IncidentReport';
import EmergencyEvent from '@/models/EmergencyEvent';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSource } from '@/lib/types/api-alerts';
import { geocodeLocation, locationMatchesAlertAreas } from '@/lib/services/location-matching';
import { getSession } from '@/lib/auth';
import { getSubAdminUserFilter, getSubAdminTextLocationFilter } from '@/lib/admin-filters';

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

        const session = await getSession();
        let userQuery: any = { role: { $in: ['user', 'responder', 'manager', 'eoc-manager', 'admin'] } };
        let incidentQuery: any = {};
        let eventQuery: any = {};

        if (session && session.user.role === 'sub-admin') {
            const userFilter = await getSubAdminUserFilter(session.user.id);
            if (userFilter) {
                userQuery = { $and: [userQuery, userFilter] };
            }

            const incFilter = await getSubAdminTextLocationFilter(session.user.id, 'location');
            if (incFilter) {
                incidentQuery = incFilter;
            }

            const evFilter = await getSubAdminTextLocationFilter(session.user.id, 'location.address');
            if (evFilter) {
                eventQuery = evFilter;
            }
        }

        const users = await User.find(
            userQuery,
            'name email role location isSafe lastLocationUpdate familyMembers'
        ).lean();

        // Get Incidents and Events for map markers
        const rawIncidents = await IncidentReport.find(incidentQuery).sort({ createdAt: -1 }).lean();
        const events = await EmergencyEvent.find(eventQuery).sort({ createdAt: -1 }).lean();

        // Ensure incidents have coordinates
        const incidents = await Promise.all(rawIncidents.map(async (inc: any) => {
            if (inc.lat && inc.lng) return inc;
            if (inc.location) {
                const geocoded = await geocodeLocation(inc.location);
                if (geocoded) {
                    return { ...inc, lat: geocoded.lat, lng: geocoded.lon };
                }
            }
            return inc;
        }));

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
                role: user.role,
                location,
                isSafe: user.isSafe,
                alerts: [...matchedWeather, ...matchedEarthquakes],
                geocoded,
            });
        }

        // Fetch current weather conditions in batch for all user locations
        const uniqueLocs = Array.from(new Set(userLocations.map(u => u.geocoded).filter(Boolean).map(g => `${g.lat},${g.lon}`)));
        const weatherMap = new Map<string, any>();

        if (uniqueLocs.length > 0) {
            try {
                const lats = uniqueLocs.map(l => l.split(',')[0]).join(',');
                const lons = uniqueLocs.map(l => l.split(',')[1]).join(',');
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`);
                if (weatherRes.ok) {
                    const weatherData = await weatherRes.json();
                    const results = Array.isArray(weatherData) ? weatherData : [weatherData];
                    results.forEach((res, i) => {
                        weatherMap.set(uniqueLocs[i], {
                            temp: res.current.temperature_2m,
                            code: res.current.weather_code,
                            wind: res.current.wind_speed_10m
                        });
                    });
                }
            } catch (e) {
                console.error("Batch weather fetch failed:", e);
            }
        }

        // Attach weather to user locations
        const finalUserLocations = userLocations.map(u => {
            const locKey = u.geocoded ? `${u.geocoded.lat},${u.geocoded.lon}` : null;
            const weather = locKey ? weatherMap.get(locKey) : null;
            return {
                ...u,
                weather,
                geocoded: undefined // Clean up for response
            };
        });

        // Broaden health/alert data: return all active alerts for the map, not just those tied to users
        // Sub-admin sees alerts in their area, super-admin sees all
        let filteredWeather = weatherAlerts;
        let filteredQuakes = earthquakes;

        if (session && session.user.role === 'sub-admin') {
            const subAdmin: any = await User.findById(session.user.id).lean();
            if (subAdmin) {
                const tokens = [subAdmin.city, subAdmin.state, subAdmin.zipcode].filter(Boolean);
                if (tokens.length > 0) {
                    const regex = new RegExp(tokens.join('|'), 'i');

                    filteredWeather = weatherAlerts.filter(alert => {
                        const areaMatch = (alert.affectedAreas || []).some(area => regex.test(area));
                        const titleMatch = regex.test(alert.title || '');
                        const descMatch = regex.test(alert.description || '');
                        return areaMatch || titleMatch || descMatch;
                    });

                    filteredQuakes = earthquakes.filter(alert => {
                        const placeMatch = regex.test(alert.location || '');
                        const titleMatch = regex.test(alert.title || '');
                        return placeMatch || titleMatch;
                    });
                }
            }
        }

        const globalAlerts = {
            earthquakes: filteredQuakes.map(eq => ({
                ...eq,
                timestamp: (eq as any).timestamp || new Date().toISOString()
            })),
            weather: filteredWeather.map(alert => ({
                id: alert.alertId,
                source: AlertSource.WEATHER_API,
                title: alert.title,
                description: alert.description,
                severity: alert.severity,
                timestamp: alert.timestamp,
                expiresAt: alert.expiresAt,
                affectedAreas: alert.affectedAreas || [],
                coordinates: alert.coordinates ? { lat: alert.coordinates.lat, lng: alert.coordinates.lon } : undefined,
            })),
        };

        return NextResponse.json({
            success: true,
            data: finalUserLocations,
            globalAlerts,
            incidents: incidents.map(inc => ({ ...inc, timestamp: (inc as any).createdAt })),
            events: events.map(ev => ({ ...ev, timestamp: (ev as any).createdAt })),
            weatherConditions: Array.from(weatherMap.entries()).map(([loc, data]) => ({
                id: `condition-${loc}`,
                position: { lat: parseFloat(loc.split(',')[0]), lng: parseFloat(loc.split(',')[1]) },
                ...data
            }))
        });
    } catch (error: any) {
        console.error('Error fetching citizen locations:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
