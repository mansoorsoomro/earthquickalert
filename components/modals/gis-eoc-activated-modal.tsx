'use client'

import { useState } from 'react'
import { X, MapPin, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface GISEOCActivatedModalProps {
  isOpen: boolean
  onClose: () => void
}

const mapLayers = [
  'Shelter-in-Place Locations',
  'Evacuation Routes',
  'Hospitals & Emergency Care',
  'Open Pharmacies',
  'Restricted & Impacted Areas',
]

const citizenReports = [
  {
    name: 'Elvira Davis',
    time: '5 Minutes ago',
    location: '626 Jerrold Stravenue, Gloverburgh 76058',
    status: 'pending' as const,
  },
  {
    name: 'Sidney White',
    time: '10 Minutes ago',
    location: '60728 Will Causeway, Lake Felton 36352-6134',
    status: 'verified' as const,
  },
]

export function GISEOCActivatedModal({ isOpen, onClose }: GISEOCActivatedModalProps) {
  const [activeLayer, setActiveLayer] = useState('Shelter-in-Place Locations')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header and Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">EOC Activated View</h2>
          </div>

          {/* Map Layer Tabs */}
          <div className="mb-4 flex gap-2 pb-3 border-b border-gray-200">
            {mapLayers.map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-3 py-1 rounded-md font-semibold text-xs whitespace-nowrap transition-all ${
                  activeLayer === layer
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          {/* Main Content - Map only */}
          <div className="w-full">
            {/* Interactive Map */}
            <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-300 relative overflow-hidden mb-4">
              {/* Detailed map visualization */}
              <svg className="w-full h-full" viewBox="0 0 1200 400" style={{ background: '#f5f5f5' }}>
                {/* Base map */}
                <rect x="0" y="0" width="1200" height="400" fill="#f0f0f0" />
                
                {/* Streets/roads */}
                <line x1="50" y1="0" x2="50" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="150" y1="0" x2="150" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="250" y1="0" x2="250" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="350" y1="0" x2="350" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="450" y1="0" x2="450" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="550" y1="0" x2="550" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="650" y1="0" x2="650" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="750" y1="0" x2="750" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="850" y1="0" x2="850" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="950" y1="0" x2="950" y2="400" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="1050" y1="0" x2="1050" y2="400" stroke="#d0d0d0" strokeWidth="8" />

                {/* Horizontal streets */}
                <line x1="0" y1="50" x2="1200" y2="50" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="0" y1="120" x2="1200" y2="120" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="0" y1="200" x2="1200" y2="200" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="0" y1="280" x2="1200" y2="280" stroke="#d0d0d0" strokeWidth="8" />
                <line x1="0" y1="360" x2="1200" y2="360" stroke="#d0d0d0" strokeWidth="8" />

                {/* River/Water feature */}
                <path d="M 100 300 Q 200 250, 350 200 Q 450 150, 550 100 Q 700 50, 900 30 L 900 400 L 100 400 Z" fill="#87ceeb" opacity="0.5" />
                
                {/* Green areas (parks) */}
                <circle cx="100" cy="80" r="30" fill="#86efac" opacity="0.8" />
                <circle cx="1000" cy="100" r="40" fill="#86efac" opacity="0.8" />
                <polygon points="650,350 700,330 720,380" fill="#86efac" opacity="0.8" />

                {/* Pink incident zones with red centers */}
                {[
                  { x: 300, y: 150 },
                  { x: 380, y: 200 },
                  { x: 450, y: 170 },
                  { x: 520, y: 240 },
                ].map((zone, idx) => (
                  <g key={`zone-${idx}`}>
                    <circle cx={zone.x} cy={zone.y} r="35" fill="#f8bbd0" opacity="0.6" />
                    <circle cx={zone.x} cy={zone.y} r="10" fill="#d32f2f" opacity="0.8" />
                  </g>
                ))}

                {/* Taxi/transport markers */}
                {[
                  { x: 80, y: 120 },
                  { x: 200, y: 180 },
                  { x: 400, y: 280 },
                  { x: 550, y: 350 },
                  { x: 700, y: 120 },
                  { x: 850, y: 200 },
                  { x: 950, y: 300 },
                  { x: 1100, y: 250 },
                ].map((marker, idx) => (
                  <g key={`marker-${idx}`}>
                    <rect x={marker.x - 8} y={marker.y - 8} width="16" height="16" fill="#fbbf24" rx="2" />
                    <text x={marker.x} y={marker.y + 4} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000">🚕</text>
                  </g>
                ))}

                {/* Label text */}
                <text x="150" y="30" fontSize="12" fill="#666" fontWeight="bold">Amboy Rd</text>
                <text x="20" y="200" fontSize="12" fill="#666" fontWeight="bold">Genessee Ave</text>
              </svg>
            </div>

            {/* Citizen Reports Below Map - Full Width */}
            <div className="space-y-4">
              {citizenReports.map((report, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left side - Name and Time */}
                    <div className="flex-shrink-0">
                      <p className="font-bold text-gray-900 text-sm">{report.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{report.time}</p>
                    </div>

                    {/* Middle - Location */}
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">{report.location}</p>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex-shrink-0">
                      {report.status === 'verified' ? (
                        <span className="px-4 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                          Verified
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 text-xs h-8 font-semibold"
                          >
                            Deny
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gray-800 hover:bg-gray-900 text-white px-4 text-xs h-8 font-semibold"
                          >
                            Verify
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
