'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Shield, Users, AlertTriangle, Radio, Map } from 'lucide-react'

export default function EOCModeDashboard() {
  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Virtual EOC Mode Dashboard</h1>
        <p className="text-gray-600 mt-1">Enhanced emergency operations capabilities for authorized responders</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Active Incidents</p>
              <p className="text-3xl font-bold text-red-600 mt-2">2</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500/30" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Responders Active</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">15</p>
            </div>
            <Users className="w-10 h-10 text-blue-500/30" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Communications</p>
              <p className="text-3xl font-bold text-green-600 mt-2">8</p>
            </div>
            <Radio className="w-10 h-10 text-green-500/30" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Resources Deployed</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
            </div>
            <Shield className="w-10 h-10 text-orange-500/30" />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Incident Command */}
        <Card className="p-6 border-l-4 border-l-red-500">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Incident Command
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-gray-900">Tornado Warning - Zone A</p>
              <p className="text-xs text-gray-600 mt-1">Issued 12:45 PM • Active</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="font-semibold text-gray-900">Flash Flood - East District</p>
              <p className="text-xs text-gray-600 mt-1">Issued 1:15 PM • Active</p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white">
            Manage Incidents
          </Button>
        </Card>

        {/* Resource Allocation */}
        <Card className="p-6 border-l-4 border-l-blue-500">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Resources Deployed
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">Fire Units</p>
                <p className="text-xs text-gray-600">4 units deployed</p>
              </div>
              <span className="text-lg font-bold text-blue-600">4</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">Medical Teams</p>
                <p className="text-xs text-gray-600">3 units deployed</p>
              </div>
              <span className="text-lg font-bold text-green-600">3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">Police Units</p>
                <p className="text-xs text-gray-600">5 units deployed</p>
              </div>
              <span className="text-lg font-bold text-purple-600">5</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            Allocate Resources
          </Button>
        </Card>

        {/* Citizen Communications */}
        <Card className="p-6 border-l-4 border-l-green-500">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-500" />
            Communications
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="font-semibold text-gray-900 text-sm">Tornado Warning Sent</p>
              <p className="text-xs text-gray-600 mt-1">12:46 PM • 8,432 recipients</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="font-semibold text-gray-900 text-sm">Evacuation Order Issued</p>
              <p className="text-xs text-gray-600 mt-1">12:52 PM • 5,221 recipients</p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
            Send Alert
          </Button>
        </Card>
      </div>

      {/* Map and Operations */}
      <Card className="p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Map className="w-5 h-5" />
          Real-Time Operations Map
        </h2>
        <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
          <div className="text-center">
            <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive Operations Map</p>
            <p className="text-xs text-gray-500 mt-1">Showing incidents, resources, and affected areas</p>
          </div>
        </div>
      </Card>
    </main>
  )
}
