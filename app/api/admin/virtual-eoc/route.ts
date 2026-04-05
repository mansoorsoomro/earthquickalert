import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import IncidentReport from '@/models/IncidentReport';
import EmergencyEvent from '@/models/EmergencyEvent';
import WeatherAlertRecord from '@/models/WeatherAlertRecord';
import { getSession } from '@/lib/auth';
import { getSubAdminUserFilter, getSubAdminTextLocationFilter } from '@/lib/admin-filters';

export async function GET() {
    try {
        await connectDB();

        const session = await getSession();
        let userFilter: any = null;
        let incFilter: any = null;
        let eventFilter: any = null;
        let weatherLocFilter: any = {};

        if (session && session.user.role === 'sub-admin') {
            userFilter = await getSubAdminUserFilter(session.user.id);
            incFilter = await getSubAdminTextLocationFilter(session.user.id, 'location');
            eventFilter = await getSubAdminTextLocationFilter(session.user.id, 'location.address');

            const subAdmin: any = await User.findById(session.user.id).lean();
            if (subAdmin) {
                const tokens = [subAdmin.city, subAdmin.state, subAdmin.zipcode].filter(Boolean);
                if (tokens.length > 0) {
                    const regex = new RegExp(tokens.join('|'), 'i');
                    weatherLocFilter = {
                        $or: [
                            { affectedAreas: { $regex: regex } },
                            { areaDesc: { $regex: regex } },
                            { title: { $regex: regex } }
                        ]
                    };
                }
            }
        }

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const activeEventQuery: any = { status: 'active' };
        if (eventFilter) activeEventQuery.$and = [eventFilter];
        const activeEvents = await EmergencyEvent.countDocuments(activeEventQuery);

        const latestEventQuery: any = { status: { $in: ['active', 'monitoring'] } };
        if (eventFilter) latestEventQuery.$and = [eventFilter];
        const latestActiveEvent: any = await EmergencyEvent.findOne(latestEventQuery)
            .sort({ updatedAt: -1 })
            .lean();

        const responderQuery: any = { role: { $in: ['admin', 'responder', 'eoc-manager', 'eoc-observer', 'manager'] } };
        if (userFilter) responderQuery.$and = [userFilter];
        const responders = await User.find(responderQuery).lean();
        const activePersonnelCount = responders.length;

        const safeQuery: any = { role: 'user', isSafe: true };
        if (userFilter) safeQuery.$and = [userFilter];
        const safeUsers = await User.countDocuments(safeQuery);

        let allUsersQuery: any = {}; // Default to all for super admin/admin
        if (session && session.user.role === 'sub-admin') {
            allUsersQuery = { role: 'user' };
            if (userFilter) allUsersQuery.$and = [userFilter];
        }
        const allUsers = await User.countDocuments(allUsersQuery);

        // eventTypes distinct
        let eventTypesQuery: any = { status: 'active' };
        if (eventFilter) eventTypesQuery.$and = [eventFilter];
        const eventTypes = await EmergencyEvent.distinct('type', eventTypesQuery);
        const activeLayers = eventTypes.length || 0;

        const incidentQuery: any = {};
        if (incFilter) incidentQuery.$and = [incFilter];
        const citizenReports = await IncidentReport.find(incidentQuery).sort({ createdAt: -1 }).limit(10).lean();
        const totalCitizenReports = await IncidentReport.countDocuments(incidentQuery);

        const recentIncidentQuery: any = { createdAt: { $gte: oneDayAgo } };
        if (incFilter) recentIncidentQuery.$and = [incFilter];
        const recentCitizenReports = await IncidentReport.countDocuments(recentIncidentQuery);

        const checkinsQuery: any = { role: 'user', location: { $exists: true, $ne: '' } };
        if (userFilter) checkinsQuery.$and = [userFilter];
        const checkins = await User.find(checkinsQuery)
            .sort({ lastLocationUpdate: -1 })
            .limit(10)
            .lean();

        // weather alerts (assume national scale, but we can filter if needed)
        // for sub-admin, weather alerts usually apply locally but their dataset is external 
        // we won't heavily restrict weather counts here since it's an external feed
        const activeWeatherAlerts = await WeatherAlertRecord.countDocuments({
            source: 'weather_api',
            ...weatherLocFilter,
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
