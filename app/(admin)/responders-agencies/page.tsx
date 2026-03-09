'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Eye, UserPlus, Info } from 'lucide-react'

export default function RespondersAgenciesPage() {
    const [adminUsers, setAdminUsers] = useState<any[]>([])
    const [activePersonnel, setActivePersonnel] = useState<any[]>([])
    const [nonprofits, setNonprofits] = useState<any[]>([])
    const [businesses, setBusinesses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [personnelRes, partnersRes] = await Promise.all([
                    fetch('/api/admin/personnel').catch(() => null),
                    fetch('/api/admin/partners'),
                ])

                // Personnel (non-critical — endpoint may not exist yet)
                if (personnelRes?.ok) {
                    const data = await personnelRes.json()
                    if (data.success) {
                        setAdminUsers(data.data.adminUsers)
                        setActivePersonnel(data.data.activePersonnel)
                    }
                }

                // Partners
                if (partnersRes.ok) {
                    const data = await partnersRes.json()
                    if (data.success) {
                        setNonprofits(data.data.nonprofits || [])
                        setBusinesses(data.data.businesses || [])
                    }
                }
            } catch (err) {
                console.error('Failed to fetch responders data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <main className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Responders & Agencies</h1>
                <p className="text-slate-500 font-medium max-w-3xl leading-relaxed">
                    Manage administrative access, essential personnel, and responder actions for active and planned incidents.
                </p>
            </div>

            {/* Administrative Users & Decision Makers */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Administrative Users & Decision Makers</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 italic">
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Name</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Role</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Organization</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Admin Access</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Incident Role</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {adminUsers.length === 0 && !loading && (
                                <tr><td colSpan={6} className="py-8 text-center text-slate-400 font-medium">No admin users found in the system.</td></tr>
                            )}
                            {adminUsers.map((user, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 font-bold text-slate-900">{user.name}</td>
                                    <td className="py-5 text-slate-600 font-medium">{user.role}</td>
                                    <td className="py-5 text-slate-600 font-medium">{user.org}</td>
                                    <td className="py-5">
                                        <Switch checked={user.access} onCheckedChange={() => { }} className="data-[state=checked]:bg-slate-700" />
                                    </td>
                                    <td className="py-5 text-slate-600 font-medium underline underline-offset-4 decoration-slate-200">
                                        {user.incidentRole}
                                    </td>
                                    <td className="py-5">
                                        <div className="flex gap-3">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                                <UserPlus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Active Response Personnel */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-extrabold text-slate-900">Active Response Personnel</h2>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 border border-blue-100">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Activate personnel today. List of Personnel cannot be edited</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 italic">
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Name</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Role</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Agency</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Assigned Incident</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Status</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activePersonnel.length === 0 && !loading && (
                                <tr><td colSpan={6} className="py-8 text-center text-slate-400 font-medium">No active personnel assigned to this incident yet.</td></tr>
                            )}
                            {activePersonnel.map((p, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 font-bold text-slate-900">{p.name}</td>
                                    <td className="py-5 text-slate-600 font-medium">{p.role}</td>
                                    <td className="py-5 text-slate-600 font-medium">{p.agency}</td>
                                    <td className="py-5 text-slate-600 font-medium">{p.incident}</td>
                                    <td className="py-5">
                                        <Badge className={cn(
                                            "px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none",
                                            p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'
                                        )}>
                                            {p.status}
                                        </Badge>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex gap-2">
                                            <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-[10px] font-black uppercase px-4 h-8">View</Button>
                                            <Button size="sm" variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg text-[10px] font-black uppercase px-4 h-8 border-none">Assign</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Non-Profit Response Partners */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Non-Profit Response Partners</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 italic">
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Organization</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Function</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Response Area</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Status</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {nonprofits.length === 0 && !loading && (
                                <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">No nonprofit partners found.</td></tr>
                            )}
                            {nonprofits.map((n: any, i: number) => (
                                <tr key={n.id || i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 font-bold text-slate-900">{n.name}</td>
                                    <td className="py-5 text-slate-600 font-medium">{n.function}</td>
                                    <td className="py-5 text-slate-600 font-medium">{n.area}</td>
                                    <td className="py-5">
                                        <Badge className="bg-green-100 text-green-700 border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                                            {n.status}
                                        </Badge>
                                    </td>
                                    <td className="py-5 text-slate-600 font-medium">{n.contact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Private Sector Response Partners */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Private Sector Response Partners</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 italic">
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Business</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Sector</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Support Role</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Response Area</th>
                                <th className="text-left pb-4 font-bold text-slate-400 text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {businesses.length === 0 && !loading && (
                                <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">No business partners found.</td></tr>
                            )}
                            {businesses.map((b: any, i: number) => (
                                <tr key={b.id || i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 font-bold text-slate-900">{b.name}</td>
                                    <td className="py-5 text-slate-600 font-medium">{b.sector}</td>
                                    <td className="py-5 text-slate-600 font-medium">{b.support}</td>
                                    <td className="py-5 text-slate-600 font-medium">{b.area}</td>
                                    <td className="py-5">
                                        <Badge className="bg-green-100 text-green-700 border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                                            {b.status}
                                        </Badge>
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
