'use client'

import React, { useState, useEffect } from 'react'
import { DashboardStats } from '@/components/dashboard-stats'
import { GISMap } from '@/components/gis-map'
import { CommunicationsCenter } from '@/components/communications-center'
import { QuickActionButtons } from '@/components/quick-action-buttons'
import { SendCommunityAlertModal } from '@/components/modals/send-community-alert-modal'
import { ActiveEmergencyEventsModal } from '@/components/modals/active-emergency-events-modal'
import { ThreatMonitoring } from '@/components/threat-monitoring'
import { VirtualEOCOperations } from '@/components/virtual-eoc-operations'
import { PreparednessTasks } from '@/components/preparedness-tasks'
import { FirstResponderTools } from '@/components/first-responder-tools'

export default function Dashboard() {
  const [showSendAlertModal, setShowSendAlertModal] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <main className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-200">
                <span className="text-white text-xl font-bold">🚨</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Emergency Operations Dashboard</h1>
            </div>
            <p className="text-slate-500 font-medium ml-13">Civilian monitoring and multi-hazard response coordination terminal interface system.</p>
          </div>
        </div>

        {/* Tactical Alert Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-1 bg-red-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Tactical Alert Grid</h2>
          </div>
          <DashboardStats />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-indigo-600 rounded-full" />
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">GIS Impact Map</h2>
            </div>
            <GISMap />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-amber-600 rounded-full" />
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Threat Monitoring</h2>
            </div>
            <ThreatMonitoring />
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FirstResponderTools />
            <VirtualEOCOperations />
          </div>

          <div className="lg:col-span-3">
            <CommunicationsCenter />
          </div>

          <div className="lg:col-span-3">
            <PreparednessTasks />
          </div>

          <div className="lg:col-span-3">
            <QuickActionButtons
              onSendAlert={() => setShowSendAlertModal(true)}
              onOpenEvents={() => setShowEventsModal(true)}
            />
          </div>
        </div>
      </main>

      <SendCommunityAlertModal isOpen={showSendAlertModal} onClose={() => setShowSendAlertModal(false)} />
      <ActiveEmergencyEventsModal isOpen={showEventsModal} onClose={() => setShowEventsModal(false)} />
    </div>
  )
}
