import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    try {
        // Photon geocoding - no API key required, more lenient usage policy
        const url = `https://photon.komoot.io/api?q=${encodeURIComponent(address)}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'EmergencyDashboard/1.0 (contact: admin@example.com)'
            }
        });

        if (!response.ok) {
            throw new Error(`Photon returned ${response.status}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            return NextResponse.json({
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0]
            });
        }

        return NextResponse.json({ error: 'No results' }, { status: 404 });
    } catch (error: any) {
        console.error('Geocoding proxy error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
