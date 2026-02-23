'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Shield,
    FileText,
    Users,
    Heart,
    Building2,
    Send,
    ChevronDown,
    ChevronUp,
    MapPin,
    Phone,
    Mail,
    CheckCircle,
    Clock,
    AlertTriangle,
    Home,
    Package,
    Pill,
    DollarSign,
    Wrench,
    X,
    Brain,
} from 'lucide-react'

type TabType = 'admin' | 'declarations' | 'sitrep' | 'responders' | 'nonprofits' | 'businesses'

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'admin', label: 'Admin View', icon: Shield },
    { id: 'declarations', label: 'Emergency Declarations', icon: FileText },
    { id: 'sitrep', label: 'Situational Report', icon: AlertTriangle },
    { id: 'responders', label: 'Responders', icon: Users },
    { id: 'nonprofits', label: 'Non-Profits', icon: Heart },
    { id: 'businesses', label: 'Private Businesses', icon: Building2 },
]

const adminUsers = [
    { name: 'Commissioner Hayes', role: 'Emergency Management Director', org: 'County OEM', status: 'Active', phone: '(312) 555-0101', email: 'hayes@oem.gov' },
    { name: 'Mayor Patricia Lopez', role: 'Mayor', org: 'City of Springfield', status: 'Active', phone: '(312) 555-0102', email: 'mayor@springfield.gov' },
    { name: 'Gov. Office – Chief of Staff', role: 'Chief of Staff', org: "Governor's Office", status: 'Active', phone: '(312) 555-0103', email: 'cos@gov.state' },
    { name: 'Rep. David Kim', role: 'State Representative', org: 'State Legislature', status: 'Notified', phone: '(312) 555-0104', email: 'kim@statehouse.gov' },
    { name: 'Fire Chief Margaret Torres', role: 'Fire Department Chief', org: 'Springfield Fire Dept.', status: 'Active', phone: '(312) 555-0105', email: 'torres@fire.gov' },
]

const declarations = [
    {
        id: 'DEC-2025-001',
        type: 'Local Emergency Declaration',
        issuedBy: 'Mayor Patricia Lopez',
        date: '2025-12-20',
        status: 'Active',
        description: 'Activates local emergency resources including additional staffing authorization, procurement flexibility, and access to emergency reserve funds.',
        liberalizations: ['Emergency procurement override', 'Overtime authorization for all city staff', 'Access to emergency reserve fund', 'Suspension of non-emergency permit requirements'],
    },
    {
        id: 'DEC-2025-002',
        type: 'State of Emergency Declaration',
        issuedBy: "Governor's Office",
        date: '2025-12-20',
        status: 'Pending Approval',
        description: 'State-level declaration enabling access to state National Guard resources, mutual aid agreements with neighboring counties, and federal assistance eligibility.',
        liberalizations: ['National Guard activation authority', 'Multi-county mutual aid', 'Federal FEMA assistance eligibility', 'Healthcare licensing waivers', 'Telemedicine authorization'],
    },
]

const responseRoles = [
    { name: 'Capt. James Rivera', role: 'Incident Commander', dept: 'Emergency Management', status: 'On Scene', comms: 'Drafting alerts' },
    { name: 'Lt. Carla Nguyen', role: 'Public Safety Officer', dept: 'Police Department', status: 'Active', comms: 'Field coordination' },
    { name: 'Chief Wade Brooks', role: 'Fire Operations Lead', dept: 'Fire Department', status: 'Active', comms: 'Evacuation support' },
    { name: 'Sandra Obi', role: 'Facility Manager', dept: 'Public Works', status: 'Active', comms: 'Shelter setup' },
    { name: 'Dr. Evelyn Park', role: 'Medical Coordinator', dept: 'Health Department', status: 'Notified', comms: 'Awaiting dispatch' },
    { name: 'Marcus Webb', role: 'Communications Lead', dept: 'County PIO', status: 'Active', comms: 'Drafting comms msgs' },
]

