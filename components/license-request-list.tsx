'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    ShieldAlert, 
    User, 
    ArrowRight, 
    Mail, 
    Clock,
    RefreshCw,
    Building2,
    ShieldPlus,
    Activity,
    Lock,
    Unlock,
    Terminal
} from "lucide-react"
import Link from 'next/link'
import { toast } from "sonner"
import { GrantLicenseModal } from "@/components/modals/grant-license-modal"
import { cn } from "@/lib/utils"

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    requestedOrgName?: string;
    city?: string;
    country?: string;
}

export function LicenseRequestList() {
    const [requests, setRequests] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/users?requestedLicense=true')
            const data = await response.json()
            if (response.ok) {
                setRequests(data.users || [])
            } else {
                toast.error(data.error || 'Failed to fetch license requests')
            }
        } catch (error) {
            toast.error('Error connecting to the server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleGrantClick = (user: IUser) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    if (!loading && requests.length === 0) {
        return (
            <Card className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50">
                <CardContent className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm group hover:scale-110 transition-transform">
                        <Lock size={32} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Pending Authentications</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                            The security matrix is clear. All EOC license requests have been validated and minted successfully.
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchRequests}
                        className="bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-10 uppercase text-[10px] font-black tracking-widest"
                    >
                        Force Scan Grid
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50 relative">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[80px] rounded-full pointer-events-none" />

                <CardHeader className="p-10 border-b border-slate-100 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm border border-rose-100 group hover:rotate-12 transition-transform">
                                <ShieldAlert size={28} />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Authentication Queue</CardTitle>
                                <div className="flex items-center gap-3">
                                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Pending Organization Onboarding Matrix</p>
                                   <div className="w-1 h-1 rounded-full bg-slate-700" />
                                   <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">{requests.length} Critical Tasks</span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={fetchRequests}
                            disabled={loading}
                            className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95"
                        >
                            <RefreshCw size={20} className={cn(loading ? 'animate-spin' : '')} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 relative z-10">
                    <div className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="p-10 flex items-center justify-between animate-pulse">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl" />
                                        <div className="space-y-3">
                                            <div className="h-4 w-40 bg-white/5 rounded" />
                                            <div className="h-3 w-64 bg-white/5 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-14 w-48 bg-white/5 rounded-2xl" />
                                </div>
                            ))
                        ) : (
                            requests.map((user) => (
                                <div key={user._id} className="p-10 group/item flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center gap-8">
                                        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 group-hover/item:text-blue-600 group-hover/item:border-blue-200 transition-all">
                                            <User size={28} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{user.name}</h4>
                                                <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-xl shadow-lg shadow-rose-500/5">
                                                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-[0.2em] animate-pulse">Awaiting Verification</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock size={12} className="text-slate-600" />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(user.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {user.requestedOrgName && (
                                                   <div className="flex items-center gap-3 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                                       <Building2 size={12} className="text-blue-600" />
                                                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user.requestedOrgName}</span>
                                                   </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-8 shrink-0">
                                        <div className="hidden xl:block text-right space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">Security Level</p>
                                            <p className="text-[10px] font-black text-slate-900 mt-1 uppercase italic tracking-widest flex items-center gap-2 justify-end">
                                               <Terminal size={10} className="text-blue-500" />
                                               Tier 4 Deployment
                                            </p>
                                        </div>
                                        <Button 
                                            onClick={() => handleGrantClick(user)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] shadow-2xl shadow-blue-600/20 gap-4 h-16 px-10 font-black text-xs uppercase tracking-widest group/btn border border-blue-400/20 active:scale-95 transition-all"
                                        >
                                            Mint Geographic License
                                            <ShieldPlus size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                        </Button>
                                    </div>
                                    </div>
                                ))
                        )}
                    </div>
                </CardContent>
                <div className="bg-indigo-600 p-6 flex flex-col items-center justify-center space-y-1 relative z-10">
                    <div className="flex items-center gap-3 text-white">
                        <Activity size={12} className="animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em]">Operational Protocol Alpha-9 Active</p>
                    </div>
                    <p className="text-[7px] text-blue-200 font-black uppercase tracking-[0.5em] opacity-40">Minting grants total administrative dominion over specified coordinates.</p>
                </div>
            </Card>

            {selectedUser && (
                <GrantLicenseModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedUser(null)
                    }}
                    onSuccess={fetchRequests}
                />
            )}
        </div>
    )
}
