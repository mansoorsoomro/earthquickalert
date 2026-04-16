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
  Clock,
  Globe,
  ShieldCheck,
  Flag,
  ShieldAlert,
  ChevronRight,
  Wand2,
  Loader2,
  Send,
  Search as SearchIcon
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { AlertSeverity, AlertSource } from '@/lib/types/api-alerts'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const NWS_NATIONAL_ALERTS = [
  { id: 'tornado_warning', name: 'Tornado Warning', severity: 'Extreme', icon: <AlertTriangle className="text-red-500" size={16} /> },
  { id: 'severe_thunderstorm', name: 'Severe Thunderstorm Warning', severity: 'Severe', icon: <Zap className="text-amber-500" size={16} /> },
  { id: 'flash_flood', name: 'Flash Flood Warning', severity: 'Severe', icon: <CloudRain className="text-blue-500" size={16} /> },
  { id: 'blizzard_warning', name: 'Blizzard Warning', severity: 'Extreme', icon: <CloudRain className="text-indigo-500" size={16} /> },
  { id: 'winter_storm', name: 'Winter Storm Warning', severity: 'High', icon: <CloudRain className="text-slate-500" size={16} /> },
  { id: 'hurricane_warning', name: 'Hurricane Warning', severity: 'Extreme', icon: <Zap className="text-red-600" size={16} /> },
  { id: 'heat_advisory', name: 'Excessive Heat Advisory', severity: 'Moderate', icon: <Info className="text-orange-500" size={16} /> },
  { id: 'fire_weather', name: 'Fire Weather Warning', severity: 'High', icon: <AlertTriangle className="text-orange-600" size={16} /> },
  { id: 'tsunami_warning', name: 'Tsunami Warning', severity: 'Extreme', icon: <AlertTriangle className="text-red-700" size={16} /> },
  { id: 'high_wind', name: 'High Wind Warning', severity: 'High', icon: <Zap className="text-blue-400" size={16} /> },
];

