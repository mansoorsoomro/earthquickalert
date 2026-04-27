import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PreparednessGuide from '@/models/PreparednessGuide';

export const dynamic = 'force-dynamic';

const SEED_GUIDES = [
    {
        category: 'individual_evacuation',
        title: 'Individual Evacuation',
        items: []
    },
    {
        category: 'community_evacuation',
        title: 'Community or City-Wide Evacuation',
        items: []
    },
    {
        category: 'shelter_in_place',
        title: 'General Shelter-in-Place Information',
        items: []
    },
    {
        category: 'active_shooter',
        title: 'Active Shooter Preparedness',
        items: []
    },
    {
        category: 'household_pets',
        title: 'Household Pets',
        items: []
    },
    {
        category: 'large_animals',
        title: 'Large Animals',
        items: []
    },
    {
        category: 'identity_theft',
        title: 'Personal Identity Theft Protection',
        items: []
    }
]

export async function GET() {
    try {
        await connectDB();

        // 1. Fetch
        let guides = await PreparednessGuide.find().lean();

        // 2. Automate seed if empty
        if (guides.length === 0) {
            console.log("Seeding Preparedness Guides into MongoDB...");
            await PreparednessGuide.insertMany(SEED_GUIDES);
            guides = await PreparednessGuide.find().lean();
        }

        // 3. Format for UI mapping
        const formattedGuides: Record<string, any> = {};
        for (const g of guides as any[]) {
            formattedGuides[g.category] = {
                id: g._id.toString(),
                title: g.title,
                items: g.items
            }
        }

        return NextResponse.json({
            success: true,
            data: formattedGuides
        });
    } catch (error) {
        console.error('Error fetching preparedness guides:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch preparedness guides' }, { status: 500 });
    }
}
