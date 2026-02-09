'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, MapPin, TrendingUp, AlertCircle, X } from 'lucide-react'
import { SendCommunityAlertModal } from '@/components/modals/send-community-alert-modal'
import { ActiveEmergencyEventsModal } from '@/components/modals/active-emergency-events-modal'
import { AlertDetailModal } from '@/components/modals/alert-detail-modal'
import { ResourceMapModal } from '@/components/modals/resource-map-modal'
import { SituationReportModal } from '@/components/modals/situation-report-modal'
import { GISMap } from '@/components/gis-map'

export default function EmergencyEventsPage() {
  const [showSendAlertModal, setShowSendAlertModal] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showAlertDetailModal, setShowAlertDetailModal] = useState(false)
  const [showResourceMapModal, setShowResourceMapModal] = useState(false)
  const [showSitRepModal, setShowSitRepModal] = useState(false)

  const mockAlert = {
    title: 'Tornado Warning',
    severity: 'warning' as const,
    description: 'A large and extremely dangerous tornado was located over East District, moving northeast at 45 mph.',
    whatItMeans: 'A tornado has been sighted or indicated by weather radar. There is imminent danger to life and property.',
    whatToDo: 'Take cover now!\nMove to a basement or an interior room on the lowest floor of a sturdy building.\nAvoid windows.',
    preparedness: 'Keep your emergency kit ready and stay tuned to local news.',
    issued: '14:41 PM',
    expires: '16:00 PM',
    source: 'National Weather Service'
  }

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Emergency Events</h1>
        <p className="text-gray-600">Monitor active emergency events, review official alerts, assess potential impacts, and manage community messaging in real time.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowAlertDetailModal(true)}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Event Type</p>
              <p className="text-2xl font-bold mt-1">Tornado Warning</p>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p>Status: Active</p>
                <p>Source: National Weather Service</p>
                <p>Last Updated: 14:41</p>
              </div>
            </div>
            <AlertTriangle className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowResourceMapModal(true)}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Affected Area</p>
              <p className="text-2xl font-bold mt-1">Official geolocation</p>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p>from National Weather Service</p>
                <p>Exact coordinates applied to live map overlay</p>
              </div>
            </div>
            <MapPin className="w-6 h-6 text-green-500" />
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowSitRepModal(true)}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Potential Impacts</p>
              <div className="mt-2 space-y-1 text-xs">
                <p className="font-semibold">Residential Areas</p>
                <p className="font-semibold">Industrial Zones</p>
                <p className="font-semibold">Critical Infrastructure</p>
              </div>
            </div>
            <TrendingUp className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowEventsModal(true)}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Alerts</p>
              <p className="text-2xl font-bold mt-1">Automatically Sent: Yes</p>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p>Audience: impacted geographic area</p>
                <p>Customization: Enabled</p>
              </div>
            </div>
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Alert Message Preview</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
              <h3 className="font-bold text-lg mb-2">Tornado Warning – Take Action</h3>
              <p className="text-gray-700 mb-4">Your geographic area is under a tornado warning. This means a tornado is imminent.</p>

              <h4 className="font-semibold text-sm mb-2">Immediate Actions</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Seek immediate shelter, preferably in a windowless room</li>
                <li>✓ Check in with family and friends using the "Are We Safe" feature if directly impacted</li>
                <li>✓ Remain in your shelter-in-place location until the warning expires</li>
              </ul>

              <div className="mt-4 pt-3 border-t text-xs text-gray-600">
                <p><span className="font-semibold">National Weather Service</span> - View Local Conditions</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Quick Stats</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Events: </span>
              <span className="text-2xl font-bold">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Warnings: </span>
              <span className="text-2xl font-bold">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Alerts Sent: </span>
              <span className="text-2xl font-bold">12,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Update: </span>
              <span className="text-lg font-semibold">14:41</span>
            </div>
          </div>

          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button onClick={() => setShowMapModal(true)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold">View Map Overview</Button>
            <Button onClick={() => setShowSendAlertModal(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold">Edit Community Message</Button>
            <Button onClick={() => setShowSendAlertModal(true)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">Resend Alert</Button>
            <Button onClick={() => setShowEventsModal(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">View Delivery Status</Button>
          </div>
        </Card>
      </div>

      <SendCommunityAlertModal isOpen={showSendAlertModal} onClose={() => setShowSendAlertModal(false)} />
      <ActiveEmergencyEventsModal isOpen={showEventsModal} onClose={() => setShowEventsModal(false)} />
      <AlertDetailModal
        isOpen={showAlertDetailModal}
        onClose={() => setShowAlertDetailModal(false)}
        alert={mockAlert}
      />
      <ResourceMapModal
        isOpen={showResourceMapModal}
        onClose={() => setShowResourceMapModal(false)}
        title="Affected Area Resources"
        resources={[]}
      />
      <SituationReportModal
        isOpen={showSitRepModal}
        onClose={() => setShowSitRepModal(false)}
      />

      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-10">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">Live Map Overview</h2>
              <button onClick={() => setShowMapModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <GISMap />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
