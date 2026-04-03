'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    UserPlus, 
    Shield, 
    Eye, 
    Loader2, 
    Mail, 
    Lock,
    User
} from "lucide-react"
import { toast } from "sonner"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'eoc-observer'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`User ${formData.name} successfully created`)
        onSuccess()
        onClose()
        setFormData({ name: '', email: '', password: '', role: 'eoc-observer' })
      } else {
        toast.error(data.error || 'Failed to create user')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-slate-50 p-8 pt-10 border-b border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
                <UserPlus className="text-white" size={28} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 uppercase">Add Team Member</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium leading-tight mt-1">Onboard a new operational personnel to your organization.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="h-14 pl-12 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.com"
                  className="h-14 pl-12 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Role</Label>
                    <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                        <SelectTrigger className="h-14 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700 shadow-sm">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                            <SelectItem value="eoc-manager" className="rounded-xl focus:bg-indigo-50 py-3">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-indigo-600" />
                                    <span className="font-bold text-xs uppercase tracking-tight">Manager</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="eoc-observer" className="rounded-xl focus:bg-indigo-50 py-3">
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-indigo-600" />
                                    <span className="font-bold text-xs uppercase tracking-tight">Observer</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="pass" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</Label>
                   <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <Input
                        id="pass"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-14 pl-12 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700 shadow-sm"
                        required
                    />
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <Shield className="text-amber-600 shrink-0" size={18} />
                <p className="text-[10px] text-amber-700 font-bold uppercase leading-relaxed tracking-wider">
                    Total organization capacity is limited to 20 personnel accounts. This user will have immediate access to your EOC dashboard.
                </p>
            </div>
          </div>

          <DialogFooter className="p-8 pt-2 bg-white flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 transition-all gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus size={18} /> ADD USER</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
