'use client';

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Phone, FileText, ShieldAlert } from 'lucide-react'

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
  const messages = [
    {
      id: 1,
      title: 'Preparedness Alert',
      message: '"Weather watch in effect..."',
      time: '10 min ago',
    },
    {
      id: 2,
      title: 'Take Action Message',
      message: '"Seek shelter immediately..."',
      time: '15 min ago',
    },
    {
      id: 3,
      title: 'Resource Update',
      message: '"Shelter locations now open..."',
      time: '18 min ago',
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4">Communications Center</h2>

      <div className="space-y-4 mb-6">
        <div>
          <h3 className="font-semibold text-sm mb-3">Recent Messages Sent</h3>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{msg.title}</p>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{msg.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm mb-3">Actions</h3>
          {/* <div className="grid grid-cols-2 gap-2">
            <Button onClick={onSendAlert} className="bg-red-500 hover:bg-red-600 text-white" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Send Alert
            </Button>
            <Button onClick={onOpenSafetyGuide} className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Safety Guide
            </Button>
            <Button onClick={onNotifyLeaders} className="bg-yellow-400 hover:bg-yellow-500 text-black" size="sm">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Notify Leaders
            </Button>
            <Button onClick={onScheduleCall} className="bg-green-500 hover:bg-green-600 text-white" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>
          </div> */}
          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Send Alert
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Safety Guide
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" size="sm">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Notify Leaders
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
