'use client';

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Phone, FileText, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
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
      <Card className="p-6 h-full flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Communications Center</h2>

        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Messages Sent</h3>
            <div className="space-y-3">
              {[
                { title: 'Preparedness Alert', msg: 'Weather watch in effect...', time: '10 min ago', bg: 'bg-slate-50' },
                { title: 'Take Action Message', msg: 'Seek shelter immediately...', time: '15 min ago', bg: 'bg-red-50' },
                { title: 'Resource Update', msg: 'Shelter locations now open...', time: '18 min ago', bg: 'bg-slate-50' }
              ].map((msg, idx) => (
                <div key={idx} className={cn("p-4 rounded-xl flex justify-between items-start", msg.bg)}>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{msg.title}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">"{msg.msg}"</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase ml-4">{msg.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setIsAlertModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs h-10 rounded-lg flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Send Alert
              </Button>
              <Button
                onClick={() => setIsSafetyGuideModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs h-10 rounded-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Safety Guide
              </Button>
              <Button
                onClick={() => setIsNotifyLeadersModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs h-10 rounded-lg flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Notify Leaders
              </Button>
              <Button
                onClick={() => setIsScheduleCallModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs h-10 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Schedule Call
              </Button>
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
