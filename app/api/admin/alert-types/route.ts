import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WeatherAlertTypeConfig from '@/models/WeatherAlertTypeConfig';
import EOCSettings from '@/models/EOCSettings';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();

        let config = await WeatherAlertTypeConfig.findOne().lean();
        if (!config) {
            config = await WeatherAlertTypeConfig.create({ events: [] }).then(doc => doc.toObject());
        }

        return NextResponse.json({
            success: true,
            data: {
                events: ((config as any).events || []).sort((a: any, b: any) => a.name.localeCompare(b.name)),
            },
        });
    } catch (error) {
        console.error('Error fetching weather alert types:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch weather alert types' },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'super-admin' || session?.user?.role === 'sub-admin';

        if (!session || !isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized - Administrative access required' },
                { status: 401 },
            );
        }

        const body = await req.json();
        const events = Array.isArray(body.events) ? body.events : [];
        const reactivateNws = body.reactivateNws === true;

        const sanitizedEvents = events
            .filter((e: any) => e && typeof e.name === 'string')
            .map((e: any) => ({
                name: e.name,
                enabled: typeof e.enabled === 'boolean' ? e.enabled : true,
                sendPush: typeof e.sendPush === 'boolean' ? e.sendPush : false,
                sendSms: typeof e.sendSms === 'boolean' ? e.sendSms : false,
                sendEmail: typeof e.sendEmail === 'boolean' ? e.sendEmail : false,
                invalid: typeof e.invalid === 'boolean' ? e.invalid : false,
                lastSeenAt: e.lastSeenAt ? new Date(e.lastSeenAt) : undefined,
            }));

        const updated = await WeatherAlertTypeConfig.findOneAndUpdate(
            {},
            { $set: { events: sanitizedEvents } },
            { upsert: true, new: true, runValidators: true },
        ).lean();

        if (reactivateNws) {
            await EOCSettings.findOneAndUpdate(
                {},
                { $set: { 'alertFeeds.nws': true } },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                events: (updated as any).events || [],
            },
            nwsFeedReactivated: reactivateNws,
        });
    } catch (error) {
        console.error('Error saving weather alert types:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save weather alert types' },
            { status: 500 },
        );
    }
}
