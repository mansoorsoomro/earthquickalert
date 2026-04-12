import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmergencyEvent from '@/models/EmergencyEvent';
import IncidentReport from '@/models/IncidentReport';
import WeatherAlertRecord from '@/models/WeatherAlertRecord';
import { openaiService } from '@/lib/services/openai-service';
import { getSession } from '@/lib/auth';
import { getSubAdminTextLocationFilter } from '@/lib/admin-filters';

export async function GET() {
    try {
        await connectDB();

        const session = await getSession();
        let eventFilter: any = null;
        let incFilter: any = null;

        if (session && session.user.role === 'sub-admin') {
            eventFilter = await getSubAdminTextLocationFilter(session.user.id, 'location.address');
            incFilter = await getSubAdminTextLocationFilter(session.user.id, 'location');
        }

        const recentIncidentQuery: any = { status: 'resolved' };
        if (eventFilter) recentIncidentQuery.$and = [eventFilter];

        // Find the most recently resolved incident to review
        const recentIncident: any = await EmergencyEvent.findOne(recentIncidentQuery)
            .sort({ updatedAt: -1 })
            .lean();

        if (!recentIncident) {
            return NextResponse.json({
                success: true,
                data: null
            });
        }

        // Format timeline events to match frontend styling
        const formattedEvents = (recentIncident.timeline || []).map((t: any, index: number) => {
            // Map timeline categories to UI colors
            let color = 'blue';
            let eventType = 'System Update';

            if (t.description.toLowerCase().includes('alert')) {
                color = 'red';
                eventType = 'Alert Issued';
            } else if (t.description.toLowerCase().includes('responder') || t.description.toLowerCase().includes('dispatched')) {
                color = 'blue';
                eventType = 'Responder Action';
            } else if (t.description.toLowerCase().includes('citizen') || t.description.toLowerCase().includes('report')) {
                color = 'green';
                eventType = 'Citizen Report';
            } else if (t.description.toLowerCase().includes('update') || t.description.toLowerCase().includes('system')) {
                color = 'purple';
                eventType = 'System Update';
            }

            return {
                id: index + 1,
                time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: eventType,
                title: t.description.length > 30 ? `${t.description.substring(0, 30)}...` : t.description,
                description: t.description,
                color,
            };
        });

        const incQuery: any = {
            createdAt: {
                $gte: new Date(recentIncident.createdAt),
                $lte: new Date(recentIncident.updatedAt),
            },
        };
        if (incFilter) incQuery.$and = [incFilter];

        const incidentReports = await IncidentReport.countDocuments(incQuery);

        const highSeverityAlerts = await WeatherAlertRecord.countDocuments({
            severity: { $in: ['high', 'severe', 'extreme'] },
            timestamp: {
                $gte: new Date(recentIncident.createdAt),
                $lte: new Date(recentIncident.updatedAt),
            },
        });

        const aiInsights = await openaiService.generateAfterActionInsights({
            incidentType: recentIncident.type,
            timelineEvents: Array.isArray(recentIncident.timeline) ? recentIncident.timeline.length : 0,
            incidentReports,
            highSeverityAlerts,
        });

        const aiInsightsWithCategories = aiInsights.map((insight, index) => {
            // Map existing categories or randomly assign for structured UI if not returned by AI
            let category = insight.category;
            if (index === 0) category = 'Summary';
            else if (insight.status === 'Addressed' || index === 1) category = 'What Went Well';
            else category = 'Areas for Improvement';

            return {
                ...insight,
                category,
                time: new Date(Date.now() - index * 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
        });

        // Format duration roughly based on dates
        const startTime = new Date(recentIncident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(recentIncident.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const incidentLocation = recentIncident.location?.address || recentIncident.location || 'Unknown Area';

        const mappedData = {
            id: recentIncident._id.toString(),
            name: `${recentIncident.type} - ${incidentLocation}`,
            type: recentIncident.type,
            duration: `${startTime} - ${endTime}`,
            insights: aiInsightsWithCategories.length,
            events: formattedEvents,
            aiInsights: aiInsightsWithCategories,
        };

        return NextResponse.json({
            success: true,
            data: mappedData
        });
    } catch (error) {
        console.error('Error fetching After Action Review:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch After Action Review data' }, { status: 500 });
    }
}
