import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSource, AlertSeverity, Alert } from '@/lib/types/api-alerts';

export async function GET(request: Request) {
    try {
        await connectDB();

        // 1. Gather all unique location strings from all users and their family members
        const users = await User.find({}).lean();
        const locationSet = new Set<string>();

        users.forEach((user: any) => {
            if (user.location && user.location.trim() !== '') {
                locationSet.add(user.location.trim());
            }
            if (user.familyMembers && Array.isArray(user.familyMembers)) {
                user.familyMembers.forEach((member: any) => {
                    if (member.location && member.location.trim() !== '') {
                        locationSet.add(member.location.trim());
                    }
                });
            }
        });

        const uniqueLocations = Array.from(locationSet);
        const geocodedLocations: { lat: number; lon: number; name: string }[] = [];

        // 2. Geocode the unique string locations using the Photon API logic
        for (const loc of uniqueLocations) {
            try {
                // Check if it's already a lat/lon string (e.g. "41.87,-87.62")
                const coordsRegex = /^([-+]?[0-9]*\.?[0-9]+),\s*([-+]?[0-9]*\.?[0-9]+)$/;
                const match = loc.match(coordsRegex);

                if (match) {
                    geocodedLocations.push({
                        lat: parseFloat(match[1]),
                        lon: parseFloat(match[2]),
                        name: loc
                    });
                    continue;
                }

                const url = `https://photon.komoot.io/api?q=${encodeURIComponent(loc)}&limit=1`;
                const response = await fetch(url, {
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        geocodedLocations.push({
                            lat: feature.geometry.coordinates[1],
                            lon: feature.geometry.coordinates[0],
                            name: loc
                        });
                    }
                }
            } catch (err) {
                console.error(`Failed to geocode location: ${loc}`, err);
            }
        }

        // 3. Fetch Alerts (Weather + Earthquake)
        // Earthquake fetches all natively and we can filter, but weather needs coords
        const allAlerts: Alert[] = [];

        // A. Weather Alerts: explicitly fetch for each geocoded location
        // Using alertProcessor isn't perfectly vectorized for multiple locations at once, 
        // so we'll fetch them individually and combine
        for (const geo of geocodedLocations) {
            try {
                const alerts = await alertProcessor.fetchAllAlerts(
                    { lat: geo.lat, lon: geo.lon },
                    [AlertSource.WEATHER_API]
                );

                // Attach the string location name to affectedAreas
                const localizedAlerts = alerts.map(a => ({
                    ...a,
                    affectedAreas: [geo.name]
                }));

                allAlerts.push(...localizedAlerts);
            } catch (err) {
                console.error(`Failed to fetch weather for ${geo.name}`, err);
            }
        }

        // B. Earthquake Alerts: Fetch globally, then filter based on proximity to our users OR just include all major ones
        // Actually, the request was "Alerts of weather and earth quick only of my users", 
        // so we just fetch earthquakes for the locations
        for (const geo of geocodedLocations) {
            try {
                const alerts = await alertProcessor.fetchAllAlerts(
                    { lat: geo.lat, lon: geo.lon },
                    [AlertSource.EARTHQUAKE_API]
                );

                // Attach the string location name to affectedAreas (if not already set)
                const localizedAlerts = alerts.map(a => ({
                    ...a,
                    affectedAreas: a.affectedAreas?.length ? a.affectedAreas : [geo.name]
                }));

                // Avoid duplicating earthquakes since one earthquake might cover multiple users
                for (const alert of localizedAlerts) {
                    if (!allAlerts.some(existing => existing.id === alert.id)) {
                        allAlerts.push(alert);
                    } else {
                        // Append affected area if it affects another user
                        const existing = allAlerts.find(e => e.id === alert.id);
                        if (existing && !existing.affectedAreas?.includes(geo.name)) {
                            existing.affectedAreas?.push(geo.name);
                        }
                    }
                }

            } catch (err) {
                console.error(`Failed to fetch earthquakes for ${geo.name}`, err);
            }
        }

        // Sort by timestamp
        allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({
            success: true,
            data: allAlerts,
            count: allAlerts.length,
        });

    } catch (error) {
        console.error('Error in /api/alerts/users:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user alerts' },
            { status: 500 }
        );
    }
}
