'use client'

import React, { useState } from 'react'
import { DashboardStats } from '@/components/dashboard-stats'
import { GISMap } from '@/components/gis-map'
import { ThreatDetection } from '@/components/threat-detection'
import { FirstResponderTools } from '@/components/first-responder-tools'
import { CommunicationsCenter } from '@/components/communications-center'
import { VirtualEOCOperations } from '@/components/virtual-eoc-operations'
import { PostEventRecovery } from '@/components/post-event-recovery'
import { QuickActionButtons } from '@/components/quick-action-buttons'
import { SendCommunityAlertModal } from '@/components/modals/send-community-alert-modal'
import { ActiveEmergencyEventsModal } from '@/components/modals/active-emergency-events-modal'
import { ActivateVirtualEOCModal } from '@/components/modals/activate-virtual-eoc-modal'
import { SituationReportModal } from '@/components/modals/situation-report-modal'
import { RecoveryToolsModal } from '@/components/modals/recovery-tools-modal'
import { DamageReportModal } from '@/components/modals/damage-report-modal'
import { SafetyGuideModal } from '@/components/modals/safety-guide-modal'
import { NotifyLeadersModal } from '@/components/modals/notify-leaders-modal'
import { ScheduleCallModal } from '@/components/modals/schedule-call-modal'

export default function Dashboard() {
  const [showSendAlertModal, setShowSendAlertModal] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)
  const [showActivateEOCModal, setShowActivateEOCModal] = useState(false)
  const [showSitRepModal, setShowSitRepModal] = useState(false)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [showDamageReportModal, setShowDamageReportModal] = useState(false)
  const [showSafetyGuideModal, setShowSafetyGuideModal] = useState(false)
  const [showNotifyLeadersModal, setShowNotifyLeadersModal] = useState(false)
  const [showScheduleCallModal, setShowScheduleCallModal] = useState(false)

  return (
    <div className="flex-1 overflow-auto">
      <main className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white font-bold">⚠</span>
            </div>
            <h1 className="text-3xl font-bold">Emergency Operations Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Real-time situational awareness, alerts, and community response tools — all in one place.</p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <GISMap />
          </div>
          <div>
            <ThreatDetection />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FirstResponderTools
            onOpenAssignTask={() => setShowEventsModal(true)}
            onOpenSitRep={() => setShowSitRepModal(true)}
            onOpenActivateEOC={() => setShowActivateEOCModal(true)}
          />
          <CommunicationsCenter
            onSendAlert={() => setShowSendAlertModal(true)}
            onOpenSafetyGuide={() => setShowSafetyGuideModal(true)}
            onNotifyLeaders={() => setShowNotifyLeadersModal(true)}
            onScheduleCall={() => setShowScheduleCallModal(true)}
          />
        </div>

        <VirtualEOCOperations onOpenSitRep={() => setShowSitRepModal(true)} />

        <PostEventRecovery onOpenDamageReports={() => setShowDamageReportModal(true)} />

        <QuickActionButtons
          onSendAlert={() => setShowSendAlertModal(true)}
          onOpenEvents={() => setShowEventsModal(true)}
          onActivateEOC={() => setShowActivateEOCModal(true)}
          onOpenSitRep={() => setShowSitRepModal(true)}
          onOpenRecovery={() => setShowRecoveryModal(true)}
        />
      </main>

      <SendCommunityAlertModal isOpen={showSendAlertModal} onClose={() => setShowSendAlertModal(false)} />
      <ActiveEmergencyEventsModal isOpen={showEventsModal} onClose={() => setShowEventsModal(false)} />
      <ActivateVirtualEOCModal isOpen={showActivateEOCModal} onClose={() => setShowActivateEOCModal(false)} />
      <SituationReportModal isOpen={showSitRepModal} onClose={() => setShowSitRepModal(false)} />
      <RecoveryToolsModal isOpen={showRecoveryModal} onClose={() => setShowRecoveryModal(false)} />
      <DamageReportModal isOpen={showDamageReportModal} onClose={() => setShowDamageReportModal(false)} />
      <SafetyGuideModal isOpen={showSafetyGuideModal} onClose={() => setShowSafetyGuideModal(false)} />
      <NotifyLeadersModal isOpen={showNotifyLeadersModal} onClose={() => setShowNotifyLeadersModal(false)} />
      <ScheduleCallModal isOpen={showScheduleCallModal} onClose={() => setShowScheduleCallModal(false)} />
    </div>
  )
}
