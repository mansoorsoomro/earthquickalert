'use client'

import React from 'react'
import { DashboardStats } from '@/components/dashboard-stats'
import { GISMap } from '@/components/gis-map'
import { LicenseRequestList } from '@/components/license-request-list'

export default function SuperAdminDashboard() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <main className="p-6 space-y-8 max-w-[1600px] mx-auto pb-24">
        {/* Super Admin Dashboard Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
                <span className="text-white text-2xl font-bold">🛡️</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Super Admin Hub</h1>
            </div>
            <p className="text-slate-500 font-medium ml-16 leading-relaxed">High-level situational awareness and administrative control terminal.</p>
          </div>
        </div>

        {/* Tactical Alert Grid */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-1.5 bg-red-600 rounded-full" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono">Tactical Alert Grid</h2>
          </div>
          <DashboardStats />
        </section>

        {/* License Requests Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-1.5 bg-rose-600 rounded-full" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono">Pending License Authentications</h2>
          </div>
          <LicenseRequestList />
        </section>

        {/* GIS Impact Map */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-1.5 bg-indigo-600 rounded-full" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-mono">GIS Impact Map</h2>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-indigo-100/20">
            <GISMap />
          </div>
        </section>
      </main>
    </div>
  )
}
