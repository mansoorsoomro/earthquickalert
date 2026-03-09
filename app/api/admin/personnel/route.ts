import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import EmergencyEvent from '@/models/EmergencyEvent';

export async function GET() {
    try {
        await connectDB();

        // 1. Admin and manager users — decision makers
        const adminUsersRaw = await User.find(
            { role: { $in: ['admin', 'manager'] } },
            'name email role'
        ).lean();

        const adminUsers = adminUsersRaw.map((u: any) => ({
            id: u._id.toString(),
            name: u.name || u.email,
            role: u.role === 'admin' ? 'System Administrator' : 'Operations Manager',
            org: 'Emergency Management Agency',
            access: true,
            incidentRole: u.role === 'admin' ? 'Incident Commander' : 'Operations Section Chief',
        }));

        // 2. Active responders — field personnel
        const respondersRaw = await User.find(
            { role: 'responder' },
            'name email role location'
        ).lean();

        // Get the most recent active/monitoring event for assignment label
        const currentEvent = await EmergencyEvent.findOne(
            { status: { $in: ['active', 'monitoring'] } }
        ).sort({ createdAt: -1 }).lean() as any;

        const incidentLabel = currentEvent
            ? `${currentEvent.type} – ${new Date(currentEvent.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}`
            : 'Standby';

        const activePersonnel = respondersRaw.map((r: any) => ({
            id: r._id.toString(),
            name: r.name || r.email,
            role: 'Field Responder',
            agency: 'Emergency Response Unit',
            incident: incidentLabel,
            status: 'Active',
        }));

        return NextResponse.json({
            success: true,
            data: { adminUsers, activePersonnel },
        });
    } catch (error) {
        console.error('Error fetching personnel:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch personnel' },
            { status: 500 }
        );
    }
}
