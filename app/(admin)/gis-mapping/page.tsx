'use client'
import { useEffect, useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GISEOCActivatedModal } from '@/components/modals/gis-eoc-activated-modal'
import { Zap, TreePine, Droplets, AlertTriangle, MapPin, Clock, User, Plus, CheckCircle, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [reports, setReports] = useState<ReportItem[]>([
    { id: '1', name: 'Javier Waters', category: 'Road Closures', date: '20/Dec/2026', file: 'Road_Closure_0421.pdf', status: 'Review' },
    { id: '2', name: 'Frankie Kilback', category: 'Structural Damage', date: '19/Dec/2026', file: 'Structural_Damage_0420.pdf', status: 'Reviewed' }
  ])
  const [loading, setLoading] = useState(true)

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/incidents')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          const mappedItems = data.data.map((inc: any) => ({
            id: inc.id,
            type: inc.type,
            icon: AlertTriangle,
            iconColor: 'text-red-600',
            bgColor: 'bg-red-50 border-red-200',
            title: inc.title,
            location: inc.location,
            lat: inc.lat,
            lng: inc.lng,
            reportedBy: inc.reportedBy,
            time: inc.time,
            status: inc.status,
            source: inc.source,
          }))
          setFeedItems(mappedItems)
        }
      }
    } catch (err) {
      console.error('Failed to load incidents', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

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

  const handleUpdateReportStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Review' ? 'Reviewed' : 'Review'
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    setIsModalOpen(true)
  }

  return (
    <main className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
      {/* Page Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Live Incident Map</h1>
        <p className="text-slate-500 font-medium max-w-3xl leading-relaxed">
          A real-time, interactive map showing all active incidents in your area.
          When the Emergency Operations Center (EOC) is activated, this map expands to include detailed, event-specific guidance and resources.
        </p>
      </div>

      {/* No EOC Activated Section */}
      <Card className="p-0 overflow-hidden rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
        <div className="p-8 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">No EOC Activated</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100/50">Public Safety</span>
            <span className="px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100/50">Informational</span>
            <span className="px-3 py-1 bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-100/50">Moderate / Caution</span>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="w-full h-[500px] rounded-[2rem] overflow-hidden border border-slate-100 relative z-0">
            <LeafletMap
              center={{ lat: 41.8781, lng: -87.6298 }}
              resources={mapResources}
              zoom={12}
            />
          </div>
        </div>
      </Card>

      {/* Interactive Reporting Management */}
      <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Interactive Reporting Management</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Name</th>
                <th className="text-left pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Report Categories</th>
                <th className="text-left pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Incident Date</th>
                <th className="text-left pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Incident Report</th>
                <th className="text-left pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 font-bold text-slate-900">{report.name}</td>
                  <td className="py-5 text-slate-600 font-medium">{report.category}</td>
                  <td className="py-5 text-slate-600 font-medium">{report.date}</td>
                  <td className="py-5">
                    <button className="text-slate-900 font-bold underline underline-offset-4 hover:text-blue-600 transition-colors">
                      {report.file}
                    </button>
                  </td>
                  <td className="py-5">
                    <Button
                      onClick={() => handleUpdateReportStatus(report.id, report.status)}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest h-8 px-6 rounded-lg transition-all",
                        report.status === 'Review'
                          ? 'bg-[#2D3142] text-white hover:bg-[#1A1D29]'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      )}
                    >
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

