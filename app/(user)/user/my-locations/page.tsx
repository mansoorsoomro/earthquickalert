'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Trash2, Edit2 } from 'lucide-react'

export default function MyLocationsPage() {
  const locations = [
    {
      name: 'Home',
      address: '123 Main St, San Francisco, CA 94102',
      type: 'home',
      alerts: true,
    },
    {
      name: 'Lincoln High School',
      address: '456 School Ave, San Francisco, CA',
      type: 'school',
      alerts: true,
    },
    {
      name: 'Office',
      address: '789 Business Blvd, San Francisco, CA',
      type: 'office',
      alerts: false,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Locations</h1>
          <p className="text-gray-600">Manage your important locations for alerts and emergency planning</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="space-y-4">
        {locations.map((location, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{location.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{location.address}</p>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded capitalize">
                      {location.type}
                    </span>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={location.alerts} className="w-4 h-4" readOnly />
                      <span>Alerts enabled</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 bg-transparent">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
