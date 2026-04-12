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
    UserPlus,
    Terminal,
    Activity,
    Lock,
    Unlock,
    Command,
    Radio,
    ShieldAlert,
    Cpu,
    MousePointerClick,
    Fingerprint
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
    const [filter, setFilter] = useState('all') // all, pending, approved, rejected
    const [search, setSearch] = useState('')
    const [userRole, setUserRole] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false)
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
    const [currentUserStatus, setCurrentUserStatus] = useState<{ hasLicense: boolean, requestedLicense: boolean, city?: string, licenseId?: string }>({ hasLicense: true, requestedLicense: false })
    const [requestLoading, setRequestLoading] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const role = localStorage.getItem('userRole')
            const isSuperAdmin = role === 'super-admin' || role === 'admin'

            const url = '/api/admin/users'
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
                return (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shadow-sm">
                        <CheckCircle size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">AUTHORIZED</span>
                    </div>
                )
            case 'pending':
                return (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 shadow-sm">
                        <Clock size={10} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">VERIFYING</span>
                    </div>
                )
            case 'rejected':
                return (
                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shadow-sm">
                        <XCircle size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">SUSPENDED</span>
                    </div>
                )
            default:
                return <Badge variant="outline" className="text-[8px] font-black opacity-40 uppercase">{status}</Badge>
        }
    }

    const getRoleBadge = (role: string) => {
        const isSuperAdmin = role === 'super-admin'
        const isSubAdmin = role === 'sub-admin'
        const isEOC = role.startsWith('eoc-')

        return (
            <div className={cn(
                "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm",
                isSuperAdmin ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/5' :
                isSubAdmin ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5' :
                isEOC ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5' :
                'bg-slate-50 text-slate-500 border-slate-200'
            )}>
                {isSuperAdmin ? <Shield size={10} /> : isEOC ? <Activity size={10} /> : <User size={10} />}
                {role.replace('-', ' ')}
            </div>
        )
    }

    const isSuperAdmin = userRole === 'super-admin' || userRole === 'admin'
    const pageTitle = isSuperAdmin ? 'Identity Matrix' : 'Operational Personnel'
    const pageSubtitle = isSuperAdmin
        ? 'Master access control terminal for EOC personnel & responders'
        : 'Manage localized response teams and tactical deployment units.'

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
    const isAtLimit = eocMembersCount >= 500

    if (!loading && userRole && !isSuperAdmin && currentUserStatus.hasLicense) {
        return (
            <div className="flex-1 overflow-auto bg-slate-50 selection:bg-emerald-600/10">
                <main className="p-10 space-y-12 max-w-[1800px] mx-auto relative pb-32">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 bg-white border border-slate-100 rounded-[40px] p-12 shadow-xl shadow-slate-200/50 group overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                             <Shield size={160} className="text-emerald-500" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] animate-pulse">Operational Authority Verified</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Security Clearance: Tier 4</h1>
                                <p className="text-slate-500 font-bold text-lg max-w-3xl leading-relaxed">
                                    Your node identity is fully authenticated within the global emergency matrix. 
                                    Geographic enforcement protocols are active for your designated jurisdiction.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                        <Card className="lg:col-span-2 bg-white border border-slate-100 rounded-[40px] p-12 shadow-xl shadow-slate-200/50">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-1 bg-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                                   <Building2 size={16} className="text-emerald-500" /> License Matrix Specification
                                </h2>
                            </div>
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 p-10 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Designated Operational Zone</p>
                                        <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{currentUserStatus.city || 'Little Rock, Arkansas'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Geographic Protocol ID</p>
                                        <p className="text-2xl font-black text-emerald-600 uppercase tracking-tighter leading-none font-mono">{currentUserStatus.licenseId || 'LIC-ARC-2024-001'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Authority Classification</p>
                                        <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">Command Unit Override</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Temporal Validity</p>
                                        <p className="text-xl font-black text-white uppercase tracking-tighter italic">Perpetual Integrity</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Active Auth Scopes</h4>
                                    <div className="grid gap-6">
                                        {[
                                            `Strategic dominion over ${currentUserStatus.city || 'local sector'} telemetry.`,
                                            'Full decryption rights for GIS Impact Matrix systems.',
                                            'Auth-level override for AI-generated Community Broadcasts.',
                                            'Command-tier access to EOC Activation & Tactical Shelter arrays.'
                                        ].map((scope, idx) => (
                                            <div key={idx} className="flex items-start gap-5 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] group hover:bg-white/[0.03] transition-colors">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                                                    <CheckCircle size={16} className="text-emerald-500" />
                                                </div>
                                                <span className="text-slate-300 font-black text-[13px] uppercase tracking-tight leading-normal mt-1">{scope}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-white border border-slate-100 rounded-[40px] p-12 shadow-xl shadow-slate-200/50 h-fit sticky top-10">
                            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">System Resilience</h2>
                            <div className="space-y-8">
                                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[32px] flex flex-col items-center gap-6 shadow-sm">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-[28px] border border-emerald-200 shadow-sm flex items-center justify-center text-emerald-600 relative group">
                                        <div className="absolute inset-0 bg-emerald-200/20 blur-xl rounded-full animate-pulse" />
                                        <Shield size={40} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em]">Node Active</p>
                                        <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest italic leading-none">Integrity 99.99% SECURE</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => router.push('/admin-dashboard')}
                                    className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[24px] shadow-2xl shadow-emerald-600/20 uppercase tracking-[0.3em] text-[12px] group relative overflow-hidden active:scale-95 transition-all"
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        INITIALIZE COMMAND STRATUM
                                        <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
                                </Button>
                                
                                <div className="pt-6 flex flex-col items-center gap-4 opacity-40">
                                   <div className="flex gap-2">
                                      {Array.from({length: 4}).map((_, i) => (
                                         <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{animationDelay: `${i*100}ms`}} />
                                      ))}
                                   </div>
                                   <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.5em]">Real-time link synced with master node</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    if (!loading && userRole && !isSuperAdmin && !currentUserStatus.hasLicense) {
        return (
            <div className="flex-1 overflow-auto bg-slate-50 selection:bg-rose-600/10">
                <main className="min-h-screen flex flex-col items-center justify-center p-10 relative overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                        <div className="w-28 h-28 bg-white border border-slate-100 text-rose-500 rounded-[36px] flex items-center justify-center shadow-xl flex-shrink-0 relative group">
                            <div className="absolute inset-0 bg-rose-100/50 blur-2xl rounded-full scale-150 animate-pulse" />
                             <ShieldAlert size={48} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            <h1 className="text-5xl font-black text-slate-900 tracking-widest uppercase leading-none italic">Authentication Required</h1>
                            <p className="text-slate-500 font-bold text-lg leading-relaxed uppercase tracking-tighter">
                                Geographic Enforcement Node is currently locked. <br />
                                <span className="text-rose-600/80">Operational territory mapping has not been initialized for your identity profile.</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-10">
                            <Button
                                size="lg"
                                disabled={requestLoading || currentUserStatus.requestedLicense}
                                onClick={handleRequestLicense}
                                className={cn(
                                    "h-24 px-16 rounded-[32px] font-black shadow-xl transition-all active:scale-95 flex items-center gap-6 text-sm uppercase tracking-[0.3em] group",
                                    currentUserStatus.requestedLicense
                                        ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-600 shadow-sm'
                                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20 border border-rose-400/20'
                                )}
                            >
                                {requestLoading ? (
                                    <RefreshCw className="animate-spin" size={24} />
                                ) : currentUserStatus.requestedLicense ? (
                                    <><CheckCircle size={24} /> AUTH PROCOTOL INITIATED</>
                                ) : (
                                    <><Fingerprint size={24} className="group-hover:scale-125 transition-transform" /> MINT GEOSPATIAL LICENSE</>
                                )}
                            </Button>
                            
                            {currentUserStatus.requestedLicense ? (
                                <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-1000">
                                   <div className="px-8 py-4 bg-white border border-slate-100 rounded-3xl shadow-lg relative overflow-hidden group">
                                       <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 group-hover:w-full group-hover:opacity-5 transition-all duration-500" />
                                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-2 italic">Scanning Security Stratum...</p>
                                       <p className="text-[12px] text-slate-500 font-black uppercase tracking-widest leading-relaxed max-w-sm">
                                           Your request has been prioritized to the Super Admin Node. Await cryptographic verification.
                                       </p>
                                   </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-30">
                                   <div className="w-px h-12 bg-slate-200" />
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.5em] max-w-[200px]">License grants tactical override within local geolocation clusters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-auto bg-slate-50 selection:bg-indigo-600/10">
            <main className="p-10 space-y-12 max-w-[1800px] mx-auto relative pb-32">
                {/* Decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-200">
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white border border-slate-100 rounded-[28px] flex items-center justify-center shadow-xl group hover:bg-slate-50 transition-colors cursor-pointer">
                                <Users size={32} className="text-slate-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">{pageTitle}</h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{pageSubtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        {(isSuperAdmin || currentUserStatus.hasLicense) && (
                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                <Button
                                    onClick={() => setIsAddUserModalOpen(true)}
                                    disabled={isAtLimit && !isSuperAdmin}
                                    className={cn(
                                        "h-16 px-8 rounded-2xl font-black shadow-xl gap-4 text-xs uppercase tracking-widest border transition-all active:scale-95 group",
                                        isAtLimit && !isSuperAdmin 
                                            ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/20 shadow-indigo-600/20'
                                    )}
                                >
                                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                                    ENROLL EOC OPERATIVE
                                </Button>
                                {!isSuperAdmin && (
                                <div className="flex items-center gap-4 w-full px-2">
                                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.3)]", isAtLimit ? 'bg-rose-500' : 'bg-indigo-600')}
                                                style={{ width: `${(eocMembersCount / 500) * 100}%` }}
                                            />
                                        </div>
                                        <span className={cn("text-[9px] font-black uppercase tracking-widest whitespace-nowrap", isAtLimit ? 'text-rose-500 animate-pulse' : 'text-slate-500')}>
                                            {eocMembersCount} / 500 DEPLOYED
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        <Button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="w-16 h-16 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >
                            <RefreshCw size={24} className={cn(loading ? 'animate-spin' : '')} />
                        </Button>
                    </div>
                </div>

                {/* Stats Summary Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                    {[
                        { label: 'Total Node Population', value: users.length, icon: Users, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100' },
                        { label: 'Pending Authentication', value: users.filter(u => u.accountStatus === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                        { label: 'Operational Operatives', value: users.filter(u => u.accountStatus === 'approved').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { label: 'Security Clearance: Root', value: users.filter(u => u.role === 'super-admin').length, icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' }
                    ].map((stat, i) => (
                        (!isSuperAdmin && stat.label.includes('Root')) ? null : (
                            <Card key={i} className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl shadow-slate-200/50 group hover:bg-slate-50 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{stat.label}</p>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-widest">{stat.value}</h3>
                                    </div>
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border transition-all duration-500", stat.bg, stat.color, stat.border, "group-hover:scale-110")}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                            </Card>
                        )
                    ))}
                </div>

                <div className="space-y-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-white/10 rounded-full" />
                            <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Administrative Registry Grid</h2>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-[20px] shadow-sm">
                                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                            filter === f 
                                                ? 'bg-slate-100 text-slate-900 shadow-inner' 
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH PROFILE..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-6 h-12 bg-white border border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all font-black text-[10px] uppercase tracking-[0.2em] italic"
                                />
                            </div>
                        </div>
                    </div>

                    <Card className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50 relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operative Identity Profile</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Designation</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Registry Stream</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Authentication</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Moderation Override</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <tr key={idx} className="animate-pulse">
                                                <td colSpan={5} className="px-10 py-10 h-24 bg-slate-50 border-b border-slate-100" />
                                            </tr>
                                        ))
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-32 text-center text-slate-400 font-black italic uppercase tracking-widest text-xs">
                                                Registry scan complete • Zero identities matched the current filter matrix.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50 transition-all group/row">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-slate-100 rounded-[24px] flex items-center justify-center text-slate-400 border border-slate-200 group-hover/row:scale-110 group-hover/row:text-blue-600 group-hover/row:border-blue-100 transition-all shadow-sm">
                                                            <User size={28} />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{user.name}</h4>
                                                                {isSuperAdmin && user.requestedLicense && !user.licenseId && (
                                                                    <div className="px-3 py-1 bg-rose-50 border border-rose-100 rounded-lg shadow-sm">
                                                                        <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest animate-pulse">LICENSE REQ</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest italic leading-none">
                                                                <Mail size={12} className="text-blue-500" />
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex justify-start">
                                                        {getRoleBadge(user.role)}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest italic leading-none">
                                                            <Calendar size={12} className="text-slate-600" />
                                                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] leading-none">NODE-ID: {user._id.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex justify-center">
                                                        {getStatusBadge(user.accountStatus)}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex justify-end gap-3 scale-95 opacity-0 group-hover/row:opacity-100 group-hover/row:scale-100 transition-all">
                                                        {isSuperAdmin && user.role === 'sub-admin' && !user.licenseId && (
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedUser(user)
                                                                    setIsGrantModalOpen(true)
                                                                }}
                                                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-2xl shadow-emerald-600/20 h-11 px-6 font-black text-[10px] uppercase tracking-widest gap-2 active:scale-95 transition-all border border-emerald-400/20"
                                                            >
                                                                <Building2 size={16} />
                                                                GRANT LICENSE
                                                            </Button>
                                                        )}

                                                        {user.accountStatus === 'pending' && (
                                                            <>
                                                                <Button
                                                                    onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-11 px-6 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                                                                >
                                                                    AUTHORIZE
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl h-11 px-6 font-black text-[10px] uppercase tracking-widest border border-rose-100 transition-all"
                                                                >
                                                                    DISMISS
                                                                </Button>
                                                            </>
                                                        )}
                                                        {user.accountStatus === 'approved' && user.role !== 'super-admin' && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl h-11 px-6 font-black text-[10px] uppercase tracking-widest border border-rose-100 transition-all"
                                                            >
                                                                REVOKE IDENTITY
                                                            </Button>
                                                        )}
                                                        {user.accountStatus === 'rejected' && (
                                                            <Button
                                                                onClick={() => handleStatusUpdate(user._id, 'approved')}
                                                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-11 px-8 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                                                            >
                                                                RE-AUTHENTICATE
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
                                <Cpu size={14} className="animate-spin duration-[4000ms]" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Global Identity Stream Virtualized</p>
                            </div>
                            <p className="text-[7px] text-indigo-100 font-black uppercase tracking-[0.5em] opacity-40">All operative protocols verified under core directive 901-A • Security level 5 active</p>
                        </div>
                    </Card>
                </div>
            </main>

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
