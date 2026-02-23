'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, MapPin, TrendingUp, AlertCircle, X, Loader2, Trash2, Shield, Clock } from 'lucide-react'
import { SendCommunityAlertModal } from '@/components/modals/send-community-alert-modal'
import { ActiveEmergencyEventsModal } from '@/components/modals/active-emergency-events-modal'
import { AlertDetailModal } from '@/components/modals/alert-detail-modal'
import { ResourceMapModal } from '@/components/modals/resource-map-modal'
import { SituationReportModal } from '@/components/modals/situation-report-modal'
import { GISMap } from '@/components/gis-map'
import { useEvents } from '@/lib/store/event-store'
import { useAlerts } from '@/lib/store/alert-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function EmergencyEventsPage() {
  const { events, isLoading: eventsLoading, deleteEvent, fetchEvents } = useEvents()
  const { alerts, fetchAlerts, isLoading: alertsLoading } = useAlerts()

  const [showSendAlertModal, setShowSendAlertModal] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showAlertDetailModal, setShowAlertDetailModal] = useState(false)
  const [showResourceMapModal, setShowResourceMapModal] = useState(false)
  const [showSitRepModal, setShowSitRepModal] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleManualSync = async () => {
    setIsSyncing(true)
    await Promise.all([fetchEvents(), fetchAlerts()])
    setIsSyncing(false)
  }

  const activeEvents = events.filter(e => e.status === 'active' || e.status === 'monitoring')
  const currentEvent = activeEvents[0] || events[0]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'extreme':
        return 'text-red-600'
      case 'severe':
      case 'warning':
        return 'text-orange-600'
      default:
        return 'text-blue-600'
    }
  }

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="font-black text-xs uppercase tracking-[0.2em]">Synchronizing Real-Time Data...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8 border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Emergency Events</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleManualSync}
              disabled={isSyncing}
              className={cn("rounded-full h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all", isSyncing && "animate-spin text-blue-500")}
            >
              <Loader2 className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Monitoring active situational threats and official hazard responses (Direct DB Link).</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSendAlertModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-tighter text-xs h-12 px-8 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            Edit Community Message
          </Button>
          <Button
            onClick={() => setShowMapModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-tighter text-xs h-12 px-8 rounded-xl shadow-lg active:scale-95 transition-all"
          >
            Live Map Overlay
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Event Type */}
        <Card className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-3xl" onClick={() => currentEvent && setShowAlertDetailModal(true)}>
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">What (Event)</span>
              <p className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                {currentEvent?.title || "Monitoring System"}
              </p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${currentEvent ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  {currentEvent ? currentEvent.status : 'All Systems Stable'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Card>

        {/* Pillar 2: Geolocation */}
        <Card className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-3xl" onClick={() => setShowMapModal(true)}>
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Where (Geolocator)</span>
              <p className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                {currentEvent?.location.address || "Official Geolocation"}
              </p>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Coordinate Mapping Applied</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        {/* Pillar 3: Potential Impacts */}
        <Card className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-3xl" onClick={() => setShowSitRepModal(true)}>
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Impact Assessment</span>
              <div className="grid grid-cols-1 gap-1">
                {currentEvent?.affectedZones.map(zone => (
                  <div key={zone} className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-red-400" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Zone {zone} Impacted</span>
                  </div>
                )) || (
                    <>
                      <p className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter">Residential</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industrial Zones Under Review</p>
                    </>
                  )}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>

        {/* Pillar 4: Alert Status */}
        <Card className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-3xl" onClick={() => setShowEventsModal(true)}>
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alert Status</span>
              <p className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                Sent: {alerts.some(a => a.eventId === currentEvent?.id) ? "YES" : "NO"}
              </p>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                {alerts.filter(a => a.eventId === currentEvent?.id).length} Active Notifications
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Incident Logistics Table Section */}
      <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Incident Logistics Terminal</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Live synchronized data from command dashboard</p>
          </div>
          <Button
            onClick={() => setShowEventsModal(true)}
            variant="outline"
            className="rounded-xl border-slate-200 font-black uppercase text-[10px] tracking-widest hover:bg-white"
          >
            Manage All Events
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Severity</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Impact Zone</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{event.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 line-clamp-1 mt-0.5">{event.description}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-700 uppercase">{event.type.replace(/-/g, ' ')}</span>
                        <span className={cn("text-[8px] font-black uppercase tracking-widest mt-0.5", getSeverityColor(event.severity))}>
                          {event.severity}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {event.location.address}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <Badge className={cn("text-[8px] font-black uppercase tracking-tighter border-none px-2 py-0.5 rounded-md", getStatusColor(event.status))}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => deleteEvent(event.id || (event as any)._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      {eventsLoading ? (
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                      ) : (
                        <Shield className="w-12 h-12 text-slate-100" />
                      )}
                      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">
                        {eventsLoading ? 'Re-Establishing Satellite Link...' : 'No Active Incidents Detected in DB'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase max-w-xs mx-auto">
                        {eventsLoading ? 'Synchronizing with command terminal...' : 'Use the dashboard to add an event. This terminal is synchronized directly with your database.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Strategic Feed Active • Dispatched from Control Terminal
          </div>
          <span>{events.length} Incidents Documented</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-8 border-slate-100 bg-slate-50/30 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase">Active Alert Preview</h2>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Official Statement</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            {alerts.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-red-500 text-white")}>
                      {alerts[0].severity}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{alerts[0].type}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{alerts[0].title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {alerts[0].message}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Zones</h4>
                    <div className="flex flex-wrap gap-2">
                      {alerts[0].zones && alerts[0].zones.length > 0 ? alerts[0].zones.map(zone => (
                        <span key={zone} className="px-4 py-2 bg-slate-100 text-slate-700 text-[10px] font-black rounded-xl border border-slate-200 uppercase tracking-widest">Zone {zone}</span>
                      )) : <span className="text-[10px] font-bold text-slate-400 uppercase">Mass Broadcast</span>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Agency</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="font-black text-slate-700 text-xs uppercase tracking-tight">{alerts[0].createdBy || 'Emergency Management Agency'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                {alertsLoading ? (
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                ) : (
                  <ShieldAlert className="w-12 h-12 text-slate-200 mb-4" />
                )}
                <p className="font-black text-slate-400 text-xs uppercase tracking-widest">
                  {alertsLoading ? 'Fetching Live Intelligence...' : 'No DB Alerts Detected'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                  {alertsLoading ? 'Connecting to Command Center...' : 'All clear. Official admin messages will appear here once saved to the database.'}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <SendCommunityAlertModal isOpen={showSendAlertModal} onClose={() => setShowSendAlertModal(false)} />
      <ActiveEmergencyEventsModal isOpen={showEventsModal} onClose={() => setShowEventsModal(false)} />
      {currentEvent && (
        <AlertDetailModal
          isOpen={showAlertDetailModal}
          onClose={() => setShowAlertDetailModal(false)}
          alert={{
            title: currentEvent.title,
            severity: currentEvent.severity,
            description: currentEvent.description,
            whatItMeans: `This is an active ${currentEvent.type} emergency and is currently in the ${currentEvent.status} phase.`,
            whatToDo: "Follow all official EOC directives and stay tuned to local channels.",
            preparedness: "Ensure your supply kits are accessible and emergency contacts are notified.",
            issued: new Date(currentEvent.createdAt).toLocaleTimeString(),
            expires: "Monitoring Ongoing",
            source: "Emergency Management Agency"
          }}
        />
      )}
      <ResourceMapModal
        isOpen={showResourceMapModal}
        onClose={() => setShowResourceMapModal(false)}
        title="Affected Area Resources"
        resources={[]}
      />
      <SituationReportModal
        isOpen={showSitRepModal}
        onClose={() => setShowSitRepModal(false)}
      />

      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-10">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl h-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white/20 animate-in zoom-in-95 duration-500">
            <div className="p-6 md:p-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase">Live Map Overlay</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Real-time hazard monitoring & resource overlay</p>
                </div>
              </div>
              <button onClick={() => setShowMapModal(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <GISMap />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}
