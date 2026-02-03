'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, FileText, Shield, Users, Layers } from 'lucide-react'

export default function VirtualEOCAICenterPage() {

  const stats = [
    {
      icon: AlertTriangle,
      label: 'Active Incidents',
      value: '2',
      color: 'red',
    },
    {
      icon: CheckCircle,
      label: 'Responder Actions Completed',
      value: '12 / 15',
      color: 'green',
    },
    {
      icon: FileText,
      label: 'Citizen Reports Received',
      value: '48',
      color: 'blue',
    },
    {
      icon: Shield,
      label: '"Are We Safe" Check-Ins',
      value: '36',
      color: 'purple',
    },
    {
      icon: Users,
      label: 'Users Leveraging Virtual EOC',
      value: '42',
      color: 'orange',
    },
    {
      icon: Layers,
      label: 'GIS Layers Active',
      value: '5',
      color: 'cyan',
    },
  ]

  const taskManagement = [
    {
      responder: 'J. Smith',
      role: 'Incident Commander',
      status: 'In Progress',
      incident: 'Tornado 04/23',
      time: '14:45',
    },
    {
      responder: 'L. Brown',
      role: 'Comms Lead',
      status: 'Completed',
      incident: 'Tornado 04/23',
      time: '14:42',
    },
    {
      responder: 'Ops Team A',
      role: 'Operations',
      status: 'Not Started',
      incident: 'Tornado 04/23',
      time: '14:35',
    },
  ]

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800'
      case 'In Progress':
        return 'px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800'
      case 'Not Started':
      default:
        return 'px-2 py-1 rounded text-xs font-semibold bg-sky-100 text-sky-800'
    }
  }

  const fieldReports = [
    {
      id: '#1045',
      submittedBy: 'John D',
      location: '32.123, -97.456',
      type: 'Flooded Road',
      status: 'Verified',
      time: '14:42',
    },
    {
      id: '#1046',
      submittedBy: 'Sarah P',
      location: '32.126, -97.459',
      type: 'Structural Damage',
      status: 'Pending',
      time: '14:42',
    },
  ]

  const checkins = [
    {
      user: 'J. Doe',
      location: '32.122, -97.456',
      status: 'Safe',
      time: '14:40',
      incident: 'Tornado 04/23',
    },
    {
      user: 'M. Khan',
      location: '32.126, -97.459',
      status: 'Unsafe',
      time: '14:42',
      incident: 'Tornado 04/23',
    },
  ]

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      red: 'text-red-500 bg-red-50',
      green: 'text-green-500 bg-green-50',
      blue: 'text-blue-500 bg-blue-50',
      purple: 'text-purple-500 bg-purple-50',
      orange: 'text-orange-500 bg-orange-50',
      cyan: 'text-cyan-500 bg-cyan-50',
    }
    return colors[color] || 'text-gray-500 bg-gray-50'
  }

  const getIconBadgeClass = (color: string) => {
    const map: Record<string, string> = {
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      cyan: 'bg-cyan-100 text-cyan-600',
    }
    return map[color] || 'bg-gray-100 text-gray-600'
  }

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Virtual EOC / AI Center</h1>
        <p className="text-gray-600">Monitor responder activity, citizen engagement, and incident insights in real time.</p>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="p-4 bg-white border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-md ${getIconBadgeClass(stat.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold">GIS Mapping & Incident Visualization</h2>
          <div className="flex items-center gap-2">
            <Button className="rounded-full bg-blue-50 text-blue-600 px-3 py-1 text-xs" size="sm">Public Safety</Button>
            <Button className="rounded-full bg-green-50 text-green-600 px-3 py-1 text-xs" size="sm">Informational</Button>
            <Button className="rounded-full bg-yellow-50 text-yellow-600 px-3 py-1 text-xs" size="sm">Moderate / Caution</Button>
          </div>
        </div>

        <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
          <svg className="w-full h-full" viewBox="0 0 900 450" style={{ background: '#f0f0f0' }}>
            {/* Basic map representation */}
            <rect x="50" y="50" width="800" height="350" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />

            {/* Water features */}
            <path d="M 100 220 Q 250 150, 400 220 T 700 220" fill="none" stroke="#0284c7" strokeWidth="4" opacity="0.6" />

            {/* Green areas (parks) */}
            <circle cx="180" cy="120" r="35" fill="#86efac" opacity="0.6" />
            <circle cx="750" cy="160" r="45" fill="#86efac" opacity="0.6" />

            {/* Pink areas (buildings) */}
            <rect x="250" y="100" width="60" height="60" fill="#f8bbd0" opacity="0.5" />
            <rect x="420" y="150" width="70" height="50" fill="#f8bbd0" opacity="0.5" />
            <rect x="680" cy="280" width="80" height="60" fill="#f8bbd0" opacity="0.5" />

            {/* Markers */}
            <circle cx="350" cy="220" r="10" fill="#fbbf24" />
            <circle cx="500" cy="280" r="10" fill="#3b82f6" />
            <circle cx="600" cy="200" r="10" fill="#10b981" />
            <circle cx="250" cy="320" r="10" fill="#fbbf24" />

            {/* Popup */}
            <rect x="420" y="300" width="200" height="90" fill="white" stroke="#333" strokeWidth="1" rx="4" />
            <text x="440" y="320" fontSize="15" fontWeight="bold">Traffic Accident</text>
            <text x="440" y="340" fontSize="13">Use caution. Monitor</text>
            <text x="440" y="357" fontSize="13">for updates.</text>
            <circle cx="605" cy="305" r="8" fill="none" stroke="#666" strokeWidth="2" />
          </svg>
        </div>

        {/* <div className="text-center text-gray-600 text-sm mb-4">
          <p>Interactive map showing all active incidents, resource locations, and incident details</p>
          <p className="mt-1">Click on markers or use tabs to filter by severity level</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">Public Safety</Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white" size="sm">Informational</Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" size="sm">Moderate / Caution</Button>
        </div> */}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Responder Task Management</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Responder</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Checklist Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Assigned Incident</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Last Update</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskManagement.map((task, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{task.responder}</td>
                  <td className="py-3 px-4 text-sm">{task.role}</td>
                  <td className="py-3 px-4">
                    <span className={getStatusBadgeClass(task.status)}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{task.incident}</td>
                  <td className="py-3 px-4 text-sm">{task.time}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">View</Button>
                      {task.responder === 'Ops Team A' ? (
                        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700" size="sm">Assign</Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Field Reports from the Public</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Report ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Submitted By</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {fieldReports.map((r, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{r.id}</td>
                  <td className="py-3 px-4 text-sm">{r.submittedBy}</td>
                  <td className="py-3 px-4 text-sm">{r.location}</td>
                  <td className="py-3 px-4 text-sm">{r.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${r.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Community Safety Check-ins</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Last Check-in</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Incident</th>
              </tr>
            </thead>
            <tbody>
              {checkins.map((c, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">{c.user}</td>
                  <td className="py-3 px-4 text-sm">{c.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${c.status === 'Safe' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{c.time}</td>
                  <td className="py-3 px-4 text-sm">{c.incident}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
