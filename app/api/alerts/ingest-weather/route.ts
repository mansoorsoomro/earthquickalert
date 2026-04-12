import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CommunityAlert from '@/models/CommunityAlert';
import WeatherAlertRecord from '@/models/WeatherAlertRecord';
import EOCSettings from '@/models/EOCSettings';
import WeatherAlertTypeConfig from '@/models/WeatherAlertTypeConfig';
import WeatherAlertTypeChangeLog from '@/models/WeatherAlertTypeChangeLog';
import { notificationService, NotificationChannel } from '@/lib/services/notification-service';
import { weatherAPI } from '@/lib/services/weather-api';
import { WeatherAlert } from '@/lib/types/api-alerts';
import {
    geocodeLocation,
    isActionableWeatherAlert,
    locationMatchesAlertAreas,
    parseCoordinateLocation,
    splitAreaDescription,
} from '@/lib/services/location-matching';

type ConfigEvent = {
    name: string;
    enabled?: boolean;
    sendPush?: boolean;
    sendSms?: boolean;
    sendEmail?: boolean;
    invalid?: boolean;
    lastSeenAt?: Date;
};

type ConfigDoc = {
    events?: ConfigEvent[];
};

function getUniqueEvents(alerts: WeatherAlert[]): Set<string> {
    const events = new Set<string>();
    for (const alert of alerts) {
        if (alert.event) events.add(alert.event);
    }
    return events;
}

function unique<T>(values: T[]): T[] {
    return Array.from(new Set(values));
}

