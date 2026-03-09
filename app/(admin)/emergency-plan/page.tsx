'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Loader2 } from 'lucide-react'

// Dynamic Type for the Plan definition
type EmergencyPlanDef = {
  id?: string;
  label: string;
  overview: string;
  steps: string[];
}

export default function EmergencyPlanPage() {
  const [plans, setPlans] = useState<Record<string, EmergencyPlanDef>>({})
  const [selectedPlan, setSelectedPlan] = useState('hurricane_warning')
  const [aiAssistance, setAiAssistance] = useState(true)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch('/api/admin/emergency-plans')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setPlans(data.data)
            // If the current selected plan is somehow invalid under the new data, pick the first available
            if (!data.data[selectedPlan] && Object.keys(data.data).length > 0) {
              setSelectedPlan(Object.keys(data.data)[0])
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch emergency plans:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="font-black text-xs uppercase tracking-[0.2em]">Synchronizing Protocol Database...</p>
        </div>
      </div>
    )
  }

  // Fallback if DB completely empty
  const currentPlan = plans[selectedPlan] || {
    label: 'Loading...',
    overview: 'Fetching operational procedures...',
    steps: []
  }

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
              {Object.entries(plans).map(([id, plan]) => (
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
