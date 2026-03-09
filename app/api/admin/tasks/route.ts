import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import IncidentReport from '@/models/IncidentReport';
import EmergencyEvent from '@/models/EmergencyEvent';

export async function GET() {
    try {
        await dbConnect();

        // 1. Get stats for task logic
        const pendingIncidents = await IncidentReport.countDocuments({ status: { $ne: 'resolved' } });
        const activeEvents = await EmergencyEvent.countDocuments({ status: 'active' });

        // 2. Define dynamic tasks
        const tasks = [
            {
                id: 1,
                label: 'Collect Damage Reports',
                status: pendingIncidents > 0 ? `${pendingIncidents} pending` : 'All Verified',
                color: pendingIncidents > 0 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
            },
            {
                id: 2,
                label: 'Activate FEMA Resource Links',
                status: activeEvents > 0 ? 'Action Needed' : 'Ready',
                color: activeEvents > 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            },
            {
                id: 3,
                label: 'Update Status Notifications',
                status: activeEvents > 0 ? 'In Progress' : 'Idle',
                color: activeEvents > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
            },
            {
                id: 4,
                label: 'Prepare After-Action Summary',
                status: activeEvents === 0 && pendingIncidents > 0 ? 'Recommended' : 'Scheduled',
                color: activeEvents === 0 && pendingIncidents > 0 ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'
            },
        ];

        return NextResponse.json({ success: true, data: tasks });
    } catch (error) {
        console.error('Admin Tasks GET error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