function channelsForEvent(eventName: string | undefined, configMap: Map<string, ConfigEvent>): NotificationChannel[] {
    if (!eventName) {
        return ['push', 'sms', 'email'];
    }

    const entry = configMap.get(eventName);
    if (!entry || entry.enabled === false || entry.invalid) {
        return [];
    }

    const hasAnyExplicitChannel = Boolean(entry.sendPush || entry.sendSms || entry.sendEmail);
    if (!hasAnyExplicitChannel) {
        // Preserve backward compatibility for existing configs that predate channel flags.
        return ['push', 'sms', 'email'];
    }

    const channels: NotificationChannel[] = [];
    if (entry.sendPush) channels.push('push');
    if (entry.sendSms) channels.push('sms');
    if (entry.sendEmail) channels.push('email');
    return channels;
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

async function handleAlertTypeChanges(discoveredEvents: Set<string>, currentConfig: ConfigDoc | null) {
    const now = new Date();
    const discoveredList = Array.from(discoveredEvents).sort();

    if (!currentConfig || !Array.isArray(currentConfig.events) || currentConfig.events.length === 0) {
        await WeatherAlertTypeConfig.findOneAndUpdate(
            {},
            {
                $set: {
                    events: discoveredList.map(name => ({
                        name,
                        enabled: true,
                        sendPush: true,
                        sendSms: true,
                        sendEmail: true,
                        invalid: false,
                        lastSeenAt: now,
                    })),
                },
            },
            { new: true, upsert: true }
        );

        return {
            newEvents: [] as string[],
            removedEvents: [] as string[],
            invalidEnabledEvents: [] as string[],
            automationPaused: false,
        };
    }

    const existingEntries = currentConfig.events || [];
    const existingMap = new Map(existingEntries.map(entry => [entry.name, entry]));
    const existingNames = new Set(existingEntries.map(entry => entry.name));

    const newEvents = discoveredList.filter(name => !existingNames.has(name));
    const removedEvents = Array.from(existingNames).filter(name => !discoveredEvents.has(name));
    const invalidEnabledEvents = removedEvents.filter(name => existingMap.get(name)?.enabled);

    const updatedEvents: ConfigEvent[] = existingEntries.map((entry) => {
        const stillPresent = discoveredEvents.has(entry.name);
        return {
            ...entry,
            enabled: stillPresent ? entry.enabled : false,
            invalid: !stillPresent,
            lastSeenAt: stillPresent ? now : entry.lastSeenAt,
        };
    });

    for (const eventName of newEvents) {
        updatedEvents.push({
            name: eventName,
            enabled: false,
            sendPush: false,
            sendSms: false,
            sendEmail: false,
            invalid: false,
            lastSeenAt: now,
        });
    }

    await WeatherAlertTypeConfig.findOneAndUpdate(
        {},
        { $set: { events: updatedEvents } },
        { new: true, upsert: true }
    );

    if (newEvents.length === 0 && removedEvents.length === 0) {
        return {
            newEvents,
            removedEvents,
            invalidEnabledEvents,
            automationPaused: false,
        };
    }

    await WeatherAlertTypeChangeLog.create({
        newEvents,
        removedEvents,
        invalidEnabledEvents,
        detectedEvents: discoveredList,
        automationPaused: true,
    });

    await EOCSettings.findOneAndUpdate(
        {},
        { $set: { 'alertFeeds.nws': false } },
        { new: true, upsert: true }
    );

    const summary: string[] = [];
    if (newEvents.length > 0) {
        summary.push(`New NWS events detected:\n- ${newEvents.join('\n- ')}`);
    }
    if (removedEvents.length > 0) {
        summary.push(`Events no longer in NWS feed:\n- ${removedEvents.join('\n- ')}`);
    }
    if (invalidEnabledEvents.length > 0) {
        summary.push(`Previously enabled events marked invalid:\n- ${invalidEnabledEvents.join('\n- ')}`);
    }
    summary.push('\nAutomated NWS ingestion has been paused until the alert-type configuration is reviewed.');

    await notificationService.sendAdminSystemEmail(
        'NWS alert types changed - automation paused',
        summary.join('\n\n'),
        {
            newEvents,
            removedEvents,
            invalidEnabledEvents,
            providerUrl: 'https://api.weather.gov/alerts/active',
        }
    );

    return {
        newEvents,
        removedEvents,
        invalidEnabledEvents,
        automationPaused: true,
    };
}

async function dispatchZoneMatchedWeatherNotifications(
    users: any[],
    alerts: WeatherAlert[],
    configMap: Map<string, ConfigEvent>
) {
    let notificationsCreated = 0;
    let matchedUsers = 0;
    const matchedUserIds = new Set<string>();

    for (const user of users) {
        const userId = user._id?.toString();
        if (!userId) continue;

        const registeredLocations = locationsFromUser(user);
        if (registeredLocations.length === 0) continue;

        const coordinateLocations = registeredLocations
            .map(value => parseCoordinateLocation(value))
            .filter((value): value is { lat: number; lon: number } => Boolean(value));

        for (const alert of alerts) {
            const entry = alert.event ? configMap.get(alert.event) : null;
            const channels = channelsForEvent(alert.event, configMap);
            if (channels.length === 0) continue;

            const preferences = user.notificationPreferences || {};
            const preferredChannels = channels.filter(channel => preferences[channel] !== false);
            if (preferredChannels.length === 0) continue;

            const matchesByArea = registeredLocations.some(location =>
                locationMatchesAlertAreas(location, alert.affectedAreas || [], alert.areaDesc, alert.zones || [])
            );

            let matchesByDistance = false;
            if (!matchesByArea && alert.coordinates && coordinateLocations.length > 0) {
                matchesByDistance = coordinateLocations.some(coords =>
                    distanceKm(coords.lat, coords.lon, alert.coordinates!.lat, alert.coordinates!.lon) <= 80
                );
            }

            if (!matchesByArea && !matchesByDistance) continue;

            // Use custom template if available
            let finalMessage = alert.description;
            if (entry && (entry as any).template) {
                finalMessage = (entry as any).template
                    .replace(/{{event}}/g, alert.event || 'Emergency')
                    .replace(/{{severity}}/g, alert.severity || 'Moderate')
                    .replace(/{{location}}/g, alert.affectedAreas?.[0] || 'your area');
            }

            // Log this broadcast to the community log if not already logged
            const existingLog = await CommunityAlert.findOne({ eventId: alert.id }).select('_id').lean();
            if (!existingLog) {
                await CommunityAlert.create({
                    source: 'nws',
                    severity: (alert.severity as any)?.toLowerCase() || 'warning',
                    title: alert.title,
                    description: finalMessage,
                    affectedAreas: alert.affectedAreas || [],
                    adminName: 'Automated System',
                    adminEmail: 'system@ready2go.gov',
                    eventId: alert.id,
                    expiresAt: alert.expiresAt,
                });
            }

            const delivery = await notificationService.dispatchWeatherAlertNotification({
                userId,
                alertId: alert.id,
                title: alert.title,
                message: finalMessage,
                channels: preferredChannels,
                providerUrl: ' National Weather Service ', // Updated to a more user-friendly string
                event: alert.event,
                severity: alert.severity,
                expiresAt: alert.expiresAt,
                affectedAreas: alert.affectedAreas,
            });

            if (delivery.length > 0) {
                notificationsCreated += delivery.length;
                matchedUserIds.add(userId);
            }
        }
    }

    matchedUsers = matchedUserIds.size;

    return {
        notificationsCreated,
        matchedUsers,
    };
}

export async function GET() {
    try {
        await connectDB();

        const settings: any = await EOCSettings.findOne().lean();
        if (settings && settings.alertFeeds && settings.alertFeeds.nws === false) {
            return NextResponse.json({
                success: true,
                message: 'NWS ingestion is disabled by EOC settings.',
                ingested: 0,
                locations: 0,
                notifications: 0,
            });
        }

        const users = await User.find({}).lean();
        const currentConfig = await WeatherAlertTypeConfig.findOne().lean() as ConfigDoc | null;
        const configMap = new Map<string, ConfigEvent>(
            ((currentConfig?.events || []) as ConfigEvent[]).map(entry => [entry.name, entry])
        );

        const uniqueLocationNames = unique(
            users.flatMap(user => locationsFromUser(user)).filter(Boolean)
        );

        const geocodedLocations: { lat: number; lon: number; name: string }[] = [];
        const geocodeCache = new Map<string, { lat: number; lon: number; name: string } | null>();

        for (const locationName of uniqueLocationNames) {
            if (!geocodeCache.has(locationName)) {
                geocodeCache.set(locationName, await geocodeLocation(locationName));
            }
            const geocoded = geocodeCache.get(locationName);
            if (geocoded) {
                geocodedLocations.push(geocoded);
            }
        }

        let ingestedCount = 0;
        let skippedCount = 0;
        const skippedEvents = new Set<string>();
        const discoveredEvents = new Set<string>();
        const ingestedAlerts = new Map<string, WeatherAlert>();

        for (const geo of geocodedLocations) {
            try {
                const alerts = await weatherAPI.fetchWeatherAlerts(geo.lat, geo.lon);
                const uniqueEventsForLocation = getUniqueEvents(alerts as WeatherAlert[]);
                for (const eventName of uniqueEventsForLocation) {
                    discoveredEvents.add(eventName);
                }

                for (const alert of alerts as WeatherAlert[]) {
                    if (!isActionableWeatherAlert(alert)) continue;

                    if (alert.event) {
                        const eventConfig = configMap.get(alert.event);
                        if (eventConfig && (eventConfig.enabled === false || eventConfig.invalid)) {
                            skippedCount += 1;
                            skippedEvents.add(alert.event);
                            continue;
                        }
                    }

                    const mergedAffectedAreas = unique([
                        ...(alert.affectedAreas || []),
                        ...splitAreaDescription(alert.areaDesc),
                        geo.name,
                    ]);

                    await WeatherAlertRecord.findOneAndUpdate(
                        { alertId: alert.id },
                        {
                            $set: {
                                alertId: alert.id,
                                source: alert.source,
                                event: alert.event,
                                severity: alert.severity,
                                title: alert.title,
                                description: alert.description,
                                timestamp: alert.timestamp ? new Date(alert.timestamp) : undefined,
                                expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
                                weatherType: alert.weatherType,
                                temperature: alert.temperature,
                                windSpeed: alert.windSpeed,
                                humidity: alert.humidity,
                                precipitation: alert.precipitation,
                                coordinates: alert.coordinates,
                                areaDesc: alert.areaDesc,
                                zones: alert.zones || [],
                                affectedAreas: mergedAffectedAreas,
                            },
                        },
                        { upsert: true, new: true }
                    );

                    ingestedAlerts.set(alert.id, {
                        ...alert,
                        affectedAreas: mergedAffectedAreas,
                    });
                    ingestedCount += 1;
                }
            } catch (error) {
                console.error(`Failed to ingest weather alerts for ${geo.name}:`, error);
            }
        }

        await WeatherAlertRecord.deleteMany({
            expiresAt: { $lte: new Date() },
        });

        const changeResult = discoveredEvents.size > 0
            ? await handleAlertTypeChanges(discoveredEvents, currentConfig)
            : {
                newEvents: [] as string[],
                removedEvents: [] as string[],
                invalidEnabledEvents: [] as string[],
                automationPaused: false,
            };
        let notificationsCreated = 0;
        let matchedUsers = 0;

        if (!changeResult.automationPaused && ingestedAlerts.size > 0) {
            const refreshedConfig = await WeatherAlertTypeConfig.findOne().lean() as ConfigDoc | null;
            const refreshedConfigMap = new Map<string, ConfigEvent>(
                ((refreshedConfig?.events || []) as ConfigEvent[]).map(entry => [entry.name, entry])
            );

            const dispatchStats = await dispatchZoneMatchedWeatherNotifications(
                users,
                Array.from(ingestedAlerts.values()),
                refreshedConfigMap
            );
            notificationsCreated = dispatchStats.notificationsCreated;
            matchedUsers = dispatchStats.matchedUsers;
        }

        return NextResponse.json({
            success: true,
            message: changeResult.automationPaused
                ? 'NWS ingestion completed, but automation was paused due to alert type changes.'
                : 'Weather alerts ingested successfully.',
            ingested: ingestedCount,
            skipped: skippedCount,
            skippedEvents: Array.from(skippedEvents),
            locations: geocodedLocations.length,
            distinctEvents: Array.from(discoveredEvents).sort(),
            notifications: notificationsCreated,
            matchedUsers,
            automationPaused: changeResult.automationPaused,
            newEvents: changeResult.newEvents,
            removedEvents: changeResult.removedEvents,
            invalidEnabledEvents: changeResult.invalidEnabledEvents,
        });
    } catch (error) {
        console.error('Error in /api/alerts/ingest-weather:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to ingest weather alerts' },
            { status: 500 }
        );
    }
}
