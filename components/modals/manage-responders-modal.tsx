'use client'

import { useState } from 'react'
import { X, Shield, Plus, Info, Siren, Truck, Activity, MoreVertical, Smartphone, Grid, Lock, Unlock, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ManageRespondersModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ResponderUnit {
    id: string
    name: string
    type: 'Police' | 'Fire' | 'Health'
    email: string
    status: 'active' | 'pending'
    accessLevel: 'full' | 'limited'
}

export function ManageRespondersModal({ isOpen, onClose }: ManageRespondersModalProps) {
    const [units, setUnits] = useState<ResponderUnit[]>([
        { id: '1', name: 'Metro Police Unit-4', type: 'Police', email: 'police4@city.gov', status: 'active', accessLevel: 'limited' },
        { id: '2', name: 'Central Fire Squad', type: 'Fire', email: 'fire@city.gov', status: 'active', accessLevel: 'full' },
        { id: '3', name: 'Public Health Response', type: 'Health', email: 'health@city.gov', status: 'pending', accessLevel: 'limited' },
    ])

    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState('')
    const [newType, setNewType] = useState<'Police' | 'Fire' | 'Health'>('Police')
    const [newEmail, setNewEmail] = useState('')
    const [newAccess, setNewAccess] = useState<'full' | 'limited'>('limited')

    if (!isOpen) return null

    const handleAddUnit = () => {
        if (!newName || !newEmail) {
            toast.error('Mission Info', { description: 'Please fill name and email' })
            return
        }
        const newUnit: ResponderUnit = {
            id: Math.random().toString(),
            name: newName,
            type: newType,
            email: newEmail,
            status: 'pending',
            accessLevel: newAccess
        }
        setUnits([...units, newUnit])
        setIsAdding(false)
        setNewName('')
        setNewEmail('')
        toast.success('Responder Invitation Sent', { description: `${newName} has been invited with ${newAccess} access.` })
    }

    const toggleAccess = (id: string) => {
        setUnits(units.map(u => u.id === id ? { ...u, accessLevel: u.accessLevel === 'full' ? 'limited' : 'full' } : u))
        toast.info('Access Permissions Updated')
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200 relative">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Shield className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Responder Access Management</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                Tactical Unit Permissions • Dashboard B Protocol
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 relative z-10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-8 pb-4 flex justify-between items-end">
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Access Nodes</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Units: {units.length}</p>
                        </div>
                        <Button 
                            onClick={() => setIsAdding(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-5 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-indigo-100 gap-2"
                        >
                            <Plus size={14} /> Add Responder Node
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                        <div className="border border-slate-100 rounded-[32px] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Responder Identity</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Capability</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Access Status</th>
                                        <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {units.map((u) => (
                                        <tr key={u.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                                        u.type === 'Police' ? "bg-blue-50 text-blue-600" : (u.type === 'Fire' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")
                                                    )}>
                                                        {u.type === 'Police' ? <Siren size={18} /> : (u.type === 'Fire' ? <Truck size={18} /> : <Activity size={18} />)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900">{u.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className="font-black text-[9px] uppercase tracking-widest bg-slate-100 text-slate-600 border-none px-2.5 py-1">
                                                    {u.type} Department
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <Badge className={cn(
                                                        "font-black text-[9px] uppercase tracking-widest border-none px-3 py-1 text-white shadow-sm",
                                                        u.accessLevel === 'full' ? "bg-emerald-500" : "bg-amber-500"
                                                    )}>
                                                        {u.accessLevel === 'full' ? 'Full Access' : 'Limited Access'}
                                                    </Badge>
                                                    {u.status === 'pending' && <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest animate-pulse italic">Awaiting Activation</p>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => toggleAccess(u.id)}
                                                        className="p-2 border border-slate-100 rounded-lg hover:bg-white hover:text-indigo-600 transition-all group-hover:shadow-sm"
                                                        title="Toggle Access Level"
                                                    >
                                                        {u.accessLevel === 'full' ? <Unlock size={14} /> : <Lock size={14} />}
                                                    </button>
                                                    <button className="p-2 border border-slate-100 rounded-lg hover:bg-white text-slate-400 hover:text-slate-900 transition-all group-hover:shadow-sm">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {isAdding && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
                        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[32px] border border-slate-100 shadow-2xl">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase">Invite Responder Node</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provision new departmental access link</p>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Agency Name</label>
                                    <Input 
                                        placeholder="Unit / Department Name"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 text-xs font-bold"
                                    />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department Email</label>
                                    <Input 
                                        placeholder="official@agency.gov"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 text-xs font-bold"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Unit Type</label>
                                        <select 
                                            value={newType}
                                            onChange={(e) => setNewType(e.target.value as any)}
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-700 focus:outline-none"
                                        >
                                            <option value="Police">Police</option>
                                            <option value="Fire">Fire</option>
                                            <option value="Health">Health</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Tier</label>
                                        <select 
                                            value={newAccess}
                                            onChange={(e) => setNewAccess(e.target.value as any)}
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-700 focus:outline-none"
                                        >
                                            <option value="limited">Limited Access</option>
                                            <option value="full">Full Command</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setIsAdding(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400">Abort</Button>
                                <Button onClick={handleAddUnit} className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl">Complete Logic</Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Info size={16} className="text-blue-500" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Responders with "Limited Access" can view GIS intel but cannot authorize national level alerts.</p>
                    </div>
                    <Button variant="outline" onClick={onClose} className="border-slate-200 text-slate-500 font-black uppercase text-[9px] tracking-[0.3em] rounded-xl h-10 px-8">Secured Close</Button>
                </div>
            </div>
        </div>
    )
}
