'use client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, MapPin, FileText, CheckCircle, Shield, Users, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useMemo, useEffect, useState } from 'react'

const LeafletMap = dynamic(() => import('@/components/leaflet-map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse flex items-center justify-center rounded-lg border border-slate-200">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading Map Engine...</p>
        </div>
    ),
})

export default function VirtualEOCAICenterPage() {
    const mapResources = useMemo(() => [], [])

    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        kpis: {
            activeIncidents: 0,
            responderActionsCompleted: 0,
            citizenReportsReceived: 0,
            areWeSafeCheckins: 0,
            totalUsers: 0,
            gisLayersActive: 0
        },
        responderTasks: [],
        citizenReports: [],
        checkins: []
    })

    useEffect(() => {
        async function fetchVirtualEOCData() {
            try {
                const res = await fetch('/api/admin/virtual-eoc')
                if (res.ok) {
                    const data = await res.json()
                    if (data.success) {
                        setStats(data.data)
                    }
                }
            } catch (err) {
                console.error("Failed to fetch Virtual EOC data:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVirtualEOCData()
        const interval = setInterval(fetchVirtualEOCData, 30000)
        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center gap-4 text-slate-500">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    <p className="font-black text-xs uppercase tracking-[0.2em]">Synchronizing Live EOC Data...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Virtual EOC / AI Center</h1>
                <p className="text-slate-500 font-medium text-lg max-w-3xl leading-relaxed">
                    Monitor responder activity, citizen engagement, and incident insights in real time.
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-6 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <div className="text-xs font-semibold text-slate-500 mb-4 tracking-tight">Active Incidents</div>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-900">{stats.kpis.activeIncidents}</span>
                        <span className="text-red-500"><AlertTriangle className="w-6 h-6" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <div className="text-xs font-semibold text-slate-500 mb-4 tracking-tight">Active Responders</div>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-900">{stats.kpis.responderActionsCompleted}</span>
                        <span className="text-green-500"><CheckCircle className="w-6 h-6" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <div className="text-xs font-semibold text-slate-500 mb-4 tracking-tight">Citizen Reports Received</div>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-900">{stats.kpis.citizenReportsReceived}</span>
                        <span className="text-blue-500"><FileText className="w-6 h-6 fill-blue-50/50" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <div className="text-xs font-semibold text-slate-500 mb-4 tracking-tight">"Are We Safe"<br />Check-ins</div>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-900">{stats.kpis.areWeSafeCheckins}/{stats.kpis.totalUsers}</span>
                        <span className="text-purple-500"><Shield className="w-6 h-6 fill-purple-50/50" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <div className="text-xs font-semibold text-slate-500 mb-4 tracking-tight">Users Leveraging Virtual EOC</div>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-900">{stats.kpis.totalUsers}</span>
                        <span className="text-yellow-500"><Users className="w-6 h-6 fill-yellow-50/50" /></span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <div className="text-xs font-semibold text-slate-500 mb-4 tracking-tight">GIS Layers Active</div>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-900">{stats.kpis.gisLayersActive}</span>
                        <span className="text-yellow-600"><MapPin className="w-6 h-6 fill-yellow-50/50" /></span>
                    </div>
                </div>
            </div>

            {/* GIS Mapping Section */}
            <Card className="p-0 overflow-hidden rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-900">GIS Mapping & Incident Visualization</h2>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100/50">Public Safety</span>
                        <span className="px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100/50">Informational</span>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-100/50">Moderate / Caution</span>
                    </div>
                </div>
                <div className="px-8 pb-8">
                    <div className="w-full h-[500px] rounded-[2rem] overflow-hidden border border-slate-100 relative z-0">
                        <LeafletMap
                            center={{ lat: 40.5488, lng: -74.1517 }}
                            resources={mapResources}
                            zoom={14}
                        />
                    </div>
                </div>
            </Card>

            {/* Responder Task Management */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Responder Task Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left pb-4 font-bold text-slate-900">Responder</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Role</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Checklist Status</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Assigned Incident</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Last Update</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.responderTasks.length > 0 ? stats.responderTasks.map((task: any) => (
                                <tr key={task.id} className="hover:bg-slate-50/50">
                                    <td className="py-5 font-bold text-slate-900">{task.name}</td>
                                    <td className="py-5 font-medium text-slate-600">{task.role}</td>
                                    <td className="py-5">
                                        <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                            task.status === 'Completed' ? 'bg-green-50 text-green-600' :
                                                task.status === 'Not Started' ? 'bg-blue-50 text-blue-500' :
                                                    'bg-yellow-50 text-yellow-600'
                                        )}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-5 font-medium text-slate-600">{task.assignedIncident}</td>
                                    <td className="py-5 font-medium text-slate-600">{task.lastUpdate}</td>
                                    <td className="py-5 flex items-center gap-2">
                                        <Button size="sm" className="bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-lg h-8 px-6 text-[10px] font-black uppercase tracking-widest">View</Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">No active responders mapped currently.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Field Reports from the Public */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Field Reports from the Public</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left pb-4 font-bold text-slate-900">Report ID</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Submitted By</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Location</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Type</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Status</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.citizenReports.length > 0 ? stats.citizenReports.map((report: any) => (
                                <tr key={report.id} className="hover:bg-slate-50/50">
                                    <td className="py-5 font-bold text-slate-900">#{report.id?.substring(0, 6).toUpperCase()}</td>
                                    <td className="py-5 font-medium text-slate-600">{report.submittedBy}</td>
                                    <td className="py-5 font-medium text-slate-600">{report.location}</td>
                                    <td className="py-5 font-medium text-slate-600">{report.type}</td>
                                    <td className="py-5">
                                        <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                            report.status === 'Resolved' || report.status === 'Verified' ? 'bg-green-50 text-green-600' :
                                                report.status === 'Active' ? 'bg-red-50 text-red-600' :
                                                    'bg-yellow-50 text-yellow-600'
                                        )}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="py-5 font-medium text-slate-600">{report.timestamp}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">No recent field reports.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Community Safety Check-ins */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Community Safety Check-ins</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left pb-4 font-bold text-slate-900">User</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Location</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Status</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Last Check-in</th>
                                <th className="text-left pb-4 font-bold text-slate-900">Incident</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.checkins.length > 0 ? stats.checkins.map((checkin: any) => (
                                <tr key={checkin.id} className="hover:bg-slate-50/50">
                                    <td className="py-5 font-bold text-slate-900">{checkin.name}</td>
                                    <td className="py-5 font-medium text-slate-600">{checkin.location || 'Unknown'}</td>
                                    <td className="py-5">
                                        <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                            checkin.status === 'Safe' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                        )}>
                                            {checkin.status}
                                        </span>
                                    </td>
                                    <td className="py-5 font-medium text-slate-600">{checkin.lastCheckin}</td>
                                    <td className="py-5 font-medium text-slate-600">{checkin.incident}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">No recent community check-ins.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </main>
    )
}
