'use client';

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Zap, Bell, Eye, CheckCircle, AlertCircle } from 'lucide-react'

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
  const actions = [
    {
      icon: AlertCircle,
      label: 'Activate Virtual EOC',
      color: 'bg-red-500 hover:bg-red-600',
      // onClick: onActivateEOC,
    },
    {
      icon: Bell,
      label: 'Send Community Alert',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onSendAlert,
    },
    {
      icon: Eye,
      label: 'View All Events',
      color: 'bg-gray-800 hover:bg-gray-900',
      onClick: onOpenEvents,
    },
    {
      icon: CheckCircle,
      label: 'Generate Situation Report',
      color: 'bg-green-500 hover:bg-green-600',
      // onClick: onOpenSitRep,
    },
    {
      icon: Zap,
      label: 'Open Recovery Tools',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      // onClick: onOpenRecovery,
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-sm mb-4">Quick Action Buttons</h3>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-4">Pending Items</p>
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
  )
}
