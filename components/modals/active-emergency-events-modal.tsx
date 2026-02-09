'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmergencyEvent {
  id: string
  description: string
  location: string
  eventType: string
  status: 'In Progress' | 'Completed' | 'Scheduled'
  canAssign?: boolean
}

interface ActiveEmergencyEventsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ActiveEmergencyEventsModal({ isOpen, onClose }: ActiveEmergencyEventsModalProps) {
  const events: EmergencyEvent[] = [
    {
      id: '1',
      description: 'Fire spreading toward residential zones; evacuation recommended.',
      location: 'Maui, Hawaii',
      eventType: 'Major',
      status: 'In Progress',
    },
    {
      id: '2',
      description: 'Category 4 storm impacting multiple states; shelters activated.',
      location: 'North Carolina, South Carolina, Georgia',
      eventType: 'Catastrophic',
      status: 'In Progress',
    },
    {
      id: '3',
      description: 'Rapid flooding on major roadways; crews dispatched for barricade placement.',
      location: 'Phoenix, Arizona',
      eventType: 'Intermediate',
      status: 'Scheduled',
      canAssign: true,
    },
    {
      id: '4',
      description: 'Hazardous material leak; hazmat unit en route.',
      location: 'San Antonio, Texas',
      eventType: 'Major',
      status: 'Completed',
    },
    {
      id: '5',
      description: 'Multiple cars off track; emergency response deployed.',
      location: 'Pittsburgh, Pennsylvania',
      eventType: 'Major',
      status: 'Scheduled',
      canAssign: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Active Emergency Events</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Event Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-700">{event.description}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{event.location}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{event.eventType}</td>
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusColor(event.status)} font-medium`}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {event.canAssign ? (
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm" size="sm">
                          Resend
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
