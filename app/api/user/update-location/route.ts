import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { location } = await req.json();

        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findByIdAndUpdate(
            session.user.id,
            {
                location,
                lastLocationUpdate: new Date()
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
                isSafe: user.isSafe
            }
        });
    } catch (error) {
        console.error('Update location error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
