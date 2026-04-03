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
import { Building2, Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GrantLicenseModalProps {
  user: {
    _id: string;
    name: string;
    email: string;
    city?: string;
    country?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GrantLicenseModal({ user, isOpen, onClose, onSuccess }: GrantLicenseModalProps) {
  const [loading, setLoading] = useState(false)
  const [orgName, setOrgName] = useState('')

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: orgName,
          userId: user._id,
          city: user.city,
          country: user.country,
          planType: 'Enterprise',
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`License successfully granted to ${orgName}`)
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || 'Failed to grant license')
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
        <form onSubmit={handleGrant}>
          <DialogHeader className="bg-slate-50 p-8 pt-10 border-b border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
                <Building2 className="text-white" size={28} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 uppercase">Grant EOC License</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium leading-tight mt-1">Assign an organization control terminal to this sub-admin.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-sm border border-slate-100">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user?.name}</p>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Organization Name</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Gotham City Emergency Services"
                  className="h-14 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex gap-4">
              <Shield className="text-indigo-600 shrink-0" size={20} />
              <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                <span className="font-black uppercase mr-1">Authentication Check</span>
                This user will be promoted to **Sub-Admin** and will have full administrative control over the specified organization and its associated GIS assets.
              </p>
            </div>
          </div>

          <DialogFooter className="p-8 pt-2 bg-white flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 active:scale-95 transition-all">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Shield size={18} /> GRANT LICENSE</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
