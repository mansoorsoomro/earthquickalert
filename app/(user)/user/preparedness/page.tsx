'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import {
  Flame,
  Wind,
  Waves,
  Cloud,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  Phone,
  ShieldCheck,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItem {
  task: string
  completed: boolean
}

interface SafetyStep {
  title: string
  points: string[]
}

interface Guide {
  icon: any
  title: string
  description: string
  color: string
  safetySteps: SafetyStep[]
}

export default function PreparednessPage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedCardIdx, setExpandedCardIdx] = useState<number | null>(null)

  const defaultChecklist = [
    { task: 'Create and practice your family emergency plan', completed: false },
    { task: 'Prepare an emergency kit with essential supplies', completed: false },
    { task: 'Know your evacuation routes', completed: false },
    { task: 'Stay informed with emergency alerts', completed: false },
  ]

  const guides: Guide[] = [
    {
      icon: Flame,
      title: 'Wildfire Safety',
      description: 'Learn how to prepare and respond to wildfires',
      color: 'from-orange-500 to-red-600',
      safetySteps: [
        {
          title: 'Preparation',
          points: [
            'Create a 30ft defensible space around home',
            'Clean gutters and roof of dry debris',
            'Pack an emergency kit with N95 masks',
            'Set up local emergency notifications'
          ]
        },
        {
          title: 'Immediate Action',
          points: [
            'Evacuate immediately if ordered',
            'Close all windows and doors',
            'Turn off gas and propane tanks',
            'Keep car gas tank at least half full'
          ]
        }
      ]
    },
    {
      icon: Waves,
      title: 'Flood Preparedness',
      description: 'Understand flood risks and stay safe',
      color: 'from-cyan-500 to-blue-600',
      safetySteps: [
        {
          title: 'Risk Reduction',
          points: [
            'Install sump pumps and backwater valves',
            'Elevate electrical panels and appliances',
            'Store documents in waterproof containers',
            'Identify high ground in your area'
          ]
        },
        {
          title: 'During Flood',
          points: [
            'Turn Around, Don\'t Drown',
            'Avoid walking or driving in floodwaters',
            'Move to higher ground immediately',
            'Disconnect power if safe to do so'
          ]
        }
      ]
    },
    {
      icon: Wind,
      title: 'Tornado Safety',
      description: 'What to do before, during, and after tornadoes',
      color: 'from-slate-600 to-slate-800',
      safetySteps: [
        {
          title: 'Safety Planning',
          points: [
            'Identify a safe room or storm cellar',
            'Keep a survival kit in your safe area',
            'Remove dead limbs from nearby trees',
            'Understand Watch vs Warning alerts'
          ]
        },
        {
          title: 'During Tornado',
          points: [
            'Go to lowest floor or designated room',
            'Stay away from all windows and glass',
            'Cover your head with your arms or heavy blankets',
            'Exit mobile homes or vehicles immediately'
          ]
        }
      ]
    },
    {
      icon: Cloud,
      title: 'Winter Weather',
      description: 'Prepare for snow and ice storms',
      color: 'from-blue-400 to-indigo-500',
      safetySteps: [
        {
          title: 'Home & Car prep',
          points: [
            'Insulate home and water pipes',
            'Keep extra blankets and warm layers',
            'Equip car with ice scraper and sand',
            'Have a backup heating source ready'
          ]
        },
        {
          title: 'During Storm',
          points: [
            'Stay indoors and avoid unnecessary travel',
            'Wear multiple layers of dry clothing',
            'Be cautious of overexertion when shoveling',
            'Conserve fuel by lowering thermostat'
          ]
        }
      ]
    },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/user/emergency-plan')
        const data = await res.json()
        if (data.preparednessChecklist && data.preparednessChecklist.length > 0) {
          setChecklist(data.preparednessChecklist)
        } else {
          setChecklist(defaultChecklist)
        }
      } catch (error) {
        console.error('Error loading preparedness data:', error)
        setChecklist(defaultChecklist)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const saveChecklist = async (updatedList: ChecklistItem[]) => {
    setIsSaving(true)
    try {
      await fetch('/api/user/emergency-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'preparedness', data: updatedList })
      })
    } catch (error) {
      console.error('Error saving checklist:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleTask = (index: number) => {
    const newList = [...checklist]
    newList[index].completed = !newList[index].completed
    setChecklist(newList)
    saveChecklist(newList)
  }

  return (
    <main className="min-h-screen bg-slate-50/30 pb-24">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <header className="flex items-center justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">Preparedness Guides</h1>
            <p className="text-slate-500 text-lg">Master the protocols required for absolute tactical resilience.</p>
          </div>
          {isSaving && (
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-full animate-pulse transition-all">
              <Loader2 className="w-4 h-4 animate-spin" />
              Syncing...
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, i) => {
            const isExpanded = expandedCardIdx === i
            return (
              <Card
                key={i}
                onClick={() => setExpandedCardIdx(isExpanded ? null : i)}
                className={cn(
                  "p-6 border-none rounded-[2rem] bg-gradient-to-br text-white shadow-xl flex flex-col transition-all cursor-pointer overflow-hidden",
                  guide.color,
                  isExpanded ? "md:col-span-2 min-h-[450px]" : "min-h-[220px] hover:translate-y-[-4px]"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                    <guide.icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/10 px-3 py-1.5 rounded-full">
                    {isExpanded ? 'Active Guide' : 'See More'}
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase">{guide.title}</h3>
                  <p className="text-white/80 font-bold text-sm leading-relaxed max-w-md">
                    {guide.description}
                  </p>
                </div>

                {isExpanded && (
                  <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {guide.safetySteps.map((step, sIdx) => (
                        <div key={sIdx} className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2 flex items-center gap-2">
                            {sIdx === 0 ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {step.title}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {step.points.map((point, pIdx) => (
                              <div key={pIdx} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                                <span className="text-sm font-bold text-white/90 leading-tight">{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
            <CheckCircle2 className="w-48 h-48 text-indigo-600" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm shadow-orange-50">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Readiness Sync</h2>
                <p className="text-slate-500 font-bold text-sm">Complete these steps for absolute tactical resilience.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />)
              ) : (
                checklist.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => toggleTask(i)}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer group/item",
                      item.completed ? "bg-green-50/50 border-green-100" : "bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      item.completed ? "bg-green-500 border-green-500 shadow-lg shadow-green-100" : "border-slate-300 bg-white group-hover/item:border-indigo-500"
                    )}>
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={cn(
                      "flex-1 text-xs font-black uppercase tracking-tight transition-all",
                      item.completed ? "text-slate-400 line-through" : "text-slate-700"
                    )}>
                      {item.task}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card> */}
      </div>
    </main>
  )
}
