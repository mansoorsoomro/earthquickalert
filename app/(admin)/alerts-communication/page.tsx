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
      case AlertSeverity.EXTREME:
        return {
          bg: 'bg-white',
          border: 'border-red-200',
          tag: 'bg-red-500 text-white',
          btn: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
        }
      case AlertSeverity.SEVERE:
      case AlertSeverity.HIGH:
        return {
          bg: 'bg-white',
          border: 'border-orange-200',
          tag: 'bg-orange-500 text-white',
          btn: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
        }
      case AlertSeverity.MODERATE:
        return {
          bg: 'bg-white',
          border: 'border-yellow-200',
          tag: 'bg-yellow-500 text-white',
          btn: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm'
        }
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          tag: 'bg-gray-100 text-gray-700',
          btn: 'bg-gray-800 hover:bg-black text-white shadow-sm'
        }
    }
  }

  const handleAlertClick = (alert: any) => {
    setSelectedAlert({
      ...alert,
      location: alert.affectedAreas?.join(', ') || 'Unknown Location',
      issuedTime: new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiry: alert.expiresAt ? new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      type: alert.source === AlertSource.WEATHER_API ? 'Weather Alert' : alert.source === AlertSource.EARTHQUAKE_API ? 'Earthquake Alert' : 'System Alert'
    })
    setIsDetailModalOpen(true)
  }

  const handleCheckIn = () => {
    setIsDetailModalOpen(false)
  }

  return (
    <main className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* System Alert Banner */}
      <div className="flex items-center justify-between gap-4 bg-white border-2 border-red-500 p-4 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-600" />
          <p className="font-bold text-red-700 text-sm tracking-tight uppercase">
            System Alert: Pushing 1.0 update to the system. Go through it and confirm if its OK.
          </p>
        </div>
        <button className="text-red-700/50 hover:text-red-700">
          <AlertCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Alerts & Communication</h1>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            Stay informed and prepared with real-time emergency alerts delivered directly from the National Weather Service.
            This system checks for updates every minute.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refresh()}
          disabled={loading}
          className="h-11 px-6 bg-white border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 rounded-xl"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />}
          Refresh Sync
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {loading && alerts.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Syncing with NWS Command...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Atmosphere Scanned: Clear</h3>
              <p className="text-gray-500 text-sm">No active warnings detected in the current sector.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity)
              const typeLabel = alert.source === AlertSource.WEATHER_API ? 'Weather' : alert.source === AlertSource.EARTHQUAKE_API ? 'Geo' : 'System'

              return (
                <Card key={alert.id} className={cn(`group border-2 p-5 shadow-sm transition-all hover:shadow-md rounded-2xl`, styles.border, styles.bg)}>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={cn(`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em]`, styles.tag)}>
                          {typeLabel} {alert.severity}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Issued {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-2xl text-gray-900 leading-tight mb-1">{alert.title}</h3>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-bold uppercase tracking-wider">{alert.affectedAreas?.[0] || 'Regional'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3 shrink-0">
                      {alert.expiresAt && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-xs font-black text-gray-400">EXP:</span>
                          <span className="text-xs font-black text-red-500">
                            {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      <Button
                        className={cn(`text-[11px] font-black uppercase tracking-[0.15em] px-8 h-12 rounded-xl`, styles.btn)}
                        onClick={() => handleAlertClick(alert)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>


        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border-gray-100 shadow-sm rounded-2xl bg-white">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Alert Details</h3>

            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100">
                  <span className="text-xl">📡</span>
                </div>
                <div>
                  <p className="font-extrabold text-blue-900 leading-tight">National Weather Service</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">Official Source</p>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  "Official, government-issued weather alerts",
                  "Real-time updates during active weather events",
                  "Timely watches, warnings, and advisories",
                  "Reliable information for quick decision-making"
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-xs font-semibold text-gray-600 leading-snug">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-6 border-gray-100 shadow-sm rounded-2xl bg-white">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Notifications</h3>
            <div className="space-y-4">
              {[
                { key: 'push', label: 'Push Notifications', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50' },
                { key: 'sms', label: 'SMS Alerts', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
                { key: 'email', label: 'Email Alerts', icon: Mail, color: 'text-gray-400', bg: 'bg-gray-50', disabled: true },
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border border-current/10", pref.bg, pref.color)}>
                      <pref.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-bold ${pref.disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                      {pref.label}
                    </span>
                  </div>
                  <Switch
                    checked={notificationPrefs[pref.key]}
                    onCheckedChange={() => !pref.disabled && toggleNotification(pref.key)}
                    disabled={pref.disabled}
                    className="data-[state=checked]:bg-blue-600"
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
