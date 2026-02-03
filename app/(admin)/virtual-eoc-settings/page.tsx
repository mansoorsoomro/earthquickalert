'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'

export default function VirtualEOCSettingsPage() {
  const [activationCriteria, setActivationCriteria] = useState('all-events')
  const [alertFeeds, setAlertFeeds] = useState<Record<string, boolean>>({
    nws: true,
    localEM: true,
    authorized: true,
  })

  const toggleAlertFeed = (key: string) => {
    setAlertFeeds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const severityLevels = ['Minor', 'Moderate', 'Major', 'Catastrophic']

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Virtual EOC Activation Settings</h1>
        <p className="text-gray-600">Configure when the Virtual Emergency Operations Center activates for your organization.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Activation Criteria</h2>
          <p className="text-sm text-gray-600 mb-4">Choose the incident severity levels that will trigger the Virtual EOC experience.</p>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="criteria"
                value="all-events"
                checked={activationCriteria === 'all-events'}
                onChange={(e) => setActivationCriteria(e.target.value)}
                className="mt-1 w-4 h-4"
              />
              <div>
                <p className="font-semibold text-sm">All Events</p>
                <p className="text-xs text-gray-600">Activate the Virtual EOC for every incident, regardless of severity.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="criteria"
                value="major-catastrophic"
                checked={activationCriteria === 'major-catastrophic'}
                onChange={(e) => setActivationCriteria(e.target.value)}
                className="mt-1 w-4 h-4"
              />
              <div>
                <p className="font-semibold text-sm">Major & Catastrophic Events Only</p>
                <p className="text-xs text-gray-600">Activate the Virtual EOC only for high-impact incidents.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="criteria"
                value="custom"
                checked={activationCriteria === 'custom'}
                onChange={(e) => setActivationCriteria(e.target.value)}
                className="mt-1 w-4 h-4"
              />
              <div>
                <p className="font-semibold text-sm">Custom Severity Levels</p>
                <p className="text-xs text-gray-600">Select specific incident severities that will activate the Virtual EOC.</p>
              </div>
            </label>

            {activationCriteria === 'custom' && (
              <div className="ml-7 space-y-2 mt-4 p-3 bg-gray-50 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-2">If Custom is selected:</p>
                {severityLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 border-gray-300 rounded" />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Location-Based Activation</h2>
          <p className="text-sm text-gray-600 mb-4">Virtual EOC activation is automatically limited to users within the affected geographic area.</p>

          <div className="space-y-3 text-sm text-gray-700">
            <p>Alerts and EOC views are geolocated using official data sources such as the National Weather Service</p>
            <p>Only users within the alert boundary will see the activated Virtual EOC view</p>
            <p>Users outside the affected area will continue to see the standard application experience</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Official Alert Feeds</h2>
        <p className="text-sm text-gray-600 mb-4">Select which trusted sources are used to trigger Virtual EOC activation.</p>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={alertFeeds.nws}
              onChange={() => toggleAlertFeed('nws')}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="font-semibold">National Weather Service (NWS)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={alertFeeds.localEM}
              onChange={() => toggleAlertFeed('localEM')}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="font-semibold">Local Emergency Management</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={alertFeeds.authorized}
              onChange={() => toggleAlertFeed('authorized')}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="font-semibold">Other Authorized Alert Sources</span>
          </label>
        </div>
      </Card>

      <Card className="p-6 bg-yellow-50 border border-yellow-200">
        <h3 className="font-bold mb-2">Administrative Controls</h3>
        <p className="text-sm text-gray-700">These settings apply at the organization level</p>
        <p className="text-sm text-gray-700 mt-2">Only users with Admin access can modify activation criteria</p>
        <p className="text-sm text-gray-700 mt-2">Changes take effect immediately for future incidents</p>
      </Card>
    </main>
  )
}
