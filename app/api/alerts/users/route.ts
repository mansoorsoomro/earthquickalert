import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CommunityAlert from '@/models/CommunityAlert';
import WeatherAlertRecord from '@/models/WeatherAlertRecord';
import WeatherAlertTypeConfig from '@/models/WeatherAlertTypeConfig';
import { getSession } from '@/lib/auth';
import { alertProcessor } from '@/lib/services/alert-processor';
import { Alert, AlertSource, AlertSeverity } from '@/lib/types/api-alerts';
import {
    geocodeLocation,
    locationMatchesAlertAreas,
} from '@/lib/services/location-matching';

type WeatherAlertDoc = {
    alertId: string;
    source: string;
    event?: string;
    severity: string;
    title: string;
    description: string;
    timestamp: Date;
    expiresAt?: Date;
    weatherType?: string;
    temperature?: number;
    windSpeed?: number;
    humidity?: number;
    precipitation?: number;
    coordinates?: { lat: number; lon: number };
    affectedAreas?: string[];
    areaDesc?: string;
    zones?: string[];
};

function unique<T>(values: T[]): T[] {
    return Array.from(new Set(values));
}

function locationsFromUser(user: any): string[] {
    const values: string[] = [];
    if (typeof user.location === 'string' && user.location.trim()) {
        values.push(user.location.trim());
    }
    if (Array.isArray(user.familyMembers)) {
        for (const member of user.familyMembers) {
            if (typeof member.location === 'string' && member.location.trim()) {
                values.push(member.location.trim());
            }
        }
    }
    return unique(values);
}

