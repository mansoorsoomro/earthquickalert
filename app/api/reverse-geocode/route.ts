import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    try {
        // Photon reverse geocoding - no key required, no rate-limiting issues
        const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'EmergencyDashboard/1.0 (contact: admin@example.com)'
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            throw new Error(`Photon API returned ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const p = data.features[0].properties;
            const parts = [p.name, p.city || p.town || p.village, p.state, p.country].filter(Boolean);
            const name = [...new Set(parts)].join(', ');
            return NextResponse.json({ name, address: p });
        }

        return NextResponse.json({ error: 'No results' }, { status: 404 });
    } catch (error: any) {
        console.error('Reverse geocoding proxy error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
