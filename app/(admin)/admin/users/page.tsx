'use client'

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Shield,
    User,
    Search,
    Filter,
    RefreshCw,
    MoreVertical,
    Mail,
    Calendar,
    ArrowUpRight,
    Building2,
    UserPlus,
    Activity,
    Lock,
    Unlock,
    Info,
    Eye,
    Settings,
    MapPin,
    Briefcase,
    Bell
} from "lucide-react"
import { toast } from "sonner"
import { GrantLicenseModal } from "@/components/modals/grant-license-modal"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { cn } from "@/lib/utils"

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    accountStatus: string;
    licenseId?: string;
    requestedLicense?: boolean;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
    responderFunction?: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [users, setUsers] = useState<IUser[]>([])
    const [organizations, setOrganizations] = useState<any[]>([])
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
    const [selectedOrgName, setSelectedOrgName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [loadingOrgs, setLoadingOrgs] = useState(false)
    const [search, setSearch] = useState('')
    const [userRole, setUserRole] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false)
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

    const fetchOrganizations = async () => {
        setLoadingOrgs(true)
        try {
            const res = await fetch('/api/admin/licenses')
            const data = await res.json()
            if (res.ok) {
                setOrganizations(data.licenses || [])
            }
        } catch (error) {
            console.error('Failed to fetch orgs', error)
        } finally {
            setLoadingOrgs(false)
        }
    }

    const fetchUsers = useCallback(async (orgId: string | null = null) => {
        setLoading(true)
        try {
            const url = orgId
                ? `/api/admin/users?licenseId=${orgId}`
                : `/api/admin/users`;

            const response = await fetch(url)
            const data = await response.json()
            if (response.ok) {
                setUsers((data.users || []) as IUser[])
            } else {
                toast.error(data.error || 'Failed to fetch users')
            }
        } catch (error) {
            toast.error('Error connecting to the server')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        setMounted(true)
        const role = localStorage.getItem('userRole')
        setUserRole(role)

        if (role === 'super-admin') {
            fetchOrganizations()
        }
        fetchUsers()
    }, [fetchUsers])

    const handleOrgSelect = (orgId: string, orgName: string) => {
        if (selectedOrgId === orgId) {
            setSelectedOrgId(null)
            setSelectedOrgName('')
            fetchUsers(null)
        } else {
            setSelectedOrgId(orgId)
            setSelectedOrgName(orgName)
            fetchUsers(orgId)
        }
    }

    const handleStatusUpdate = async (userId: string, status: string) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, accountStatus: status }),
            })

            if (response.ok) {
                toast.success(`User access updated successfully`)
                fetchUsers(selectedOrgId)
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to update status')
            }
        } catch (error) {
            toast.error('An error occurred during status update')
        }
    }

    const filteredUsers = (users || []).filter(user => {
        const query = search.toLowerCase()
        return (user?.name?.toLowerCase() || '').includes(query) ||
            (user?.email?.toLowerCase() || '').includes(query)
    })

    const adminNodes = filteredUsers.filter(u => ['super-admin', 'sub-admin', 'admin'].includes(u.role))
    const fieldResponders = filteredUsers.filter(u => ['responder', 'eoc-manager', 'eoc-observer', 'manager'].includes(u.role))

    // Partners data logic (as per original requirements)
    const nonprofits = [
        { id: 'N1', name: 'Red Cross', function: 'Sheltering', area: 'North Zone', status: 'Active' },
        { id: 'N2', name: 'World Central Kitchen', function: 'Food Services', area: 'Central Hub', status: 'Active' }
    ]

    const privatePartners = [
        { id: 'P1', name: 'PowerCo', sector: 'Utilities', role: 'Power Restoration', area: 'All Zones', status: 'Active' },
        { id: 'P2', name: 'PharmaPlus', sector: 'Medical', role: 'Prescription Access', area: 'East District', status: 'Active' }
    ]

    if (!mounted) return null;

    if (loading && users.length === 0) return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-12 h-12 text-[#33375D] animate-spin" />
                <p className="text-[#33375D] font-black uppercase tracking-widest text-xs">Accessing Personnel Matrix...</p>
            </div>
        </div>
    )

    return (
        <div className="flex-1 overflow-auto bg-[#F8FAFC]">
            <main className="p-6 md:p-10 space-y-8 max-w-[1600px] mx-auto">

                {/* Header Section */}
                <div className="bg-white border-l-4 border-l-[#33375D] rounded-xl p-8 shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Responders & Agencies</h1>
                    <p className="text-slate-500 font-medium tracking-tight">System configuration for operational personnel, decision makers, and agency partners.</p>
                </div>

                {/* Licensee Portal (Super Admin Only) */}
                {userRole === 'super-admin' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-1 bg-[#33375D] rounded-full" />
                            <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Licensees Portal</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {organizations.map((org) => (
                                <Card
                                    key={org._id}
                                    onClick={() => handleOrgSelect(org._id, org.organizationName)}
                                    className={cn(
                                        "cursor-pointer transition-all duration-500 border-none overflow-hidden rounded-[32px] relative group",
                                        selectedOrgId === org._id
                                            ? "bg-[#33375D] text-white scale-[1.02] shadow-[0_20px_50px_rgba(51,55,93,0.3)]"
                                            : "bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl"
                                    )}
                                >
                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                                                selectedOrgId === org._id
                                                    ? "bg-white/10 border border-white/10"
                                                    : "bg-slate-100 group-hover:bg-[#33375D]/5 text-slate-400 group-hover:text-[#33375D]"
                                            )}>
                                                <Building2 size={24} />
                                            </div>
                                            {selectedOrgId === org._id && (
                                                <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                                                    Active
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className={cn(
                                            "text-lg font-black uppercase tracking-tight mb-1",
                                            selectedOrgId === org._id ? "text-white" : "text-slate-900"
                                        )}>
                                            {org.organizationName}
                                        </h3>

                                        <div className={cn(
                                            "text-[10px] font-bold uppercase tracking-[0.2em]",
                                            selectedOrgId === org._id ? "text-slate-300" : "text-slate-400"
                                        )}>
                                            Tier: {org.subscriptionDetails?.planType || 'Enterprise'}
                                        </div>

                                        {selectedOrgId === org._id && (
                                            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Dashboard</span>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Bridge</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/admin-dashboard?licenseId=${org._id}`);
                                                    }}
                                                    className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-xl backdrop-blur-md group/btn transition-all active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    Launch Dashboard <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Unified Personnel Search */}
                <div className="relative max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#33375D] transition-colors w-4 h-4" />
                    <input
                        type="search"
                        placeholder="Search Identity Registry..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#33375D]/5 focus:border-[#33375D] transition-all shadow-sm"
                    />
                </div>

                {/* Admin Table */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 border-b border-slate-100 bg-white flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Decision Makers & Dispatchers</CardTitle>
                        <Badge className="bg-[#33375D] text-white px-3 py-1 rounded-full text-[10px] font-bold border-none">{adminNodes.length} Verified Accounts</Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Access</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Oversight</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {adminNodes.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Zero administrative nodes detected</td></tr>
                                    ) : (
                                        adminNodes.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 text-sm font-bold text-slate-900 leading-none">{user.name}</td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{user.role?.replace('-', ' ')}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Switch
                                                        checked={user.accountStatus === 'approved'}
                                                        onCheckedChange={(checked) => handleStatusUpdate(user._id, checked ? 'approved' : 'rejected')}
                                                        className="data-[state=checked]:bg-[#33375D]"
                                                    />
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => { setSelectedUser(user); setIsGrantModalOpen(true); }}
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Shield size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Responders Table */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 border-b border-slate-100 bg-white container-between">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Duty Responders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Function</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Profile</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {fieldResponders.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No operators activated in this sector</td></tr>
                                    ) : (
                                        fieldResponders.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 text-sm font-bold text-slate-900 leading-none">{user.name}</td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{user.responderFunction || 'General Support'}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full border-none", user.accountStatus === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                                                        {user.accountStatus === 'approved' ? 'Active' : 'Standby'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Button variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase bg-slate-100 border-none rounded-lg hover:bg-slate-200 text-slate-600">View Detail</Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Partner Tables Logic */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-100 bg-white">
                            <CardTitle className="text-md font-black text-slate-900 uppercase tracking-tight">Non-Profit Partners</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left text-xs font-bold uppercase text-slate-500">
                                <tbody className="divide-y divide-slate-50">
                                    {nonprofits.map(org => (
                                        <tr key={org.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-slate-900">{org.name}</td>
                                            <td className="px-6 py-4">{org.function}</td>
                                            <td className="px-6 py-4 text-emerald-600">{org.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-100 bg-white">
                            <CardTitle className="text-md font-black text-slate-900 uppercase tracking-tight">Private Sector Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left text-xs font-bold uppercase text-slate-500">
                                <tbody className="divide-y divide-slate-50">
                                    {privatePartners.map(biz => (
                                        <tr key={biz.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-slate-900">{biz.name}</td>
                                            <td className="px-6 py-4">{biz.sector}</td>
                                            <td className="px-6 py-4 text-emerald-600">{biz.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

            </main>

            {/* Fab Section */}


            {/* Modal Logic */}
            {selectedUser && (
                <GrantLicenseModal
                    user={selectedUser}
                    isOpen={isGrantModalOpen}
                    onClose={() => {
                        setIsGrantModalOpen(false)
                        setSelectedUser(null)
                    }}
                    onSuccess={() => fetchUsers(selectedOrgId)}
                />
            )}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSuccess={() => fetchUsers(selectedOrgId)}
            />
        </div>
    )
}
