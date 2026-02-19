// API Route: Fetch all alerts (weather + earthquake + admin)

import { NextResponse } from 'next/server';
import { alertProcessor } from '@/lib/services/alert-processor';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Get location from query params
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');

        const location = lat && lon
            ? { lat: parseFloat(lat), lon: parseFloat(lon) }
            : undefined;

        // Fetch all alerts
        const alerts = await alertProcessor.fetchAllAlerts(location);

        return NextResponse.json({
            success: true,
            data: alerts,
            count: alerts.length,
            statistics: alertProcessor.getStatistics(),
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch alerts',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
