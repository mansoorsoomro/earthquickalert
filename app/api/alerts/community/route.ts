import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CommunityAlert from '@/models/CommunityAlert';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();

        // Fetch active alerts (not expired)
        const now = new Date();
        const alerts = await CommunityAlert.find({
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: { $gt: now } }
            ]
        }).sort({ timestamp: -1 });

        return NextResponse.json({ success: true, data: alerts });
    } catch (error) {
        console.error('Community Alerts GET error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 });
        }

        const body = await request.json();
        const {
            severity,
            title,
            description,
            expiresAt,
            affectedAreas,
            priority,
            targetUsers
        } = body;

        const newAlert = await CommunityAlert.create({
            severity,
            title,
            description,
            expiresAt,
            affectedAreas,
            priority,
            targetUsers,
            adminName: session.user.name || 'Admin',
            adminEmail: session.user.email,
        });

        return NextResponse.json({ success: true, data: newAlert }, { status: 201 });
    } catch (error) {
        console.error('Community Alerts POST error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
