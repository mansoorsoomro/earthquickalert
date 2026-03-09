import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import IncidentReport from '@/models/IncidentReport';
import EmergencyEvent from '@/models/EmergencyEvent';
import WeatherAlertRecord from '@/models/WeatherAlertRecord';

export async function GET() {
    try {
        await connectDB();

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const activeEvents = await EmergencyEvent.countDocuments({ status: 'active' });
        const latestActiveEvent: any = await EmergencyEvent.findOne({ status: { $in: ['active', 'monitoring'] } })
            .sort({ updatedAt: -1 })
            .lean();

        const responders = await User.find({ role: 'responder' }).lean();
        const activePersonnelCount = responders.length;

        const safeUsers = await User.countDocuments({ role: 'user', isSafe: true });
        const allUsers = await User.countDocuments({ role: 'user' });

        const eventTypes = await EmergencyEvent.distinct('type', { status: 'active' });
        const activeLayers = eventTypes.length || 0;

        const citizenReports = await IncidentReport.find().sort({ createdAt: -1 }).limit(10).lean();
        const totalCitizenReports = await IncidentReport.countDocuments();
        const recentCitizenReports = await IncidentReport.countDocuments({ createdAt: { $gte: oneDayAgo } });

        const checkins = await User.find({ role: 'user', location: { $exists: true, $ne: '' } })
            .sort({ lastLocationUpdate: -1 })
            .limit(10)
            .lean();

        const activeWeatherAlerts = await WeatherAlertRecord.countDocuments({
            source: 'weather_api',
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: now } },
            ],
        });

        const incidentLabel = latestActiveEvent
            ? `${latestActiveEvent.type} - ${new Date(latestActiveEvent.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}`
            : 'Standby';

        const responderTasks = responders.map(res => ({
            id: res._id?.toString() || Math.random().toString(),
            name: res.name || res.email,
            role: 'Responder',
            status: latestActiveEvent ? 'In Progress' : 'Standby',
            assignedIncident: incidentLabel,
            lastUpdate: new Date(res.updatedAt || res.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        const formattedCitizenReports = citizenReports.map(report => ({
            id: report._id?.toString(),
            submittedBy: report.reportedBy || 'Citizen',
            location: report.location || 'Unknown',
            type: report.type || 'Other',
            status: report.status || 'Pending',
            timestamp: new Date(report.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        const formattedCheckins = checkins.map(user => ({
            id: user._id?.toString(),
            name: user.name || user.email,
            location: user.location,
            status: user.isSafe ? 'Safe' : 'Unsafe',
            lastCheckin: new Date((user as any).lastLocationUpdate || user.updatedAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            incident: incidentLabel,
        }));

        return NextResponse.json({
            success: true,
            data: {
                kpis: {
                    activeIncidents: activeEvents,
                    responderActionsCompleted: activePersonnelCount,
                    citizenReportsReceived: totalCitizenReports,
                    areWeSafeCheckins: safeUsers,
                    totalUsers: allUsers,
                    gisLayersActive: activeLayers,
                },
                responderTasks,
                citizenReports: formattedCitizenReports,
                checkins: formattedCheckins,
                meta: {
                    recentCitizenReports,
                    activeWeatherAlerts,
                    activeIncidentLabel: incidentLabel,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching Virtual EOC stats:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch Virtual EOC stats',
        }, { status: 500 });
    }
}
