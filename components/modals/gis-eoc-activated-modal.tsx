'use client'

import { useState } from 'react'
import { X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const LeafletMap = dynamic(() => import('@/components/leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-50 animate-pulse flex items-center justify-center rounded-lg border border-slate-100">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Loading Map Engine...</p>
    </div>
  ),
})

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
    location: '626 Jerrold Stravenue, Cloverburgh 76058',
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border-none animate-in fade-in zoom-in duration-300">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#111827]">EOC Activated View</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Layer Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {mapLayers.map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={cn(
                  "px-4 py-2 rounded-lg font-bold text-[11px] transition-all",
                  activeLayer === layer
                    ? "bg-[#2D3142] text-white shadow-md shadow-slate-900/10"
                    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                )}
              >
                {layer}
              </button>
            ))}
          </div>

          {/* Map Container */}
          <div className="w-full h-[350px] rounded-lg overflow-hidden border border-slate-100 shadow-sm relative">
            <LeafletMap
              center={{ lat: 41.8781, lng: -87.6298 }}
              resources={[]} // Modal map usually has specific layers
              zoom={13}
            />
            {/* Simulation of the red circles from the design */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="relative w-full h-full opacity-40">
                <div className="absolute top-[10%] left-[35%] w-12 h-12 bg-red-400 rounded-full blur-sm border border-red-500/20" />
                <div className="absolute top-[25%] left-[28%] w-16 h-16 bg-red-400 rounded-full blur-sm border border-red-500/20" />
                <div className="absolute top-[35%] left-[40%] w-20 h-20 bg-red-400 rounded-full blur-sm border border-red-500/20" />
                <div className="absolute top-[55%] left-[28%] w-14 h-14 bg-red-400 rounded-full blur-sm border border-red-500/20" />
                <div className="absolute top-[45%] left-[32%] w-10 h-10 bg-red-400 rounded-full blur-sm border border-red-500/20" />
              </div>
            </div>
          </div>

          {/* Verification Rows */}
          <div className="space-y-2.5">
            {citizenReports.map((report, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1.2fr_1.8fr_auto] items-center gap-6 p-4 bg-[#F8F9FB] rounded-xl hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-extrabold text-[#111827] text-base leading-none mb-1">{report.name}</p>
                  <p className="text-[12px] font-bold text-[#64748B]">{report.time}</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#2D3142] mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] font-bold text-[#475569] leading-tight max-w-[280px]">
                    {report.location}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 min-w-[160px] justify-end">
                  {report.status === 'verified' ? (
                    <Button
                      disabled
                      className="w-full bg-[#E2E8F0] text-[#64748B] font-bold text-[12px] h-9 border-none rounded-lg"
                    >
                      Verified
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="bg-[#E2E8F0]/50 hover:bg-[#E2E8F0] text-[#64748B] font-bold text-[12px] h-9 px-6 rounded-lg"
                      >
                        Deny
                      </Button>
                      <Button
                        className="bg-[#2D3142] hover:bg-[#1A1D29] text-white font-bold text-[12px] h-9 px-6 rounded-lg"
                      >
                        Verify
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
