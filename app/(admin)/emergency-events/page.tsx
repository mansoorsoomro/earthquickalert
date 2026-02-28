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
      {/* Header Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Emergency Events</h1>
        <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-3xl">
          Monitor active emergency events, review official alerts, assess potential impacts, and manage community messaging in real time.
        </p>
      </div>

      {/* Four Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Event Type */}
        <Card className="p-6 border-slate-100 shadow-sm rounded-[1.5rem] bg-white hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900 text-lg">Event Type</h3>
            <div className="p-2 bg-purple-50 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-purple-500 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-700">{currentEvent?.title || "Tornado Warning"}</p>
          <div className="mt-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status: <span className="text-slate-600">{currentEvent?.status || "Active"}</span></p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source: <span className="text-slate-600">National Weather Service</span></p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated: <span className="text-slate-600">14:41</span></p>
          </div>
        </Card>

        {/* Affected Area */}
        <Card className="p-6 border-slate-100 shadow-sm rounded-[1.5rem] bg-white hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900 text-lg">Affected Area</h3>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <MapPin className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-500 leading-snug">
            Official geolocation from National Weather Service
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-2">
            Exact coordinates applied to live map overlay
          </p>
        </Card>

        {/* Potential Impacts */}
        <Card className="p-6 border-slate-100 shadow-sm rounded-[1.5rem] bg-white hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900 text-lg">Potential Impacts</h3>
            <div className="p-2 bg-blue-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="space-y-1 text-[11px] font-bold text-slate-600">
            <p>Residential Areas</p>
            <p>Industrial Zones</p>
            <p>Critical Infrastructure</p>
          </div>
        </Card>

        {/* Alerts */}
        <Card className="p-6 border-slate-100 shadow-sm rounded-[1.5rem] bg-white hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900 text-lg">Alerts</h3>
            <div className="p-2 bg-red-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automatically Sent: <span className="text-slate-600">Yes</span></p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audience: <span className="text-slate-600">Impacted geographic area</span></p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customization: <span className="text-slate-600">Enabled</span></p>
          </div>
        </Card>
      </div>

      {/* Main Content Sections: Alert Preview & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Alert Message Preview */}
        <div className="lg:col-span-2">
          <Card className="p-8 border-slate-100 shadow-sm rounded-[2rem] bg-white h-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Alert Message Preview</h2>

            <div className="bg-slate-50/50 p-8 rounded-2xl border-l-4 border-red-500 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tornado Warning – Take Action</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Your geographic area is under a tornado warning. This means a tornado is imminent.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-slate-900 text-lg">Immediate Actions</h4>
              <ul className="space-y-4">
                {[
                  'Seek immediate shelter, preferably in a windowless room',
                  'Check in with family and friends using Ready2Go’s Are We Safe feature if directly impacted',
                  'Remain in your shelter-in-place location until the warning expires'
                ].map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1 font-black">✦</span>
                    <span className="text-slate-600 font-bold text-sm tracking-tight">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center text-slate-400 underline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link-2"><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 0 1 0 10h-2" /><line x1="8" x2="16" y1="12" y2="12" /></svg>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">National Weather Service – </span>
              <a href="#" className="text-xs font-bold text-blue-500 hover:underline uppercase tracking-widest">View Local Conditions</a>
            </div>
          </Card>
        </div>

        {/* Right Column: Stats & Quick Actions */}
        <div className="space-y-6">
          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Events</p>
              <p className="text-lg font-bold text-slate-900">2</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Warnings</p>
              <p className="text-lg font-bold text-slate-900">1</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alerts Sent</p>
              <p className="text-lg font-bold text-slate-900">12,450</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
              <p className="text-lg font-bold text-slate-900">14:41</p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <Card className="p-8 border-slate-100 shadow-sm rounded-[2rem] bg-white h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setShowMapModal(true)}
                className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl shadow-sm active:scale-95 transition-all text-sm tracking-tight"
              >
                View Map
              </Button>
              <Button
                onClick={() => setShowSendAlertModal(true)}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all text-sm tracking-tight"
              >
                Edit Community Message
              </Button>
              <Button
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all text-sm tracking-tight"
              >
                Resend Alert
              </Button>
              <Button
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all text-sm tracking-tight"
              >
                View Delivery Status
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Old Alert Preview removed as it's replaced by the new section above */}

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
