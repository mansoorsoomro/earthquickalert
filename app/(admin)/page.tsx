'use client'

import React, { useState } from 'react'
import { DashboardStats } from '@/components/dashboard-stats'
import { GISMap } from '@/components/gis-map'
import { CommunicationsCenter } from '@/components/communications-center'
import { QuickActionButtons } from '@/components/quick-action-buttons'
import { SendCommunityAlertModal } from '@/components/modals/send-community-alert-modal'
import { ActiveEmergencyEventsModal } from '@/components/modals/active-emergency-events-modal'

export default function Dashboard() {
  const [showSendAlertModal, setShowSendAlertModal] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">📡</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Emergency Admin Terminal</h1>
          </div>
          <p className="text-slate-500">Real-time hazard monitoring and citizen communication portal.</p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GISMap />
          </div>
          <div className="space-y-6">
            <QuickActionButtons
              onSendAlert={() => setShowSendAlertModal(true)}
              onOpenEvents={() => setShowEventsModal(true)}
            />
            <CommunicationsCenter
              onSendAlert={() => setShowSendAlertModal(true)}
            />
          </div>
        </div>
      </main>

      <SendCommunityAlertModal isOpen={showSendAlertModal} onClose={() => setShowSendAlertModal(false)} />
      <ActiveEmergencyEventsModal isOpen={showEventsModal} onClose={() => setShowEventsModal(false)} />
    </div>
  )
}
