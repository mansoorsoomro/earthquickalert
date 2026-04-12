'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
    AlertTriangle, 
    Cloud, 
    AlertCircle, 
    Smartphone, 
    MessageSquare, 
    Mail, 
    Zap, 
    Loader2, 
    RefreshCw, 
    MapPin,
    Settings,
    Shield,
    Bell,
    CheckCircle2,
    Save,
    Search,
    Filter,
    ArrowUpRight,
    Activity,
    Info,
    ChevronDown,
    Plus,
    Radio
} from 'lucide-react'
import { AlertDetailModal } from '@/components/AlertDetailModal'
import { Switch } from '@/components/ui/switch'
import { Alert as APIAlert, AlertSeverity, AlertSource } from '@/lib/types/api-alerts'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export default function AlertsCommunicationPage() {
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    push: true,
    sms: true,
    email: false,
  })

  const [alerts, setAlerts] = useState<APIAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [configLoading, setConfigLoading] = useState(true)
  const [configEvents, setConfigEvents] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

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

  const fetchConfig = useCallback(async () => {
    try {
      setConfigLoading(true)
      const res = await fetch('/api/admin/alert-types')
      if (res.ok) {
        const data = await res.json()
        setConfigEvents(data.data.events || [])
      }
    } catch (err) {
      console.error('Failed to fetch config', err)
    } finally {
      setConfigLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserAlerts()
    fetchConfig()
    const interval = setInterval(fetchUserAlerts, 60000)
    return () => clearInterval(interval)
  }, [fetchUserAlerts, fetchConfig])

  const toggleNotification = (key: string) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSaveConfig = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/alert-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: configEvents })
      })
      if (res.ok) {
        toast.success("Configuration saved successfully")
      } else {
        toast.error("Failed to save configuration")
      }
    } catch (err) {
      toast.error("An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const updateEventConfig = (name: string, field: string, value: any) => {
    setConfigEvents(prev => prev.map(e => e.name === name ? { ...e, [field]: value } : e))
  }

  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.EXTREME:
        return {
          bg: 'bg-red-500/5',
          border: 'border-red-500/20',
          tag: 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]',
          btn: 'bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20'
        }
      case AlertSeverity.SEVERE:
      case AlertSeverity.HIGH:
        return {
          bg: 'bg-orange-500/5',
          border: 'border-orange-500/20',
          tag: 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]',
          btn: 'bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-600/20'
        }
      case AlertSeverity.MODERATE:
        return {
          bg: 'bg-yellow-500/5',
          border: 'border-yellow-500/20',
          tag: 'bg-yellow-500 text-black shadow-[0_0_12px_rgba(234,179,8,0.4)]',
          btn: 'bg-yellow-600 hover:bg-yellow-700 text-black shadow-xl shadow-yellow-600/20'
        }
      default:
        return {
          bg: 'bg-white/5',
          border: 'border-white/10',
          tag: 'bg-slate-700 text-white',
          btn: 'bg-slate-700 hover:bg-slate-600 text-white shadow-xl shadow-slate-900/20'
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

  return (
    <main className="min-h-screen bg-slate-50 p-8 lg:p-12 space-y-12 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-200">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-red-600/20">
                    <Radio size={24} className="animate-pulse" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Broadcast Center</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Multi-Channel Emergency Communication Hub</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
             <Button
                variant="ghost"
                onClick={() => fetchUserAlerts()}
                disabled={loading}
                className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all gap-3 shadow-sm"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-blue-500" />}
                Synchronize Ops
            </Button>
            <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 gap-3">
                 <Plus size={16} /> Initiate Alert
            </Button>
        </div>
      </div>

      <Tabs defaultValue="feed" className="space-y-8 relative">
        <div className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded-[32px] w-fit shadow-sm">
            <TabsList className="bg-transparent h-12 gap-1 p-0">
                <TabsTrigger value="feed" className="h-10 px-8 rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-500 text-[10px] font-black uppercase tracking-widest transition-all">
                    <Bell size={14} className="mr-2" /> Live Broadcast Feed
                </TabsTrigger>
                <TabsTrigger value="config" className="h-10 px-8 rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-500 text-[10px] font-black uppercase tracking-widest transition-all">
                    <Settings size={14} className="mr-2" /> NWS Configuration
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="feed" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-6">
                {loading && alerts.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-[48px] border border-slate-200 shadow-xl border-dashed">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-6" />
                        <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Assembling Signal Chains...</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-[48px] border border-slate-200 shadow-xl">
                        <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-blue-500/5">
                            <Cloud className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">Sector Nominal</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No synchronized warnings detected in current AO.</p>
                    </div>
                ) : (
                    alerts.map((alert) => {
                        const styles = getSeverityStyles(alert.severity)
                        const typeLabel = alert.source === AlertSource.WEATHER_API ? 'Weather' : alert.source === AlertSource.EARTHQUAKE_API ? 'Geo' : 'System'

                        return (
                            <Card key={alert.id} className={cn(`group p-10 bg-white border-[2px] rounded-[40px] shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-slate-300/50`, styles.border)}>
                                <div className="flex flex-col xl:flex-row xl:items-center gap-10">
                                    <div className="flex-1 min-w-0 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <span className={cn(`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em]`, styles.tag)}>
                                                {typeLabel} &bull; {alert.severity}
                                            </span>
                                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                ID: {alert.id.slice(0, 8)} &bull; {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-black text-3xl text-slate-900 uppercase tracking-tighter leading-none mb-3 group-hover:text-blue-600 transition-colors">{alert.title}</h3>
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <MapPin className="w-5 h-5 text-blue-500" />
                                                <span className="text-[11px] font-black uppercase tracking-widest underline underline-offset-4 decoration-slate-200">{alert.affectedAreas?.join(', ') || 'Global Sector'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row xl:flex-col items-center xl:items-end gap-6 shrink-0">
                                        {alert.expiresAt && (
                                            <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EXPIRY</span>
                                                <span className="text-[11px] font-black text-red-600 uppercase">
                                                    {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                        <Button
                                            className={cn(`text-[10px] font-black uppercase tracking-[0.2em] px-10 h-16 rounded-[22px] group-hover:scale-[1.02] active:scale-[0.98] transition-all`, styles.btn)}
                                            onClick={() => handleAlertClick(alert)}
                                        >
                                            Intercept Intel
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })
                )}
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Message Preview */}
                    <Card className="p-10 bg-white border border-slate-200 rounded-[48px] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                            <Activity size={120} className="text-blue-600" />
                        </div>
                        
                        <h2 className="text-xl font-black text-slate-900 mb-10 tracking-tighter uppercase relative z-10">Broadcast Matrix</h2>

                        {alerts.length > 0 ? (
                            <div className="relative z-10 space-y-10">
                                <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] shadow-inner relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                                    <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight uppercase">
                                        {selectedAlert?.title || alerts[0]?.title}
                                    </h3>
                                    <p className="text-slate-600 font-bold leading-relaxed text-sm h-32 overflow-y-auto pr-4 custom-scrollbar lowercase first-letter:uppercase">
                                        {selectedAlert?.message || alerts[0]?.description}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Tactical Protocol</h4>
                                    </div>
                                    <div className="p-6 bg-red-50 rounded-[24px] border border-red-100">
                                        <p className="text-slate-600 font-bold text-[11px] tracking-tight leading-relaxed italic">
                                            Follow all official EOC directives. System scanning indicates Sector 4 requires secondary unit confirmation. Stay tuned to the primary broadcast channel.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Authenticity Signature</p>
                                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">EMERGENCY MANAGEMENT CORE</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] text-slate-300 border-2 border-dashed border-slate-100 rounded-[32px]">
                                <Bell size={48} className="mb-6 opacity-20" />
                                <p className="font-black text-[10px] uppercase tracking-widest">Select Signal to Preview</p>
                            </div>
                        )}
                    </Card>

                    {/* Notification Stats */}
                    <Card className="p-10 bg-white border border-slate-200 rounded-[48px] shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10">Dispatch Reach</h3>
                        <div className="space-y-6">
                        {[
                            { key: 'push', label: 'Push Hub', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { key: 'sms', label: 'SMS Matrix', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { key: 'email', label: 'Email Node', icon: Mail, color: 'text-slate-400', bg: 'bg-slate-50', disabled: true },
                        ].map((pref) => (
                            <div key={pref.key} className="flex items-center justify-between p-6 rounded-[28px] bg-white border border-slate-100 group hover:bg-slate-50 transition-all shadow-sm">
                                <div className="flex items-center gap-5">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", pref.bg, pref.color)}>
                                        <pref.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className={`text-xs font-black uppercase tracking-widest ${pref.disabled ? 'text-slate-300' : 'text-slate-900'}`}>
                                            {pref.label}
                                        </span>
                                        <p className="text-[9px] font-black text-slate-400 uppercase mt-1">{pref.disabled ? 'Offline' : 'Nominal'}</p>
                                    </div>
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
        </TabsContent>

        <TabsContent value="config" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-12 bg-white border border-slate-200 rounded-[48px] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Settings size={180} />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">NWS Intelligent Pick-List</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Autonomous Alert Translation & Broadcast Logic</p>
                            </div>
                            <Button 
                                onClick={handleSaveConfig} 
                                disabled={isSaving || configLoading}
                                className="bg-blue-600 hover:bg-blue-700 h-16 px-10 rounded-[22px] text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-2xl shadow-blue-600/20 transition-all active:scale-95"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                                Synchronize Logic
                            </Button>
                        </div>

                        {configLoading ? (
                            <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-6" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Parsing Configuration Schema...</p>
                            </div>
                        ) : configEvents.length === 0 ? (
                            <div className="py-24 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 group hover:border-blue-500/20 transition-all">
                                <Shield className="w-16 h-16 text-slate-300 mx-auto mb-6 group-hover:text-blue-500 transition-colors" />
                                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Null Configuration Context</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Signal with NWS to populate event definitions.</p>
                            </div>
                        ) : (
                            <Accordion type="single" collapsible className="space-y-4">
                                {configEvents.map((event) => (
                                    <AccordionItem key={event.name} value={event.name} className="border border-slate-100 rounded-[32px] px-8 bg-slate-50/50 overflow-hidden transition-all data-[state=open]:bg-white data-[state=open]:border-blue-100 group shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <Switch 
                                                checked={event.enabled}
                                                onCheckedChange={(val) => updateEventConfig(event.name, 'enabled', val)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                            <AccordionTrigger className="flex-1 hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left">
                                                    <span className={cn(
                                                        "text-lg font-black uppercase tracking-tight transition-colors",
                                                        event.enabled ? "text-slate-900" : "text-slate-400 group-hover:text-slate-500"
                                                    )}>{event.name}</span>
                                                    {event.enabled && (
                                                        <div className="flex gap-3">
                                                            {event.sendPush && <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Smartphone className="w-4 h-4 text-blue-500" /></div>}
                                                            {event.sendSms && <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center"><MessageSquare className="w-4 h-4 text-purple-500" /></div>}
                                                            {event.sendEmail && <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><Mail className="w-4 h-4 text-slate-400" /></div>}
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                        </div>
                                        <AccordionContent className="pb-10 pt-4 border-t border-slate-100">
                                            <div className="space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {[
                                                        { key: 'sendPush', label: 'Push Link', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                        { key: 'sendSms', label: 'SMS Matrix', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
                                                        { key: 'sendEmail', label: 'Email Node', icon: Mail, color: 'text-slate-500', bg: 'bg-slate-100' },
                                                    ].map((chan) => (
                                                        <div key={chan.key} className="flex items-center justify-between p-6 rounded-[24px] bg-white border border-slate-100 shadow-sm">
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", chan.bg, chan.color)}>
                                                                    <chan.icon size={18} />
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">{chan.label}</span>
                                                            </div>
                                                            <Switch 
                                                                checked={(event as any)[chan.key]}
                                                                onCheckedChange={(val) => updateEventConfig(event.name, chan.key, val)}
                                                                className="data-[state=checked]:bg-blue-600 scale-90"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center px-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Language Mapping Matrix</label>
                                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest border border-blue-100 bg-blue-50 px-3 py-1 rounded-full">Automated Variable Injection</span>
                                                    </div>
                                                    <Textarea 
                                                        placeholder="Customize the automated alert message language..."
                                                        className="min-h-[140px] rounded-[28px] bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-500/10 text-slate-700 font-bold text-sm leading-relaxed p-6 lowercase first-letter:uppercase transition-all"
                                                        value={(event as any).template || ''}
                                                        onChange={(e) => updateEventConfig(event.name, 'template', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-10 bg-white border border-slate-200 rounded-[48px] shadow-xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-105 transition-transform">
                            <Shield size={120} className="text-blue-900" />
                        </div>
                        <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-10 relative z-10 transition-transform group-hover:rotate-6">
                            <Shield className="text-white" size={32} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 relative z-10">Strategic Integrity</h4>
                        <p className="text-sm font-bold text-slate-500 leading-relaxed mb-10 relative z-10 lowercase first-letter:uppercase">
                            Autonomous dispatch chains are authorized for multi-channel propagation. Once activated, signal processing requires zero-human intervention.
                        </p>
                        
                        <div className="space-y-6 pt-10 border-t border-slate-100 relative z-10">
                            {[
                                { label: 'Autonomous Dispatch', sub: 'Hands-off monitoring', icon: Zap },
                                { label: 'Tri-Signal Support', sub: 'SMS, Push, Enterprise Mail', icon: Bell },
                                { label: 'Schema Mapping', sub: 'Dynamic language injection', icon: Edit2 },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 transition-colors shadow-sm">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    
                    <div className="bg-red-50 p-8 rounded-[48px] border border-red-100 flex gap-6 group hover:bg-red-100/50 transition-all shadow-sm">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-2 leading-none">Security Protocol</p>
                            <p className="text-[11px] font-bold text-slate-600 leading-relaxed lowercase">
                                Changes to the dispatch matrix require elevated authorization. Signal propagation is immediate upon synchronization.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>
      </Tabs>

      <AlertDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onCheckIn={() => setIsDetailModalOpen(false)}
        alert={selectedAlert}
      />
    </main>
  )
}

function Edit2(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    )
}
