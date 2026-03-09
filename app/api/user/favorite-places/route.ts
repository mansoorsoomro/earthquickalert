import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const session = await getSession();

        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user.favoritePlaces || [] });
    } catch (error: any) {
        console.error('Error fetching favorite places:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, address, coordinates, icon } = body;

        if (!name || !address || !coordinates) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            {
                $push: {
                    favoritePlaces: {
                        name,
                        address,
                        coordinates,
                        icon: icon || 'MapPin',
                        createdAt: new Date(),
                    }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const newPlace = updatedUser.favoritePlaces[updatedUser.favoritePlaces.length - 1];

        return NextResponse.json({ success: true, data: newPlace });
    } catch (error: any) {
        console.error('Error creating favorite place:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
