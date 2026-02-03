'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Cloud } from 'lucide-react'

export default function UserAlertsPage() {
  const alerts = [
    {
      type: 'warning',
      title: 'Severe Weather Alert',
      location: 'San Francisco, CA',
      description: 'Thunderstorm warning with wind gusts up to 45 mph expected in your area.',
      time: '12 min ago',
      icon: Cloud,
    },
    {
      type: 'warning',
      title: 'Tornado Watch',
      location: 'Bay Area',
      description: 'Tornado watch issued for your region until 6:00 PM EST.',
      time: '45 min ago',
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Alerts</h1>
        <p className="text-gray-600">Stay informed about weather alerts and emergencies in your area</p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon
          return (
            <Card key={idx} className="p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-red-50 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                        {alert.type.toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      📍 {alert.location}
                    </p>
                    <p className="text-gray-700">{alert.description}</p>
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0">
                  Take Action
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
