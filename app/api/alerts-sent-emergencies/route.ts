import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AlertSentEmergency from '@/models/AlertSentEmergency';

export async function GET() {
    try {
        await dbConnect();
        const data = await AlertSentEmergency.find({}).sort({ createdAt: -1 });
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newData = await AlertSentEmergency.create(body);
        return NextResponse.json(newData, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
