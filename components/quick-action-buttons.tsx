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
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
          <Zap className="w-24 h-24 rotate-12" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Quick Action Buttons</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 relative z-10">Administrative Control</p>

        <div className="flex flex-wrap gap-3 relative z-10">
          {[
            { label: 'Activate Virtual EOC', color: 'bg-red-500 hover:bg-red-600', icon: Zap, onClick: () => setIsEOCModalOpen(true), badge: 'Command' },
            { label: 'Send Community Alert', color: 'bg-blue-500 hover:bg-blue-600', icon: Bell, onClick: () => setIsAlertModalOpen(true), badge: 'Broadcast' },
            { label: 'View All Events', color: 'bg-slate-700 hover:bg-slate-800', icon: Eye, onClick: () => setIsEventsModalOpen(true), badge: 'Live' },
            { label: 'Generate Situation Report', color: 'bg-emerald-600 hover:bg-emerald-700', icon: CheckCircle, onClick: () => setIsSitRepModalOpen(true), badge: 'AI' },
            { label: 'Open Recovery Tools', color: 'bg-amber-400 hover:bg-amber-500', icon: AlertCircle, onClick: () => setIsRecoveryModalOpen(true), badge: 'Verify' }
          ].map((action, idx) => (
            <Button
              key={idx}
              onClick={action.onClick}
              className={cn(
                "h-12 px-5 text-white text-[11px] font-black uppercase rounded-xl flex items-center gap-3 border-none transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md",
                action.color
              )}
            >
              <action.icon className="w-4 h-4" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="leading-none">{action.label}</span>
                {action.badge && (
                  <span className="text-[8px] opacity-70 font-black tracking-[0.2em]">{action.badge}</span>
                )}
              </div>
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
