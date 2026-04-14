'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  Zap,
  CloudRain,
  Smartphone,
  MessageSquare,
  Mail,
  Info,
  Search,
  Bell,
  Clock
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { AlertSeverity, AlertSource } from '@/lib/types/api-alerts'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function AlertsCommunicationPage() {
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    push: true,
    sms: true,
    email: false,
  })

  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)

  const fetchDynamicAlerts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/alerts-sent-emergencies')
      if (res.ok) {
        const data = await res.json()
        const formattedAlerts = data.map((item: any) => ({
          id: item._id || Math.random().toString(),
          title: item.name || 'System Alert',
          severity: item.status === 'Critical' ? AlertSeverity.EXTREME : item.status === 'High' ? AlertSeverity.SEVERE : AlertSeverity.MODERATE,
          affectedAreas: [item.location || 'Regional Sector'],
          timestamp: item.timestamp || new Date().toISOString(),
          expiresAt: item.expiresAt || new Date(Date.now() + 4 * 60 * 60000).toISOString(),
          description: item.description || `Automatic alert dispatched for ${item.type}`,
          source: AlertSource.WEATHER_API
        }))
        setAlerts(formattedAlerts)

        // Select first alert by default if not already selected
        if (formattedAlerts.length > 0 && !selectedAlertId) {
          setSelectedAlertId(formattedAlerts[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch emergency alerts', err)
    } finally {
      setLoading(false)
    }
  }, [selectedAlertId])

  useEffect(() => {
    fetchDynamicAlerts()
    const interval = setInterval(fetchDynamicAlerts, 60000)
    return () => clearInterval(interval)
  }, [fetchDynamicAlerts])

  const toggleNotification = (key: string) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const selectedAlert = alerts.find(a => a.id === selectedAlertId)

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 space-y-8 max-w-7xl mx-auto">
      {/* Top Navigation / Search area */}

      {/* Hero Header */}
      <Card className="p-8 lg:p-12 bg-white border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6366F1]" />
        <div className="flex justify-between items-start gap-8">
          <div className="space-y-4 flex-1">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">Alerts & Communication</h1>
            <p className="text-slate-600 font-medium text-sm lg:text-base max-w-4xl leading-relaxed">
              Stay informed and prepared with real-time emergency alerts delivered directly from the National Weather Service.
              This system checks for updates every minute, ensuring you receive the most current weather watches and warnings as they happen.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchDynamicAlerts()}
            className="mt-2 border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 font-bold"
          >
            <Clock size={16} className="text-blue-500" />
            Check Updates
          </Button>
        </div>
      </Card>

      {/* Status Bar */}
      <div className="bg-[#EBEBFF] border border-[#6366F1]/10 p-4 rounded-xl flex items-center gap-4 text-[#4338CA]">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
          <Info size={16} />
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <span className="text-[#3730A3]">Real-time monitoring:</span>
          <span className="font-medium text-[#4338CA]/80">
            {alerts.length > 0
              ? `Signals are live: Most recent alert detected in ${alerts[0].affectedAreas[0]}.`
              : "Polling the National Weather Service every minute for the latest alerts."
            }
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Alerts Feed */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="p-20 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-sm font-bold text-slate-400">Loading dynamic alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-[48px] border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-blue-500/5">
                <CloudRain className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">Sector Nominal</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No active alerts detected in your sector logic.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isWarning = alert.title.toLowerCase().includes('warning');
              const isTornado = alert.title.toLowerCase().includes('tornado');
              const isBlizzard = alert.title.toLowerCase().includes('blizzard');
              const isSelected = selectedAlertId === alert.id;

              const badgeColor = isWarning ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-amber-600 border-amber-100';
              const icon = isTornado ? <AlertTriangle className="w-5 h-5 text-red-500" /> : isBlizzard ? <CloudRain className="w-5 h-5 text-amber-500" /> : <Zap className="w-5 h-5 text-orange-500" />;
              const buttonColor = isWarning ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600';
              const buttonText = isWarning ? 'Take Action' : 'Get Prepared';

              return (
                <Card
                  key={alert.id}
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={cn(
                    "cursor-pointer bg-white border-slate-200 rounded-2xl p-8 hover:shadow-md transition-all relative overflow-hidden",
                    isSelected ? "ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-500/10" : "border-slate-200"
                  )}
                >
                  {isSelected && <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 -mr-12 -mt-12 rounded-full opacity-50" />}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <span className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase border", badgeColor)}>
                        {isWarning ? 'Warning' : 'Watch'}
                      </span>
                      {icon}
                    </div>
                    <span className="text-slate-400 text-[11px] font-medium">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{alert.title}</h2>
                    <p className="text-slate-500 text-sm font-medium">{alert.affectedAreas?.join(', ') || 'Metropolitan Area'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={16} />
                      <span className="text-xs font-semibold">Expires: {new Date(alert.expiresAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <Button className={cn("rounded-lg px-8 py-6 font-bold text-white transition-all active:scale-95 shadow-sm", buttonColor)}>
                      {buttonText}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebars */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-8 h-fit">
            {/* Alerts Details Sidepanel */}
            <Card className="bg-white border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Alerts Details</h3>

              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                  <Image src="https://www.weather.gov/assets/images/nws_logo.png" alt="NWS" width={32} height={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-1">Data Source</p>
                  <p className="text-sm font-black text-slate-900 tracking-tight">National Weather Service</p>
                </div>
              </div>

              {selectedAlert ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-red-600 tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live Intelligence
                    </p>
                    <h4 className="text-xl font-black text-slate-900 leading-tight">{selectedAlert.title}</h4>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] font-bold uppercase text-blue-600 tracking-widest mb-2">Primary Location</p>
                    <p className="text-sm font-bold text-slate-700">{selectedAlert.affectedAreas[0]}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1 italic">NWS Sector Detection: Real-time Coordinate Sync active.</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Tactical Summary</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed lowercase first-letter:uppercase pr-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {selectedAlert.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <ul className="space-y-3">
                      {[
                        'NWS-Verified Alert Chain',
                        'Dynamic Location Tracking',
                        'Priority Communication Level'
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-[11px] font-bold text-slate-500 items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[32px]">
                  <CloudRain className="w-12 h-12 text-slate-200 mx-auto" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select an alert to <br /> view intel</p>
                </div>
              )}
            </Card>

            {/* Notification Preferences Sidepanel */}
            <Card className="bg-white border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                {[
                  { id: 'push', label: 'Push Notifications', icon: <Smartphone className="w-5 h-5" /> },
                  { id: 'sms', label: 'SMS Alerts', icon: <MessageSquare className="w-5 h-5" /> },
                  { id: 'email', label: 'Email Alerts', icon: <Mail className="w-5 h-5" /> },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="text-slate-700">{pref.icon}</div>
                      <span className="text-sm font-bold text-slate-800">{pref.label}</span>
                    </div>
                    <Switch
                      checked={notificationPrefs[pref.id]}
                      onCheckedChange={() => toggleNotification(pref.id)}
                      className="data-[state=checked]:bg-[#312E81]"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
