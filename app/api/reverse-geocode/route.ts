import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        // Photon reverse geocoding - no key required, no rate-limiting issues
        const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'EmergencyDashboard/1.0'
            },
            signal: controller.signal,
            next: { revalidate: 3600 } // Cache for 1 hour to reduce outgoing requests
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return NextResponse.json(
                { error: `Geocoding service returned ${response.status}` }, 
                { status: response.status === 404 ? 404 : 502 }
            );
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const p = data.features[0].properties;
            const parts = [p.name, p.city || p.town || p.village, p.state, p.country].filter(Boolean);
            const name = [...new Set(parts)].join(', ');
            return NextResponse.json({ name, address: p });
        }

        return NextResponse.json({ error: 'No results found for these coordinates' }, { status: 404 });
    } catch (error: any) {
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: 'Reverse geocoding request timed out' }, { status: 504 });
        }
        console.warn('Reverse geocoding proxy warning:', error.message);
        return NextResponse.json({ error: 'Failed to process reverse geocoding request' }, { status: 500 });
    }
}
