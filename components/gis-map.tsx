'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Users,
  Zap,
  Cloud,
  Shield,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Navigation,
  Loader2,
  Globe,
  Map as MapIcon,
  Maximize2,
  Settings,
  Radar
} from 'lucide-react'
import { GoogleMap } from '@/components/google-map'
import { cn } from '@/lib/utils'
import { ShieldCheck, Truck, Siren, Building2, MapPin } from 'lucide-react'
import { geocodeAddress } from '@/lib/services/mock-map-service'
import { useGeolocation } from '@/lib/hooks/use-geolocation'

interface CitizenLocation {
  id: string
  name: string
  location: string
  role: string
  isSafe: boolean
  alerts: any[]
  weather?: { temp: number, code: number, wind: number }
  position?: { lat: number; lng: number }
}

interface IncidentMarker {
  _id: string
  type: string
  location: string
  description: string
  status: string
  lat?: number
  lng?: number
  timestamp?: string
}

interface EventMarker {
  _id: string
  type: string
  title: string
  description: string
  severity: string
  location: { lat: number; lng: number; address: string }
  magnitude?: number
  timestamp?: string
}

export function GISMap() {
  const [activeEmergencies, setActiveEmergencies] = useState<any[]>([])
  const [impactedUsers, setImpactedUsers] = useState<any[]>([])
  const [responders, setResponders] = useState<any[]>([])
  const [subAdmins, setSubAdmins] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.0902, lng: -95.7129 }) // Center of USA
  const [mapZoom] = useState(4)
  const [activeTab, setActiveTab] = useState<'Citizens' | 'Responders' | 'City Leaders' | 'Infrastructure'>('Citizens')

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [activeRes, impactedRes, subAdminsRes, respondersRes] = await Promise.all([
          fetch('/api/active-emergencies'),
          fetch('/api/ready2go-users-impacted'),
          fetch('/api/admin/users?role=sub-admin'),
          fetch('/api/responders')
        ])

        const [activeData, impactedData, subAdminsData, respondersData] = await Promise.all([
          activeRes.ok ? activeRes.json() : [],
          impactedRes.ok ? impactedRes.json() : [],
          subAdminsRes.ok ? subAdminsRes.json() : { users: [] },
          respondersRes.ok ? respondersRes.json() : []
        ])

        // Process Active Emergencies (Background Layer or separate)
        const emergencyMarkers = await Promise.all((activeData || []).map(async (item: any) => {
          const pos = await geocodeAddress(item.location || 'USA')
          return {
            id: item._id,
            position: pos,
            title: item.name,
            type: 'incident',
            status: item.status || 'Active',
            description: `${item.type} - ${item.location}`,
            color: '#DC2626'
          }
        }))
        setActiveEmergencies(emergencyMarkers)

        // Process Impacted Users for Citizens tab (As requested)
        const userMarkers = await Promise.all((impactedData || []).map(async (item: any) => {
          const pos = await geocodeAddress(item.location || 'USA')
          return {
            id: item._id,
            position: pos,
            title: item.name || 'Impacted User',
            type: 'user',
            isSafe: false,
            status: 'At Risk',
            description: `Affected Zone: ${item.location}`
          }
        }))
        setImpactedUsers(userMarkers)

        // Process Responders for Responders tab
        const responderMarkers = await Promise.all((respondersData || []).map(async (item: any) => {
          const pos = item.coordinates || await geocodeAddress(item.location || 'USA')
          return {
            id: item._id,
            position: pos,
            title: item.name,
            type: 'incident',
            status: item.status,
            description: `${item.type} Unit - ${item.location}`,
            color: item.type === 'Fire' ? '#EF4444' : item.type === 'Police' ? '#3B82F6' : '#10B981',
            icon: item.type === 'Police' ? 'siren' : item.type === 'Fire' ? 'truck' : 'medical'
          }
        }))
        setResponders(responderMarkers)

        // Process Sub-Admins for City Leaders tab
        const adminMarkers = await Promise.all((subAdminsData.users || []).map(async (user: any) => {
          const pos = await geocodeAddress(user.city || user.country || 'USA')
          return {
            id: user._id,
            position: pos,
            title: user.name,
            type: 'admin',
            status: 'Online',
            description: `Sub-Admin: ${user.city || ''} ${user.country || ''}`
          }
        }))
        setSubAdmins(adminMarkers)

      } catch (error) {
        console.error('Error fetching GIS data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const infraMarkers = useMemo(() => [
    // Hospitals
    { id: 'h1', position: { lat: 40.7128, lng: -74.0060 }, title: 'NY Presbyterian Hospital', type: 'incident', status: 'Critical Support', description: 'Level 1 Trauma Center', color: '#10B981', icon: 'medical' },
    { id: 'h2', position: { lat: 34.0522, lng: -118.2437 }, title: 'Cedars-Sinai Medical', type: 'incident', status: 'Ready', description: 'Regional Emergency Hub', color: '#10B981', icon: 'medical' },
    { id: 'h3', position: { lat: 41.8781, lng: -87.6298 }, title: 'Northwestern Memorial', type: 'incident', status: 'Active', description: 'Primary Care Node', color: '#10B981', icon: 'medical' },

    // Petrol Pumps
    { id: 'p1', position: { lat: 29.7604, lng: -95.3698 }, title: 'Houston Fuel Point', type: 'incident', status: 'Stock High', description: 'Primary Refueling Center', color: '#F59E0B', icon: 'caution' },
    { id: 'p2', position: { lat: 33.4484, lng: -112.0740 }, title: 'Phoenix Gas Hub', type: 'incident', status: 'Open', description: '24/7 Energy Access', color: '#F59E0B', icon: 'caution' },

    // Hotels (Shelters)
    { id: 'ht1', position: { lat: 39.9526, lng: -75.1652 }, title: 'Philly Grand Shelter', type: 'incident', status: 'Capacity Available', description: 'Designated Relief Housing', color: '#3B82F6', icon: 'caution' },
    { id: 'ht2', position: { lat: 47.6062, lng: -122.3321 }, title: 'Seattle Harbor Inn', type: 'incident', status: 'Designated Shelter', description: 'Emergency Safe House', color: '#3B82F6', icon: 'caution' },
  ], [])

  const markers = useMemo(() => {
    switch (activeTab) {
      case 'Citizens': return impactedUsers
      case 'Responders': return responders
      case 'City Leaders': return subAdmins
      case 'Infrastructure': return infraMarkers
      default: return []
    }
  }, [activeTab, impactedUsers, responders, subAdmins, infraMarkers])

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-[700px] flex flex-col">
      {/* Real-time Impact Map Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap shrink-0">GIS Impact Map</h2>

        <div className="flex bg-slate-50 p-1 rounded-2xl gap-0.5 overflow-x-auto no-scrollbar">
          {(['Citizens', 'Responders', 'City Leaders', 'Infrastructure'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                  : "text-slate-400 hover:text-slate-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        <GoogleMap markers={markers} zoom={mapZoom} center={mapCenter} />
      </div>
    </div>
  )
}
