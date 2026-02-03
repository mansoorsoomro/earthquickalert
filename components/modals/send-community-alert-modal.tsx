'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SendCommunityAlertModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendCommunityAlertModal({ isOpen, onClose }: SendCommunityAlertModalProps) {
  const [showNWSAdvisory, setShowNWSAdvisory] = useState(true)
  const [coordinatorMessage, setCoordinatorMessage] = useState(
    'Emergency shelters are available at Lincoln Community Center and Riverside High School. Transportation assistance is available by calling 311. Residents in flood-prone areas should consider evacuation.'
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Send Community Alert</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-gray-600">
            Review and finalize alert message before sending to the public.
          </p>

          {/* AI-Generated Alert */}
          <div>
            <h3 className="font-semibold text-lg mb-2">AI-Generated Alert</h3>
            <p className="text-sm text-gray-600 mb-4">
              Automatically created based on event severity, type, and location.
            </p>
            <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                SEVERE WEATHER ALERT: A powerful thunderstorm system is approaching the eastern district
                at approximately 45 mph. Expected arrival time: 3:30 PM. Residents are strongly advised to
                remain indoors, secure outdoor items, and avoid travel unless absolutely necessary. Heavy
                rainfall, strong winds up to 65 mph, and potential hail are expected. Stay tuned for further
                updates.
              </p>
              <button className="mt-3 p-1 text-gray-500 hover:text-gray-700">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* National Weather Service Advisory */}
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
                  <div className="text-yellow-600 font-bold text-xl">⚠</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">NWS Severe Thunderstorm Warning</h4>
                    <p className="text-sm text-gray-600">Issued at 2:45 PM</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Wind gusts up to 60 mph expected. Seek shelter immediately. This warning is in effect
                      until 4:30 PM. Avoid outdoor activities and secure loose objects.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coordinator Message */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Coordinator Message</h3>
            <p className="text-sm text-gray-600 mb-3">Add additional instructions or modify the alert.</p>
            <textarea
              value={coordinatorMessage}
              onChange={(e) => setCoordinatorMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Preview of Final Alert */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Preview of Final Alert</h3>
            <div className="bg-yellow-100 p-6 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-2xl">❓</span>
                <h4 className="font-bold text-gray-900">COMMUNITY EMERGENCY ALERT</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-900">
                <div>
                  <span className="font-semibold">Weather Emergency:</span>
                  <p className="text-gray-700 mt-1">
                    SEVERE WEATHER ALERT: A powerful thunderstorm system is approaching the eastern
                    district at approximately 45 mph. Expected arrival time: 3:30 PM. Residents are
                    strongly advised to remain indoors, secure outdoor items, and avoid travel unless
                    absolutely necessary.
                  </p>
                </div>
                <div>
                  <span className="font-semibold">National Weather Service:</span>
                  <p className="text-gray-700 mt-1">
                    Severe Thunderstorm Warning in effect until 4:30 PM. Wind gusts up to 60 mph expected.
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Emergency Instructions:</span>
                  <p className="text-gray-700 mt-1">{coordinatorMessage}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 pt-3 border-t border-yellow-200">
                Sent via Emergency Management System | Reply STOP to opt out
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="ml-auto bg-red-500 hover:bg-red-600 text-white">
              <span>📮</span>
              Send Community Alert
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