function toSeverity(value: string): AlertSeverity {
    const normalized = (value || '').toLowerCase();
    if (normalized === 'extreme') return AlertSeverity.EXTREME;
    if (normalized === 'severe') return AlertSeverity.SEVERE;
    if (normalized === 'high') return AlertSeverity.HIGH;
    if (normalized === 'moderate') return AlertSeverity.MODERATE;
    if (normalized === 'low' || normalized === 'minor') return AlertSeverity.LOW;
    return AlertSeverity.INFO;
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

function normalizeAlertTargetValues(values: string[]): string[] {
    return values
        .map(value => value.toLowerCase().trim())
        .filter(Boolean);
}

export async function GET() {
    try {
        await connectDB();

        const session = await getSession();
        const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'super-admin' || session?.user?.role === 'sub-admin';

        let users: any[] = [];
        if (session?.user && !isAdmin) {
            const currentUser = await User.findById(session.user.id).lean();
            if (currentUser) users = [currentUser];
        } else {
            users = await User.find({}).lean();
        }

        const allRegisteredLocations = unique(
            users.flatMap(user => locationsFromUser(user))
        );

        const geocodedLocations: { lat: number; lon: number; name: string }[] = [];
        for (const locationName of allRegisteredLocations) {
            const geocoded = await geocodeLocation(locationName);
            if (geocoded) {
                geocodedLocations.push(geocoded);
            }
        }

        const now = new Date();
        const alertConfig: any = await WeatherAlertTypeConfig.findOne().lean();
        const enabledEvents = new Set<string>(
            (alertConfig?.events || [])
                .filter((entry: any) => entry.enabled && !entry.invalid)
                .map((entry: any) => entry.name)
        );
        const hasConfig = Array.isArray(alertConfig?.events) && alertConfig.events.length > 0;

        const storedWeatherAlerts = await WeatherAlertRecord.find({
            source: AlertSource.WEATHER_API,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: now } },
            ],
        }).sort({ timestamp: -1 }).lean() as unknown as WeatherAlertDoc[];

        const mergedWeatherMap = new Map<string, Alert>();
        const coordinateLocations = geocodedLocations.map(value => ({ lat: value.lat, lon: value.lon, name: value.name }));

        for (const record of storedWeatherAlerts) {
            if (hasConfig && record.event && !enabledEvents.has(record.event)) {
                continue;
            }

            let matchedAreas: string[] = [];
            if (isAdmin && allRegisteredLocations.length === 0) {
                matchedAreas = record.affectedAreas || [];
            } else {
                matchedAreas = allRegisteredLocations.filter(location =>
                    locationMatchesAlertAreas(location, record.affectedAreas || [], record.areaDesc, record.zones || [])
                );

                if (matchedAreas.length === 0 && record.coordinates && coordinateLocations.length > 0) {
                    const nearby = coordinateLocations
                        .filter(coords => distanceKm(coords.lat, coords.lon, record.coordinates!.lat, record.coordinates!.lon) <= 80)
                        .map(coords => coords.name);
                    matchedAreas.push(...nearby);
                }
            }

            if (!isAdmin && matchedAreas.length === 0) continue;

            const existing = mergedWeatherMap.get(record.alertId);
            const mergedAreas = unique([
                ...(existing?.affectedAreas || []),
                ...(matchedAreas.length > 0 ? matchedAreas : (record.affectedAreas || [])),
            ]);

            mergedWeatherMap.set(record.alertId, {
                id: record.alertId,
                source: AlertSource.WEATHER_API,
                severity: toSeverity(record.severity),
                title: record.title,
                description: record.description,
                timestamp: new Date(record.timestamp).toISOString(),
                expiresAt: record.expiresAt ? new Date(record.expiresAt).toISOString() : undefined,
                affectedAreas: mergedAreas,
                event: record.event,
                areaDesc: record.areaDesc,
                zones: record.zones || [],
                weatherType: (record.weatherType as any) || 'other',
                temperature: record.temperature,
                windSpeed: record.windSpeed,
                humidity: record.humidity,
                precipitation: record.precipitation,
                coordinates: record.coordinates,
            } as Alert);
        }

        const earthquakeAlerts: Alert[] = [];
        for (const location of geocodedLocations) {
            try {
                const fetched = await alertProcessor.fetchAllAlerts(
                    { lat: location.lat, lon: location.lon },
                    [AlertSource.EARTHQUAKE_API]
                );

                for (const alert of fetched) {
                    const existing = earthquakeAlerts.find(item => item.id === alert.id);
                    if (!existing) {
                        earthquakeAlerts.push({
                            ...alert,
                            affectedAreas: unique([...(alert.affectedAreas || []), location.name]),
                        });
                    } else {
                        existing.affectedAreas = unique([...(existing.affectedAreas || []), location.name]);
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch earthquakes for ${location.name}:`, error);
            }
        }

        const communityRaw = await CommunityAlert.find({
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: now } },
            ],
        }).sort({ timestamp: -1 }).lean();

        const requestedUserId = session?.user?.id ? String(session.user.id) : '';
        const scopedZones = normalizeAlertTargetValues(allRegisteredLocations);

        const communityAlerts: Alert[] = communityRaw
            .filter((alert: any) => {
                if (isAdmin) return true;

                const targetUsers = normalizeAlertTargetValues(
                    Array.isArray(alert.targetUsers) ? alert.targetUsers.map((value: any) => String(value)) : []
                );
                const affectedAreas = normalizeAlertTargetValues(
                    Array.isArray(alert.affectedAreas) ? alert.affectedAreas.map((value: any) => String(value)) : []
                );

                const targetsCurrentUser = requestedUserId && targetUsers.includes(requestedUserId.toLowerCase());
                const targetsAll = targetUsers.includes('broadcast') || targetUsers.includes('all');
                const areaOverlap = affectedAreas.length === 0 ||
                    affectedAreas.some((area: string) =>
                        scopedZones.some(zone => area.includes(zone) || zone.includes(area))
                    );

                return targetsCurrentUser || targetsAll || areaOverlap;
            })
            .map((alert: any) => ({
                id: String(alert._id),
                source: AlertSource.ADMIN_MANUAL,
                severity: toSeverity(alert.severity),
                title: alert.title,
                description: alert.description,
                timestamp: new Date(alert.timestamp || alert.createdAt || new Date()).toISOString(),
                expiresAt: alert.expiresAt ? new Date(alert.expiresAt).toISOString() : undefined,
                affectedAreas: alert.affectedAreas || [],
                adminName: alert.adminName || 'Admin',
                priority: alert.priority || 'medium',
                isRead: false,
            } as Alert));

        const allAlerts: Alert[] = [
            ...Array.from(mergedWeatherMap.values()),
            ...earthquakeAlerts,
            ...communityAlerts,
        ];

        allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({
            success: true,
            data: allAlerts,
            count: allAlerts.length,
            metadata: {
                locations: geocodedLocations.length,
                weatherAlerts: mergedWeatherMap.size,
                earthquakeAlerts: earthquakeAlerts.length,
                communityAlerts: communityAlerts.length,
            },
        });
    } catch (error) {
        console.error('Error in /api/alerts/users:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user alerts' },
            { status: 500 }
        );
    }
}
