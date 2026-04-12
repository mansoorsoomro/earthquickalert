'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Plus, Search, Building2, Shield, AlertTriangle, Command, Terminal, Activity, Radio, Cpu, MousePointerClick } from 'lucide-react'
import { GrantLicenseModal } from '@/components/modals/grant-license-modal'
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
    const [availableUsers, setAvailableUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    useEffect(() => {
        fetchLicenses()
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            if (res.ok) {
                const data = await res.json()
                setAvailableUsers(data.users.filter((u: any) => u.role !== 'super-admin'))
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const fetchLicenses = async () => {
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
    }

    const filteredLicenses = licenses.filter(lic =>
        lic.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.assignedSubAdminId?.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 overflow-auto bg-slate-50 selection:bg-blue-600/10">
            <main className="p-10 space-y-12 max-w-[1800px] mx-auto relative pb-32">
                {/* Decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-200">
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-600/20 group hover:scale-110 transition-transform cursor-pointer">
                                <Building2 size={32} className="text-white group-hover:rotate-12 transition-transform duration-500" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">Organization Licensing</h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Master Client Registry</p>
                                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                                    <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        Deployment Management
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] shadow-2xl shadow-blue-600/20 gap-4 h-16 px-10 font-black text-xs uppercase tracking-widest group border border-blue-400/20 active:scale-95 transition-all"
                    >
                        Issue New Protocol License
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    </Button>

                    <GrantLicenseModal 
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={fetchLicenses}
                        user={null}
                    />
                </div>

                <div className="space-y-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Operational Registry</h2>
                        </div>
                        <div className="relative group w-full md:w-96">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <Input
                                placeholder="SEARCH CLIENT / NODE ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 bg-white border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest focus-visible:ring-blue-600/20 focus-visible:border-blue-600 transition-all"
                            />
                        </div>
                    </div>

                    <Card className="bg-white border-slate-100 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="border-b border-slate-100">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] h-16 px-10">Organization / Unified ID</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] h-16 px-10">Assigned Operations Sub-Admin</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] h-16 px-10">Status</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] h-16 px-10">Initial Mint Date</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] h-16 px-10 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <TableRow key={i} className="border-b border-slate-50 hover:bg-transparent animate-pulse">
                                                <TableCell colSpan={5} className="p-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                                                        <div className="space-y-2">
                                                            <div className="h-4 w-48 bg-slate-100 rounded" />
                                                            <div className="h-3 w-64 bg-slate-100 rounded" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredLicenses.length === 0 ? (
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableCell colSpan={5} className="py-32 text-center space-y-6">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                                    <Shield size={32} className="text-slate-300" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">No Operational Records Found</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-xs mx-auto italic">Master registry is currently empty. Initialize a new license deployment to populate the grid.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredLicenses.map((lic) => (
                                            <TableRow key={lic._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group/row">
                                                <TableCell className="px-10 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover/row:border-blue-200 group-hover/row:text-blue-600 transition-all shadow-sm">
                                                            <Building2 size={24} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{lic.organizationName}</div>
                                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Node ID: {lic._id.slice(-8).toUpperCase()}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-10 py-8">
                                                    <div className="space-y-1.5 flex flex-col">
                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{lic.assignedSubAdminId?.name || 'TERMINAL UNASSIGNED'}</span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                                            <Terminal size={10} className="text-blue-500" />
                                                            {lic.assignedSubAdminId?.email || 'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-10 py-8">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl border shadow-lg",
                                                        lic.status === 'active'
                                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-emerald-500/5'
                                                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-rose-500/5'
                                                    )}>
                                                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                                                            lic.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.5)]'
                                                        )} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{lic.status.toUpperCase()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-10 py-8">
                                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest italic">{new Date(lic.createdAt).toLocaleDateString()}</div>
                                                </TableCell>
                                                <TableCell className="px-10 py-8 text-right">
                                                    <Button className="bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[16px] border border-slate-200 h-12 px-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/btn overflow-hidden relative">
                                                        <span className="relative z-10">Access Node</span>
                                                        <div className="absolute inset-0 bg-blue-600/0 group-hover/btn:bg-blue-600/5 transition-colors" />
                                                        <MousePointerClick size={14} className="ml-3 group-hover/btn:scale-125 transition-transform" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <div className="bg-blue-600 p-8 flex flex-col items-center justify-center space-y-2 relative z-10">
                            <div className="flex items-center gap-3 text-white">
                                <Cpu size={14} className="animate-spin duration-[3000ms]" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Metadata Stream Active</p>
                            </div>
                            <p className="text-[7px] text-blue-200 font-black uppercase tracking-[0.6em] opacity-40">Systemic integrity scan complete • All licenses verified under protocol v4.0.01</p>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )
}
