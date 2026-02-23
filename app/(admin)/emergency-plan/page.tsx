'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Edit } from 'lucide-react'

const PLANS: Record<string, { label: string; overview: string; steps: string[] }> = {
  hurricane_warning: {
    label: 'Hurricane Warning',
    overview: 'Your geographic area is currently under a hurricane warning. This means hurricane conditions are expected to impact your location within 36 hours.',
    steps: [
      'Complete storm preparations: secure your home, fill your car up with gas, purchase extra food/water',
      'Immediately evacuate the threatened area if impacted community orders an evacuation order',
      'If you choose to stay, anticipate loss of power and/or water',
      'Bookmark FEMA’s disaster assistance (https://www.disasterassistance.gov/) link to reference if your property incurs damage',
      'Take photos before and after photos and save all receipts for insurance purposes',
      'Be prepared to be self-sufficient for up to 72 hours post impact',
    ],
  },
  hurricane_watch: {
    label: 'Hurricane Watch',
    overview: 'Your geographic area is currently under a hurricane watch. This means a hurricane could possibly impact your location within 48 hours. This hurricane may bring dangerous winds exceeding 75 mph, heavy rain, frequent lightening and hail.',
    steps: [
      'Know your evacuation route',
      'Proceed to hardware store and purchase supplies to prepare your home for high winds, heavy surf, etc.',
      'Proceed to gas station and fill vehicles up with gas',
      'If choose to evacuate, rule of thumb is to evacuate as far away inland as one tank of gas will get you',
      'If you decide not to evacuate, be prepared to be self-sufficient for up to 72 hours. I.e. go to the store and stock up on food, water and supplies. Be prepared for power outages.',
    ],
  },
  tornado_warning: {
    label: 'Tornado Warning',
    overview: 'Your geographic area is under a tornado warning. This means that a tornado is imminent.',
    steps: [
      'Seek immediate shelter. Preferable a windowless room',
      'Check-in with family/friends via Ready2Go’s are we safe feature',
      'Stay in your shelter in place location until the warning expires',
    ],
  },
  tornado_watch: {
    label: 'Tornado Watch',
    overview: 'Your geographic area is under a tornado watch. This means that tornados are possible for a set number of hours. This does not mean that they will occur.',
    steps: [
      'Stay alert for changing weather conditions throughout the duration of the watch',
      'Identify shelter in place locations',
      'Check flashlights and hand crank/battery powered radios',
      'Check-in with family/friends via Ready2Go’s are we safe feature',
    ],
  },
  blizzard_warning: {
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
    ],
  },
  blizzard_watch: {
    label: 'Blizzard Watch',
    overview: 'Your geographic area is currently under a blizzard watch. This means that blizzard conditions are expected within 48 hours.',
    steps: [
      'Prepared to be stranded in your home for the duration of the blizzard event',
      'Go to the store and stock up on essentials',
      'Fill your car with a tank of gas',
      'Ensure flashlights work and take out warm cloths/blankets so they are easily accessible in case of a power outage',
      'Charge all devices (cell phones, computers, tablets, etc.) incase of a power outage',
      'Check-in with family/friends via Ready2Go’s are we safe feature',
      'Prepare for travel delays and/or school/work closings',
    ],
  },
  earthquake_warning: {
    label: 'Earthquake Warning',
    overview: 'Your geographic area is currently under an earthquake warning. This means that an earthquake is already in progress and aftershocks are expected.',
    steps: [
      'If inside, immediately drop, take cover protecting your head and neck and hang on until the shaking stops. Once the shaking stops, evacuate the building',
      'If outside get to an open area away from buildings, powerlines, etc. then proceed to drop, take cover protecting your head and neck and hang onto the ground until the shaking stops.',
      'If in a moving vehicle, immediately stop the vehicle preferably in an open area',
      'When the shaking stops, assess your space for any damage. If there is damage in the area, stay away until authorities say it is safe to enter',
      'Check-in with family/friends via Ready2Go’s are we safe feature',
      'Be prepared for aftershock',
    ],
  },
  excessive_heat_warning: {
    label: 'Excessive Heat Warning',
    overview: 'Your geographic area is currently under an excessive heat warning. This means dangerous heat conditions are or will be impacting your region within the next 12 hours.',
    steps: [
      'Stay indoors, proceed to community shelter if you are considered high risk for heat exhaustion and do not have air conditioning',
      'Drink plenty of fluids',
      'Limit outside physical activity during daylight hours',
    ],
  },
  flood_warning: {
    label: 'Flood Warning',
    overview: 'Your geographic area is currently under a flood warning. Due to rain in the area, flooding is likely to occur if is have not already occurred.',
    steps: [
      'Immediately evacuate to higher ground if you are in a flood prone area',
      'Seek shelter for the duration of the storm and avoid traveling through flood prone areas',
      'If you must travel, avoid flood prone roadways and NEVER attempt to cross a flooded road',
    ],
  },
  flash_flood_warning: {
    label: 'Flash Flood Warning',
    overview: 'Your geographic area is currently under a flash flood warning. Due to rain in the area, flash flooding is likely to occur if is have not already occurred.',
    steps: [
      'Stay away from riverbeds and other areas that are susceptible to flooding as flash floods happen quickly',
      'Avoid walking through flooded areas as six inches or less can knock you down',
      'Avoid driving through flooded areas as twelve inches of water can sweep your vehicle away',
      'If you must travel, avoid flood prone roadways and NEVER attempt to cross a flooded road',
    ],
  },
  shelter_in_place_warning: {
    label: 'Shelter in Place Warning',
    overview: 'Your geographic area is under a shelter in place warning. This means that conditions outside are hazardous to your life safety.',
    steps: [
      'Ensure that family members who are outside come inside',
      'Lock doors and proceed to an interior room, preferably without windows',
      'Check-in with family/friends via Ready2Go’s are we safe feature',
      'Tune into news sources for latest information',
      'Do not open doors to the exterior of your residence unless instructed to do so by law enforcement',
      'Stay there until authorities give the all clear',
    ],
  },
}

