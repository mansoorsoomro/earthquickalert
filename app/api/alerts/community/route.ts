import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CommunityAlert from '@/models/CommunityAlert';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { notificationService, NotificationChannel } from '@/lib/services/notification-service';
import { locationMatchesAlertAreas } from '@/lib/services/location-matching';

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
            targetUsers,
            channels,
            isPinned,
        } = body;

        const normalizedChannels: NotificationChannel[] = Array.isArray(channels) && channels.length > 0
            ? channels.filter((value: string): value is NotificationChannel => ['push', 'sms', 'email'].includes(value))
            : ['push', 'sms', 'email'];

        const newAlert = await CommunityAlert.create({
            severity,
            title,
            description,
            expiresAt,
            affectedAreas,
            priority,
            targetUsers,
            isPinned: isPinned === true,
            adminName: session.user.name || 'Admin',
            adminEmail: session.user.email,
        });

        const users = await User.find({ role: 'user' }).lean();
        const explicitTargets = Array.isArray(targetUsers)
            ? targetUsers.map((value: any) => String(value).toLowerCase())
            : [];

        const userIds = users
            .filter((user: any) => {
                if (explicitTargets.length > 0 && !explicitTargets.includes('broadcast') && !explicitTargets.includes('all')) {
                    return explicitTargets.includes(String(user._id).toLowerCase()) ||
                        explicitTargets.includes(String(user.email || '').toLowerCase());
                }

                if (Array.isArray(affectedAreas) && affectedAreas.length > 0) {
                    const userAreas = [
                        user.location,
                        ...(Array.isArray(user.familyMembers) ? user.familyMembers.map((member: any) => member.location) : []),
                    ].filter(Boolean) as string[];

                    return userAreas.some(location =>
                        locationMatchesAlertAreas(location, affectedAreas)
                    );
                }

                return true;
            })
            .map((user: any) => String(user._id));

        for (const userId of userIds) {
            await notificationService.sendUserNotification(
                userId,
                `Community Alert: ${title}`,
                description,
                normalizedChannels,
                {
                    alertId: newAlert._id,
                    affectedAreas,
                    priority,
                }
            );
        }

        return NextResponse.json({
            success: true,
            data: newAlert,
            deliveredToUsers: userIds.length,
            channels: normalizedChannels,
        }, { status: 201 });
    } catch (error) {
        console.error('Community Alerts POST error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
