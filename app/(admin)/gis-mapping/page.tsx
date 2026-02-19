'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GISEOCActivatedModal } from '@/components/modals/gis-eoc-activated-modal'
import { Zap, TreePine, Droplets, AlertTriangle, MapPin, Clock, User, Plus, CheckCircle, Wifi } from 'lucide-react'

type FeedItem = {
  id: number
  type: string
  icon: React.ElementType
  iconColor: string
  bgColor: string
  title: string
  location: string
  reportedBy: string
  time: string
  status: string
  source: 'AI Feed' | 'End User'
}

export default function GISMappingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [newReport, setNewReport] = useState({ type: 'Road Closure', location: '', description: '' })
  const [submitted, setSubmitted] = useState(false)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 1,
      type: 'Power Outage',
      icon: Zap,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
      title: 'Power Outage – Sector 7-B',
      location: '2400 Oak Ridge Ave',
      reportedBy: 'ComEd AI Feed',
      time: '2 min ago',
      status: 'Active',
      source: 'AI Feed',
    },
    {
      id: 2,
      type: 'Street Closure',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      title: 'Road Closed – Flood Debris',
      location: 'Main St & River Rd Intersection',
      reportedBy: 'End User: J. Martinez',
      time: '8 min ago',
      status: 'Active',
      source: 'End User',
    },
    {
      id: 3,
      type: 'Water Main Leak',
      icon: Droplets,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      title: 'Water Main Break',
      location: '850 W Madison St',
      reportedBy: 'SCADA AI Feed',
      time: '14 min ago',
      status: 'Crew Dispatched',
      source: 'AI Feed',
    },
    {
      id: 4,
      type: 'Downed Tree',
      icon: TreePine,
      iconColor: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
      title: 'Downed Tree Blocking Road',
      location: '120 N Elm Ave',
      reportedBy: 'End User: K. Thompson',
      time: '22 min ago',
      status: 'Active',
      source: 'End User',
    },
    {
      id: 5,
      type: 'Power Outage',
      icon: Zap,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
      title: 'Power Outage – Industrial District',
      location: '3100 S Pulaski Rd',
      reportedBy: 'ComEd AI Feed',
      time: '31 min ago',
      status: 'Crew En Route',
      source: 'AI Feed',
    },
  ])

  const reports = [
    {
      id: 1,
      name: 'Javier Waters',
      category: 'Road Closures',
      date: '20/Dec/2025',
      file: 'Road_Closure_0421.pdf',
      status: 'Review',
    },
    {
      id: 2,
      name: 'Frankie Kilback',
      category: 'Structural Damage',
      date: '19/Dec/2025',
      file: 'Structural_Damage_0420.pdf',
      status: 'Reviewed',
    },
  ]

  const handleSubmitReport = () => {
    if (!newReport.location) return
    const iconMap: Record<string, React.ElementType> = {
      'Road Closure': AlertTriangle,
      'Downed Tree': TreePine,
      'Water Main Leak': Droplets,
      'Power Outage': Zap,
    }
    const colorMap: Record<string, { iconColor: string; bgColor: string }> = {
      'Road Closure': { iconColor: 'text-red-600', bgColor: 'bg-red-50 border-red-200' },
      'Downed Tree': { iconColor: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
      'Water Main Leak': { iconColor: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
      'Power Outage': { iconColor: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' },
    }
    const newItem: FeedItem = {
      id: Date.now(),
      type: newReport.type,
      icon: iconMap[newReport.type] || AlertTriangle,
      iconColor: colorMap[newReport.type]?.iconColor || 'text-gray-600',
      bgColor: colorMap[newReport.type]?.bgColor || 'bg-gray-50 border-gray-200',
      title: `${newReport.type}${newReport.description ? ' – ' + newReport.description : ''}`,
      location: newReport.location,
      reportedBy: 'End User: You',
      time: 'Just now',
      status: 'Submitted',
      source: 'End User',
    }
    setFeedItems(prev => [newItem, ...prev])
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowReportForm(false)
      setNewReport({ type: 'Road Closure', location: '', description: '' })
    }, 2000)
  }

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Live Incident Map</h1>
        <p className="text-gray-600">A real-time, interactive map showing all active incidents in your area. When the Emergency Operations Center (EOC) is activated, this map expands to include detailed, event-specific guidance and resources.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">No EOC Activated</h2>
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
          <svg className="w-full h-full" viewBox="0 0 800 400" style={{ background: '#f0f0f0' }}>
            {/* Basic map representation */}
            <rect x="50" y="50" width="700" height="300" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />

            {/* Water features */}
            <path d="M 100 200 Q 200 150, 300 200 T 500 200" fill="none" stroke="#0284c7" strokeWidth="3" opacity="0.6" />

            {/* Green areas (parks) */}
            <circle cx="150" cy="120" r="30" fill="#86efac" opacity="0.6" />
            <circle cx="650" cy="150" r="40" fill="#86efac" opacity="0.6" />

            {/* Pink areas (buildings) */}
            <rect x="200" y="100" width="50" height="50" fill="#f8bbd0" opacity="0.5" />
            <rect x="350" y="150" width="60" height="40" fill="#f8bbd0" opacity="0.5" />
            <rect x="600" y="250" width="70" height="50" fill="#f8bbd0" opacity="0.5" />

            {/* Markers */}
            <circle cx="300" cy="200" r="8" fill="#fbbf24" />
            <circle cx="450" cy="250" r="8" fill="#3b82f6" />
            <circle cx="550" cy="180" r="8" fill="#10b981" />
            <circle cx="200" cy="300" r="8" fill="#fbbf24" />

            {/* Popup */}
            <rect x="350" y="250" width="180" height="80" fill="white" stroke="#333" strokeWidth="1" rx="4" />
            <text x="365" y="270" fontSize="14" fontWeight="bold">Traffic Accident</text>
            <text x="365" y="290" fontSize="12">Use caution. Monitor</text>
            <text x="365" y="290" dy="15" fontSize="12">for updates.</text>
            <circle cx="515" cy="255" r="6" fill="none" stroke="#666" strokeWidth="2" />
          </svg>
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>Interactive map showing incident locations and details</p>
          <p className="mt-1">Click on markers to view incident information</p>
        </div>
      </Card>

      {/* AI & Crowd-Sourced Live Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">Live Incident Feed</h2>
            <span className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
              <Wifi className="w-3 h-3" />AI + Community
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowReportForm(!showReportForm)}
            className="bg-slate-800 text-white hover:bg-slate-900 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />Report Incident
          </Button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Updated via AI feeds (power, water, traffic sensors) and community reports from the disaster area. Street closures, water main leaks, downed trees, power outages, and more.
        </p>

        {showReportForm && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-sm mb-3">Submit a Community Report</h3>
            {submitted ? (
              <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                <CheckCircle className="w-5 h-5" />Report submitted! Thank you.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Incident Type</label>
                  <select value={newReport.type} onChange={e => setNewReport(prev => ({ ...prev, type: e.target.value }))} className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm">
                    <option>Road Closure</option>
                    <option>Downed Tree</option>
                    <option>Water Main Leak</option>
                    <option>Power Outage</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Location / Address</label>
                  <input type="text" placeholder="e.g. 450 W Oak St" value={newReport.location} onChange={e => setNewReport(prev => ({ ...prev, location: e.target.value }))} className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Description (optional)</label>
                  <input type="text" placeholder="Brief description..." value={newReport.description} onChange={e => setNewReport(prev => ({ ...prev, description: e.target.value }))} className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm" />
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowReportForm(false)}>Cancel</Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmitReport}>Submit Report</Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {feedItems.map(item => {
            const Icon = item.icon
            return (
              <div key={item.id} className={`flex items-start gap-4 p-4 rounded-lg border ${item.bgColor}`}>
                <div className={`mt-0.5 p-2 bg-white rounded-lg shadow-sm ${item.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{item.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.status === 'Active' || item.status === 'Submitted' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.source === 'AI Feed' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.source}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.reportedBy}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Interactive Reporting Management</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Report Categories</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Incident Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Incident Report</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{report.name}</td>
                  <td className="py-3 px-4 text-sm">{report.category}</td>
                  <td className="py-3 px-4 text-sm">{report.date}</td>
                  <td className="py-3 px-4 text-sm text-blue-600">{report.file}</td>
                  <td className="py-3 px-4 text-sm">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className={`${report.status === 'Review'
                        ? 'bg-gray-800 hover:bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`} size="sm">
                      {report.status}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <GISEOCActivatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
