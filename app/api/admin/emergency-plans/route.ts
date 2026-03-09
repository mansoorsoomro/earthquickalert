import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmergencyPlan from '@/models/EmergencyPlan';

// Seed data based on existing page.tsx static const
const SEED_PLANS = [
    {
        planId: 'hurricane_warning',
        label: 'Hurricane Warning',
        overview: 'Your geographic area is currently under a hurricane warning. Conditions are expected to impact your location within 36 hours.',
        steps: [
            'Complete storm preparations – secure doors, windows, and loose items; fill your car with gas; purchase extra food and water.',
            'Be prepared to be self-sufficient for up to 72 hours post impact.',
            'Follow evacuation orders immediately if issued by local authorities.',
            'If staying at home, anticipate loss of power, water, and communications.',
            'Take photos of property and possessions before the storm and save receipts for insurance purposes.',
            'Secure important documents – passports, insurance papers, medical records in waterproof bags.',
            'Prepare an emergency kit – first aid, flashlight, batteries, medications, hygiene products, and blankets.',
            'Stay informed – monitor local news, weather updates, and community alerts.',
            'Have a family communication plan – designate a meeting place and emergency contacts.',
            'Check on neighbors, especially the elderly or those with special needs.',
            'Safeguard pets – ensure you have food, water, and shelter for animals.',
            'Keep emergency contact numbers handy, including local authorities, hospitals, and disaster assistance.',
            'Bookmark FEMA\'s disaster assistance: https://www.disasterassistance.gov for post-storm support.',
        ]
    },
    {
        planId: 'hurricane_watch',
        label: 'Hurricane Watch',
        overview: 'Your geographic area is currently under a hurricane watch. This means a hurricane could possibly impact your location within 48 hours.',
        steps: [
            'Know your evacuation route',
            'Proceed to hardware store and purchase supplies to prepare your home for high winds, heavy surf, etc.',
            'Proceed to gas station and fill vehicles up with gas',
            'If choose to evacuate, rule of thumb is to evacuate as far away inland as one tank of gas will get you',
            'If you decide not to evacuate, be prepared to be self-sufficient for up to 72 hours. I.e. go to the store and stock up on food, water and supplies. Be prepared for power outages.',
        ]
    },
    {
        planId: 'tornado_warning',
        label: 'Tornado Warning',
        overview: 'Your geographic area is under a tornado warning. This means that a tornado is imminent.',
        steps: [
            'Seek immediate shelter. Preferable a windowless room',
            'Check-in with family/friends via Ready2Go’s are we safe feature',
            'Stay in your shelter in place location until the warning expires',
        ]
    },
    {
        planId: 'tornado_watch',
        label: 'Tornado Watch',
        overview: 'Your geographic area is under a tornado watch. This means that tornados are possible for a set number of hours. This does not mean that they will occur.',
        steps: [
            'Stay alert for changing weather conditions throughout the duration of the watch',
            'Identify shelter in place locations',
            'Check flashlights and hand crank/battery powered radios',
            'Check-in with family/friends via Ready2Go’s are we safe feature',
        ]
    },
    {
        planId: 'blizzard_warning',
        label: 'Blizzard Warning',
        overview: 'Your geographic area is currently under a blizzard warning. This means heavy snow, high winds and or ice will impact your area during the warning timeframe.',
        steps: [
            'Ensure enough medicine and food/water for duration of the storm',
            'Ensure pet have enough food/water and medicine if applicable',
            'Cancel all non-essential appointments and stay home',
            'Delay travel plans if able to',
            'Be prepared for power outages.',
            'Allow time for snow removal post storm',
            'Check-in with family/friends via Ready2Go’s are we safe feature',
        ]
    },
    {
        planId: 'earthquake_warning',
        label: 'Earthquake Warning',
        overview: 'Your geographic area is currently under an earthquake warning. This means that an earthquake is already in progress and aftershocks are expected.',
        steps: [
            'If inside, immediately drop, take cover protecting your head and neck and hang on until the shaking stops. Once the shaking stops, evacuate the building',
            'If outside get to an open area away from buildings, powerlines, etc. then proceed to drop, take cover protecting your head and neck and hang onto the ground until the shaking stops.',
            'If in a moving vehicle, immediately stop the vehicle preferably in an open area',
            'When the shaking stops, assess your space for any damage. If there is damage in the area, stay away until authorities say it is safe to enter',
            'Check-in with family/friends via Ready2Go’s are we safe feature',
            'Be prepared for aftershock',
        ]
    },
    {
        planId: 'excessive_heat_warning',
        label: 'Excessive Heat Warning',
        overview: 'Your geographic area is currently under an excessive heat warning. This means dangerous heat conditions are or will be impacting your region within the next 12 hours.',
        steps: [
            'Stay indoors, proceed to community shelter if you are considered high risk for heat exhaustion and do not have air conditioning',
            'Drink plenty of fluids',
            'Limit outside physical activity during daylight hours',
        ]
    },
    {
        planId: 'flood_warning',
        label: 'Flood Warning',
        overview: 'Your geographic area is currently under a flood warning. Due to rain in the area, flooding is likely to occur if is have not already occurred.',
        steps: [
            'Immediately evacuate to higher ground if you are in a flood prone area',
            'Seek shelter for the duration of the storm and avoid traveling through flood prone areas',
            'If you must travel, avoid flood prone roadways and NEVER attempt to cross a flooded road',
        ]
    },
    {
        planId: 'shelter_in_place_warning',
        label: 'Shelter in Place Warning',
        overview: 'Your geographic area is under a shelter in place warning. This means that conditions outside are hazardous to your life safety.',
        steps: [
            'Ensure that family members who are outside come inside',
            'Lock doors and proceed to an interior room, preferably without windows',
            'Check-in with family/friends via Ready2Go’s are we safe feature',
            'Tune into news sources for latest information',
            'Do not open doors to the exterior of your residence unless instructed to do so by law enforcement',
            'Stay there until authorities give the all clear',
        ]
    }
]

export async function GET() {
    try {
        await connectDB();

        // 1. Fetch
        let plans = await EmergencyPlan.find().lean();

        // 2. Automate seed if empty (First boot)
        if (plans.length === 0) {
            console.log("Seeding Emergency Plans into MongoDB...");
            await EmergencyPlan.insertMany(SEED_PLANS);
            plans = await EmergencyPlan.find().lean();
        }

        // 3. Format into a record dictionary directly compatible with the frontend logic
        const formattedPlans: Record<string, any> = {};
        for (const p of plans as any[]) {
            formattedPlans[p.planId] = {
                id: p._id.toString(),
                label: p.label,
                overview: p.overview,
                steps: p.steps
            }
        }

        return NextResponse.json({
            success: true,
            data: formattedPlans
        });
    } catch (error) {
        console.error('Error fetching emergency plans:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch emergency plans' }, { status: 500 });
    }
}
