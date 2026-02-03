'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Flame, Wind, Waves, AlertTriangle, Cloud } from 'lucide-react'

export default function PreparednessPage() {

  const guides = [
    { icon: Flame, title: 'Wildfire Safety', description: 'Learn how to prepare and respond to wildfires', color: 'from-orange-500 to-red-500' },
    { icon: Waves, title: 'Flood Preparedness', description: 'Understand flood risks and stay safe', color: 'from-blue-500 to-cyan-500' },
    { icon: Wind, title: 'Tornado Safety', description: 'What to do before, during, and after tornadoes', color: 'from-gray-500 to-slate-700' },
    { icon: Cloud, title: 'Winter Weather', description: 'Prepare for snow and ice storms', color: 'from-blue-300 to-blue-600' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Preparedness Guides</h1>
        <p className="text-gray-600">Learn how to prepare for different types of emergencies</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {guides.map((guide, idx) => {
          const Icon = guide.icon
          return (
            <Card key={idx} className={`p-6 bg-gradient-to-br ${guide.color} text-white hover:shadow-lg transition-shadow cursor-pointer`}>
              <Icon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
              <p className="text-white/80 mb-4">{guide.description}</p>
              <Button className="bg-white text-gray-900 hover:bg-gray-100">
                Learn More
              </Button>
            </Card>
          )
        })}
      </div>

      <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold mb-2">Emergency Preparedness Checklist</h2>
            <p className="text-gray-700 mb-4">Complete these steps to be better prepared for emergencies:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>Create and practice your family emergency plan</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>Prepare an emergency kit with essential supplies</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>Know your evacuation routes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>Stay informed with emergency alerts</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
