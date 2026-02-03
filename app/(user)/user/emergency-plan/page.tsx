'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Users, Phone, MapPin, AlertTriangle } from 'lucide-react'

export default function UserEmergencyPlanPage() {
  const planItems = [
    { icon: Phone, title: 'Emergency Contacts', status: true, description: 'Store family and emergency numbers' },
    { icon: MapPin, title: 'Meeting Place', status: true, description: 'Designate family meeting location' },
    { icon: Users, title: 'Family Communication', status: false, description: 'Create communication plan' },
    { icon: AlertTriangle, title: 'Evacuation Routes', status: true, description: 'Plan multiple exit routes' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Family Emergency Plan</h1>
        <p className="text-gray-600">Create and manage your family's emergency response plan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {planItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
                {item.status ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {item.status ? 'Edit' : 'Add'}
              </Button>
            </Card>
          )
        })}
      </div>

      <Card className="p-8 bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-bold mb-4">Emergency Kit Checklist</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {['Water (1 gallon per person/day)', 'Non-perishable food', 'Flashlight & batteries', 'First aid kit', 'Medications', 'Important documents', 'Phone charger', 'Cash'].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}
