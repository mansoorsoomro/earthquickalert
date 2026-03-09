import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EmergencyEvent from '@/models/EmergencyEvent';
import IncidentReport from '@/models/IncidentReport';
import User from '@/models/User';
import { openaiService } from '@/lib/services/openai-service';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSeverity } from '@/lib/types/api-alerts';

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const activeEventsCount = await EmergencyEvent.countDocuments({
            status: { $in: ['active', 'monitoring'] },
        });

        const recentIncidentCount = await IncidentReport.countDocuments({
            createdAt: { $gte: oneDayAgo },
        });

        const totalUsers = await User.countDocuments({ role: 'user' });
        const safeUsers = await User.countDocuments({ role: 'user', isSafe: true });
        const responderUnits = await User.countDocuments({
            role: { $in: ['responder', 'manager', 'admin'] },
        });

        const alerts = await alertProcessor.fetchAllAlerts();
        const alertsLastHour = alerts.filter(alert => new Date(alert.timestamp) >= oneHourAgo);
        const highSeverityAlerts = alerts.filter(alert =>
            [AlertSeverity.HIGH, AlertSeverity.SEVERE, AlertSeverity.EXTREME].includes(alert.severity)
        );

        const incidentStats = {
            activeEvents: activeEventsCount,
            incidentsLast24h: recentIncidentCount,
            responders: responderUnits,
        };
        const alertStats = {
            activeAlerts: alerts.length,
            alertsLastHour: alertsLastHour.length,
            highSeverityAlerts: highSeverityAlerts.length,
        };

        const insights = await openaiService.generateEOCInsights(incidentStats, alertStats);
        const signals = openaiService.buildSignalsFromAlertSet(alerts, recentIncidentCount, safeUsers, totalUsers);

        const activities = [
            {
                label: 'Data ingestion',
                status: alertsLastHour.length > 0 ? 'Running' : 'Idle',
            },
            {
                label: 'Interagency comms',
                status: signals.recommendVirtualEOC ? 'Escalated' : 'Standby',
            },
            {
                label: 'Community messages',
                status: recentIncidentCount > 20 ? 'High Volume' : recentIncidentCount > 0 ? 'Steady' : 'Low',
            },
        ];

        return NextResponse.json({
            success: true,
            data: {
                insights,
                activities,
                metrics: {
                    activeEvents: activeEventsCount,
                    alertsPerHour: alertsLastHour.length,
                    responseUnits: responderUnits,
                },
                signals,
            },
        });
    } catch (error) {
        console.error('EOC GET error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
