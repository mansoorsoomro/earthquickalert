import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EOCSettings from '@/models/EOCSettings';
import { getSession } from '@/lib/auth';

const DEFAULT_SETTINGS = {
    activationType: 'all',
    customSeverities: {
        minor: false,
        moderate: false,
        major: false,
        catastrophic: false,
    },
    alertFeeds: {
        nws: true,
        local: true,
        other: true,
    },
};

export async function GET() {
    try {
        await connectDB();

        let settings = await EOCSettings.findOne().lean();

        // Return defaults if no settings saved yet
        if (!settings) {
            return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
        }

        return NextResponse.json({
            success: true,
            data: {
                activationType: (settings as any).activationType,
                customSeverities: (settings as any).customSeverities,
                alertFeeds: (settings as any).alertFeeds,
            },
        });
    } catch (error) {
        console.error('Error fetching EOC settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch EOC settings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await getSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 });
        }

        const body = await req.json();
        const { activationType, customSeverities, alertFeeds } = body;

        // Upsert — create if none exists, update if one does
        const updated = await EOCSettings.findOneAndUpdate(
            {},
            { $set: { activationType, customSeverities, alertFeeds } },
            { upsert: true, new: true, runValidators: true }
        ).lean();

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error saving EOC settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to save EOC settings' }, { status: 500 });
    }
}
