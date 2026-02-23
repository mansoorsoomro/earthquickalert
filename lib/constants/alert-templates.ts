import { AlertType, AlertSeverity } from '@/lib/types/emergency'

export interface AlertTemplate {
    title: string
    type: AlertType
    severity: AlertSeverity
    message: string
}

export const ALERT_TEMPLATES: Record<string, AlertTemplate> = {
    blizzard_warning: {
        title: 'Blizzard Warning – Take Action',
        type: 'severe-weather',
        severity: 'critical',
        message: `Your geographic area is currently under a blizzard warning. This means heavy snow, high winds and or ice will impact your area during the warning timeframe. Immediately take action:
- Ensure enough medicine and food/water for duration of the storm
- Ensure pet have enough food/water and medicine if applicable
- Cancel all non-essential appointments and stay home
- Delay travel plans if able to
- Be prepared for power outages.
- Allow time for snow removal post storm
- Check-in with family/friends via Ready2Go’s are we safe feature

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    blizzard_watch: {
        title: 'Blizzard Watch – Get Prepared',
        type: 'severe-weather',
        severity: 'warning',
        message: `Your geographic area is currently under a blizzard watch. This means that blizzard conditions are expected within 48 hours. Immediately take the following steps to prepare for a blizzard:
- Prepared to be stranded in your home for the duration of the blizzard event
- Go to the store and stock up on essentials
- Fill your car with a tank of gas
- Ensure flashlights work and take out warm cloths/blankets so they are easily accessible in case of a power outage
- Charge all devices (cell phones, computers, tablets, etc.) incase of a power outage
- Check-in with family/friends via Ready2Go’s are we safe feature
- Prepare for travel delays and/or school/work closings

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    earthquake_warning: {
        title: 'Earthquake Warning – Take Action',
        type: 'earthquake',
        severity: 'critical',
        message: `Your geographic area is currently under an earthquake warning. This means that an earthquake is already in progress and aftershocks are expected. Immediately take the following actions:
- If inside, immediately drop, take cover protecting your head and neck and hang on until the shaking stops. Once the shaking stops, evacuate the building
- If outside get to an open area away from buildings, powerlines, etc. then proceed to drop, take cover protecting your head and neck and hang onto the ground until the shaking stops.
- If in a moving vehicle, immediately stop the vehicle preferably in an open area
- When the shaking stops, assess your space for any damage. If there is damage in the area, stay away until authorities say it is safe to enter
- Check-in with family/friends via Ready2Go’s are we safe feature
- Be prepared for aftershock

Click on the link (National Weather Service) for more information.`
    },
    extreme_heat: {
        title: 'Excessive Heat Warning – Take Action',
        type: 'severe-weather',
        severity: 'warning',
        message: `Your geographic area is currently under an excessive heat warning. This means dangerous heat conditions are or will be impacting your region within the next 12 hours. To prepare for excessive heat, consider the following:
- Stay indoors, proceed to community shelter if you are considered high risk for heat exhaustion and do not have air conditioning
- Drink plenty of fluids
- Limit outside physical activity during daylight hours

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    flood_warning: {
        title: 'Flood Warning – Take Action',
        type: 'flood',
        severity: 'warning',
        message: `Your geographic area is currently under a flood warning. Due to rain in the area, flooding is likely to occur if is have not already occurred. To prepare for flooding consider the following:
- Immediately evacuate to higher ground if you are in a flood prone area
- Seek shelter for the duration of the storm and avoid traveling through flood prone areas
- If you must travel, avoid flood prone roadways and NEVER attempt to cross a flooded road

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    flash_flood: {
        title: 'Flash Flood Warning – Take Action',
        type: 'flood',
        severity: 'critical',
        message: `Your geographic area is currently under a flash flood warning. Due to rain in the area, flash flooding is likely to occur if is have not already occurred. To prepare for flash floods consider the following:
- Stay away from riverbeds and other areas that are susceptible to flooding as flash floods happen quickly
- Avoid walking through flooded areas as six inches or less can knock you down
- Avoid driving through flooded areas as twelve inches of water can sweep your vehicle away
- If you must travel, avoid flood prone roadways and NEVER attempt to cross a flooded road

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    hurricane_watch: {
        title: 'Hurricane Watch – Be Prepared',
        type: 'hurricane',
        severity: 'watch',
        message: `Your geographic area is currently under a hurricane watch. This means a hurricane could possibly impact your location within 48 hours. This hurricane may bring dangerous winds exceeding 75 mph, heavy rain, frequent lightening and hail. To prepare for these types of storms consider the following:
- Know your evacuation route
- Proceed to hardware store and purchase supplies to prepare your home for high winds, heavy surf, etc.
- Proceed to gas station and fill vehicles up with gas
- If choose to evacuate, rule of thumb is to evacuate as far away inland as one tank of gas will get you
- If you decide not to evacuate, be prepared to be self-sufficient for up to 72 hours. I.e. go to the store and stock up on food, water and supplies. Be prepared for power outages.

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    hurricane_warning: {
        title: 'Hurricane Warning – Take Action',
        type: 'hurricane',
        severity: 'critical',
        message: `Your geographic area is currently under a hurricane warning. This means hurricane conditions are expected to impact your location within 36 hours. To prepare for these types of storms consider the following:
- Complete storm preparations: secure your home, fill your car up with gas, purchase extra food/water
- Immediately evacuate the threatened area if impacted community orders an evacuation order
- If you choose to stay, anticipate loss of power and/or water
- Bookmark FEMA’s disaster assistance https://www.disasterassistance.gov/ link to reference if your property incurs damage
- Take photos before and after photos and save all receipts for insurance purposes
- Be prepared to be self-sufficient for up to 72 hours post impact

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    shelter_in_place: {
        title: 'Shelter in Place Warning – Take Action',
        type: 'other',
        severity: 'critical',
        message: `Your geographic area is under a shelter in place warning. This means that conditions outside are hazardous to your life safety. Immediately take the following actions:
- Ensure that family members who are outside come inside
- Lock doors and proceed to an interior room, preferably without windows
- Check-in with family/friends via Ready2Go’s are we safe feature
- Tune into news sources for latest information
- Do not open doors to the exterior of your residence unless instructed to do so by law enforcement
- Stay there until authorities give the all clear

Click on the link (National Weather Service) to learn more about local conditions.`
    },
    tornado_watch: {
        title: 'Tornado Watch – Get Prepared',
        type: 'tornado',
        severity: 'watch',
        message: `Your geographic area is under a tornado watch. This means that tornados are possible for a set number of hours. This does not mean that they will occur. To prepare for a possible tornado:
- Stay alert for changing weather conditions throughout the duration of the watch
- Identify shelter in place locations
- Check flashlights and hand crank/battery powered radios
- Check-in with family/friends via Ready2Go’s are we safe feature

Click on the link (National Weather Service) to learn more about local weather conditions.`
    },
    tornado_warning: {
        title: 'Tornado Warning – Take Action',
        type: 'tornado',
        severity: 'critical',
        message: `Your geographic area is under a tornado warning. This means that a tornado is imminent. Immediately take the following actions:
- Seek immediate shelter. Preferable a windowless room
- Check-in with family/friends via Ready2Go’s are we safe feature
- Stay in your shelter in place location until the warning expires

Click on the link (National Weather Service) to learn more about local weather conditions.`
    }
}
