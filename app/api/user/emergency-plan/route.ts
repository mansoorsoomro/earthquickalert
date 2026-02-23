import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            emergencyContacts: user.emergencyContacts || [],
            supplyKit: user.supplyKit || [],
            meetingPoints: user.meetingPoints || [],
            preparednessChecklist: user.preparednessChecklist || []
        });
    } catch (error) {
        console.error('Emergency Plan GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, data } = body;

        const update: any = {};
        if (type === 'contacts') update.emergencyContacts = data;
        if (type === 'kit') update.supplyKit = data;
        if (type === 'meeting') update.meetingPoints = data;
        if (type === 'preparedness') update.preparednessChecklist = data;

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: update },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            emergencyContacts: user.emergencyContacts,
            supplyKit: user.supplyKit,
            meetingPoints: user.meetingPoints,
            preparednessChecklist: user.preparednessChecklist
        });
    } catch (error) {
        console.error('Emergency Plan POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
