'use client'
import { useEffect, useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GISEOCActivatedModal } from '@/components/modals/gis-eoc-activated-modal'
import { Zap, TreePine, Droplets, AlertTriangle, MapPin, Clock, User, Plus, CheckCircle, Wifi } from 'lucide-react'

import dynamic from 'next/dynamic'
import { EmergencyResource } from '@/lib/types/emergency'

// Dynamically import LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-slate-100 animate-pulse flex items-center justify-center rounded-lg border border-slate-200">
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading Map Engine...</p>
    </div>
  ),
})

type FeedItem = {
  id: string
  type: string
  icon: React.ElementType
  iconColor: string
  bgColor: string
  title: string
  location: string
  lat?: number
  lng?: number
  reportedBy: string
  time: string
  status: string
  source: 'AI Feed' | 'End User'
}

type ReportItem = {
  id: string
  name: string
  category: string
  date: string
  file: string
  status: string
}

export default function GISMappingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [newReport, setNewReport] = useState({ type: 'Road Closure', location: '', description: '' })
  const [submitted, setSubmitted] = useState(false)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/incidents')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          // Map backend incidents to UI FeedItems
          const mappedItems = data.data.map((inc: any) => {
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

            // Simple time formatter for display
            const timeStr = new Date(inc.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            return {
              id: inc.id,
              type: inc.type,
              icon: iconMap[inc.type] || AlertTriangle,
              iconColor: colorMap[inc.type]?.iconColor || 'text-gray-600',
              bgColor: colorMap[inc.type]?.bgColor || 'bg-gray-50 border-gray-200',
              title: inc.title,
              location: inc.location,
              lat: inc.lat,
              lng: inc.lng,
              reportedBy: inc.reportedBy,
              time: `Reported at ${timeStr}`,
              status: inc.status,
              source: inc.source,
            }
          })
          setFeedItems(mappedItems)
        }
      }
    } catch (err) {
      console.error('Failed to load incidents', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/field-reports')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setReports(data.data)
        }
      }
    } catch (err) {
      console.error('Failed to load reports', err)
    }
  }

  // Load initial feeds
  useEffect(() => {
    fetchIncidents()
    fetchReports()
    const interval = setInterval(() => {
      fetchIncidents()
      fetchReports()
    }, 60000) // refresh every 60s
    return () => clearInterval(interval)
  }, [])

  // Map FeedItems to Leaflet map resources
  const mapResources = useMemo(() => {
    return feedItems
      .filter(item => item.lat && item.lng)
      .map(item => ({
        id: item.id,
        name: item.title,
        type: 'other',
        location: { lat: item.lat!, lng: item.lng!, address: item.location },
        distance: 0,
        status: item.status === 'Resolved' ? 'available' : 'limited'
      } as EmergencyResource))
  }, [feedItems])

  const handleUpdateReportStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Review' ? 'Reviewed' : 'Review'

    // Optimistic UI update
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))

    try {
      const res = await fetch('/api/field-reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      if (!res.ok) {
        // Revert on failure
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: currentStatus } : r))
      }
    } catch (err) {
      console.error('Failed to update report status', err)
      // Revert on failure
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: currentStatus } : r))
    }
  }

  const handleSubmitReport = async () => {
    if (!newReport.location) return

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newReport.type,
          location: newReport.location,
          description: newReport.description,
          reportedBy: 'End User: You', // In a real app, pick from session
          source: 'End User'
        })
      })

      if (res.ok) {
        setSubmitted(true)
        fetchIncidents() // Refresh feed

        setTimeout(() => {
          setSubmitted(false)
          setShowReportForm(false)
          setNewReport({ type: 'Road Closure', location: '', description: '' })
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to submit report', err)
    }
  }

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Live Incident Map</h1>
        <p className="text-gray-600">A real-time, interactive map showing all active incidents in your area. When the Emergency Operations Center (EOC) is activated, this map expands to include detailed, event-specific guidance and resources.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">No EOC Activated</h2>
        <div className="w-full h-[400px] border border-gray-200 rounded-lg overflow-hidden relative shadow-sm z-0">
          <LeafletMap
            center={{ lat: 41.8781, lng: -87.6298 }} // Default center (Chicago)
            resources={mapResources}
            zoom={11}
          />
        </div>

        <div className="text-center text-gray-500 text-xs font-semibold uppercase tracking-widest mt-4 flex items-center justify-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm border border-red-200"></span> Active Hazards
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm border border-blue-200"></span> Current Position
          </span>
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

      {/* <Card className="p-6">
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
                      onClick={() => handleUpdateReportStatus(report.id, report.status)}
                      className={`${report.status === 'Review'
                        ? 'bg-gray-800 hover:bg-gray-900 text-white'
                        : 'bg-green-100/50 hover:bg-green-100 text-green-700 font-semibold'
                        }`} size="sm">
                      {report.status}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card> */}

      <GISEOCActivatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
