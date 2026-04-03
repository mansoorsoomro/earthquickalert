import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        
        // Only sub-admins or those designated as operations authority can request
        const allowedRoles = ['sub-admin', 'observer', 'responder', 'manager', 'admin'];
        if (!allowedRoles.includes(session.user.role)) {
            return NextResponse.json({ error: 'Your role is not authorized to request an EOC license.' }, { status: 403 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.licenseId) {
            return NextResponse.json({ error: 'Account already has an active license' }, { status: 400 });
        }

        user.requestedLicense = true;
        await user.save();

        return NextResponse.json({ success: true, message: 'License request submitted to Super Admin.' });
    } catch (error) {
        console.error('Request license error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
