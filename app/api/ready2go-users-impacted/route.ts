import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ready2GoUserImpacted from '@/models/Ready2GoUserImpacted';

export async function GET() {
    try {
        await dbConnect();
        const data = await Ready2GoUserImpacted.find({}).sort({ createdAt: -1 });
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newData = await Ready2GoUserImpacted.create(body);
        return NextResponse.json(newData, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
