'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertDetailModal } from '@/components/modals/alert-detail-modal'
import { Bell, MapPin, AlertTriangle, Heart, MailPlus as MapPinPlus, Cloud, Navigation, BookOpen, AlertCircle, Utensils, DollarSign, Fuel, ArrowRight } from 'lucide-react'

const emergencyGuides = [
  {
    icon: AlertTriangle,
    title: 'Active Shooter Response',
    description: 'Guided steps + direct 911 call with location sharing'
  },
  {
    icon: Heart,
    title: '"Are We Safe?" Check-In',
    description: 'Start check-in or view your group\'s safety status'
  },
  {
    icon: MapPin,
    title: 'Favorite Places',
    description: 'Quick access to school, daycare, meeting points'
  }
]

const nearbyResources = [
  { icon: AlertCircle, label: 'Hospitals', distance: '0.8 mi away' },
  { icon: Utensils, label: 'Pharmacies', distance: '0.3 mi away' },
  { icon: BookOpen, label: 'Lodging', distance: '1.2 mi away' },
  { icon: Fuel, label: 'Food & Essentials', distance: '0.5 mi away' },
  { icon: DollarSign, label: 'Financial Services', distance: '0.4 mi away' },
  { icon: Navigation, label: 'Traffic Status', distance: 'Clear' },
]

const newsItems = [
  {
    tag: 'Traffic',
    title: 'Highway 101 Closure This Weekend',
    description: 'Plan alternate routes for Saturday maintenance work',
    time: '2 hours ago'
  },
  {
    tag: 'Community',
    title: 'Free Health Screening Event',
    description: 'Community center wellness checkups this Thursday',
    time: '5 hours ago'
  },
  {
    tag: 'Safety',
    title: 'Emergency Drill Scheduled',
    description: 'City-wide preparedness exercise next Tuesday',
    time: '1 day ago'
  }
]

