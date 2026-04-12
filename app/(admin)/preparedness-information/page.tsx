'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Loader2, 
  Plus, 
  Save, 
  Trash2, 
  Globe, 
  Shield, 
  Home, 
  Users as UsersIcon, 
  Info,
  CheckCircle,
  Zap,
  Activity,
  Target,
  Sparkles,
  Search,
  ChevronRight,
  ArrowUpRight,
  Trophy
} from 'lucide-react'
import { cn } from '@/lib/utils'

type GuideDef = {
  id?: string;
  title: string;
  items: string[];
}

export default function PreparednessInformationPage() {
  const [guides, setGuides] = useState<Record<string, GuideDef>>({
    individual_evacuation: { 
      title: 'Individual Evacuation', 
      items: [
        "Identify 2 evacuation routes at your home and places you frequently visit.",
        "Develop a family communications plan, including adding contacts to the Ready2Go \"Are We Safe\" feature.",
        "Designate an outdoor reunification meeting place and practice at least twice a year.",
        "Create an emergency go-bag for 72 hours including medicine, pet supplies, and essential.",
        "Store important financial documents (bank accounts, insurance) in your phone's contact section."
      ] 
    },
    community_evacuation: { 
      title: 'Community or City-Wide Evacuation', 
      items: [
        "Identify at least 2 evacuation routes from your community.",
        "Ensure full tank of gas; local stations may run out during emergencies.",
        "Take your emergency go-bag.",
        "Know pet-friendly hotels if evacuating with pets.",
        "Secure your home and take valuables with you.",
        "Be aware of community shelters if you cannot evacuate.",
        "Take photos of your property for insurance purposes.",
        "Bookmark FEMA's disaster assistance for post-disaster help."
      ] 
    },
    shelter_in_place: { title: 'General Shelter-in-Place', items: [] },
    household_pets: { title: 'Household Pets', items: [] },
  })
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchGuides = async () => {
    try {
      const res = await fetch('/api/admin/preparedness-guides')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setGuides((prev) => ({ ...prev, ...data.data }))
        }
      }
    } catch (err) {
      console.error("Failed to fetch preparedness guides:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGuides()
  }, [])

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-[#0A0B10]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-400">SAFE</div>
          </div>
          <p className="font-black text-xs uppercase tracking-[0.4em] text-slate-500 animate-pulse">Synchronizing Resilience Matrix...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 lg:p-12 space-y-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-600/20">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Preparedness Center</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Community Resilience & Life Safety Protocols</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 py-3 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                    External Visibility: <span className="text-emerald-600">Authorized</span>
                </span>
            </div>
            <Button 
                className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 gap-3"
            >
                 <Plus size={16} /> Add Protocol
            </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 text-blue-500/5 grayscale group-hover:grayscale-0 transition-all duration-1000">
          <Shield size={200} />
        </div>
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex h-8 px-4 rounded-xl items-center bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">
             Mission Critical Guidance
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Community Resilience Strategic Framework</h2>
          <p className="text-slate-500 font-medium leading-relaxed text-lg">
            Standardized life-safety protocols designed for rapid deployment. Review and audit these procedures to maintain certification and community safety.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {[
            { key: 'individual_evacuation', icon: Home, color: 'text-blue-600', bg: 'bg-blue-600' },
            { key: 'community_evacuation', icon: UsersIcon, color: 'text-purple-600', bg: 'bg-purple-600' }
        ].map((guide) => (
            <Card key={guide.key} className="bg-white border-slate-200 rounded-[48px] p-10 shadow-xl flex flex-col h-full hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                    <guide.icon size={120} className="text-slate-900" />
                </div>
                
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl", guide.bg)}>
                            <guide.icon size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{guides[guide.key].title}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Scenario Planning</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    {guides[guide.key].items.map((item, idx) => (
                        <div key={`${guide.key}-${idx}`} className="flex items-start gap-6 group">
                            <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 shrink-0 mt-1 shadow-sm">
                                <span className="text-[9px] font-black">{idx + 1}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors lowercase first-letter:uppercase">{item}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <Button variant="ghost" className="h-12 px-6 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 hover:bg-red-50 gap-3">
                        <Trash2 size={16} /> Purge
                    </Button>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="h-12 px-6 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 gap-3">
                            <Plus size={16} /> Append
                        </Button>
                        <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 gap-3">
                            <Save size={16} /> Serialize
                        </Button>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      {/* Footer System Note */}
      <Card className="bg-white border border-slate-200 rounded-[48px] p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 text-blue-500/5">
            <Info size={140} />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-20 h-20 bg-blue-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-blue-600/20 shrink-0">
                <Sparkles size={40} />
            </div>
            <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Strategic Template Management</h4>
                <p className="text-base font-medium text-slate-500 leading-relaxed max-w-5xl">
                    Our AI models generate baseline preparedness templates for all standard hazard profiles. 
                    Administrators can selectively activate, modify, or extend these protocols to ensure localized relevance. 
                    <br/><br/>
                    <Button variant="link" className="p-0 h-auto text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] hover:text-blue-800 transition-colors">
                        Re-calibrate AI Guidance Models
                    </Button>
                </p>
            </div>
        </div>
      </Card>
    </main>
  )
}
