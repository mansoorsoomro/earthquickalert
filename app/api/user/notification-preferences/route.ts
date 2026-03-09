import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const session = await getSession();

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(session.user.id)
            .select('notificationPreferences phoneNumber email')
            .lean();

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                phoneNumber: (user as any).phoneNumber || '',
                email: (user as any).email || '',
                notificationPreferences: {
                    push: (user as any).notificationPreferences?.push !== false,
                    sms: (user as any).notificationPreferences?.sms !== false,
                    email: (user as any).notificationPreferences?.email !== false,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notification preferences' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const prefs = body.notificationPreferences || {};
        const phoneNumber = typeof body.phoneNumber === 'string' ? body.phoneNumber.trim() : undefined;

        const updated = await User.findByIdAndUpdate(
            session.user.id,
            {
                ...(phoneNumber !== undefined ? { phoneNumber } : {}),
                notificationPreferences: {
                    push: prefs.push !== false,
                    sms: prefs.sms !== false,
                    email: prefs.email !== false,
                },
            },
            { new: true, runValidators: true }
        )
            .select('notificationPreferences phoneNumber email')
            .lean();

        if (!updated) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                phoneNumber: (updated as any).phoneNumber || '',
                email: (updated as any).email || '',
                notificationPreferences: (updated as any).notificationPreferences || {
                    push: true,
                    sms: true,
                    email: true,
                },
            },
        });
    } catch (error) {
        console.error('Error saving notification preferences:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save notification preferences' },
            { status: 500 }
        );
    }
}