export default function UserDashboard() {
  const [userName, setUserName] = useState('')
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showAlertModal, setShowAlertModal] = useState(false)

  // We can still keep the name setting if needed, but it's largely handled by the layout now.
  // We'll leave the state for local page needs if any.

  return (
    <main className="flex-1 overflow-auto max-w-7xl mx-auto w-full px-6 py-8">
      {/* Hero Banner */}
      <Card className="mb-8 p-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white border-0 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/Frame 1618873823.png"
            alt="Ready2Go Background"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-bold mb-3">Ready2Go – Stay Prepared & Protected</h1>
            <p className="text-blue-100 text-lg">Your personalized safety tools, alerts, and preparedness resources – all in one place.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button className="bg-green-400 text-white hover:bg-green-500 font-semibold px-6 py-2">
              All Clear
            </Button>
            <span className="text-xs text-blue-100">Last updated<br/>12:45 PM EST</span>
          </div>
        </div>
      </Card>

      {/* Quick Guide Cards */}
      <div className="grid grid-cols-3 gap-0 mb-8 items-center">
        {emergencyGuides.map((guide, idx) => {
          const Icon = guide.icon
          return (
            <React.Fragment key={idx}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <div className="flex items-start gap-4 mb-3">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{guide.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{guide.description}</p>
                  </div>
                </div>
              </Card>
              {/* {idx < 2 && <ArrowRight className="w-6 h-6 text-gray-400 mx-2" />} */}
            </React.Fragment>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* My Locations & Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Locations & Alerts</h2>
              <Button size="sm" className="text-blue-600 bg-transparent hover:bg-blue-50">
                + Add Location
              </Button>
            </div>

            {/* Current Location */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Current Location</p>
                  <p className="text-sm text-gray-600">San Francisco, CA 94102</p>
                  <p className="text-xs text-gray-500 mt-1">GPS enabled • Real-time alerts active</p>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">Active</span>
              </div>
            </div>

            {/* Other Locations */}
            {['Home', 'Lincoln High School', 'Office', 'Office'].map((location, idx) => (
              <div key={idx} className="py-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 px-3 -mx-3 rounded">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">{location}</p>
                      <p className="text-xs text-gray-500">123 Main St, San Francisco, CA</p>
                    </div>
                  </div>
                  <span className="text-gray-400">›</span>
                </div>
              </div>
            ))}

            {/* Alert Types */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-3">Alerts Enabled For:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Weather</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">News</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Nearby Emergencies</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Community Updates</span>
              </div>
            </div>
          </Card>

          {/* Nearby Resources */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Nearby Resources</h2>
              <Button size="sm" className="text-blue-600 bg-transparent hover:bg-blue-50">
                View Map
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {nearbyResources.map((resource, idx) => {
                const Icon = resource.icon
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{resource.label}</p>
                      <p className="text-xs text-gray-500">{resource.distance}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather Alerts */}
          <Card className="p-0 bg-blue-600 text-white border-0 overflow-hidden relative">
            <div className="relative w-full h-64">
              <Image
                src="/div.png"
                alt="Weather Alerts Background"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="w-6 h-6" />
                  <h3 className="font-bold">Weather Alerts</h3>
                </div>
                <p className="text-3xl font-bold mb-1">72°F</p>
                <p className="text-blue-100 text-sm mb-4">Partly Cloudy</p>
                <div className="bg-blue-500 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold mb-2">No Active Warnings</p>
                  <p className="text-xs text-blue-100">Your area is clear of weather alerts</p>
                </div>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  View Full Forecast
                </Button>
              </div>
            </div>
          </Card>

          {/* Emergency Plan Builder */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-3">Emergency Plan Builder</h3>
            <p className="text-sm text-gray-600 mb-4">Create and manage your family emergency plan</p>

            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded">
                Family Emergency Plan →
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded">
                Emergency Kits →
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded">
                Favorite Places Setup →
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded">
                Pet Safety Plan →
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">Plan Completion</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">65%</p>
            </div>
          </Card>

          {/* Preparedness Info */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Preparedness Info</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                <p className="font-semibold text-sm text-gray-900">Active Shooter Preparedness</p>
                <p className="text-xs text-gray-500">Essential safety protocols</p>
              </button>
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                <p className="font-semibold text-sm text-gray-900">Severe Weather Tips</p>
                <p className="text-xs text-gray-500">Stay safe during storms</p>
              </button>
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                <p className="font-semibold text-sm text-gray-900">Wildfire Preparedness</p>
                <p className="text-xs text-gray-500">Evacuation planning</p>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* News & Updates */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">News & Updates</h2>
          <div className="flex gap-2">
            <Button size="sm" className="text-blue-600 bg-transparent hover:bg-blue-50">All</Button>
            <Button size="sm" className="text-gray-600 bg-transparent hover:bg-gray-50">Emergency</Button>
            <Button size="sm" className="text-gray-600 bg-transparent hover:bg-gray-50">Local</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {newsItems.map((item, idx) => {
            const bgColor = item.tag === 'Traffic' ? 'from-yellow-400 to-yellow-500' : item.tag === 'Community' ? 'from-green-400 to-green-500' : 'from-orange-400 to-orange-500'
            const textColor = item.tag === 'Traffic' ? 'text-yellow-600' : item.tag === 'Community' ? 'text-green-600' : 'text-orange-600'
            const tagBg = item.tag === 'Traffic' ? 'bg-blue-100' : item.tag === 'Community' ? 'bg-green-100' : 'bg-orange-100'
            return (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`h-40 bg-gradient-to-br ${bgColor} flex items-center justify-center`}>
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <div className="p-4">
                  <span className={`px-2 py-1 ${tagBg} ${textColor} rounded text-xs font-semibold`}>{item.tag}</span>
                  <h3 className="font-bold text-gray-900 mt-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{item.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <AlertDetailModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        alert={selectedAlert}
      />
    </main>
  )
}
