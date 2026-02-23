'use client';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Zap, Bell, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { SendCommunityAlertModal } from './modals/send-community-alert-modal'
import { ActiveEmergencyEventsModal } from './modals/active-emergency-events-modal'

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
      <Card className="p-6">
        <h3 className="font-semibold text-sm mb-4">Quick Action Buttons</h3>

        <div className="bg-gray-50 rounded-lg p-4">
          {/* <p className="text-sm text-gray-600 mb-4">Pending Items</p> */}
          <div className="flex flex-wrap gap-3">
            {actions.map((action, idx) => {
              const Icon = action.icon
              return (
                <Button
                  key={idx}
                  onClick={action.onClick}
                  className={`${action.color} text-white`}
                  size="sm"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              )
            })}
          </div>
        </div>
      </Card>

      <SendCommunityAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
      <ActiveEmergencyEventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
      />
    </>
  )
}
