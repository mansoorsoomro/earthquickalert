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
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Send Community Alert</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-2">Apply Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                const templateId = e.target.value;
                setSelectedTemplate(templateId);
                if (templateId && ALERT_TEMPLATES[templateId as keyof typeof ALERT_TEMPLATES]) {
                  const template = ALERT_TEMPLATES[templateId as keyof typeof ALERT_TEMPLATES];
                  setAlertType(template.type);
                  setSeverity(template.severity);
                  setTitle(template.title);
                  setMessage(template.message);
                }
              }}
              className="w-full p-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="">Select a pre-defined template...</option>
              {Object.entries(ALERT_TEMPLATES).map(([id, template]) => (
                <option key={id} value={id}>{template.title}</option>
              ))}
            </select>
          </div>

          {/* Alert Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Alert Type</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as AlertType)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-semibold mb-2">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="critical">Critical</option>
                <option value="extreme">Extreme</option>
                <option value="severe">Severe</option>
                <option value="warning">Warning</option>
                <option value="watch">Watch</option>
                <option value="advisory">Advisory</option>
                <option value="moderate">Moderate</option>
                <option value="minor">Minor</option>
              </select>
            </div>
          </div>

          {/* Affected Zones */}
          <div>
            <label className="block text-sm font-semibold mb-2">Affected Zones</label>
            <div className="flex gap-2 flex-wrap">
              {['A', 'B', 'C', 'D', 'E'].map((zone) => (
                <button
                  key={zone}
                  onClick={() => {
                    setZones(prev =>
                      prev.includes(zone)
                        ? prev.filter(z => z !== zone)
                        : [...prev, zone]
                    )
                  }}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition-colors ${zones.includes(zone)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                >
                  Zone {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Alert Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter alert title"
            />
          </div>

          {/* AI-Generated Alert Message */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Alert Message</h3>
            <p className="text-sm text-gray-600 mb-4">
              Main alert message that will be sent to affected residents.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* National Weather Service Advisory */}
          {alertType === 'severe-weather' && (
            <div>
              <button
                onClick={() => setShowNWSAdvisory(!showNWSAdvisory)}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">National Weather Service (NWS) Advisory</h3>
                {showNWSAdvisory ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {showNWSAdvisory && (
                <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">NWS Severe Thunderstorm Warning</h4>
                      <p className="text-sm text-gray-600">Issued at {new Date().toLocaleTimeString()}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        Wind gusts up to 60 mph expected. Seek shelter immediately. This warning is in effect
                        until 4:30 PM. Avoid outdoor activities and secure loose objects.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coordinator Message */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Additional Instructions</h3>
            <p className="text-sm text-gray-600 mb-3">Add emergency instructions or resources.</p>
            <textarea
              value={coordinatorMessage}
              onChange={(e) => setCoordinatorMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Preview of Final Alert */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Preview of Final Alert</h3>
            <div className={`p-6 rounded-lg space-y-3 ${severity === 'critical' ? 'bg-red-100' :
              severity === 'warning' ? 'bg-yellow-100' :
                severity === 'watch' ? 'bg-orange-100' : 'bg-blue-100'
              }`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-6 h-6 mt-1" />
                <h4 className="font-bold text-gray-900 text-lg">{title.toUpperCase()}</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-900">
                <div>
                  <span className="font-semibold">Type:</span> {alertType.replace('-', ' ').toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold">Severity:</span> {severity.toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold">Affected Zones:</span> {zones.join(', ')}
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <p className="text-gray-700">{message}</p>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <span className="font-semibold">Emergency Instructions:</span>
                  <p className="text-gray-700 mt-1">{coordinatorMessage}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 pt-3 border-t border-gray-300">
                Sent via Emergency Management System | {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSendAlert}
              disabled={isSending}
              className="ml-auto bg-red-500 hover:bg-red-600 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {isSending ? 'Sending Alert...' : 'Send Community Alert'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
