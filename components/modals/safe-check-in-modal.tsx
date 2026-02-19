'use client'

import { useState } from 'react'
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  MapPin, 
  Phone, 
  MessageSquare,
  Navigation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSafety, SafetyStatus } from '@/lib/context/safety-context'
import { cn } from '@/lib/utils'

interface SafeCheckInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SafeCheckInModal({ isOpen, onClose }: SafeCheckInModalProps) {
  const { myStatus, setMyStatus, familyMembers, updateFamilyMemberStatus } = useSafety()
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  // Helper to get status color
  const getStatusColor = (status: SafetyStatus) => {
    switch (status) {
      case 'SAFE': return 'bg-green-100 text-green-700 border-green-200'
      case 'DANGER': return 'bg-red-100 text-red-700 border-red-200'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  // Helper to get status icon
  const getStatusIcon = (status: SafetyStatus) => {
    switch (status) {
      case 'SAFE': return <UserCheck className="w-5 h-5" />
      case 'DANGER': return <UserX className="w-5 h-5" />
      default: return <ShieldCheck className="w-5 h-5" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-xl font-bold">Are We Safe?</h2>
              <p className="text-slate-400 text-sm">Family & Group Safety Check-in</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-0">
          
          {/* My Status Section */}
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Update Your Status</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setMyStatus('SAFE')}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                  myStatus === 'SAFE' 
                    ? "bg-green-50 border-green-500 ring-2 ring-green-200 ring-offset-2" 
                    : "bg-white border-slate-200 hover:border-green-300 hover:bg-green-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", myStatus === 'SAFE' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className={cn("block font-bold", myStatus === 'SAFE' ? "text-green-900" : "text-slate-700")}>I Am Safe</span>
                    <span className="text-xs text-slate-500">Share location with family</span>
                  </div>
                </div>
                {myStatus === 'SAFE' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
              </button>

              <button 
                onClick={() => setMyStatus('DANGER')}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                  myStatus === 'DANGER' 
                    ? "bg-red-50 border-red-500 ring-2 ring-red-200 ring-offset-2" 
                    : "bg-white border-slate-200 hover:border-red-300 hover:bg-red-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", myStatus === 'DANGER' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400")}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className={cn("block font-bold", myStatus === 'DANGER' ? "text-red-900" : "text-slate-700")}>I Need Help</span>
                    <span className="text-xs text-slate-500">Alert emergency contacts</span>
                  </div>
                </div>
                {myStatus === 'DANGER' && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
              </button>
            </div>

            {/* Optional Message */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Add a custom message (optional)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., At the community center, safe."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <MessageSquare className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Family Status Section */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Family & Group Status</h3>
            
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
                      member.status === 'DANGER' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                    )}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-xs px-2 py-0.5 rounded font-bold border flex items-center gap-1", getStatusColor(member.status))}>
                          {getStatusIcon(member.status)}
                          {member.status === 'SAFE' ? 'MARKED SAFE' : member.status === 'DANGER' ? 'NOT SAFE' : 'NO UPDATE'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(member.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for family members */}
                  <div className="flex items-center gap-2">
                    {member.status === 'DANGER' && (
                      <>
                        <Button size="icon" variant="destructive" className="rounded-full w-10 h-10 shadow-lg shadow-red-200" title="Call Emergency">
                          <Phone className="w-5 h-5" />
                        </Button>
                        <Button size="icon" className="rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" title="Navigate to Location">
                          <Navigation className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" className="rounded-full text-slate-400 hover:text-slate-600">
                      <MapPin className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Check-in Trigger */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500">Last group check-in initiated 2 hours ago</span>
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Request Check-in
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
