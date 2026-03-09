import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PreparednessGuide from '@/models/PreparednessGuide';

const SEED_GUIDES = [
    {
        category: 'individual_evacuation',
        title: 'Individual Evacuation',
        items: [
            'Identify 2 evacuation routes at your home and places you frequently visit.',
            'Develop a family communications plan, including adding contacts to the Ready2Go "Are We Safe" feature.',
            'Designate an outdoor reunification meeting place and practice at least twice a year.',
            'Create an emergency go-bag for 72 hours including medicine, pet supplies, and essentials.',
            'Store important financial documents (bank accounts, insurance) in your phone\'s contact section.',
        ]
    },
    {
        category: 'community_evacuation',
        title: 'Community or City-Wide Evacuation',
        items: [
            'Identify at least 2 evacuation routes from your community.',
            'Ensure full tank of gas; local stations may run out during emergencies.',
            'Take your emergency go-bag.',
            'Know pet-friendly hotels if evacuating with pets.',
            'Secure your home and take valuables with you.',
            'Be aware of community shelters if you cannot evacuate.',
            'Take photos of your property for insurance purposes.',
            'Bookmark FEMA\'s disaster assistance for post-disaster help.',
        ]
    },
    {
        category: 'shelter_in_place',
        title: 'General Shelter-in-Place Information',
        items: [
            'Identify 2 shelter locations indoors; if none available, choose the most secure room.',
            'Take shelter immediately if conditions worsen; share status via Ready2Go.',
            'Protect from severe weather hazards (tornado, high winds, hail).',
        ]
    },
    {
        category: 'active_shooter',
        title: 'Active Shooter Preparedness',
        items: [
            'Identify evacuation and shelter-in-place locations.',
            'Discuss plan with family; test Ready2Go "Are We Safe" feature.',
        ]
    },
    {
        category: 'household_pets',
        title: 'Household Pets',
        items: [
            '3 days food/medicine supply',
            'Microchip identification',
            'Know pet-friendly shelters/hotels',
            'Develop contingency plans',
        ]
    },
    {
        category: 'large_animals',
        title: 'Large Animals',
        items: [
            'Inventory and health records',
            'Unique identifiers, 1-week supplies',
            'Evacuation arrangements, escape routes',
        ]
    },
    {
        category: 'identity_theft',
        title: 'Personal Identity Theft Protection',
        items: [
            'Secure Social Security card; provide info only when necessary.',
            'Review statements regularly.',
            'Enable mobile security features.',
            'Install firewalls and antivirus software.',
        ]
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
