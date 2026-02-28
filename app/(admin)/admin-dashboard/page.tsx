'use client'

import React, { useState } from 'react'
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

        {/* Stats Cards Row */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GISMap />
          </div>
          <div>
            <ThreatMonitoring />
          </div>

          <div>
            <FirstResponderTools />
          </div>
          <div>
            <VirtualEOCOperations />
          </div>
          <div>
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