const nonprofits = [
    { name: 'American Red Cross', type: 'Humanitarian', contact: 'Maria Santos', phone: '(800) 733-2767', services: ['Emergency Shelter', 'Food', 'Blood Supply', 'Mental Health'], status: 'Mobilized' },
    { name: 'World Central Kitchen', type: 'Food Relief', contact: 'Chef Jose Andres Team', phone: '(202) 555-0180', services: ['Hot Meals', 'Food Distribution', 'Pop-up Kitchens'], status: 'En Route' },
    { name: 'Salvation Army', type: 'Social Services', contact: 'Maj. Franklin Drew', phone: '(800) 725-2769', services: ['Emergency Lodging', 'Clothing', 'Emotional/Spiritual Care'], status: 'Standby' },
    { name: 'FEMA Voluntary Agency', type: 'Federal Support', contact: 'VOAD Coordinator', phone: '(202) 555-0190', services: ['Debris Removal', 'Case Management', 'Recovery Planning'], status: 'Notified' },
]

const businesses = [
    { name: 'HomeBase Hardware', type: 'Supply Chain', contact: 'Bill Garrett', phone: '(312) 555-0201', services: ['Tools & Equipment', 'Building Supplies'], status: 'Available' },
    { name: 'MedPlus Pharmacy', type: 'Healthcare', contact: 'Dr. Kim Weston', phone: '(312) 555-0202', services: ['Pop-up Pharmacy', 'Prescriptions', 'Medical Supplies'], status: 'Mobilized' },
    { name: 'QuickFreight Logistics', type: 'Logistics', contact: 'Sam Ellis', phone: '(312) 555-0203', services: ['Supply Transport', 'Distribution Hubs'], status: 'Available' },
    { name: 'FoodFirst Markets', type: 'Food Retail', contact: 'Tara Obi', phone: '(312) 555-0204', services: ['Emergency Food Packs', 'Bottled Water'], status: 'Standby' },
]

const responseSections = [
    { id: 'housing', icon: Home, label: 'Emergency Housing', location: '123 Civic Center Dr, Shelter B', status: 'Open', capacity: '450/600' },
    { id: 'infrastructure', icon: Wrench, label: 'Infrastructure Command', location: '45 Public Works Blvd', status: 'Active', capacity: 'Staff Only' },
    { id: 'donations', icon: DollarSign, label: 'Donations Center', location: '890 Community Park, Lot A', status: 'Open', capacity: 'Unlimited' },
    { id: 'pharmacy', icon: Pill, label: 'Pop-up Pharmacy', location: '210 Main St, Tent 3', status: 'Open', capacity: '200/day' },
    { id: 'food', icon: Package, label: 'Food Distribution', location: '500 Church Ave, Lot B', status: 'Open', capacity: 'Unlimited' },
]

