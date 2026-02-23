import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Get session from cookie
        const cookieStore = await cookies();
        const session = cookieStore.get('session');

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = await decrypt(session.value);
        if (!decoded || !decoded.user || !decoded.user.id) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        const { name, email, location } = await req.json();

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            decoded.user.id,
            { name, email, location, lastLocationUpdate: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                location: updatedUser.location,
            }
        });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
