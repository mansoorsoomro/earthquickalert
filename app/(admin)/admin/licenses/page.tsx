'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Plus,
    Search,
    Building2,
    Shield,
    Terminal,
    Activity,
    Cpu,
    MousePointerClick,
    ShieldCheck,
    Globe,
    ExternalLink,
    Loader2,
    Briefcase,
    Calendar,
    ArrowUpRight,
    Users,
    Trash2
} from 'lucide-react'
import { ProvisionLicenseModal } from '@/components/modals/provision-license-modal'
import { cn } from "@/lib/utils"

interface License {
    _id: string;
    organizationName: string;
    status: string;
    subscriptionDetails: {
        planType: string;
        endDate: string | null;
    };
    assignedSubAdminId: {
        _id: string;
        name: string;
        email: string;
        accountStatus: string;
    };
    createdAt: string;
}

export default function LicenseManagement() {
    const [licenses, setLicenses] = useState<License[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const fetchLicenses = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/licenses')
            if (res.ok) {
                const data = await res.json()
                setLicenses(data.licenses)
            }
        } catch (error) {
            console.error('Error fetching licenses:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLicenses()
    }, [fetchLicenses])

    const handleDeleteLicense = async (licenseId: string) => {
        if (!confirm('Are you sure you want to remove this organization and all its settings?')) return

        setDeletingId(licenseId)
        try {
            const res = await fetch(`/api/admin/licenses?licenseId=${licenseId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchLicenses()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to remove license')
            }
        } catch (error) {
            console.error('Error deleting license:', error)
            alert('An error occurred while removing the license')
        } finally {
            setDeletingId(null)
        }
    }

    const filteredLicenses = licenses.filter(lic =>
        lic.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.assignedSubAdminId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.assignedSubAdminId?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: licenses.length,
        active: licenses.filter(l => l.status === 'active').length,
        pending: licenses.filter(l => l.status !== 'active').length
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse">Loading licenses...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50/50 pb-20">
            <div className="px-6 lg:px-12 pt-8 space-y-8 max-w-[1600px] mx-auto">

                {/* Main Header Card */}
                <Card className="p-8 border-slate-200 rounded-2xl shadow-sm relative overflow-hidden bg-white group transition-all hover:shadow-md">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900 group-hover:bg-blue-600 transition-colors" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Manage Licenses</h1>
                            <p className="text-slate-500 font-medium">View and manage all organization licenses in one place.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg px-6 h-12 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex gap-2"
                            >
                                <Plus size={18} />
                                New License
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Banner Gradient */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-white/20" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-[10px] font-black uppercase tracking-widest mb-4">
                                <ShieldCheck size={12} /> License Overview
                            </div>
                            <h2 className="text-3xl font-black tracking-tight mb-3">Organization List</h2>
                            <p className="text-blue-50/90 font-medium max-w-2xl leading-relaxed">Manage your organizations, assign admins, and check active licenses for the entire network.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 shrink-0">
                            {[
                                { label: 'TOTAL', value: stats.total, icon: Globe },
                                { label: 'ACTIVE', value: stats.active, icon: ShieldCheck },
                                { label: 'PENDING', value: stats.pending, icon: Activity }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center">
                                    <stat.icon className="w-5 h-5 mb-2 opacity-60" />
                                    <p className="text-3xl font-black">{stat.value}</p>
                                    <p className="text-[9px] font-bold opacity-60 tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-slate-900 border-l-4 border-blue-600 pl-4">
                        <h2 className="text-2xl font-black tracking-tight uppercase">License List</h2>
                    </div>
                    <div className="relative group w-full md:w-96">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <Input
                            placeholder="Search by organization or admin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 bg-white border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl h-14 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* License Table/Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredLicenses.length === 0 ? (
                        <Card className="p-20 border-dashed border-2 border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 italic font-black text-slate-200 text-4xl">?</div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase">No Licenses Found</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto">No operational nodes match your current search criteria in the master registry.</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Organization</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date Created</th>
                                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredLicenses.map((lic) => (
                                            <tr key={lic._id} className="group hover:bg-blue-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-md transition-all border border-slate-100">
                                                            <Building2 size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 uppercase tracking-tight">{lic.organizationName}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 tracking-widest">Code: {lic._id.slice(-8).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-black text-slate-700">{lic.assignedSubAdminId?.name || 'UNASSIGNED'}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            {lic.assignedSubAdminId?.email || 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                        lic.status === 'active'
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-amber-50 text-amber-600 border-amber-100"
                                                    )}>
                                                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", lic.status === 'active' ? "bg-emerald-500" : "bg-amber-500")} />
                                                        {lic.status}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col text-slate-400">
                                                        <span className="text-xs font-bold italic">{new Date(lic.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    {lic.status === 'active' && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => handleDeleteLicense(lic._id)}
                                                            disabled={deletingId === lic._id}
                                                            className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex gap-2 ml-auto"
                                                        >
                                                            {deletingId === lic._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                            Remove
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            <ProvisionLicenseModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchLicenses}
            />
        </main>
    )
}
