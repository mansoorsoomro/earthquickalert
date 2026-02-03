'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, Users } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

export default function RespondersAgenciesPage() {

  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Emergency Manager',
      organization: 'County EM',
      access: true,
      incident: 'Incident Command',
    },
    {
      id: 2,
      name: 'Michael Torres',
      role: 'Mayor',
      organization: 'City Office',
      access: true,
      incident: 'Executive Oversight',
    },
    {
      id: 3,
      name: 'Robert Hayes',
      role: 'Chief of Staff',
      organization: "Governor's Office",
      access: true,
      incident: 'Policy Coordination',
    },
  ])

  const toggleAdminAccess = (id: number, enabled: boolean) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, access: enabled } : u)))
  }

  const activePersonnel = [
    {
      id: 1,
      name: 'L. Brown',
      role: 'Comms Lead',
      agency: 'City EM',
      incident: 'Tornado Warning',
      status: 'Active',
      statusColor: 'green',
    },
    {
      id: 2,
      name: 'M. Patel',
      role: 'Fire Ops',
      agency: 'Fire Dept',
      incident: 'Tornado Warning',
      status: 'Active',
      statusColor: 'green',
    },
    {
      id: 3,
      name: 'Ops Team A',
      role: 'Facilities',
      agency: 'Public Works',
      incident: 'Tornado Warning',
      status: 'Standby',
      statusColor: 'yellow',
    },
  ]

  const nonprofitPartners = [
    {
      organization: 'Red Cross',
      function: 'Sheltering',
      area: 'North Zone',
      status: 'Active',
      contact: 'Assigned',
    },
    {
      organization: 'World Central Kitchen',
      function: 'Food Services',
      area: 'Central Hub',
      status: 'Active',
      contact: 'Assigned',
    },
  ]

  const privateSectorPartners = [
    {
      business: 'PowerCo',
      sector: 'Utilities',
      role: 'Power Restoration',
      area: 'Industrial Zone',
      status: 'Active',
    },
    {
      business: 'PharmaPlus',
      sector: 'Pharmacy',
      role: 'Medication Access',
      area: 'East District',
      status: 'Active',
    },
  ]

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Responders & Agencies</h1>
        <p className="text-gray-600">Manage administrative access, essential personnel, and responder actions for active and planned incidents.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Administrative Users & Decision Makers</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Organization</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Admin Access</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Incident Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-sm">{user.role}</td>
                  <td className="py-3 px-4 text-sm">{user.organization}</td>
                  <td className="py-3 px-4">
                    <Switch
                      checked={user.access}
                      onCheckedChange={(checked) => toggleAdminAccess(user.id, !!checked)}
                      aria-label={`Admin access for ${user.name}`}
                    />
                  </td>
                  <td className="py-3 px-4 text-sm underline text-blue-600">{user.incident}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Users className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md p-3">
          <span className="text-blue-500 font-semibold text-lg">●</span>
          <AlertDescription className="text-blue-700 text-sm font-medium">
            Activated personnel display Essential Personnel banner on mobile
          </AlertDescription>
        </div>

        <h2 className="text-lg font-bold mb-4">Active Response Personnel</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Agency</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Assigned Incident</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activePersonnel.map((person) => (
                <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{person.name}</td>
                  <td className="py-3 px-4 text-sm">{person.role}</td>
                  <td className="py-3 px-4 text-sm">{person.agency}</td>
                  <td className="py-3 px-4 text-sm">{person.incident}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${person.statusColor === 'green'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs" size="sm">View</Button>
                    <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs" size="sm">Assign</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Non-Profit Response Partners</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Organization</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Function</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Response Area</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Contact</th>
              </tr>
            </thead>
            <tbody>
              {nonprofitPartners.map((partner, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{partner.organization}</td>
                  <td className="py-3 px-4 text-sm">{partner.function}</td>
                  <td className="py-3 px-4 text-sm">{partner.area}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                      {partner.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{partner.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Private Sector Response Partners</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Business</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Sector</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Support Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Response Area</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {privateSectorPartners.map((partner, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{partner.business}</td>
                  <td className="py-3 px-4 text-sm">{partner.sector}</td>
                  <td className="py-3 px-4 text-sm">{partner.role}</td>
                  <td className="py-3 px-4 text-sm">{partner.area}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                      {partner.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