export default function EmergencyPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState('hurricane_warning')
  const [aiAssistance, setAiAssistance] = useState(true)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const currentPlan = PLANS[selectedPlan] || PLANS.hurricane_warning

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Emergency Plan</h1>
        <p className="text-gray-600">This will be the community’s emergency plan. Recommend transitioning away from individual emergency plans and shift to just in time actions to take.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Emergency Overview</h2>
        <div className="flex items-start justify-between">
          <Alert className="bg-red-50 border-red-200 w-full">
            <AlertDescription className="text-red-800">
              {currentPlan.overview}
            </AlertDescription>
          </Alert>
          <button aria-label="Edit overview" className="ml-3 inline-flex items-center justify-center p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50">
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Actionable Safety Steps</h2>
          <div className="flex items-center gap-4">
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value)
                setCheckedItems({})
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {Object.entries(PLANS).map(([id, plan]) => (
                <option key={id} value={id}>{plan.label}</option>
              ))}
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Audience Selection</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-sm">AI Assistance</span>
              <Switch checked={aiAssistance} onCheckedChange={(v) => setAiAssistance(!!v)} aria-label="AI Assistance" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {currentPlan.steps.map((step, index) => (
            <label key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={checkedItems[index] || false}
                onChange={() => toggleCheck(index)}
                className="mt-1 w-4 h-4 border-gray-300 rounded"
              />
              <span className={checkedItems[index] ? 'line-through text-gray-500' : 'text-gray-700'}>
                {step}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button className="bg-white border border-gray-200 text-gray-700">Add</Button>
          <Button className="bg-slate-800 text-white">Send</Button>
        </div>
      </Card>
    </main>
  )
}
