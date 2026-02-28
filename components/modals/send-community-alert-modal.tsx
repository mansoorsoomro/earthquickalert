'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Edit2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAlerts } from '@/lib/store/alert-store'
import { AlertType, AlertSeverity } from '@/lib/types/emergency'
import { useToast } from '@/hooks/use-toast'
import { ALERT_TEMPLATES } from '@/lib/constants/alert-templates'

interface SendCommunityAlertModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendCommunityAlertModal({ isOpen, onClose }: SendCommunityAlertModalProps) {
  const { toast } = useToast()
  const { createAlert } = useAlerts()
  const [alertType, setAlertType] = useState<AlertType>('severe-weather')
  const [severity, setSeverity] = useState<AlertSeverity>('warning')
  const [title, setTitle] = useState('Severe Weather Alert')
  const [message, setMessage] = useState(
    'A powerful thunderstorm system is approaching the eastern district at approximately 45 mph. Expected arrival time: 3:30 PM. Residents are strongly advised to remain indoors, secure outdoor items, and avoid travel unless absolutely necessary. Heavy rainfall, strong winds up to 65 mph, and potential hail are expected.'
  )
  const [zones, setZones] = useState<string[]>(['A', 'B', 'C'])
  const [locations, setLocations] = useState<string[]>(['San Francisco', 'Oakland', 'Berkeley'])
  const [coordinatorMessage, setCoordinatorMessage] = useState(
    'Emergency shelters are available at Lincoln Community Center and Riverside High School. Transportation assistance is available by calling 311. Residents in flood-prone areas should consider evacuation.'
  )
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showNWSAdvisory, setShowNWSAdvisory] = useState(true)
  const [isSending, setIsSending] = useState(false)

  if (!isOpen) return null
  const handleSendAlert = async () => {
    setIsSending(true)
    try {
      const fullMessage = `${message}\n\n${coordinatorMessage}`

      const success = await createAlert({
        type: alertType,
        severity,
        title,
        message: fullMessage,
        zones,
        locations,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdBy: 'Admin',
        source: 'admin_manual',
      })

      if (!success) {
        throw new Error('Failed to synchronize alert with database')
      }

      toast({
        title: 'Alert Dispatched Successfully',
        description: `Community alert synchronized with database terminal.`,
      })

      onClose()
    } catch (error) {
      console.error('Error sending alert:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send community alert',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <AlertTriangle className="text-white w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Send Community Alert</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-500">Broadcast critical messages to citizens through multiple channels.</p>

          {/* Alert Configuration Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alert Type</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as AlertType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="earthquake">Earthquake</option>
                <option value="hurricane">Hurricane</option>
                <option value="tornado">Tornado</option>
                <option value="flood">Flood</option>
                <option value="wildfire">Wildfire</option>
                <option value="severe-weather">Severe Weather</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="critical">Critical</option>
                <option value="extreme">Extreme</option>
                <option value="severe">Severe</option>
                <option value="warning">Warning</option>
                <option value="watch">Watch</option>
                <option value="advisory">Advisory</option>
              </select>
            </div>
          </div>

          {/* AI-Generated Alert Message */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI-GENERATED ALERT MESSAGE</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-700 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the main alert message..."
            />
          </div>

          {/* NWS Advisory Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Affected Locations (NWS Advisory)</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <button
                onClick={() => setShowNWSAdvisory(!showNWSAdvisory)}
                className="w-full flex items-center justify-between mb-2 text-left"
              >
                <span className="text-xs font-bold text-slate-900">SEVERE WEATHER ADVISORY</span>
                {showNWSAdvisory ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {showNWSAdvisory && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">NWS Flash Flood Warning</p>
                      <p className="text-xs text-amber-700 mt-1 leading-normal">
                        Wind gusts up to 60 mph expected. Seek shelter immediately. This warning is in effect until 4:30 PM.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Coordinator Messages */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Coordinator Messages</label>
            <textarea
              value={coordinatorMessage}
              onChange={(e) => setCoordinatorMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add additional instructions..."
            />
          </div>

          {/* Preview of Final Alert */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PREVIEW OF FINAL ALERT</label>
            <div className={`p-5 rounded-xl border ${severity === 'critical' ? 'bg-red-50 border-red-100 text-red-900' :
                severity === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                  severity === 'severe' ? 'bg-orange-50 border-orange-100 text-orange-900' :
                    'bg-blue-50 border-blue-100 text-blue-900'
              }`}>
              <h4 className="text-sm font-bold flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" />
                STA COMMUNITY EMERGENCY ALERT
              </h4>
              <ul className="text-xs space-y-1.5 font-medium list-disc list-inside mb-3 opacity-80">
                <li>Category: {alertType.replace('-', ' ').toUpperCase()}</li>
                <li>Priority Level: {severity.toUpperCase()}</li>
                <li>Affected Zones: {zones.join(', ')}</li>
                <li>Estimated Impact: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
              </ul>
              <div className="pt-3 border-t border-current border-opacity-10">
                <p className="text-xs leading-relaxed font-medium">
                  {message}
                </p>
                {coordinatorMessage && (
                  <p className="text-xs leading-relaxed mt-3 pt-3 border-t border-current border-opacity-10 italic">
                    {coordinatorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 text-xs font-bold text-slate-500 border-slate-200 rounded-xl"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSendAlert}
              disabled={isSending}
              className="flex-1 h-11 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-[1.02]"
            >
              {isSending ? 'SENDING...' : 'DISPATCH MESSAGE'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
