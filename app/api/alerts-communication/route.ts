import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AlertCommunication from '@/models/AlertCommunication';

export async function GET() {
    try {
        await dbConnect();
        const data = await AlertCommunication.find({}).sort({ createdAt: -1 });
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const { id, status } = await request.json();
        const updated = await AlertCommunication.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
