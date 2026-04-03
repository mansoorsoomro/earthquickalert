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
import { SetupWizard } from '@/components/setup-wizard'

export default function Dashboard() {
  const [showSendAlertModal, setShowSendAlertModal] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)

  // Setup Status Logic
  const [checkingSetup, setCheckingSetup] = useState(true)
  const [requiresSetup, setRequiresSetup] = useState(false)
  const [isOrphan, setIsOrphan] = useState(false)
  const [licenseData, setLicenseData] = useState({ id: '', orgName: '' })

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const res = await fetch('/api/admin/eoc-setup-status')
      const data = await res.json()

      if (data.requiresSetup) {
        setRequiresSetup(true)
        if (data.orphan) {
          setIsOrphan(true)
        } else {
          setLicenseData({ id: data.licenseId, orgName: data.organizationName })
        }
      }
    } catch (err) {
      console.error("Setup Check Failed", err)
    } finally {
      setCheckingSetup(false)
    }
  }

  if (checkingSetup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen">
        <div className="animate-pulse text-slate-400 font-bold text-lg">Initializing Terminal...</div>
      </div>
    )
  }

  if (requiresSetup && !isOrphan) {
    return (
      <div className="flex-1 relative bg-slate-50">
        {/* The wizard intercepts the entire screen */}
        <SetupWizard
          licenseId={licenseData.id}
          organizationName={licenseData.orgName}
          onComplete={() => setRequiresSetup(false)}
        />
      </div>
    )
  }

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

          {/* <div className="lg:col-span-3">
            <CommunicationsCenter />
          </div> */}

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
