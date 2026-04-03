'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    UserPlus
} from "lucide-react"
import { toast } from "sonner"
import { GrantLicenseModal } from "@/components/modals/grant-license-modal"
import { AddUserModal } from "@/components/modals/add-user-modal"

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
    const [filter, setFilter] = useState('all') // all, pending, approved, rejected
    const [search, setSearch] = useState('')
    const [userRole, setUserRole] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false)
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
    const [currentUserStatus, setCurrentUserStatus] = useState({ hasLicense: true, requestedLicense: false })
    const [requestLoading, setRequestLoading] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const role = localStorage.getItem('userRole')
            const isSuperAdmin = role === 'super-admin' || role === 'admin'

            // For super admin, fetch both regular users and sub-admins
            // For sub-admin, the API will automatically filter by their licenseId
            const url = isSuperAdmin ? '/api/admin/users?role=user,sub-admin' : '/api/admin/users'
            const response = await fetch(url)
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
        const matchesFilter = filter === 'all' || user.accountStatus === filter
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1.5"><CheckCircle size={12} /> Approved</Badge>
            case 'pending':
                return <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 px-3 py-1 rounded-lg flex items-center gap-1.5"><Clock size={12} /> Pending</Badge>
            case 'rejected':
                return <Badge className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-50 px-3 py-1 rounded-lg flex items-center gap-1.5"><XCircle size={12} /> Rejected</Badge>
            default:
                return <Badge className="bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50">{status}</Badge>
        }
    }

    const getRoleBadge = (role: string) => {
        const isSuperAdmin = role === 'super-admin'
        const isSubAdmin = role === 'sub-admin'
        const isEOC = role.startsWith('eoc-')

        return (
            <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                isSuperAdmin ? 'bg-indigo-100 text-indigo-700' :
                isSubAdmin ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                isEOC ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-slate-100 text-slate-600'
            }`}>
                {isSuperAdmin ? <Shield size={10} /> : isEOC ? <Shield size={10} className="text-amber-600" /> : <User size={10} />}
                {role.replace('-', ' ')}
            </div>
        )
    }

    const isSuperAdmin = userRole === 'super-admin' || userRole === 'admin'
    const pageTitle = isSuperAdmin ? 'Board User Management' : 'Organization Team Management'
    const pageSubtitle = isSuperAdmin
        ? 'Manage and authorize regular community members and system board users.'
        : 'Manage your internal response team and operational personnel.'

    const handleRequestLicense = async () => {
        setRequestLoading(true)
        try {
            const response = await fetch('/api/admin/users/request-license', { method: 'POST' })
            const data = await response.json()
            if (response.ok) {
                toast.success('License request submitted successfully!')
                fetchUsers() // Refresh status
            } else {
                toast.error(data.error || 'Failed to submit request')
            }
        } catch (error) {
            toast.error('Connection error. Please try again.')
        } finally {
            setRequestLoading(false)
        }
    }

    const eocMembersCount = users.filter(u => u.role.startsWith('eoc-')).length
    const isAtLimit = eocMembersCount >= 20

    if (!loading && userRole && !isSuperAdmin && !currentUserStatus.hasLicense) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] p-4 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center shadow-xl shadow-indigo-100 flex-shrink-0 animate-bounce group mb-8">
                    <Shield size={42} className="group-hover:scale-110 transition-transform" />
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">License Authentication Pending</h1>
                <p className="text-slate-500 font-medium max-w-lg leading-relaxed mb-10">
                    Your account has been designated as an operations authority, but no Geographic License has been minted for you yet.
                    <span className="block mt-2 font-bold text-slate-700">Please request a license or contact your Super Admin to proceed.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        size="lg"
                        disabled={requestLoading || currentUserStatus.requestedLicense}
                        onClick={handleRequestLicense}
                        className={`h-16 px-10 rounded-2xl font-black shadow-2xl transition-all active:scale-95 flex items-center gap-3 ${currentUserStatus.requestedLicense
                            ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-100'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                            }`}
                    >
                        {requestLoading ? (
                            <RefreshCw className="animate-spin" size={20} />
                        ) : currentUserStatus.requestedLicense ? (
                            <><CheckCircle size={20} /> REQUEST SUBMITTED</>
                        ) : (
                            <><Building2 size={20} /> REQUEST LICENSE FOR EOC</>
                        )}
                    </Button>
                </div>

                {currentUserStatus.requestedLicense && (
                    <div className="mt-12 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl max-w-md animate-in slide-in-from-bottom-4 duration-1000">
                        <p className="text-xs font-bold text-emerald-800 leading-relaxed uppercase tracking-widest mb-1 italic">
                            Verification under process
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                            A notification has been prioritized to the system host. You will receive organization credentials once the license is issued.
                        </p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-8 p-1 sm:p-4">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tighter flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Users size={22} />
                        </div>
                        {pageTitle}
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">{pageSubtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                    {(isSuperAdmin || currentUserStatus.hasLicense) && (
                        <div className="flex flex-col items-end gap-1.5 mr-2">
                             <Button
                                onClick={() => setIsAddUserModalOpen(true)}
                                disabled={isAtLimit && !isSuperAdmin}
                                className={`h-11 px-5 rounded-xl font-bold shadow-lg shadow-indigo-900/10 gap-2 ${
                                    isAtLimit ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                            >
                                <UserPlus size={18} />
                                Add EOC Member
                            </Button>
                            {!isSuperAdmin && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${isAtLimit ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                                            style={{ width: `${(eocMembersCount / 20) * 100}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isAtLimit ? 'text-rose-500' : 'text-slate-400'}`}>
                                        {eocMembersCount} / 20 TOTAL
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <Button
                        variant="outline"
                        onClick={fetchUsers}
                        className="bg-white border-slate-200 hover:bg-slate-50 shadow-sm h-11"
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-100 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
                                <h3 className="text-3xl font-black text-slate-900">{users.length}</h3>
                            </div>
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                                <Users size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm overflow-hidden group hover:border-amber-200 transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Pending</p>
                                <h3 className="text-3xl font-black text-slate-900">{users.filter(u => u.accountStatus === 'pending').length}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                                <Clock size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm overflow-hidden group hover:border-emerald-200 transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Approved</p>
                                <h3 className="text-3xl font-black text-slate-900">{users.filter(u => u.accountStatus === 'approved').length}</h3>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                                <CheckCircle size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {isSuperAdmin && (
                    <Card className="border-slate-100 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Super Admins</p>
                                    <h3 className="text-3xl font-black text-slate-900">{users.filter(u => u.role === 'super-admin').length}</h3>
                                </div>
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                    <Shield size={20} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Filter and Search Bar */}
            <Card className="border-slate-100 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            <Badge
                                onClick={() => setFilter('all')}
                                className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${filter === 'all' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                All Users
                            </Badge>
                            <Badge
                                onClick={() => setFilter('pending')}
                                className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${filter === 'pending' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Pending
                            </Badge>
                            <Badge
                                onClick={() => setFilter('approved')}
                                className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${filter === 'approved' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Approved
                            </Badge>
                            <Badge
                                onClick={() => setFilter('rejected')}
                                className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${filter === 'rejected' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Rejected
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Role Type</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Registration Date</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Current Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-20 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium italic">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</h4>
                                                        {isSuperAdmin && user.requestedLicense && !user.licenseId && (
                                                            <Badge className="bg-rose-100 text-rose-700 border-none px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter animate-pulse">
                                                                License Requested
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                                                        <Mail size={12} className="text-slate-400" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-block">
                                                {getRoleBadge(user.role)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                {getStatusBadge(user.accountStatus)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Super Admin specific actions for sub-admins */}
                                                {isSuperAdmin && user.role === 'sub-admin' && !user.licenseId && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsGrantModalOpen(true)
                                                        }}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/10 h-9 gap-1.5"
                                                    >
                                                        <Building2 size={14} />
                                                        Grant License
                                                    </Button>
                                                )}

                                                {user.accountStatus === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-900/10 h-9"
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                            className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl h-9"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {user.accountStatus === 'approved' && user.role !== 'super-admin' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl h-9"
                                                    >
                                                        Revoke Access
                                                    </Button>
                                                )}
                                                {user.accountStatus === 'rejected' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                        className="bg-slate-800 hover:bg-black text-white rounded-xl h-9"
                                                    >
                                                        Restore User
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Grant License Modal */}
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
            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSuccess={fetchUsers}
            />
        </div>
    )
}
