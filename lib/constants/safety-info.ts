export interface SafetyInfo {
    title: string
    items: {
        subtitle: string
        content: string
    }[]
}

export const SAFETY_INFO: Record<string, SafetyInfo> = {
    evacuation: {
        title: 'General Evacuation Information',
        items: [
            {
                subtitle: 'Individual Evacuation',
                content: `• Identify 2 evacuation routes at your home and places you frequent
• Develop a communications plan with your family
• Identify outdoor reunification meeting place (practice 2x a year)
• Create an emergency go bag (72 hours of food/supplies)
• Store important financial info in your phone contacts`
            },
            {
                subtitle: 'Community or City-Wide Evacuation',
                content: `• Identify at least 2 evacuation routes from your community
• Keep a full tank of gas (local stations may run out)
• Take your emergency go bag
• Know pet-friendly hotels and local shelters
• Take pictures of your home for insurance records`
            }
        ]
    },
    shelter_in_place: {
        title: 'General Shelter in Place Information',
        items: [
            {
                subtitle: 'Preparation',
                content: `• Identify 2 good shelter-in-place locations (interior rooms, basements)
• If no good options, find a windowless secure room (closet/bathroom)
• Don't wait for instructions if events outside become severe
• Share your status via Ready2Go app`
            }
        ]
    },
    active_shooter: {
        title: 'Active Shooter Protocol',
        items: [
            {
                subtitle: 'Preparedness',
                content: `• Know your surroundings and listen to your gut instinct
• Identify 2 evacuation routes and hiding locations
• Discuss the plan with your family
• Test the "Are We Safe" feature in Ready2Go`
            },
            {
                subtitle: 'Action Guide',
                content: `• RUN: If you can get out, do
• HIDE: Windowless room, lock/barricade entry, silence phone
• FIGHT: As a last resort, attempt to incapacitate the shooter`
            }
        ]
    },
    pets: {
        title: 'Emergency Planning for Pets',
        items: [
            {
                subtitle: 'House Pets',
                content: `• 3 days' supply of food and medicine
• Microchip and nametag with updated contact info
• Know pet-friendly shelters and hotels`
            },
            {
                subtitle: 'Large Animals',
                content: `• Maintain inventory and health records
• week of food, supplies, and medication
• Place identifiers on them (phone number on collar/permanent marker)`
            }
        ]
    },
    identity_theft: {
        title: 'Personal Identity Theft',
        items: [
            {
                subtitle: 'Prevention',
                content: `• Secure your social security card
• Never provide unsolicited personal information
• Review financial statements carefully
• Install firewalls and anti-virus software`
            },
            {
                subtitle: 'If Victim',
                content: `• Report to Federal Trade Commission (IdentityTheft.gov)
• Report by phone at 1-877-438-4338`
            }
        ]
    },
    choking: {
        title: 'Choking Prevention & First Aid',
        items: [
            {
                subtitle: 'Signs of Choking',
                content: `• Hands clutched to throat (universal sign)
• Inability to talk or difficulty breathing
• Skin, lips, and nails turning blue`
            },
            {
                subtitle: 'Prevention in Children',
                content: `• Cut food into small pieces
• Keep small objects out of reach
• Always supervise young children while eating`
            }
        ]
    }
}
