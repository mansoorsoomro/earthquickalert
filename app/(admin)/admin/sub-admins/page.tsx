'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
    ArrowLeft,
    Terminal,
    Activity,
    Lock,
    Unlock,
    Command,
    Radio,
    ShieldAlert
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AddUserModal } from "@/components/modals/add-user-modal"

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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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
                return (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 shadow-lg shadow-emerald-500/5">
                        <CheckCircle size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">AUTHORIZED</span>
                    </div>
                )
            case 'pending':
                return (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 shadow-lg shadow-amber-500/5">
                        <Clock size={10} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">VERIFICATION</span>
                    </div>
                )
            case 'rejected':
                return (
                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 shadow-lg shadow-rose-500/5">
                        <XCircle size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">DENIED</span>
                    </div>
                )
            default:
                return <Badge variant="outline" className="text-[8px] font-black opacity-40 uppercase">{status}</Badge>
        }
    }

    return (
        <div className="flex-1 overflow-auto bg-slate-50 selection:bg-indigo-600/10">
            <main className="p-10 space-y-12 max-w-[1800px] mx-auto relative pb-32">
                {/* Decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-200">
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => router.push('/admin-dashboard')}
                                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm"
                            >
                                <ArrowLeft size={20} />
                            </Button>
                            <div className="w-16 h-16 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-indigo-600/20 group hover:scale-110 transition-transform cursor-pointer">
                                <Shield size={32} className="text-white group-hover:rotate-12 transition-transform duration-500" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">Sub-Admin Registry</h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Delegation Matrix</p>
                                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                                    <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        Sub-Node Authentication
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right space-y-1 mr-4">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Registry Status</p>
                            <p className="text-emerald-500 text-xs font-black uppercase tracking-widest italic">SYNCHRONIZED</p>
                        </div>
                        <Button 
                            onClick={fetchSubAdmins} 
                            disabled={loading}
                            variant="ghost" 
                            size="icon"
                            className="w-14 h-14 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                        >
                            <RefreshCw size={24} className={cn(loading ? 'animate-spin' : '')} />
                        </Button>
                        <Button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-600/20 gap-3"
                        >
                            <Users size={16} /> Onboard Sub-Admin
                        </Button>
                    </div>
                </div>
                
                {/* Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    {[
                        { label: 'Pending Verification', value: users.filter(u => u.accountStatus === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                        { label: 'Authorized Sub-Admins', value: users.filter(u => u.accountStatus === 'approved').length, icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                        { label: 'Access Denied', value: users.filter(u => u.accountStatus === 'rejected').length, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' }
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl shadow-slate-200/50 group hover:bg-slate-50 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{stat.label}</p>
                                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                                </div>
                                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl border group-hover:scale-110 transition-transform", stat.bg, stat.color, stat.border)}>
                                    <stat.icon size={28} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="space-y-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                            <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Administrative Security Matrix</h2>
                        </div>
                         <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-[20px] shadow-sm">
                                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                                    <button 
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                            filter === f 
                                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <div className="relative group w-full md:w-80">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <Input
                                    placeholder="SEARCH DELEGATES..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-12 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest focus-visible:ring-indigo-500/50 transition-all font-mono shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <Card className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Administrative Identity</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Deployment Status</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Auth Verification</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Moderation Protocols</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        Array.from({ length: 4 }).map((_, idx) => (
                                            <tr key={idx} className="animate-pulse">
                                                <td colSpan={4} className="px-10 py-12"><div className="h-10 bg-white/5 rounded-2xl w-full" /></td>
                                            </tr>
                                        ))
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-32 text-center space-y-6">
                                                <div className="flex flex-col items-center">
                                                    <ShieldAlert size={60} className="text-slate-800 mb-6" />
                                                    <p className="text-lg font-black text-white uppercase tracking-tighter">No Access Nodes Found</p>
                                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2 italic max-w-xs mx-auto">Master registry scan returned zero matches for your filter criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50 transition-all group/row">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-slate-400 border border-slate-200 group-hover/row:scale-105 group-hover/row:text-indigo-600 group-hover/row:border-indigo-200 transition-all shadow-sm">
                                                            <User size={28} />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{user.name}</h4>
                                                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">
                                                                <Mail size={12} className="text-indigo-500" />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none flex items-center gap-2">
                                                            <Calendar size={12} className="text-indigo-600" />
                                                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block">Registry ID: {user._id.slice(-8).toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                     {getStatusBadge(user.accountStatus)}
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex justify-end gap-3">
                                                        {user.accountStatus === 'pending' && (
                                                            <>
                                                                <Button 
                                                                    onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-[18px] shadow-2xl shadow-indigo-600/20 font-black text-[10px] uppercase tracking-widest h-12 px-8 border border-indigo-400/20 active:scale-95 transition-all"
                                                                >
                                                                    Authorize Node
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost"
                                                                    onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                                    className="bg-rose-600/5 hover:bg-rose-600 text-rose-500 hover:text-white rounded-[18px] border border-rose-500/10 font-black text-[10px] uppercase tracking-widest h-12 px-8 transition-all"
                                                                >
                                                                    Deny Access
                                                                </Button>
                                                            </>
                                                        )}
                                                        {user.accountStatus === 'approved' && (
                                                            <Button 
                                                                variant="ghost"
                                                                onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                                className="text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl font-black text-[9px] uppercase tracking-widest px-6 h-10 transition-all border border-rose-500/10"
                                                            >
                                                                Revoke Controls
                                                            </Button>
                                                        )}
                                                        {user.accountStatus === 'rejected' && (
                                                             <Button 
                                                                onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                                className="bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl border border-white/10 font-black text-[9px] uppercase tracking-widest px-8 h-10 transition-all shadow-xl"
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
                        <div className="bg-indigo-600 p-8 flex flex-col items-center justify-center space-y-2 relative z-10">
                            <div className="flex items-center gap-3 text-white">
                                <Activity size={14} className="animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sub-Node Deployment Matrix v4.0.01</p>
                            </div>
                            <p className="text-[7px] text-indigo-200 font-black uppercase tracking-[0.6em] opacity-40 italic">Delegation of authority grants immutable administrative overrides within local clusters.</p>
                        </div>
                    </Card>
                </div>
                
                {/* Footer Info */}
                <div className="pt-20 flex flex-col items-center justify-center gap-6 opacity-30 group">
                   <Terminal size={32} className="text-slate-500 group-hover:text-indigo-500 transition-colors" />
                   <div className="flex flex-col items-center gap-2">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] text-center max-w-[800px] leading-relaxed">
                          Master Control Hub • Administrative Security Level 4 • All Delegate Mutations Are Logged
                       </p>
                       <p className="text-[8px] font-bold text-slate-800 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
                   </div>
                </div>
            </main>

            <AddUserModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={fetchSubAdmins} 
            />
        </div>
    )
}
