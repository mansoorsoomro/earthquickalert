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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#FFF8E1] text-[#A68910] border-none' // In Progress
      case 'monitoring':
        return 'bg-[#E3F2FD] text-[#1976D2] border-none' // Task Assign
      case 'resolved':
        return 'bg-[#E8F5E9] text-[#2E7D32] border-none' // Completed
      default:
        return 'bg-blue-500 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'In Progress'
      case 'monitoring': return 'Task Assign'
      case 'resolved': return 'Completed'
      default: return status.toUpperCase()
    }
  }

  const getMappedEventType = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'extreme':
        return 'Catastrophic'
      case 'severe':
      case 'warning':
        return 'Major'
      case 'moderate':
        return 'Intermediate'
      case 'minor':
      default:
        return 'Minor'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl relative">
        {/* Minimalist Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 z-50 bg-white shadow-sm border border-slate-50"
        >
          <X className="w-6 h-6 text-slate-900" />
        </button>

        <div className="p-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">Active Emergency Events</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100/60">
                  <th className="pb-6 text-2xl font-bold text-slate-900 w-[35%]">Description:</th>
                  <th className="pb-6 text-2xl font-bold text-slate-900 w-[25%]">Location:</th>
                  <th className="pb-6 text-2xl font-bold text-slate-900 w-[20%]">Event Type:</th>
                  <th className="pb-6 text-2xl font-bold text-slate-900 text-center w-[20%] px-4">Status:</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="py-8 pr-10 align-top">
                        <p className="text-lg font-medium text-[#5B5B9D] leading-relaxed">
                          {event.title}; {event.description}
                        </p>
                      </td>
                      <td className="py-8 pr-10 align-top">
                        <p className="text-lg font-medium text-[#5B5B9D] leading-relaxed">
                          {event.location.address}
                        </p>
                      </td>
                      <td className="py-8 pr-10 align-top">
                        <p className="text-lg font-medium text-[#5B5B9D] leading-relaxed">
                          {getMappedEventType(event.severity)}
                        </p>
                      </td>
                      <td className="py-8 align-top">
                        <div className="flex justify-center pr-2">
                          <button
                            className={cn(
                              "px-8 py-3.5 rounded-xl text-lg font-bold min-w-[180px] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
                              getStatusStyles(event.status)
                            )}
                          >
                            {getStatusLabel(event.status)}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Shield className="w-16 h-16 text-slate-100" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Emergency Operations</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
