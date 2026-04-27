import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PreparednessGuide from '@/models/PreparednessGuide';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        let guides = await PreparednessGuide.find({});

        // If no guides exist, seed with default data
        if (guides.length === 0) {
            const defaultGuides = [
                {
                    category: 'individual_evacuation',
                    title: 'Individual Evacuation',
                    items: []
                },
                {
                    category: 'community_evacuation',
                    title: 'Community Evacuation',
                    items: []
                },
                {
                    category: 'shelter_in_place',
                    title: 'General Shelter-in-Place',
                    items: []
                },
                {
                    category: 'active_shooter',
                    title: 'Active Shooter Preparedness',
                    items: []
                },
                {
                    category: 'pets_household',
                    title: 'Planning for Household Pets',
                    items: []
                },
                {
                    category: 'pets_large',
                    title: 'Planning for Large Animals',
                    items: []
                },
                {
                    category: 'identity_theft',
                    title: 'Identity Theft Protection',
                    items: []
                },
                {
                    category: 'choking_first_aid',
                    title: 'Choking First Aid',
                    items: []
                }
            ];

            await PreparednessGuide.insertMany(defaultGuides);
            guides = await PreparednessGuide.find({});
        }

        return NextResponse.json(guides);
    } catch (error: any) {
        console.error('Error fetching preparedness guides:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { category, title, items } = body;

        const guide = await PreparednessGuide.findOneAndUpdate(
            { category },
            { title, items },
            { new: true, upsert: true }
        );

        return NextResponse.json(guide);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        if (!category) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        await PreparednessGuide.deleteOne({ category });
        return NextResponse.json({ message: 'Guide deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
