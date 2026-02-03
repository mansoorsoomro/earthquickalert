'use client'

import { X, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface AlertDetailModalProps {
  isOpen: boolean
  onClose: () => void
  alert?: {
    title: string
    severity: 'warning' | 'alert' | 'watch'
    description: string
    whatItMeans: string
    whatToDo: string
    preparedness: string
    issued: string
    expires: string
    source: string
  } | null
}

export function AlertDetailModal({ isOpen, onClose, alert }: AlertDetailModalProps) {
  if (!isOpen || !alert) return null

  const severityColors = {
    warning: 'bg-red-50 border-red-200',
    alert: 'bg-orange-50 border-orange-200',
    watch: 'bg-yellow-50 border-yellow-200',
  }

  const severityBgColors = {
    warning: 'bg-red-100',
    alert: 'bg-orange-100',
    watch: 'bg-yellow-100',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${severityColors[alert.severity]}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 rounded-lg ${severityBgColors[alert.severity]} flex-shrink-0`}>
                <AlertTriangle className="w-6 h-6 text-gray-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${alert.severity === 'warning' ? 'bg-red-500 text-white' :
                      alert.severity === 'alert' ? 'bg-orange-500 text-white' :
                        'bg-yellow-500 text-white'
                    }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{alert.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{alert.source}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Description */}
          <div className="mb-6">
            <p className="text-gray-800">{alert.description}</p>
          </div>

          {/* What This Means */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">What This Means</h3>
            <p className="text-gray-700 text-sm">{alert.whatItMeans}</p>
          </div>

          {/* What You Need To Do Now */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              What You Need To Do Now
            </h3>
            <div className="bg-red-100/50 rounded-lg p-4 text-gray-800 text-sm space-y-2">
              {alert.whatToDo.split('\n').map((line, i) => (
                <p key={i}>• {line}</p>
              ))}
            </div>
          </div>

          {/* Preparedness Tip */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Preparedness Tip</h3>
            <p className="text-gray-700 text-sm">{alert.preparedness}</p>
          </div>

          {/* Safety Checklist */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">Safety Checklist</h3>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Ensure you have a flashlight and extra batteries</span>
            </label>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Keep an emergency kit ready</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Mark yourself safe on Ready2Go</span>
            </label>
            <Button className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Check Safety
            </Button>
          </div>

          {/* Footer Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div>
              <p className="font-semibold text-gray-900">Issued</p>
              <p>{alert.issued}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Expires</p>
              <p>{alert.expires}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
            >
              Close
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Share Alert
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
