'use client'

import { useState } from 'react'
import { X, Plus, User, MapPin, AlertCircle, Clock, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEvents } from '@/lib/store/event-store'
import { AlertType, AlertSeverity, EventStatus } from '@/lib/types/emergency'
import { cn } from '@/lib/utils'

interface ActiveEmergencyEventsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ActiveEmergencyEventsModal({ isOpen, onClose }: ActiveEmergencyEventsModalProps) {
  const { events, createEvent, deleteEvent } = useEvents()
  const [showAddForm, setShowAddForm] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<AlertType>('other')
  const [severity, setSeverity] = useState<AlertSeverity>('moderate')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<EventStatus>('active')

  const handleAddEvent = async () => {
    if (!title.trim() || !description.trim()) return

    const success = await createEvent({
      title,
      description,
      type,
      severity,
      status,
      location: {
        lat: 37.7749, // Default to SF for now
        lng: -122.4194,
        address
      },
      affectedZones: ['Global'],
      createdBy: 'Admin'
    })

    if (success) {
      // Reset form
      setTitle('')
      setDescription('')
      setAddress('')
      setShowAddForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'extreme':
        return 'text-red-600'
      case 'severe':
      case 'warning':
        return 'text-orange-600'
      default:
        return 'text-blue-600'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-white shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Emergency Command Center</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Active Incident Response Management</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-tighter text-[10px] h-10 px-6 rounded-xl flex items-center gap-2"
            >
              {showAddForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showAddForm ? 'Cancel Operation' : 'Initialize New Event'}
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {showAddForm && (
            <div className="mb-12 bg-slate-50 border border-slate-100 rounded-3xl p-8 animate-in slide-in-from-top-4 duration-500">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                Incident Initialization Protocol
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Seismic Shift Cluster" className="h-12 rounded-xl border-slate-200 bg-white font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Type</Label>
                  <Select value={type} onValueChange={(v: AlertType) => setType(v)}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="severe-weather">Severe Weather</SelectItem>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="wildfire">Wildfire</SelectItem>
                      <SelectItem value="hurricane">Hurricane</SelectItem>
                      <SelectItem value="other">Other Incident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Criticality Level</Label>
                  <Select value={severity} onValueChange={(v: AlertSeverity) => setSeverity(v)}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="extreme">Extreme</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intelligence Summary</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed incident description..." className="h-12 rounded-xl border-slate-200 bg-white font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Impact Location</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, Region or Exact Address" className="h-12 rounded-xl border-slate-200 bg-white font-bold" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleAddEvent}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-tighter text-xs h-12 px-10 rounded-xl shadow-xl shadow-blue-100"
                >
                  Authorize Deployment
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Severity</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Impact Zone</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="text-right py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-6 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{event.title}</span>
                          <span className="text-[10px] font-bold text-slate-400 line-clamp-1 mt-0.5">{event.description}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 uppercase">{event.type.replace(/-/g, ' ')}</span>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest mt-0.5", getSeverityColor(event.severity))}>
                            {event.severity}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          {event.location.address}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <Badge className={cn("text-[8px] font-black uppercase tracking-tighter border-none px-2 py-0.5 rounded-md", getStatusColor(event.status))}>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => deleteEvent(event.id || (event as any)._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Shield className="w-12 h-12 text-slate-100" />
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Active Incidents Detected</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            Strategic Feed Active • Last Sync: {new Date().toLocaleTimeString()}
          </div>
          <Button onClick={onClose} variant="outline" className="h-10 px-8 rounded-xl border-slate-200 font-black uppercase text-[10px] tracking-tight hover:bg-white">
            Dismiss Terminal
          </Button>
        </div>
      </div>
    </div>
  )
}
