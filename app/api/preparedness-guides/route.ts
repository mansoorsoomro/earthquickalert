import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PreparednessGuide from '@/models/PreparednessGuide';

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
                    items: [
                        "Identify 2 evacuation routes at your home and places you frequently visit.",
                        "Develop a family communications plan, including adding contacts to the Ready2Go Are We Safe feature.",
                        "Designate an outdoor reunification meeting place and practice at least twice a year.",
                        "Create an emergency go bag for 72 hours including medicine, pet supplies, and essentials.",
                        "Store important financial documents (bank accounts, insurance) in your phone's contact section."
                    ]
                },
                {
                    category: 'community_evacuation',
                    title: 'Community Evacuation',
                    items: [
                        "Identify at least 2 evacuation routes from your community.",
                        "Ensure full tank of gas; local stations may run out during emergencies.",
                        "Take your emergency go bag.",
                        "Know pet-friendly hotels if evacuating with pets.",
                        "Secure your home and take valuables with you.",
                        "Be aware of community shelters if you cannot evacuate.",
                        "Take photos of your property for insurance purposes.",
                        "Bookmark FEMA's disaster assistance for post-disaster help."
                    ]
                },
                {
                    category: 'shelter_in_place',
                    title: 'General Shelter-in-Place',
                    items: [
                        "Identify 2 shelter locations indoors; if none available, choose the most secure room",
                        "Take shelter immediately if conditions worsen; share status via Ready2Go",
                        "Protect from severe weather hazards (tornado, high winds, hail)"
                    ]
                },
                {
                    category: 'active_shooter',
                    title: 'Active Shooter Preparedness',
                    items: [
                        "Identify evacuation and shelter-in-place locations",
                        "Discuss plan with family; test Ready2Go Are We Safe feature"
                    ]
                },
                {
                    category: 'pets_household',
                    title: 'Planning for Household Pets',
                    items: [
                        "3 days food/medicine supply",
                        "Microchip identification",
                        "Know pet-friendly shelters/hotels",
                        "Develop contingency plans"
                    ]
                },
                {
                    category: 'pets_large',
                    title: 'Planning for Large Animals',
                    items: [
                        "Inventory and health records",
                        "Unique identifiers, 1-week supplies",
                        "Evacuation arrangements, escape routes"
                    ]
                },
                {
                    category: 'identity_theft',
                    title: 'Identity Theft Protection',
                    items: [
                        "Secure Social Security card, provide info only when necessary",
                        "Review bank and credit statements regularly",
                        "Enable multi-factor authentication and mobile security",
                        "Install firewalls and keep antivirus software updated"
                    ]
                },
                {
                    category: 'choking_first_aid',
                    title: 'Choking First Aid',
                    items: [
                        "Recognition: Hands to throat",
                        "Recognition: Difficulty breathing",
                        "Recognition: Inability to talk",
                        "Prevention: Cut food small",
                        "Prevention: Supervise children",
                        "Prevention: Clear small objects"
                    ]
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
