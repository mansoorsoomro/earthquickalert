import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import License from '@/models/License';
import EOCSettings from '@/models/EOCSettings';
import { getSession } from '@/lib/auth';
import User from '@/models/User';

export async function PUT(req: NextRequest, context: any) {
    try {
        await connectDB();
        const session = await getSession();
        
        // Due to Next.js 15+ async params, we must await context.params
        const params = await context.params;
        const licenseId = params.licenseId;

        if (!session || !session.user || session.user.role !== 'sub-admin') {
            return NextResponse.json({ error: 'Unauthorized. Setup requires sub-admin role.' }, { status: 401 });
        }

        // Make sure the calling user actually owns this license setup
        const user = await User.findById(session.user.id);
        if (user.licenseId?.toString() !== licenseId) {
             return NextResponse.json({ error: 'You do not own this License Configuration.' }, { status: 403 });
        }

        const { geographicBoundaries, thresholds, oneMinutePollingEvents } = await req.json();

        // 1. Update the License with the chosen geographic area
        // Valid GeoJSON Polygon expectations
        const license = await License.findById(licenseId);
        if (!license) return NextResponse.json({ error: 'License missing' }, { status: 404 });

        license.geographicBoundaries = geographicBoundaries;
        await license.save();

        // 2. Update EOCSettings with the client's custom thresholds
        await EOCSettings.findOneAndUpdate(
             { licenseId: licenseId },
             { 
                 activationThresholds: thresholds,
                 'pollingIntervals.eventTypesForOneMinute': oneMinutePollingEvents
             },
             { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, message: 'Setup Complete!' });

    } catch (error: any) {
        console.error('Wizard setup error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
