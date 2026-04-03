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
    ShieldPlus
} from "lucide-react"
import Link from 'next/link'
import { toast } from "sonner"
import { GrantLicenseModal } from "@/components/modals/grant-license-modal"

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
            <Card className="border-slate-100 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No Pending Authentications</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">All EOC license requests have been processed successfully.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="border-slate-100 shadow-2xl shadow-indigo-100/20 overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-black text-slate-900 tracking-tight uppercase">Action Required: Pending Licenses</CardTitle>
                                <p className="text-xs text-slate-500 font-medium">New organization onboarding requests awaiting minting.</p>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={fetchRequests}
                            disabled={loading}
                            className="text-slate-400 hover:text-indigo-600"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="p-6 animate-pulse flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-100 rounded" />
                                            <div className="h-3 w-48 bg-slate-100 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-10 w-24 bg-slate-100 rounded-xl" />
                                </div>
                            ))
                        ) : (
                            requests.map((user) => (
                                <div key={user._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                            <User size={22} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="font-bold text-slate-900">{user.name}</h4>
                                                <Badge className="bg-amber-50 text-amber-600 border-none px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter uppercase animate-pulse">
                                                    Awaiting Minting
                                                </Badge>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {user.email}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} className="text-slate-400" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="hidden lg:block text-right mr-4">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                            <p className="text-xs font-bold text-slate-600 mt-1 uppercase italic">Operational Verification</p>
                                        </div>
                                        <Button 
                                            onClick={() => handleGrantClick(user)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/10 gap-2 h-11 px-6 font-bold text-sm group"
                                        >
                                            Grant Geographic License
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
                <div className="bg-slate-50/30 p-4 border-t border-slate-100">
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
                        Minting a license will grant this user administrative controls over their respective organization boundaries.
                    </p>
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
        </>
    )
}
