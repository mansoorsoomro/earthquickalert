import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import IncidentReport from '@/models/IncidentReport';
import { alertProcessor } from '@/lib/services/alert-processor';
import { AlertSource } from '@/lib/types/api-alerts';
import { openaiService } from '@/lib/services/openai-service';
import { getSession } from '@/lib/auth';
import { getSubAdminUserFilter, getSubAdminTextLocationFilter } from '@/lib/admin-filters';

export async function GET() {
    try {
        await connectDB();

        const session = await getSession();
        let userFilter: any = null;
        let incFilter: any = null;
        let weatherLocFilter: any = {};

        if (session && session.user.role === 'sub-admin') {
            userFilter = await getSubAdminUserFilter(session.user.id);
            incFilter = await getSubAdminTextLocationFilter(session.user.id, 'location');

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

        // Get total users
        let userQuery: any = {}; // Default to all for super admin
        if (session && session.user.role === 'sub-admin') {
            userQuery = { role: 'user' }; // Sub-admin only manages users
            if (userFilter) userQuery.$and = [userFilter];
        }

        const users = await User.find(userQuery, 'location').lean();
        const totalUsers = users.length;

        // Get safe users
        let safeQuery: any = { role: 'user', isSafe: true };
        if (userFilter) safeQuery.$and = [userFilter];
        const safeUsers = await User.countDocuments(safeQuery);

        // Get active personnel (admins and responders and managers)
        let personnelQuery: any = { role: { $in: ['admin', 'responder', 'eoc-manager', 'eoc-observer', 'manager'] } };
        if (userFilter) personnelQuery.$and = [userFilter];
        const activePersonnel = await User.countDocuments(personnelQuery);

        // Get total incident reports
        let incQuery: any = {};
        if (incFilter) incQuery.$and = [incFilter];
        const totalIncidents = await IncidentReport.countDocuments(incQuery);

        // Get all alerts
        // For sub-admin, we filter by their assigned area
        const allAlerts = await alertProcessor.fetchAllAlerts();
        let filteredAlerts = allAlerts;

        if (session && session.user.role === 'sub-admin' && Object.keys(weatherLocFilter).length > 0) {
            const regex = weatherLocFilter.$or[0].affectedAreas.$regex;
            filteredAlerts = allAlerts.filter(alert => {
                const titleMatch = regex.test(alert.title || '');
                const descMatch = regex.test(alert.description || '');
                const areaMatch = (alert as any).affectedAreas?.some((area: string) => regex.test(area));
                return titleMatch || descMatch || areaMatch;
            });
        }

        const quakeAlerts = filteredAlerts.filter(a => a.source === AlertSource.EARTHQUAKE_API);
        const weatherAlerts = filteredAlerts.filter(a => a.source === AlertSource.WEATHER_API);
        const quakeCount = quakeAlerts.length;
        const weatherCount = weatherAlerts.length;
        const latestQuake = quakeAlerts[0]?.title || 'No recent impact';

        // Get AI Insight (Integrating OpenAI)
        const aiInsight = await openaiService.generateEmergencyInsights(weatherAlerts, quakeAlerts);
        const signals = openaiService.buildSignalsFromAlertSet(filteredAlerts, totalIncidents, safeUsers, totalUsers);

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
                // Additional stats for cards
                pendingSubAdmins: await User.countDocuments({ role: 'sub-admin', accountStatus: 'pending' }),
                approvedSubAdmins: await User.countDocuments({ role: 'sub-admin', accountStatus: 'approved' }),
                superAdmins: await User.countDocuments({ role: 'super-admin' }),
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
