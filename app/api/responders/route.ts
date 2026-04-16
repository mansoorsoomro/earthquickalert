import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Responder from '@/models/Responder';

export async function GET() {
    try {
        await dbConnect();
        let data = await Responder.find({}).sort({ createdAt: -1 });

        // Seed mock data if empty
        if (data.length === 0) {
            const mockResponders = [
                {
                    name: "Squad 42 - Fire & Rescue",
                    type: "Fire",
                    status: "Active",
                    location: "Downtown Station",
                    city: "Los Angeles",
                    availability: true,
                    contact: "+1-555-0101",
                    coordinates: { lat: 34.0522, lng: -118.2437 }
                },
                {
                    name: "Metro Police Unit 12",
                    type: "Police",
                    status: "Active",
                    location: "North sector",
                    city: "New York",
                    availability: true,
                    contact: "+1-555-0102",
                    coordinates: { lat: 40.7128, lng: -74.0060 }
                },
                {
                    name: "EMS Critical Care Team 5",
                    type: "EMS",
                    status: "Standby",
                    location: "Central Hospital",
                    city: "Chicago",
                    availability: true,
                    contact: "+1-555-0103",
                    coordinates: { lat: 41.8781, lng: -87.6298 }
                },
                {
                    name: "Hazmat Response Team Alpha",
                    type: "Hazmat",
                    status: "Active",
                    location: "Industrial Zone",
                    city: "Houston",
                    availability: false,
                    contact: "+1-555-0104",
                    coordinates: { lat: 29.7604, lng: -95.3698 }
                }
            ];
            await Responder.insertMany(mockResponders);
            data = await Responder.find({}).sort({ createdAt: -1 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newData = await Responder.create(body);
        return NextResponse.json(newData, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
