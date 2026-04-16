import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import AlertSentEmergency from '@/models/AlertSentEmergency';
import { getSession } from '@/lib/auth';
import { notificationService } from '@/lib/services/notification-service';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        // Security check: Only Super Admin can dispatch national alerts
        if (!session || session.user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized. Super-Admin access only.' }, { status: 403 });
        }

        const { alertType, channels, message, context } = await req.json();

        if (!alertType || !message || !channels || channels.length === 0) {
            return NextResponse.json({ error: 'Alert type, message, and at least one channel are required.' }, { status: 400 });
        }

        // 1. Create the alert record in Dashboard C (AlertSentEmergency)
        const newAlert = await AlertSentEmergency.create({
            name: alertType,
            location: 'National Dispatch',
            city: 'All Territories',
            time: new Date().toLocaleTimeString(),
            status: alertType.toLowerCase().includes('warning') ? 'Critical' : 'High',
            description: message,
        });

        // 2. Fetch all active users for broadcasing
        const allUsers = await User.find({ role: 'user' }).select('_id email').lean();

        if (allUsers.length > 0) {
            // 3. Dispatch notifications in bulk (using the service)
            const notificationPromises = allUsers.map(user => 
                notificationService.sendUserNotification(
                    (user as any)._id.toString(),
                    `NATIONAL ALERT: ${alertType}`,
                    message,
                    channels,
                    { alertId: newAlert._id, alertType, isNational: true }
                )
            );

            // Execute broadcasts (promise-based to avoid blocking too long, though ideally this would be backgrounded)
            Promise.all(notificationPromises).catch(err => 
                console.error('Bulk notification dispatch error:', err)
            );
        }

        return NextResponse.json({ 
            success: true, 
            message: `National alert dispatched successfully to ${allUsers.length} users.`,
            alert: newAlert,
            recipientCount: allUsers.length
        });
    } catch (error: any) {
        console.error('National alert dispatch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
