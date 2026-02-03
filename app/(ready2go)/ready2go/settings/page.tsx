'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Settings as SettingsIcon,
    Bell,
    User,
    Shield,
    Smartphone,
    Lock,
    ChevronRight,
    Eye,
    Globe,
    Database
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Settings() {
    return (
        <div className="p-8 space-y-8 max-w-[1000px] mx-auto">
            <div>
                <h1 className="text-4xl font-black text-[#34385E] mb-2 tracking-tight">System Settings</h1>
                <p className="text-slate-500 font-medium italic">Configure your emergency suite preferences and security protocols.</p>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left: Settings Navigation */}
                <div className="col-span-12 lg:col-span-4 space-y-2">
                    {[
                        { icon: User, label: 'Profile Information', active: true },
                        { icon: Bell, label: 'Notifications', active: false },
                        { icon: Shield, label: 'Security & Privacy', active: false },
                        { icon: Smartphone, label: 'Device Integration', active: false },
                        { icon: Globe, label: 'Language & Region', active: false },
                        { icon: Database, label: 'Data Management', active: false },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={cn("w-full flex items-center justify-between p-4 rounded-2xl transition-all group", {
                                'bg-[#34385E] text-white shadow-xl shadow-blue-900/10': item.active,
                                'hover:bg-slate-50 text-slate-600': !item.active
                            })}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", item.active ? "text-white" : "text-slate-400 group-hover:text-[#34385E]")} />
                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                            </div>
                            {!item.active && <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />}
                        </button>
                    ))}
                </div>

                {/* Right: Settings Content */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <Card className="p-8 border-slate-200 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                            <div>
                                <h3 className="font-black text-slate-800 text-lg tracking-tight">Profile Information</h3>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Manage your identity in the EOC</p>
                            </div>
                            <Button className="bg-[#34385E] hover:bg-slate-800 text-white rounded-xl px-6 h-9 text-xs font-bold">Save Changes</Button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                                    <input type="text" defaultValue="Ready User" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#34385E]/5" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Unit Assignment</label>
                                    <input type="text" defaultValue="Ready2Go Core" readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 outline-none cursor-not-allowed italic" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                                <input type="email" defaultValue="test1@yopmail.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#34385E]/5" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Emergency Contact Number</label>
                                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#34385E]/5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-slate-200 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-slate-800 text-sm">Security Protocols</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Two-Factor Authentication', status: 'Enabled', desc: 'Secure your account with SMS or App codes.' },
                                { label: 'Biometric Access', status: 'Disabled', desc: 'Use FaceID or Fingerprint for rapid dashboard entry.' },
                                { label: 'Network Lockdown', status: 'Enabled', desc: 'Restricts access to verified EOC IP ranges.' },
                            ].map((mod, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-slate-800 group-hover:underline decoration-slate-300">{mod.label}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{mod.desc}</p>
                                    </div>
                                    <span className={cn("text-[10px] font-black px-3 py-1 rounded-full border-2", {
                                        'border-green-200 text-green-600': mod.status === 'Enabled',
                                        'border-slate-200 text-slate-400': mod.status === 'Disabled',
                                    })}>{mod.status}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="flex justify-between items-center p-6 bg-red-50 border border-red-100 rounded-3xl mt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-700 tracking-tight">Deactivate EOC Suite</p>
                                <p className="text-[10px] text-red-400 font-medium">Permanently remove this user and wipe local cache.</p>
                            </div>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-500 hover:text-white rounded-xl h-10 text-xs font-black uppercase tracking-widest px-8">Deactivate</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
