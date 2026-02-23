'use client';

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Phone, FileText, ShieldAlert } from 'lucide-react'
import { SendCommunityAlertModal } from './modals/send-community-alert-modal'
import { SafetyGuideModal } from './modals/safety-guide-modal'
import { NotifyLeadersModal } from './modals/notify-leaders-modal'
import { ScheduleCallModal } from './modals/schedule-call-modal'
import { useAlerts } from '@/lib/store/alert-store'

interface CommunicationsCenterProps {
  onSendAlert?: () => void
  onOpenSafetyGuide?: () => void
  onNotifyLeaders?: () => void
  onScheduleCall?: () => void
}

export function CommunicationsCenter({
  onSendAlert,
  onOpenSafetyGuide,
  onNotifyLeaders,
  onScheduleCall
}: CommunicationsCenterProps) {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [isSafetyGuideModalOpen, setIsSafetyGuideModalOpen] = useState(false)
  const [isNotifyLeadersModalOpen, setIsNotifyLeadersModalOpen] = useState(false)
  const [isScheduleCallModalOpen, setIsScheduleCallModalOpen] = useState(false)

  const { alerts } = useAlerts()

  // Sort by date (newest first) and get top 3
  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const formatTimeAgo = (date: Date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60))
    const minutesDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60))

    if (Math.abs(daysDifference) > 0) {
      return rtf.format(daysDifference, 'day')
    } else if (Math.abs(hoursDifference) > 0) {
      return rtf.format(hoursDifference, 'hour')
    } else {
      return rtf.format(minutesDifference, 'minute')
    }
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Communications Center</h2>

        <div className="space-y-4 mb-6">
          {/* <div>
            <h3 className="font-semibold text-sm mb-3">Recent Messages Sent</h3>
            <div className="space-y-3">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((msg) => (
                  <div key={msg.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{msg.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{msg.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatTimeAgo(new Date(msg.createdAt))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No recent messages sent.</p>
              )}
            </div>
          </div> */}

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-3">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setIsAlertModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                Send Alert
              </Button>
              <Button
                onClick={() => setIsSafetyGuideModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Safety Guide
              </Button>
              {/* <Button
                onClick={() => setIsNotifyLeadersModalOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                size="sm"
              >
                <ShieldAlert className="w-4 h-4 mr-2" />
                Notify Leaders
              </Button> */}
              {/* <Button
                onClick={() => setIsScheduleCallModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <Phone className="w-4 h-4 mr-2" />
                Schedule Call
              </Button> */}
            </div>
          </div>
        </div>
      </Card>

      <SendCommunityAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
      <SafetyGuideModal
        isOpen={isSafetyGuideModalOpen}
        onClose={() => setIsSafetyGuideModalOpen(false)}
      />
      <NotifyLeadersModal
        isOpen={isNotifyLeadersModalOpen}
        onClose={() => setIsNotifyLeadersModalOpen(false)}
      />
      <ScheduleCallModal
        isOpen={isScheduleCallModalOpen}
        onClose={() => setIsScheduleCallModalOpen(false)}
      />
    </>
  )
}
