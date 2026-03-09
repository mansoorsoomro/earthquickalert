import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import IncidentReport from '@/models/IncidentReport';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSource } from '@/lib/types/api-alerts';
import { openaiService } from '@/lib/services/openai-service';

export async function GET() {
    try {
        await connectDB();

        // Get total users
        const users = await User.find({ role: 'user' }, 'location').lean();
        const totalUsers = users.length;

        // Get safe users
        const safeUsers = await User.countDocuments({ role: 'user', isSafe: true });

        // Get active personnel (admins and responders)
        const activePersonnel = await User.countDocuments({
            role: { $in: ['admin', 'responder'] }
        });

        // Get total incident reports
        const totalIncidents = await IncidentReport.countDocuments();

        // Get all alerts
        const allAlerts = await alertProcessor.fetchAllAlerts();

        const quakeAlerts = allAlerts.filter(a => a.source === AlertSource.EARTHQUAKE_API);
        const weatherAlerts = allAlerts.filter(a => a.source === AlertSource.WEATHER_API);
        const quakeCount = quakeAlerts.length;
        const weatherCount = weatherAlerts.length;
        const latestQuake = quakeAlerts[0]?.title || 'No recent impact';

        // Get AI Insight (Integrating OpenAI)
        const aiInsight = await openaiService.generateEmergencyInsights(weatherAlerts, quakeAlerts);
        const signals = openaiService.buildSignalsFromAlertSet(allAlerts, totalIncidents, safeUsers, totalUsers);

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                safeUsers,
                quakeCount,
                weatherCount,
                latestQuake,
                totalIncidents,
                activePersonnel,
                aiInsight,
                signals,
            },
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
