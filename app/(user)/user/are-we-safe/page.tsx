'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, UserCheck, UserX, Navigation } from 'lucide-react'

import { useSafety } from '@/lib/context/safety-context'

export default function AreWeSafePage() {
    const { myStatus, setMyStatus, familyMembers } = useSafety()

    const isSafe = myStatus === 'SAFE'
    const isDanger = myStatus === 'DANGER'

    return (
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Are We Safe?</h1>
                        <p className="text-slate-500">Family & Group Safety Check-in</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Create Group
                    </Button>
                </div>

                {/* My Status Card */}
                <Card className={`p-6 border-slate-200 shadow-sm transition-colors ${isDanger ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">My Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            className={`h-16 text-lg font-bold transition-all ${isSafe ? 'bg-green-700 ring-4 ring-green-200' : 'bg-green-600 hover:bg-green-700'} text-white`}
                            onClick={() => setMyStatus('SAFE')}
                        >
                            <UserCheck className="w-6 h-6 mr-2" />
                            I AM SAFE
                        </Button>
                        <Button
                            className={`h-16 text-lg font-bold transition-all ${isDanger ? 'bg-red-700 ring-4 ring-red-200' : 'bg-red-600 hover:bg-red-700'} text-white`}
                            onClick={() => setMyStatus('DANGER')}
                        >
                            <UserX className="w-6 h-6 mr-2" />
                            I NEED HELP
                        </Button>
                    </div>

                    <div className="mt-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Current Action / Location Status</label>
                        <select
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => console.log('Status updated:', e.target.value)}
                        >
                            <option>At Home (Safe)</option>
                            <option>At Work / School</option>
                            <option>Evacuating / Mobile</option>
                            <option>At Designated Meeting Point</option>
                            <option>Sheltering in Place</option>
                        </select>
                    </div>
                    {isDanger && (
                        <div className="mt-4 p-4 bg-red-100 rounded-lg text-red-800 text-sm font-medium animate-pulse">
                            Status set to Danger. Location sharing enabled. Emergency contacts notified.
                        </div>
                    )}
                </Card>

                {/* Active Groups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Family Group</h3>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full font-bold text-slate-600">{familyMembers.length + 1} Members</span>
                        </div>

                        <div className="space-y-4">
                            {/* Me */}
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${isSafe ? 'bg-green-50 border-green-100' : isDanger ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isSafe ? 'bg-green-200 text-green-700' : isDanger ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-600'}`}>Me</div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">You</p>
                                        <p className={`text-xs ${isSafe ? 'text-green-700' : isDanger ? 'text-red-700' : 'text-slate-500'}`}>
                                            {isSafe ? 'Marked Safe' : isDanger ? 'NEEDS HELP' : 'Status Pending'}
                                        </p>
                                    </div>
                                </div>
                                {isSafe && <UserCheck className="w-5 h-5 text-green-600" />}
                                {isDanger && <UserX className="w-5 h-5 text-red-600" />}
                            </div>

                            {/* Family Members */}
                            {familyMembers.map((member) => (
                                <div key={member.id} className={`flex items-center justify-between p-3 rounded-lg border ${member.status === 'SAFE' ? 'bg-green-50 border-green-100' : member.status === 'DANGER' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${member.status === 'SAFE' ? 'bg-green-200 text-green-700' : member.status === 'DANGER' ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                                            <p className={`text-xs ${member.status === 'SAFE' ? 'text-green-700' : member.status === 'DANGER' ? 'text-red-700' : 'text-slate-500'}`}>
                                                {member.status === 'SAFE' ? 'Marked Safe' : member.status === 'DANGER' ? 'NEEDS HELP' : 'Status Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    {member.status === 'SAFE' && <UserCheck className="w-5 h-5 text-green-600" />}
                                    {member.status === 'DANGER' && (
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="destructive" className="h-8 shadow-lg shadow-red-200">Call</Button>
                                                <Button size="sm" variant="outline" className="h-8 border-red-200 text-red-700"><Navigation className="w-3 h-3" /></Button>
                                            </div>
                                            <p className="text-[10px] text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded animate-pulse">
                                                INSTRUCTIONS: Call immediately. If unreachable, call 911.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    )
}
