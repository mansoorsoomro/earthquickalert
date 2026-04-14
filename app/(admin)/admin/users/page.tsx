'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
    country?: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [userRole, setUserRole] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false)
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
    const [currentUserStatus, setCurrentUserStatus] = useState<{ hasLicense: boolean, requestedLicense: boolean, city?: string, licenseId?: string }>({ hasLicense: true, requestedLicense: false })

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/users')
            const data = await response.json()
            if (response.ok) {
                setUsers(data.users)
                if (data.currentUser) {
                    setCurrentUserStatus(data.currentUser)
                }
            } else {
                toast.error(data.error || 'Failed to fetch users')
            }
        } catch (error) {
            toast.error('Error connecting to the server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'))
        fetchUsers()
    }, [])

    const handleStatusUpdate = async (userId: string, status: string) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, accountStatus: status }),
            })

            if (response.ok) {
                toast.success(`User account ${status} successfully`)
                fetchUsers()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to update status')
            }
        } catch (error) {
            toast.error('An error occurred during status update')
        }
    }

    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    })

    const adminUsers = filteredUsers.filter(u => u.role === 'super-admin')

    const responsePersonnel = [
        { _id: '101', name: 'L. Brown', role: 'Comms Lead', city: 'City EM', assigned: 'Tornado Warning', accountStatus: 'approved', lastActive: '2 min ago' },
        { _id: '102', name: 'M. Patel', role: 'Fire Ops', city: 'Fire Dept', assigned: 'Tornado Warning', accountStatus: 'approved', lastActive: '5 min ago' },
        { _id: '103', name: 'Ops Team A', role: 'Facilities', city: 'Public Works', assigned: 'Tornado Warning', accountStatus: 'pending', lastActive: 'Offline' },
    ]

    const isSuperAdmin = userRole === 'super-admin' || userRole === 'admin'

    // Mock partners data to match the UI image
    const nonprofits = [
        { id: 'N1', name: 'Red Cross', function: 'Sheltering', area: 'North Zone', status: 'Active', contact: 'Assigned' },
        { id: 'N2', name: 'World Central Kitchen', function: 'Food Services', area: 'Central Hub', status: 'Active', contact: 'Assigned' }
    ]

    const privatePartners = [
        { id: 'P1', name: 'PowerCo', sector: 'Utilities', role: 'Power Restoration', area: 'Industrial Zone', status: 'Active' },
        { id: 'P2', name: 'PharmaPlus', sector: 'Pharmacy', role: 'Medication Access', area: 'East District', status: 'Active' }
    ]

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-12 h-12 text-[#33375D] animate-spin" />
                <p className="text-[#33375D] font-black uppercase tracking-widest text-xs">Synchronizing Identity Matrix...</p>
            </div>
        </div>
    )

    return (
        <div className="flex-1 overflow-auto bg-[#F8FAFC]">
            <main className="p-6 md:p-10 space-y-8 max-w-[1600px] mx-auto">

                {/* Info Card Header */}
                <div className="bg-white border-l-4 border-l-[#33375D] rounded-xl p-8 shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Responders & Agencies</h1>
                    <p className="text-slate-500 font-medium">Manage administrative access, essential personnel, and responder actions for active and planned incidents.</p>
                </div>

                {/* Administrative Users & Decision Makers Section */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Administrative Users & Decision Makers</h2>
                        <Badge className="bg-[#33375D] text-white px-3 py-1 rounded-full text-xs font-bold border-none shadow-sm">
                            {adminUsers.length} Super Admins
                        </Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFBFC] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Organization</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Admin Access</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Incident Role</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {adminUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">No administrative users found</td>
                                    </tr>
                                ) : (
                                    adminUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-slate-900">{user.name}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-slate-600 text-sm">{user.role.replace('-', ' ')}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-slate-600 text-sm">{user.city || 'Regional Office'}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Switch
                                                    checked={user.accountStatus === 'approved'}
                                                    onCheckedChange={(checked) => handleStatusUpdate(user._id, checked ? 'approved' : 'rejected')}
                                                    className="data-[state=checked]:bg-[#33375D]"
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <button className="text-slate-900 underline underline-offset-4 text-sm font-medium hover:text-blue-600 transition-colors">
                                                    Executive Oversight
                                                </button>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-end items-center gap-3">
                                                    <button className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                        <Users size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Active Response Personnel Section */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Response Personnel</h2>
                        <div className="flex items-center gap-2 bg-[#EFF6FF] px-4 py-2 rounded-lg border border-[#DBEAFE]">
                            <Info size={14} className="text-[#3B82F6]" />
                            <span className="text-[11px] font-medium text-[#3B82F6]">Activated personnel display Essential Personnel banner on mobile</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFBFC] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Agency</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assigned Incident</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {responsePersonnel.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">No response personnel found</td>
                                    </tr>
                                ) : (
                                    responsePersonnel.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-slate-900">{user.name}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-slate-600 text-sm">{user.role.replace('-', ' ')}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-slate-600 text-sm">{user.city || 'City EM'}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-slate-600 text-sm">Emergency Response</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none shadow-none",
                                                    user.accountStatus === 'approved' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF9C3] text-[#854D0E]'
                                                )}>
                                                    {user.accountStatus === 'approved' ? 'Active' : 'Standby'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="h-8 px-4 bg-[#3B82F6] text-white hover:bg-blue-600 border-none rounded-lg text-xs font-bold shadow-none active:scale-95 transition-all">
                                                        View
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 px-4 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none rounded-lg text-xs font-bold shadow-none active:scale-95 transition-all">
                                                        Assign
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Non-Profit Response Partners Section */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Non-Profit Response Partners</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFBFC] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Organization</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Function</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Response Area</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {nonprofits.map((org) => (
                                    <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-slate-900">{org.name}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-600 text-sm">{org.function}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-600 text-sm">{org.area}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge className="bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none shadow-none">
                                                {org.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-slate-500 text-sm">{org.contact}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Private Sector Response Partners Section */}
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Private Sector Response Partners</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFBFC] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Business</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sector</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Support Role</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Response Area</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {privatePartners.map((biz) => (
                                    <tr key={biz.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-slate-900">{biz.name}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-600 text-sm">{biz.sector}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-600 text-sm">{biz.role}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-600 text-sm">{biz.area}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Badge className="bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none shadow-none">
                                                {biz.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* FAB or Actions */}
                {/* <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
                    <Button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="w-16 h-16 rounded-full bg-[#33375D] hover:bg-[#44496B] text-white shadow-2xl flex items-center justify-center p-0 active:scale-95 transition-all group overflow-hidden"
                    >
                        <UserPlus size={24} className="group-hover:scale-110 transition-transform" />
                    </Button>
                    <Button
                        onClick={fetchUsers}
                        className="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 shadow-xl flex items-center justify-center p-0 active:scale-95 transition-all group overflow-hidden"
                    >
                        <RefreshCw size={24} className={cn(loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500')} />
                    </Button>
                </div> */}

            </main>

            {/* Modals */}
            {selectedUser && (
                <GrantLicenseModal
                    user={selectedUser}
                    isOpen={isGrantModalOpen}
                    onClose={() => {
                        setIsGrantModalOpen(false)
                        setSelectedUser(null)
                    }}
                    onSuccess={fetchUsers}
                />
            )}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSuccess={fetchUsers}
            />
        </div>
    )
}

