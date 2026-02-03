'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GISEOCActivatedModal } from '@/components/modals/gis-eoc-activated-modal'

export default function GISMappingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const reports = [
    {
      id: 1,
      name: 'Javier Waters',
      category: 'Road Closures',
      date: '20/Dec/2025',
      file: 'Road_Closure_0421.pdf',
      status: 'Review',
    },
    {
      id: 2,
      name: 'Frankie Kilback',
      category: 'Structural Damage',
      date: '19/Dec/2025',
      file: 'Structural_Damage_0420.pdf',
      status: 'Reviewed',
    },
  ]

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Live Incident Map</h1>
        <p className="text-gray-600">A real-time, interactive map showing all active incidents in your area. When the Emergency Operations Center (EOC) is activated, this map expands to include detailed, event-specific guidance and resources.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">No EOC Activated</h2>
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
          <svg className="w-full h-full" viewBox="0 0 800 400" style={{ background: '#f0f0f0' }}>
            {/* Basic map representation */}
            <rect x="50" y="50" width="700" height="300" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />

            {/* Water features */}
            <path d="M 100 200 Q 200 150, 300 200 T 500 200" fill="none" stroke="#0284c7" strokeWidth="3" opacity="0.6" />

            {/* Green areas (parks) */}
            <circle cx="150" cy="120" r="30" fill="#86efac" opacity="0.6" />
            <circle cx="650" cy="150" r="40" fill="#86efac" opacity="0.6" />

            {/* Pink areas (buildings) */}
            <rect x="200" y="100" width="50" height="50" fill="#f8bbd0" opacity="0.5" />
            <rect x="350" y="150" width="60" height="40" fill="#f8bbd0" opacity="0.5" />
            <rect x="600" y="250" width="70" height="50" fill="#f8bbd0" opacity="0.5" />

            {/* Markers */}
            <circle cx="300" cy="200" r="8" fill="#fbbf24" />
            <circle cx="450" cy="250" r="8" fill="#3b82f6" />
            <circle cx="550" cy="180" r="8" fill="#10b981" />
            <circle cx="200" cy="300" r="8" fill="#fbbf24" />

            {/* Popup */}
            <rect x="350" y="250" width="180" height="80" fill="white" stroke="#333" strokeWidth="1" rx="4" />
            <text x="365" y="270" fontSize="14" fontWeight="bold">Traffic Accident</text>
            <text x="365" y="290" fontSize="12">Use caution. Monitor</text>
            <text x="365" y="290" dy="15" fontSize="12">for updates.</text>
            <circle cx="515" cy="255" r="6" fill="none" stroke="#666" strokeWidth="2" />
          </svg>
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>Interactive map showing incident locations and details</p>
          <p className="mt-1">Click on markers to view incident information</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Interactive Reporting Management</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Report Categories</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Incident Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Incident Report</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{report.name}</td>
                  <td className="py-3 px-4 text-sm">{report.category}</td>
                  <td className="py-3 px-4 text-sm">{report.date}</td>
                  <td className="py-3 px-4 text-sm text-blue-600">{report.file}</td>
                  <td className="py-3 px-4 text-sm">
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className={`${report.status === 'Review'
                      ? 'bg-gray-800 hover:bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700'
                      }`} size="sm">
                      {report.status}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <GISEOCActivatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
