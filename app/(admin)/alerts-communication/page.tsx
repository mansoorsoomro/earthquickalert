'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Cloud, AlertCircle, Smartphone, MessageSquare, Mail, Zap, Loader2, RefreshCw, MapPin } from 'lucide-react'
import { AlertDetailModal } from '@/components/AlertDetailModal'
import { Switch } from '@/components/ui/switch'
import { Alert as APIAlert, AlertSeverity, AlertSource } from '@/lib/types/api-alerts'
import { cn } from '@/lib/utils'

export default function AlertsCommunicationPage() {
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    push: true,
    sms: true,
    email: false,
  })

  const [alerts, setAlerts] = useState<APIAlert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserAlerts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/alerts/users')
      if (res.ok) {
        const data = await res.json()
        setAlerts(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch user alerts', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserAlerts()
    const interval = setInterval(fetchUserAlerts, 60000) // Poll every 60s
    return () => clearInterval(interval)
  }, [fetchUserAlerts])

  const refresh = fetchUserAlerts

  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const toggleNotification = (key: string) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getAlertIcon = (source: AlertSource) => {
    switch (source) {
      case AlertSource.WEATHER_API: return Cloud
      case AlertSource.EARTHQUAKE_API: return Zap
      default: return AlertTriangle
    }
  }

  const getTypeIconStr = (source: AlertSource) => {
    switch (source) {
      case AlertSource.WEATHER_API: return '☁️'
      case AlertSource.EARTHQUAKE_API: return '⚡'
      default: return '⚠️'
    }
  }

  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.EXTREME: return { bg: 'bg-red-50', border: 'border-red-100', tag: 'bg-red-100 text-red-700', btn: 'bg-red-600 hover:bg-red-700 text-white' }
      case AlertSeverity.SEVERE: return { bg: 'bg-amber-50', border: 'border-amber-100', tag: 'bg-amber-100 text-amber-700', btn: 'bg-orange-600 hover:bg-orange-700 text-white' }
      case AlertSeverity.HIGH: return { bg: 'bg-amber-50', border: 'border-amber-100', tag: 'bg-amber-100 text-amber-700', btn: 'bg-orange-600 hover:bg-orange-700 text-white' }
      case AlertSeverity.MODERATE: return { bg: 'bg-yellow-50', border: 'border-yellow-100', tag: 'bg-yellow-100 text-yellow-700', btn: 'bg-yellow-600 hover:bg-yellow-700 text-white' }
      default: return { bg: 'bg-gray-50', border: 'border-gray-100', tag: 'bg-gray-100 text-gray-700', btn: 'bg-gray-600 hover:bg-gray-700 text-white' }
    }
  }

  const handleAlertClick = (alert: any) => {
    // Transform API alert to match modal's expected format if needed
    setSelectedAlert({
      ...alert,
      location: alert.affectedAreas?.join(', ') || 'Unknown Location',
      issuedTime: new Date(alert.timestamp).toLocaleTimeString(),
      expiry: alert.expiresAt ? new Date(alert.expiresAt).toLocaleTimeString() : 'N/A',
      type: alert.source === AlertSource.WEATHER_API ? 'Weather Alert' : alert.source === AlertSource.EARTHQUAKE_API ? 'Earthquake Alert' : 'System Alert'
    })
    setIsDetailModalOpen(true)
  }

  const handleCheckIn = () => {
    setIsDetailModalOpen(false)
  }

  return (

    <main className="p-6 space-y-6">
      <div className="flex justify-between items-start gap-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alerts & Communication</h1>
          <p className="text-gray-600">Stay informed and prepared with real-time emergency alerts delivered directly from the National Weather Service. This system checks for updates every minute, ensuring you receive the most current weather watches and warnings as they happen.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => refresh()}
          disabled={loading}
          className="bg-white whitespace-nowrap gap-2 font-bold uppercase tracking-widest text-xs"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Sync NWS
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 ml-2">
          <span className="font-semibold">Real-time monitoring:</span> Polling the National Weather Service every minute for the latest alerts.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading && alerts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="font-bold text-gray-500">Establishing Link with NWS...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 rounded-xl border border-gray-200">
              <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Warnings</h3>
              <p className="text-gray-500">The National Weather Service reports clear conditions for scanned sectors.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity)
              const Icon = getAlertIcon(alert.source)
              const typeLabel = alert.source === AlertSource.WEATHER_API ? 'Weather' : alert.source === AlertSource.EARTHQUAKE_API ? 'Geological' : 'Admin'

              return (
                <Card key={alert.id} className={cn(`border p-6 shadow-sm transition-all hover:shadow-md`, styles.border, styles.bg)}>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn(`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest`, styles.tag)}>
                          <span>{getTypeIconStr(alert.source)}</span>
                          {typeLabel} {alert.severity}
                        </span>
                        <span className="text-xs font-bold text-gray-400 ml-auto uppercase tracking-widest">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="font-black text-xl mb-2 text-gray-900 uppercase tracking-tight leading-tight">{alert.title}</h3>
                      <p className="text-sm font-medium text-gray-700 mb-3 line-clamp-2">{alert.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded border border-gray-200/50">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <span className="truncate max-w-[150px]">{alert.affectedAreas?.[0] || 'Regional Coverage'}</span>
                        </div>
                        {alert.expiresAt && (
                          <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded border border-gray-200/50">
                            <span className="text-red-500">⏱</span>
                            <span>Exp: {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      className={cn(`text-xs font-black uppercase tracking-widest w-full sm:w-auto h-10 px-6 shrink-0`, styles.btn)}
                      onClick={() => handleAlertClick(alert)}
                    >
                      Assess Threat
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
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
