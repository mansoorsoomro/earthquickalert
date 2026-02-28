'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

const PLANS: Record<string, { label: string; overview: string; steps: string[] }> = {
  hurricane_warning: {
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
    <main className="p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen">
      {/* Header Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden p-6 md:px-8 md:py-7">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency Plan</h1>
        <p className="text-slate-600 text-[15px]">Timely guidance and just-in-time actions for your community during emergencies.</p>
      </div>

      {/* Overview Container */}
      <Card className="p-6 md:p-8 border border-slate-200 shadow-sm rounded-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Emergency Overview</h2>

        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center justify-between text-slate-700">
          <p className="font-medium text-[15px] max-w-[90%]">{currentPlan.overview}</p>
          <button className="text-slate-500 hover:text-slate-800 transition-colors p-1" aria-label="Edit overview">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Actionable Safety Steps Container */}
      <Card className="p-6 md:p-8 border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-bold text-slate-900">Actionable Safety Steps</h2>

          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value)
                setCheckedItems({})
              }}
              className="border border-slate-200 rounded-md py-1.5 px-3 text-sm text-slate-700 bg-white outline-none focus:border-slate-400"
            >
              {Object.entries(PLANS).map(([id, plan]) => (
                <option key={id} value={id}>{plan.label}</option>
              ))}
            </select>

            <select className="border border-slate-200 rounded-md py-1.5 px-3 text-sm text-slate-700 bg-white outline-none focus:border-slate-400">
              <option>Audience Selection</option>
            </select>

            <div className="flex items-center gap-3 ml-2">
              <span className="text-[13px] font-bold text-slate-900">AI Assistance</span>
              <button
                onClick={() => setAiAssistance(!aiAssistance)}
                className={`w-11 h-6 rounded-full relative transition-colors ${aiAssistance ? 'bg-slate-700' : 'bg-slate-300'}`}
                aria-label="Toggle AI Assistance"
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${aiAssistance ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {currentPlan.steps.map((step, idx) => (
            <label
              key={idx}
              className="flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/50 transition-colors group cursor-pointer"
            >
              <div className="relative flex items-start mt-0.5">
                <input
                  type="checkbox"
                  checked={checkedItems[idx] || false}
                  onChange={() => toggleCheck(idx)}
                  className="peer appearance-none w-4 h-4 min-w-[1rem] border-2 border-slate-400 rounded-sm bg-white checked:bg-slate-700 checked:border-slate-700 transition-colors cursor-pointer"
                />
                <svg
                  className="absolute inset-0 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className={`text-[14px] leading-snug transition-colors ${checkedItems[idx] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {step}
              </p>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" className="px-8 bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold border-0">
            Add
          </Button>
          <Button className="px-8 bg-[#2d325a] hover:bg-[#1a1d36] text-white font-semibold">
            Send
          </Button>
        </div>
      </Card>
    </main>
  )
}
