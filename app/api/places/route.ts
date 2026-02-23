import { NextResponse } from 'next/server';

// Map our type strings to OpenStreetMap amenity/shop tags
const typeToOsmTag: Record<string, { key: string; value: string }> = {
    hospital: { key: 'amenity', value: 'hospital' },
    pharmacy: { key: 'amenity', value: 'pharmacy' },
    gas_station: { key: 'amenity', value: 'fuel' },
    lodging: { key: 'tourism', value: 'hotel' },
    local_government_office: { key: 'amenity', value: 'social_facility' },
    shelter: { key: 'amenity', value: 'shelter' },
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const type = searchParams.get('type') || 'hospital';
    const radius = searchParams.get('radius') || '5000';

    // Support legacy text-search mode (used by address autocomplete)
    const query = searchParams.get('q') || searchParams.get('address');
    if (query) {
        return handleTextSearch(query);
    }

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        const osmTag = typeToOsmTag[type] || { key: 'amenity', value: type };

        // Overpass API — free, no key required
        const overpassQuery = `
            [out:json][timeout:10];
            (
              node["${osmTag.key}"="${osmTag.value}"](around:${radius},${lat},${lng});
              way["${osmTag.key}"="${osmTag.value}"](around:${radius},${lat},${lng});
            );
            out center 20;
        `;

        const url = 'https://overpass-api.de/api/interpreter';
        const response = await fetch(url, {
            method: 'POST',
            body: overpassQuery,
            headers: {
                'Content-Type': 'text/plain',
                'User-Agent': 'EarthquickEmergencyDashboard/1.0',
            },
        });

        // Treat rate-limit (429) and timeout (504) as graceful empty results
        if (!response.ok) {
            console.warn(`Overpass API returned ${response.status}, returning empty results`);
            return NextResponse.json({ results: [] });
        }

        const data = await response.json();
        const elements: any[] = data.elements || [];

        const results = elements.map((el: any) => {
            const elLat = el.lat ?? el.center?.lat;
            const elLng = el.lon ?? el.center?.lon;
            const tags = el.tags || {};
            const name = tags.name || tags['name:en'] || type;

            return {
                place_id: `${el.type}_${el.id}`,
                name,
                geometry: {
                    location: { lat: elLat, lng: elLng },
                },
                vicinity: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']]
                    .filter(Boolean)
                    .join(' ') || 'Address not available',
                formatted_phone_number: tags.phone || tags['contact:phone'] || undefined,
            };
        });

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error('Places search error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleTextSearch(query: string) {
    try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en`;
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 60 },
        });

        if (!response.ok) throw new Error(`Photon API returned ${response.status}`);

        const data = await response.json();

        if (data.features?.length > 0) {
            const results = data.features.map((feature: any) => {
                const p = feature.properties;
                const parts = [p.name, p.city || p.town || p.village, p.state, p.country].filter(Boolean);
                const displayName = [...new Set(parts)].join(', ');
                return {
                    place_id: `${feature.geometry.coordinates[0]}_${feature.geometry.coordinates[1]}`,
                    display_name: displayName,
                    lat: feature.geometry.coordinates[1].toString(),
                    lon: feature.geometry.coordinates[0].toString(),
                    address: {
                        name: p.name,
                        city: p.city || p.town || p.village || p.county,
                        state: p.state,
                        country: p.country,
                    },
                };
            });
            return NextResponse.json(results);
        }

        return NextResponse.json([]);
    } catch (error: any) {
        console.error('Places text search error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
