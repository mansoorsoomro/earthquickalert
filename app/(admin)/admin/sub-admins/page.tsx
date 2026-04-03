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
    RefreshCw,
    Mail,
    Calendar,
    ArrowLeft
} from "lucide-react"
import { toast } from "sonner"

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    accountStatus: string;
    createdAt: string;
}

export default function SubAdminManagementPage() {
    const router = useRouter()
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') 
    const [search, setSearch] = useState('')

    const fetchSubAdmins = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/users?role=sub-admin')
            const data = await response.json()
            if (response.ok) {
                setUsers(data.users)
            } else {
                toast.error(data.error || 'Failed to fetch sub-admins')
            }
        } catch (error) {
            toast.error('Error connecting to the server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const userRole = localStorage.getItem('userRole')
        if (userRole !== 'super-admin' && userRole !== 'admin' && userRole !== 'sub-admin') {
            router.push('/admin-dashboard')
            return
        }
        fetchSubAdmins()
    }, [])

    const handleStatusUpdate = async (userId: string, status: string) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, accountStatus: status }),
            })

            if (response.ok) {
                toast.success(`Account ${status} successfully`)
                fetchSubAdmins()
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
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1.5"><CheckCircle size={12}/> Authorized</Badge>
            case 'pending':
                return <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 px-3 py-1 rounded-lg flex items-center gap-1.5"><Clock size={12}/> Pending Approval</Badge>
            case 'rejected':
                return <Badge className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-50 px-3 py-1 rounded-lg flex items-center gap-1.5"><XCircle size={12}/> Access Denied</Badge>
            default:
                return <Badge className="bg-slate-50 text-slate-700 border-slate-100 uppercase tracking-widest text-[10px]">{status}</Badge>
        }
    }

    return (
        <div className="space-y-8 p-4 mb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.push('/admin-dashboard')}
                            className="rounded-xl hover:bg-slate-100"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Shield size={24} />
                            </div>
                            Sub-Admin Delegation
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-16">Authorize and manage administrative delegates for organization safety clusters.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={fetchSubAdmins} 
                        className="bg-white border-slate-200 hover:bg-slate-50 shadow-sm rounded-xl font-bold"
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Sync Registry
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <Card className="border-slate-100 shadow-sm overflow-hidden group hover:border-amber-200 transition-all rounded-3xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Pending Verification</p>
                                <h3 className="text-4xl font-black text-slate-900">{users.filter(u => u.accountStatus === 'pending').length}</h3>
                            </div>
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                                <Clock size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                 <Card className="border-slate-100 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all rounded-3xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Active Sub-Admins</p>
                                <h3 className="text-4xl font-black text-slate-900">{users.filter(u => u.accountStatus === 'approved').length}</h3>
                            </div>
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                <Shield size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm overflow-hidden group hover:border-slate-200 transition-all rounded-3xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Access Rejected</p>
                                <h3 className="text-4xl font-black text-slate-900">{users.filter(u => u.accountStatus === 'rejected').length}</h3>
                            </div>
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-slate-200 transition-colors">
                                <XCircle size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Search sub-admins..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-slate-700"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <Badge 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`cursor-pointer px-6 py-3 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-[0.1em] ${filter === f ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
                            >
                                {f}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sub-Admins Table */}
            <div className="bg-white rounded-[40px] border border-slate-50 shadow-2xl shadow-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrative Identity</th>
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Date</th>
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/80">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-10 h-24 bg-slate-50/10"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <Shield size={48} className="text-slate-100 mb-4" />
                                            <p className="text-slate-400 font-bold italic tracking-wide">No sub-admin requests matched your query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-slate-900 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:scale-105 transition-transform">
                                                    <Shield size={24} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{user.name}</h4>
                                                    <p className="text-xs text-slate-400 font-bold flex items-center gap-2 mt-1">
                                                        <Mail size={12} className="text-indigo-500" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <p className="text-sm text-slate-600 font-black flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex justify-center">
                                                {getStatusBadge(user.accountStatus)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                {user.accountStatus === 'pending' && (
                                                    <>
                                                        <Button 
                                                            size="lg" 
                                                            onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-200 font-bold px-6"
                                                        >
                                                            Authorize
                                                        </Button>
                                                        <Button 
                                                            size="lg" 
                                                            variant="outline"
                                                            onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                            className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-2xl font-bold px-6"
                                                        >
                                                            Deny Access
                                                        </Button>
                                                    </>
                                                )}
                                                {user.accountStatus === 'approved' && (
                                                    <Button 
                                                        size="lg" 
                                                        variant="ghost"
                                                        onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase"
                                                    >
                                                        Revoke Delegation
                                                    </Button>
                                                )}
                                                {user.accountStatus === 'rejected' && (
                                                     <Button 
                                                        size="lg" 
                                                        onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                        className="bg-slate-900 border-2 border-slate-900 hover:bg-black text-white rounded-2xl font-bold px-8 shadow-2xl shadow-slate-300"
                                                    >
                                                        Restore Delegate
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
        </div>
    )
}
