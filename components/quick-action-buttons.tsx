'use client';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Zap, Bell, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SendCommunityAlertModal } from './modals/send-community-alert-modal'
import { ActiveEmergencyEventsModal } from './modals/active-emergency-events-modal'
import { GISEOCActivatedModal } from './modals/gis-eoc-activated-modal'
import { SituationReportModal } from './modals/situation-report-modal'
import { RecoveryToolsModal } from './modals/recovery-tools-modal'

interface QuickActionButtonsProps {
  onSendAlert?: () => void
  onOpenEvents?: () => void
  onActivateEOC?: () => void
  onOpenSitRep?: () => void
  onOpenRecovery?: () => void
}

export function QuickActionButtons({
  onSendAlert,
  onOpenEvents,
  onActivateEOC,
  onOpenSitRep,
  onOpenRecovery
}: QuickActionButtonsProps) {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false)
  const [isEOCModalOpen, setIsEOCModalOpen] = useState(false)
  const [isSitRepModalOpen, setIsSitRepModalOpen] = useState(false)
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false)

  const actions = [
    {
      icon: Bell,
      label: 'Send Alert',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setIsAlertModalOpen(true),
    },
    {
      icon: Eye,
      label: 'View Active Events',
      color: 'bg-slate-800 hover:bg-slate-900',
      onClick: () => setIsEventsModalOpen(true),
    },
  ]

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Action Buttons</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pending Items</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Activate Virtual EOC', color: 'bg-red-500 hover:bg-red-600', icon: Zap, onClick: () => setIsEOCModalOpen(true) },
            { label: 'Send Community Alert', color: 'bg-blue-500 hover:bg-blue-600', icon: Bell, onClick: () => setIsAlertModalOpen(true) },
            { label: 'View All Events', color: 'bg-slate-700 hover:bg-slate-800', icon: Eye, onClick: () => setIsEventsModalOpen(true) },
            { label: 'Generate Situation Report', color: 'bg-emerald-500 hover:bg-emerald-600', icon: CheckCircle, onClick: () => setIsSitRepModalOpen(true) },
            { label: 'Open Recovery Tools', color: 'bg-amber-400 hover:bg-amber-500', icon: AlertCircle, onClick: () => setIsRecoveryModalOpen(true) }
          ].map((action, idx) => (
            <Button
              key={idx}
              onClick={action.onClick}
              className={cn(
                "h-10 px-4 text-white text-[11px] font-bold uppercase rounded-lg flex items-center gap-2 border-none transition-all hover:scale-[1.02]",
                action.color
              )}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <SendCommunityAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
      <ActiveEmergencyEventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
      />
      <GISEOCActivatedModal
        isOpen={isEOCModalOpen}
        onClose={() => setIsEOCModalOpen(false)}
      />
      <SituationReportModal
        isOpen={isSitRepModalOpen}
        onClose={() => setIsSitRepModalOpen(false)}
      />
      <RecoveryToolsModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
      />
    </>
  )
}
