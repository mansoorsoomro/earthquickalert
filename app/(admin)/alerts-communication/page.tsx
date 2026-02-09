'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Cloud, AlertCircle, Smartphone, MessageSquare, Mail, Zap } from 'lucide-react'
import { AlertDetailModal } from '@/components/AlertDetailModal'
import { Switch } from '@/components/ui/switch'

export default function AlertsCommunicationPage() {
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    push: true,
    sms: true,
    email: false,
  })

  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const toggleNotification = (key: string) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const alerts = [
    {
      id: 1,
      type: 'Warning',
      icon: AlertTriangle,
      typeIcon: '⚠️',
      severity: 'red',
      title: 'Tornado Watch',
      location: 'Cook County, DuPage County',
      expiry: '3:45 PM',
      issuedTime: '12 min ago',
      buttonColor: 'red',
      buttonLabel: 'Take Action',
    },
    {
      id: 2,
      type: 'Warning',
      icon: Zap,
      typeIcon: '⚡',
      severity: 'orange',
      title: 'Severe Tornado Warning',
      location: 'Lake County, McHenry County',
      expiry: '4:15 PM',
      issuedTime: '45 min ago',
      buttonColor: 'orange',
      buttonLabel: 'Get Prepared',
    },
    {
      id: 3,
      type: 'Watch',
      icon: Cloud,
      typeIcon: '☁️',
      severity: 'yellow',
      title: 'Blizzard Watch',
      location: 'Will County, Kankakee County',
      expiry: '8:00 PM',
      issuedTime: '2 hours ago',
      buttonColor: 'red',
      buttonLabel: 'Take Action',
    },
  ]

  const getBgColorClass = (severity: string) => {
    const colors = {
      red: 'bg-red-50',
      orange: 'bg-amber-50',
      yellow: 'bg-yellow-50',
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-50'
  }

  const getBorderColorClass = (severity: string) => {
    const colors = {
      red: 'border-red-100',
      orange: 'border-amber-100',
      yellow: 'border-yellow-100',
    }
    return colors[severity as keyof typeof colors] || 'border-gray-100'
  }

  const getTypeTagClass = (severity: string) => {
    const colors = {
      red: 'bg-red-100 text-red-700',
      orange: 'bg-amber-100 text-amber-700',
      yellow: 'bg-yellow-100 text-yellow-700',
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getButtonClass = (color: string) => {
    const colors = {
      red: 'bg-red-600 hover:bg-red-700 text-white',
      orange: 'bg-orange-600 hover:bg-orange-700 text-white',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    }
    return colors[color as keyof typeof colors] || 'bg-gray-600 hover:bg-gray-700'
  }

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert)
    setIsDetailModalOpen(true)
  }

  const handleCheckIn = () => {
    setIsDetailModalOpen(false)
  }

  return (

    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Alerts & Communication</h1>
        <p className="text-gray-600">Stay informed and prepared with real-time emergency alerts delivered directly from the National Weather Service. This system checks for updates every minute, ensuring you receive the most current weather watches and warnings as they happen.</p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 ml-2">
          <span className="font-semibold">Real-time monitoring:</span> Polling the National Weather Service every minute for the latest alerts.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {alerts.map((alert) => {
            return (
              <Card key={alert.id} className={`border ${getBorderColorClass(alert.severity)} ${getBgColorClass(alert.severity)} p-6`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold ${getTypeTagClass(alert.severity)}`}>
                        <span>{alert.typeIcon}</span>
                        {alert.type}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">Issued {alert.issuedTime}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-700 mb-3">{alert.location}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span>⏱</span>
                      <span>Expires {alert.expiry}</span>
                    </div>
                  </div>
                  <Button
                    className={`${getButtonClass(alert.buttonColor)} text-sm font-semibold ml-4 flex-shrink-0`}
                    size="sm"
                    onClick={() => handleAlertClick(alert)}
                  >
                    {alert.buttonLabel}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="space-y-6">
          <Card className="p-6 h-fit border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Alerts Details</h3>

            <div className="bg-indigo-50/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm p-1">
                  <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    NWS
                  </div>
                </div>
                <p className="font-bold text-lg text-gray-900">National Weather Service</p>
              </div>

              <ul className="space-y-4">
                {[
                  "Official, government-issued weather alerts",
                  "Real-time updates during active weather events",
                  "Timely watches, warnings, and advisories for your area",
                  "Reliable information designed to support quick decision-making"
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 leading-tight">
                    <span className="text-gray-900 font-bold">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-6 h-fit border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Notification Preferences</h3>
            <div className="space-y-5">
              {[
                { key: 'push', label: 'Push Notifications', icon: Smartphone },
                { key: 'sms', label: 'SMS Alerts', icon: MessageSquare },
                { key: 'email', label: 'Email Alerts', icon: Mail, disabled: true },
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-700 border border-gray-100">
                      <pref.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-base font-semibold ${pref.disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                      {pref.label}
                    </span>
                  </div>
                  <Switch
                    checked={notificationPrefs[pref.key]}
                    onCheckedChange={() => !pref.disabled && toggleNotification(pref.key)}
                    disabled={pref.disabled}
                    className="data-[state=checked]:bg-indigo-900"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AlertDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onCheckIn={handleCheckIn}
        alert={selectedAlert}
      />
    </main>
  )
}