export default function AlertsCommunicationPage() {
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    push: true,
    sms: true,
    email: false,
  })

  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [countryStatuses, setCountryStatuses] = useState<any[]>([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [broadcastingCountry, setBroadcastingCountry] = useState<string | null>(null)

  // National Dispatch Wizard States
  const [dispatchStep, setDispatchStep] = useState(1)
  const [selectedNwsType, setSelectedNwsType] = useState<string | null>(null)
  const [dispatchChannels, setDispatchChannels] = useState<string[]>(['push', 'sms'])
  const [dispatchMessage, setDispatchMessage] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [isDispatching, setIsDispatching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
    const checkRoleAndFetchCountryData = async () => {
      try {
        const res = await fetch('/api/admin/sub-admin-country-status')
        if (res.ok) {
          const data = await res.json()
          setCountryStatuses(data.countries || [])
          setIsSuperAdmin(true)
        }
      } catch (err) {
        console.error('Failed to fetch country intelligence', err)
      }
    }

    checkRoleAndFetchCountryData()
    fetchDynamicAlerts()
    const interval = setInterval(fetchDynamicAlerts, 60000)
    return () => clearInterval(interval)
  }, [fetchDynamicAlerts])

  const handleBroadcast = async (country: string, status: string) => {
    try {
      setBroadcastingCountry(country)
      const res = await fetch('/api/admin/broadcast-country-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          message: `Regional Intelligence Update for ${country}: ${status}`,
          title: `Emergency Protocol: ${country}`
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Broadcast Successful`, {
          description: `Notification sent to ${data.count} users in ${country}.`
        })
      } else {
        const error = await res.json()
        toast.error(`Broadcast Failed`, {
          description: error.error || 'Failed to send regional alert.'
        })
      }
    } catch (err) {
      console.error('Broadcast error:', err)
      toast.error('System Error', {
        description: 'Failed to connect to the broadcast service.'
      })
    } finally {
      setBroadcastingCountry(null)
    }
  }

  const handleAIDraft = async () => {
    if (!selectedNwsType) return
    try {
      setIsGeneratingAI(true)
      const res = await fetch('/api/admin/ai-alert-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertType: selectedNwsType, context: dispatchMessage })
      })
      if (res.ok) {
        const data = await res.json()
        setDispatchMessage(data.message)
        toast.success('AI Draft Generated')
      }
    } catch (err) {
      toast.error('AI Generation Failed')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleNationalDispatch = async () => {
    try {
      setIsDispatching(true)
      const res = await fetch('/api/admin/national-alert-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: selectedNwsType,
          channels: dispatchChannels,
          message: dispatchMessage
        })
      })
      if (res.ok) {
        toast.success('National Alert Dispatched', {
          description: 'Alert has been saved and broadcasted to all users.'
        })
        // Reset wizard
        setDispatchStep(1)
        setSelectedNwsType(null)
        setDispatchMessage('')
        fetchDynamicAlerts()
      } else {
        const error = await res.json()
        toast.error('Dispatch Failed', { description: error.error })
      }
    } catch (err) {
      toast.error('Dispatch System Error')
    } finally {
      setIsDispatching(false)
    }
  }

  const toggleNotification = (key: string) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const selectedAlert = alerts.find(a => a.id === selectedAlertId)

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 space-y-8 max-w-7xl mx-auto">
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

      {/* Global Intelligence Section (Super Admin Only) */}
      {isSuperAdmin && countryStatuses.length > 0 && (
        <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 border border-indigo-400">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">International Alert Status</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AI Summary • Sub-Admin Area Updates</p>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Super-Admin Access Only</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryStatuses.map((item, idx) => (
              <Card key={idx} className="p-6 bg-white border-slate-200 rounded-3xl hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative group overflow-hidden border-t-4 border-t-indigo-500">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
                      <Flag size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-none mb-1">{item.country}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.subAdminCount} Units Deployed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Active Monitoring</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 relative group-hover:bg-white transition-colors">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ShieldCheck size={12} /> AI Area Summary
                    </p>
                    <p className="text-[12px] font-bold text-slate-700 leading-relaxed italic">
                      "{item.status}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-wider px-1">
                    <span className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100">
                      <AlertTriangle size={12} /> {item.alertCount} Local Hazards
                    </span>
                    <span className="text-slate-400">Sync: {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBroadcast(item.country, item.status);
                      }}
                      disabled={broadcastingCountry === item.country}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-5 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 mt-2 transition-all active:scale-95 group"
                    >
                      {broadcastingCountry === item.country ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      )}
                      {broadcastingCountry === item.country ? 'Sending...' : 'Send to All Users'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* National Alert Dispatch Wizard (Super Admin Only) */}
      {isSuperAdmin && (
        <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200 border border-red-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Send National Alert</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pick NWS Alert • Send to All Users</p>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none underline decoration-2 underline-offset-4 decoration-red-200">Admin Dispatch Controls</p>
              </div>
            </div>
          </div>

          <Card className="bg-white border-2 border-slate-100 rounded-[40px] p-1 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[600px]">
              {/* Step Navigation Sidebar */}
              <div className="lg:col-span-3 bg-slate-50/50 border-r border-slate-100 p-8 space-y-8 flex flex-col h-full">
                <div className="space-y-6">
                  {[
                    { step: 1, label: 'Pick Alert Type', sub: 'Select NWS Type' },
                    { step: 2, label: 'Choose Channels', sub: 'How to send (SMS, Push, etc)' },
                    { step: 3, label: 'Write Message', sub: 'Review & AI Support' }
                  ].map((s) => (
                    <div
                      key={s.step}
                      className={cn(
                        "flex items-center gap-4 transition-all duration-300",
                        dispatchStep === s.step ? "scale-105" : "opacity-40 grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm",
                        dispatchStep === s.step ? "bg-red-600 text-white shadow-lg shadow-red-100" : "bg-white border border-slate-200 text-slate-400"
                      )}>
                        {s.step}
                      </div>
                      <div>
                        <p className={cn("text-[10px] uppercase font-black tracking-widest leading-none mb-1", dispatchStep === s.step ? "text-red-600" : "text-slate-400")}>Step {s.step}</p>
                        <p className="text-xs font-black text-slate-900">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-200 mt-auto">
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <ShieldAlert /> Important Notice
                    </p>
                    <p className="text-[10px] font-bold text-red-800 leading-tight">
                      These alerts will be sent to all users across the country.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="lg:col-span-9 relative flex flex-col h-[600px] border-l border-slate-100">
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar pb-24">
                  {dispatchStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Select Alert Type</h3>
                          <p className="text-sm font-bold text-slate-400">Choose the type of alert you want to send from the list below.</p>
                        </div>
                        <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input
                            type="text"
                            placeholder="Search alerts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
                        {NWS_NATIONAL_ALERTS.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setSelectedNwsType(type.name)}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
                              selectedNwsType === type.name
                                ? "bg-red-50 border-red-500 shadow-md shadow-red-100"
                                : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100">
                                {type.icon}
                              </div>
                              <span className={cn("text-xs font-black", selectedNwsType === type.name ? "text-slate-900" : "text-slate-700")}>{type.name}</span>
                            </div>
                            <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest", selectedNwsType === type.name ? "bg-red-600 text-white" : "border-slate-200")}>
                              {type.severity}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {dispatchStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Select Channels</h3>
                          <p className="text-sm font-bold text-slate-400">Choose how users will receive this alert (Push, Text, or Email).</p>
                        </div>
                        <Badge className="bg-red-50 text-red-600 border-red-100 px-3 py-1 text-[10px] font-black uppercase">
                          Selected: {selectedNwsType}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { id: 'push', label: 'Push Notification', desc: 'Instant alert on phone apps', icon: <Smartphone size={24} /> },
                          { id: 'sms', label: 'Text Message (SMS)', desc: 'Standard phone text alert', icon: <MessageSquare size={24} /> },
                          { id: 'email', label: 'Email', desc: 'Message sent to email address', icon: <Mail size={24} /> },
                        ].map((ch) => (
                          <Card
                            key={ch.id}
                            className={cn(
                              "p-6 cursor-pointer border-2 transition-all",
                              dispatchChannels.includes(ch.id) ? "border-red-500 bg-red-50/50 shadow-lg shadow-red-100" : "border-slate-100 hover:border-slate-200"
                            )}
                            onClick={() => {
                              if (dispatchChannels.includes(ch.id)) {
                                setDispatchChannels(dispatchChannels.filter(c => c !== ch.id))
                              } else {
                                setDispatchChannels([...dispatchChannels, ch.id])
                              }
                            }}
                          >
                            <div className={cn("mb-4", dispatchChannels.includes(ch.id) ? "text-red-600" : "text-slate-400")}>
                              {ch.icon}
                            </div>
                            <h4 className="text-sm font-black text-slate-900 mb-1">{ch.label}</h4>
                            <p className="text-[10px] font-medium text-slate-400 tracking-tight">{ch.desc}</p>
                            <div className="mt-4 flex justify-end">
                              <Switch checked={dispatchChannels.includes(ch.id)} onCheckedChange={() => { }} className="data-[state=checked]:bg-red-600" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {dispatchStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Write Your Message</h3>
                          <p className="text-sm font-bold text-slate-400">Type your alert message here. You can also use AI to help you write it.</p>
                        </div>
                        <div className="flex gap-2">
                          {dispatchChannels.map(c => <Badge key={c} variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-slate-50">{c}</Badge>)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="relative group">
                          <Textarea
                            value={dispatchMessage}
                            onChange={(e) => setDispatchMessage(e.target.value)}
                            placeholder="Type your message here or click the AI button below..."
                            className="min-h-[200px] border-2 border-slate-100 rounded-[32px] p-8 text-sm font-bold text-slate-700 bg-white shadow-inner focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all"
                          />
                          <div className="absolute bottom-6 right-6 flex gap-3">
                            <Button
                              variant="outline"
                              onClick={handleAIDraft}
                              disabled={isGeneratingAI}
                              className="bg-white/80 backdrop-blur-md border-slate-200 text-indigo-600 font-black uppercase tracking-widest text-[9px] rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-indigo-50 border-indigo-100 transition-all"
                            >
                              {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 size={12} />}
                              AI Help
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between px-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            Character Count: <span className={cn(dispatchMessage.length > 160 ? "text-red-500" : "text-emerald-600")}>{dispatchMessage.length}</span> / 160 (For best results on SMS)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky Footer for Navigation Buttons */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center backdrop-blur-sm">
                  <div className="flex gap-2">
                    {dispatchStep > 1 && (
                      <Button variant="outline" onClick={() => setDispatchStep(dispatchStep - 1)} className="border-slate-200 text-slate-600 font-bold px-8 py-6 rounded-2xl uppercase tracking-widest text-[11px] bg-white">
                        Back to Step {dispatchStep - 1}
                      </Button>
                    )}
                  </div>

                  {dispatchStep === 1 && (
                    <Button
                      disabled={!selectedNwsType}
                      onClick={() => setDispatchStep(2)}
                      className="bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 group shadow-xl"
                    >
                      Go to Step 2 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}

                  {dispatchStep === 2 && (
                    <Button
                      disabled={dispatchChannels.length === 0}
                      onClick={() => setDispatchStep(3)}
                      className="bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 group shadow-xl"
                    >
                      Go to Step 3 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}

                  {dispatchStep === 3 && (
                    <Button
                      onClick={handleNationalDispatch}
                      disabled={isDispatching || !dispatchMessage}
                      className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center gap-2 group shadow-2xl shadow-red-200 ring-4 ring-red-500/10 active:scale-95 transition-all"
                    >
                      {isDispatching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldAlert className="w-5 h-5 mr-1" />}
                      {isDispatching ? 'Sending...' : 'Send National Alert'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

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

          </div>
        </div>
      </div>
    </main>
  );
}
