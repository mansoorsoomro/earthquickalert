'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Edit } from 'lucide-react'

export default function EmergencyPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState('hurricane')
  const [aiAssistance, setAiAssistance] = useState(true)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const safetySteps = [
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
  ]

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
        <p className="text-gray-600">Timely guidance and just-in-time actions for your community during emergencies.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Emergency Overview</h2>
        <div className="flex items-start justify-between">
          <Alert className="bg-red-50 border-red-200 w-full">
            <AlertDescription className="text-red-800">
              Your geographic area is currently under a hurricane warning. Conditions are expected to impact your location within 36 hours.
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
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="hurricane">Select Emergency Plan</option>
                <option value="tornado">Tornado Plan</option>
                <option value="flood">Flood Plan</option>
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
            {safetySteps.map((step, index) => (
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