function AdminViewTab() {
    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-yellow-700" />
                    <p className="text-sm font-semibold text-yellow-800">Admin Access Only</p>
                </div>
                <p className="text-sm text-yellow-700">
                    This view is restricted to Emergency Management, Response Agency Leaders, and Governing Officials (Representatives, Mayors, Governors and their Chief of Staff offices).
                </p>
            </div>

            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Admin Users</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Role</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Organization</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Contact</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminUsers.map((u, i) => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium">{u.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{u.role}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{u.org}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="flex items-center gap-1 text-xs text-gray-600"><Phone className="w-3 h-3" />{u.phone}</span>
                                            <span className="flex items-center gap-1 text-xs text-blue-600"><Mail className="w-3 h-3" />{u.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge className={u.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}>
                                            {u.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                    <Button variant="outline" size="sm">+ Add Admin User</Button>
                    <Button size="sm" className="bg-slate-800 text-white hover:bg-slate-900">Send Briefing to All Admins</Button>
                </div>
            </Card>
        </div>
    )
}

function DeclarationsTab() {
    const [expanded, setExpanded] = useState<string | null>(null)
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600">
                Emergency declarations open policy liberalizations for healthcare, federal government funding, and additional assistance programs.
            </p>
            {declarations.map((dec) => (
                <Card key={dec.id} className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className={dec.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-orange-100 text-orange-800 hover:bg-orange-100'}>
                                    {dec.status}
                                </Badge>
                                <span className="text-xs text-gray-500">{dec.id} · Issued {dec.date}</span>
                            </div>
                            <h3 className="font-bold text-base mb-1">{dec.type}</h3>
                            <p className="text-sm text-gray-600 mb-1">Issued by: <span className="font-medium text-gray-800">{dec.issuedBy}</span></p>
                            <p className="text-sm text-gray-600">{dec.description}</p>
                        </div>
                        <button onClick={() => setExpanded(expanded === dec.id ? null : dec.id)} className="ml-4 p-1 hover:bg-gray-100 rounded">
                            {expanded === dec.id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </button>
                    </div>
                    {expanded === dec.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm font-semibold mb-2">Policy Liberalizations Activated:</p>
                            <ul className="space-y-2">
                                {dec.liberalizations.map((l, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        {l}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex gap-3">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Notify Governing Officials</Button>
                                <Button size="sm" variant="outline">Download PDF</Button>
                            </div>
                        </div>
                    )}
                </Card>
            ))}
            <Button className="w-full border-dashed border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50" variant="outline">
                + Request New Declaration
            </Button>
        </div>
    )
}

function SitRepTab() {
    const [notes, setNotes] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [sitRep, setSitRep] = useState({
        incidentName: 'Tornado Warning – Springfield Area',
        period: 'Dec 20, 2025 · 14:00 – 16:00',
        situation: 'Active tornado warning in effect. EOC activated. Shelters opened at Civic Center and Madison HS.',
        actions: 'Alerts sent to 12,450 residents. Fire and Police units deployed. Evacuation routes established.',
        resources: 'Shelter B: 450/600 occupied. Food distribution active. Medical team on standby.',
        nextSteps: 'Monitor NWS for warning expiry. Prepare recovery phase briefing for 17:00.'
    })

    const generateAI = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setSitRep({
                incidentName: 'Hurricane Helene Response',
                period: 'Feb 23, 2026 · 08:00 – 10:00',
                situation: 'Category 3 Hurricane impact imminent. Storm surge warnings in effect for all coastal sectors.',
                actions: 'Mandatory evacuations completed for Zones A & B. National Guard staged at Springfield Armory.',
                resources: 'Shelters A-D at 100% capacity. Supplemental power generators deployed to Springfield General Hospital.',
                nextSteps: 'Coordinate with State OEM for aerial damage assessment post-landfall. Monitor river levels for flash flooding.'
            })
            setIsGenerating(false)
        }, 1200)
    }

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold mb-1">Situational Report Builder</h2>
                        <p className="text-sm text-gray-600">Build and distribute situational reports to all active responders. AI pre-fills fields based on incident data; you can edit before sending.</p>
                    </div>
                    <Button
                        onClick={generateAI}
                        disabled={isGenerating}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Brain className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                        {isGenerating ? 'Generating...' : 'AI Pre-fill'}
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Incident Name</label>
                        <input type="text" value={sitRep.incidentName} onChange={e => setSitRep({ ...sitRep, incidentName: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Report Period</label>
                        <input type="text" value={sitRep.period} onChange={e => setSitRep({ ...sitRep, period: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Current Situation</label>
                        <textarea rows={3} value={sitRep.situation} onChange={e => setSitRep({ ...sitRep, situation: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Actions Taken</label>
                        <textarea rows={3} value={sitRep.actions} onChange={e => setSitRep({ ...sitRep, actions: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Resource Status</label>
                        <textarea rows={3} value={sitRep.resources} onChange={e => setSitRep({ ...sitRep, resources: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Next Steps / Priorities</label>
                        <textarea rows={3} value={sitRep.nextSteps} onChange={e => setSitRep({ ...sitRep, nextSteps: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-1">Additional Notes</label>
                    <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any additional notes..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Distribute to: All Active Responders (Admin View recipients)</p>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm">Save Draft</Button>
                        <Button size="sm" className="bg-slate-800 text-white hover:bg-slate-900 flex items-center gap-2"><Send className="w-4 h-4" />Send to All Responders</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function RespondersTab() {
    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-600">
                Individuals with a response role — including communications drafters, facility managers, public safety officers, and police and fire management.
            </p>

            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Active Responders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Role</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Department</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Current Activity</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responseRoles.map((r, i) => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium">{r.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{r.role}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{r.dept}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{r.comms}</td>
                                    <td className="py-3 px-4">
                                        <Badge className={
                                            r.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                r.status === 'On Scene' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                        }>
                                            {r.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                    <Button variant="outline" size="sm">+ Add Responder</Button>
                    <Button size="sm" className="bg-slate-800 text-white hover:bg-slate-900 flex items-center gap-2"><Send className="w-4 h-4" />Send Situation Report</Button>
                </div>
            </Card>
        </div>
    )
}

function NonProfitsTab({ onSendInfo }: { onSendInfo: () => void }) {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                Non-profits need to know where response sections are being set up. Use the <span className="font-semibold">"Send Response Locations"</span> button to notify them of active sites.
            </div>

            <div className="grid grid-cols-1 gap-4">
                {nonprofits.map((np, i) => (
                    <Card key={i} className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-base">{np.name}</h3>
                                    <Badge className={
                                        np.status === 'Mobilized' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                            np.status === 'En Route' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                                np.status === 'Standby' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                                    'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                    }>{np.status}</Badge>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">Type: {np.type} · Contact: {np.contact}</p>
                                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1"><Phone className="w-3 h-3" />{np.phone}</p>
                                <div className="flex flex-wrap gap-2">
                                    {np.services.map((s, j) => (
                                        <span key={j} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={onSendInfo} className="flex-shrink-0 flex items-center gap-1">
                                <Send className="w-4 h-4" />Send Locations
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function BusinessesTab({ onSendInfo }: { onSendInfo: () => void }) {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                Private businesses need to know where response sections are set up (housing, infrastructure, donations, pop-up pharmacy, etc.) so they can coordinate supply and logistics.
            </div>

            <div className="grid grid-cols-1 gap-4">
                {businesses.map((b, i) => (
                    <Card key={i} className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-base">{b.name}</h3>
                                    <Badge className={b.status === 'Mobilized' ? 'bg-green-100 text-green-800 hover:bg-green-100' : b.status === 'Standby' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}>
                                        {b.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mb-1">Type: {b.type} · Contact: {b.contact}</p>
                                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1"><Phone className="w-3 h-3" />{b.phone}</p>
                                <div className="flex flex-wrap gap-2">
                                    {b.services.map((s, j) => (
                                        <span key={j} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={onSendInfo} className="flex-shrink-0 flex items-center gap-1">
                                <Send className="w-4 h-4" />Send Locations
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function SendLocationsModal({ onClose }: { onClose: () => void }) {
    const [sent, setSent] = useState(false)
    const [selected, setSelected] = useState<string[]>(responseSections.map(s => s.id))

    const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold">Send Response Section Locations</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6">
                    {!sent ? (
                        <>
                            <p className="text-sm text-gray-600 mb-4">Select which response sections to include in the notification:</p>
                            <div className="space-y-3 mb-6">
                                {responseSections.map(section => {
                                    const Icon = section.icon
                                    const isSelected = selected.includes(section.id)
                                    return (
                                        <label key={section.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="checkbox" checked={isSelected} onChange={() => toggle(section.id)} className="mt-1 w-4 h-4" />
                                            <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                                            <div>
                                                <p className="font-semibold text-sm">{section.label}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{section.location}</p>
                                                <p className="text-xs text-gray-400">Status: {section.status} · Capacity: {section.capacity}</p>
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                                <Button className="flex-1 bg-slate-800 text-white hover:bg-slate-900 flex items-center justify-center gap-2" onClick={() => setSent(true)}>
                                    <Send className="w-4 h-4" />Send via Email & SMS
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Locations Sent!</h3>
                            <p className="text-sm text-gray-600 mb-6">{selected.length} response section location(s) sent via email and SMS to the selected organization.</p>
                            <Button onClick={onClose} className="bg-slate-800 text-white hover:bg-slate-900">Close</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function RespondersAgenciesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('admin')
    const [showSendModal, setShowSendModal] = useState(false)

    return (
        <main className="p-6 space-y-6">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                <h1 className="text-3xl font-bold mb-2">Responders & Agencies</h1>
                <p className="text-gray-600">
                    Manage admin access, emergency declarations, situational reports, responder roles, non-profits, and private businesses participating in the emergency response.
                </p>
            </div>

            {/* Tab Bar */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-0">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${isActive
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'admin' && <AdminViewTab />}
                {activeTab === 'declarations' && <DeclarationsTab />}
                {activeTab === 'sitrep' && <SitRepTab />}
                {activeTab === 'responders' && <RespondersTab />}
                {activeTab === 'nonprofits' && <NonProfitsTab onSendInfo={() => setShowSendModal(true)} />}
                {activeTab === 'businesses' && <BusinessesTab onSendInfo={() => setShowSendModal(true)} />}
            </div>

            {showSendModal && <SendLocationsModal onClose={() => setShowSendModal(false)} />}
        </main>
    )
}
