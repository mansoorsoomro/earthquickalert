'use client'

import { Card } from '@/components/ui/card'
import { Flame, AlertTriangle, Clock, Brain } from 'lucide-react'

export default function AfterActionReviewPage() {

  const timelineEvents = [
    {
      id: 1,
      time: '08:15 AM',
      type: 'Alert Issued',
      title: 'Initial Fire Alert Detected',
      description: 'Automated system detected smoke and heat signatures in Sector 7-B. Emergency protocols activated.',
      color: 'red',
    },
    {
      id: 2,
      time: '08:22 AM',
      type: 'Responder Action',
      title: 'Fire Unit 3 Dispatched',
      description: 'Primary response team deployed with 12 personnel and 2 engines. ETA: 7 minutes.',
      color: 'blue',
    },
    {
      id: 3,
      time: '08:28 AM',
      type: 'Citizen Report',
      title: 'Multiple 911 Calls Received',
      description: '47 citizen reports confirming fire spread. Evacuation requests from residential areas.',
      color: 'green',
    },
    {
      id: 4,
      time: '08:35 AM',
      type: 'Responder Action',
      title: 'Evacuation Order Issued',
      description: 'Mandatory evacuation for 2.3 mile radius. Shelter locations broadcast via emergency alert system.',
      color: 'blue',
    },
    {
      id: 5,
      time: '09:12 AM',
      type: 'System Update',
      title: 'Resource Allocation Updated',
      description: 'AI system reallocated 3 additional units based on wind pattern analysis and spread prediction.',
      color: 'purple',
    },
    {
      id: 6,
      time: '11:45 AM',
      type: 'Responder Action',
      title: 'Aerial Support Deployed',
      description: '2 helicopters with water drops initiated. Ground crews report 40% containment achieved.',
      color: 'blue',
    },
    {
      id: 7,
      time: '10:47 PM',
      type: 'Citizen Report',
      title: 'Incident Contained - All Clear',
      description: '100% containment confirmed. Residents cleared to return. Post-incident assessment initiated.',
      color: 'green',
    },
  ]

  const aiInsights = [
    {
      id: '001',
      category: 'Response Time',
      description: 'Fire Ops delayed 5 min',
      time: '14:45',
      status: 'Pending',
    },
    {
      id: '002',
      category: 'Resource Allocation',
      description: 'Additional medical team recommended',
      time: '14:42',
      status: 'Addressed',
    },
  ]

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Alert Issued': 'red',
      'Responder Action': 'blue',
      'Citizen Report': 'green',
      'System Update': 'purple',
    }
    return colors[type] || 'gray'
  }

  const getColorClass = (color: string) => {
    const classes: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
    }
    return classes[color] || 'bg-gray-500'
  }

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">After Action Review (AAR)</h1>
        <p className="text-gray-600">Analyze incident response performance, review AI-generated insights, and monitor task execution timelines.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Incident Name</p>
              <p className="text-xl font-bold mt-1">Tornado Warning 04/23</p>
            </div>
            <Flame className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Incident Type</p>
              <p className="text-xl font-bold mt-1">Tornado</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-bold mt-1">14:10 – 15:45</p>
            </div>
            <Clock className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total AI Insights Generated</p>
              <p className="text-xl font-bold mt-1">12</p>
            </div>
            <Brain className="w-6 h-6 text-green-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-6">Event Timeline</h2>
        <p className="text-sm text-gray-600 mb-6">Chronological view of all incident events</p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"></div>

          <div className="space-y-8">
            {timelineEvents.map((event) => {
              const color = getTypeColor(event.type)
              return (
                <div key={event.id} className="pl-20">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 w-14 h-14 rounded-full flex items-center justify-center ${color === 'red' ? 'bg-red-100' :
                    color === 'blue' ? 'bg-blue-100' :
                      color === 'green' ? 'bg-green-100' :
                        'bg-purple-100'
                    }`}>
                    <div className={`w-6 h-6 rounded-full ${getColorClass(color)}`}></div>
                  </div>

                  {/* Event content */}
                  <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${color === 'red' ? 'bg-red-100 text-red-800' :
                        color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          color === 'green' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                        }`}>
                        {event.type}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">{event.time}</span>
                    </div>
                    <h3 className="font-bold text-base mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Alert Issued</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Responder Action</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Citizen Report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>System Update</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">AI Insights from Incident Data</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Insight ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {aiInsights.map((insight, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{insight.id}</td>
                  <td className="py-3 px-4 text-sm">{insight.category}</td>
                  <td className="py-3 px-4 text-sm">{insight.description}</td>
                  <td className="py-3 px-4 text-sm">{insight.time}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${insight.status === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {insight.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
