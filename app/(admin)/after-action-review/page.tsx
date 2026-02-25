'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Flame, AlertTriangle, Clock, Brain, ThumbsUp, BookOpen, Plus, CheckCircle } from 'lucide-react'

const INCIDENTS = {
  tornado_april: {
    name: 'Tornado Warning 04/23',
    type: 'Tornado',
    duration: '14:10 – 15:45',
    insights: 12,
    events: [
      { id: 1, time: '02:15 PM', type: 'Alert Issued', title: 'Tornado Warning Issued', description: 'NWS issued tornado warning for Springfield metro area. Siren protocols activated.', color: 'red' },
      { id: 2, time: '02:22 PM', type: 'Responder Action', title: 'Police/Fire Units Deployed', description: 'Emergency personnel dispatched to high-risk zones for traffic control and spotter duty.', color: 'blue' },
      { id: 3, time: '02:30 PM', type: 'System Update', title: 'Shelters Activated', description: 'Virtual EOC triggered automated shelter-in-place instructions to all residents.', color: 'purple' },
      { id: 4, time: '03:45 PM', type: 'System Update', title: 'Warning Expired', description: 'Dangerous weather has passed. Damage assessment teams mobilized.', color: 'purple' },
    ],
    aiInsights: [
      { id: 'T-001', category: 'Compliance', description: '92% of residents acknowledged shelter-in-place alert within 2 min.', time: '15:50', status: 'Completed' },
      { id: 'T-002', category: 'Efficiency', description: 'Siren activation delayed by 45s due to manual override check.', time: '16:05', status: 'Pending' },
    ]
  },
  fire_sector7: {
    name: 'Fire Alert Sector 7-B',
    type: 'Urban Fire',
    duration: '08:15 – 22:47',
    insights: 8,
    events: [
      { id: 1, time: '08:15 AM', type: 'Alert Issued', title: 'Initial Fire Alert Detected', description: 'Automated system detected smoke and heat signatures in Sector 7-B.', color: 'red' },
      { id: 2, time: '08:22 AM', type: 'Responder Action', title: 'Fire Unit 3 Dispatched', description: 'Primary response team deployed with 12 personnel and 2 engines.', color: 'blue' },
      { id: 3, time: '08:35 AM', type: 'Responder Action', title: 'Evacuation Order Issued', description: 'Mandatory evacuation for 2.3 mile radius.', color: 'blue' },
      { id: 4, time: '10:47 PM', type: 'Citizen Report', title: 'Incident Contained - All Clear', description: '100% containment confirmed. Residents cleared to return.', color: 'green' },
    ],
    aiInsights: [
      { id: 'F-001', category: 'Response Time', description: 'Fire Ops delayed 5 min due to blocked hydrants in Sector 7.', time: '23:00', status: 'Addressed' },
    ]
  }
}

export default function AfterActionReviewPage() {
  const [selectedIncident, setSelectedIncident] = useState<keyof typeof INCIDENTS>('tornado_april')
  const [isSyncing, setIsSyncing] = useState(false)
  const [wentWellItems, setWentWellItems] = useState([
    'Early alert dissemination reached 96% of impacted residents within 3 minutes.',
    'Inter-agency coordination between Fire, Police, and OEM was seamless.',
    'Shelter-in-place guidance was clear and well-received by the public.',
  ])
  const [lessonsItems, setLessonsItems] = useState([
    'Secondary alert channel (email) had a 15-minute delay — investigate SMTP configuration.',
    'More clear signage needed at Shelter B entry points.',
  ])
  const [newWentWell, setNewWentWell] = useState('')
  const [newLesson, setNewLesson] = useState('')
  const [savedWW, setSavedWW] = useState(false)
  const [savedLL, setSavedLL] = useState(false)

  const currentIncident = INCIDENTS[selectedIncident]

  const syncData = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      // In a real app, this would fetch updated AI data
    }, 1500)
  }

  const addWentWell = () => {
    if (newWentWell.trim()) {
      setWentWellItems(prev => [...prev, newWentWell.trim()])
      setNewWentWell('')
    }
  }
  const addLesson = () => {
    if (newLesson.trim()) {
      setLessonsItems(prev => [...prev, newLesson.trim()])
      setNewLesson('')
    }
  }

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
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">After Action Review (AAR)</h1>
          <p className="text-gray-600">Timeline, AI generated using data from incident except for lessons learned and what went well.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedIncident}
            onChange={(e) => setSelectedIncident(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {Object.entries(INCIDENTS).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
          <Button
            onClick={syncData}
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Brain className={`w-4 h-4 ${isSyncing ? 'animate-pulse' : ''}`} />
            {isSyncing ? 'Syncing AI Data...' : 'Sync with AI'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Incident Name</p>
              <p className="text-xl font-bold mt-1">{currentIncident.name}</p>
            </div>
            <Flame className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Incident Type</p>
              <p className="text-xl font-bold mt-1">{currentIncident.type}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-bold mt-1">{currentIncident.duration}</p>
            </div>
            <Clock className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Insights Generated</p>
              <p className="text-xl font-bold mt-1">{currentIncident.insights}</p>
            </div>
            <Brain className="w-6 h-6 text-green-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-6">Event Timeline</h2>
        <p className="text-sm text-gray-600 mb-6">Chronological view of all incident events – AI Generated</p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"></div>

          <div className="space-y-8">
            {currentIncident.events.map((event) => {
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
              {currentIncident.aiInsights.map((insight, idx) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Went Well */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-4 h-4 text-green-700" />
            </div>
            <h2 className="text-lg font-bold">What Went Well</h2>
            <span className="text-xs text-gray-400 ml-auto">Manual entry — not AI generated</span>
          </div>

          <div className="space-y-2 mb-4">
            {wentWellItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newWentWell}
              onChange={e => setNewWentWell(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWentWell()}
              placeholder="Add what went well..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <Button size="sm" variant="outline" onClick={addWentWell} className="flex items-center gap-1">
              <Plus className="w-4 h-4" />Add
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setSavedWW(true)}>
              {savedWW ? '✓ Saved' : 'Save'}
            </Button>
          </div>
        </Card>

        {/* Lessons Learned */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-orange-700" />
            </div>
            <h2 className="text-lg font-bold">Lessons Learned</h2>
            <span className="text-xs text-gray-400 ml-auto">Manual entry — not AI generated</span>
          </div>

          <div className="space-y-2 mb-4">
            {lessonsItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                <BookOpen className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newLesson}
              onChange={e => setNewLesson(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLesson()}
              placeholder="Add a lesson learned..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <Button size="sm" variant="outline" onClick={addLesson} className="flex items-center gap-1">
              <Plus className="w-4 h-4" />Add
            </Button>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setSavedLL(true)}>
              {savedLL ? '✓ Saved' : 'Save'}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

