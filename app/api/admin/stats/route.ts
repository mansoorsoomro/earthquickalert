import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSource } from '@/lib/types/api-alerts';

export async function GET() {
    try {
        await connectDB();

        // Get total users
        const users = await User.find({ role: 'user' }, 'location').lean();
        const totalUsers = users.length;

        // Get safe users
        const safeUsers = await User.countDocuments({ role: 'user', isSafe: true });

        // Get all alerts
        const allAlerts = await alertProcessor.fetchAllAlerts();

        // Calculate relevant hazards
        const relevantAlertIds = new Set<string>();
        users.forEach(user => {
            allAlerts.forEach(alert => {
                const locationStr = user.location?.toLowerCase() || '';
                const alertTitle = alert.title.toLowerCase();
                const alertDesc = alert.description.toLowerCase();
                const alertLoc = (alert as any).location?.toLowerCase() || '';

                if (locationStr && (
                    alertTitle.includes(locationStr) ||
                    alertDesc.includes(locationStr) ||
                    alertLoc.includes(locationStr) ||
                    locationStr.includes(alertLoc && alertLoc.length > 3 ? alertLoc : '____')
                )) {
                    relevantAlertIds.add(alert.id);
                }
            });
        });

        const relevantAlerts = allAlerts.filter(a => relevantAlertIds.has(a.id));
        const quakeCount = relevantAlerts.filter(a => a.source === AlertSource.EARTHQUAKE_API).length;
        const weatherCount = relevantAlerts.filter(a => a.source === AlertSource.WEATHER_API).length;
        const latestQuake = relevantAlerts.find(a => a.source === AlertSource.EARTHQUAKE_API)?.title || 'No recent impact';

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                safeUsers,
                quakeCount,
                weatherCount,
                latestQuake
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch admin stats',
            },
            { status: 500 }
        );
    }
}
