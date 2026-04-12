'use client'

import React from 'react'
import { DashboardStats } from '@/components/dashboard-stats'
import { GISMap } from '@/components/gis-map'
import { LicenseRequestList } from '@/components/license-request-list'
import { ActiveLicenseList } from '@/components/active-license-list'
import { Shield, Activity, Radio, Command, Terminal, Cpu, Target, Key, ShieldCheck } from 'lucide-react'

export default function SuperAdminDashboard() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 selection:bg-blue-600/10">
      <main className="p-10 space-y-12 max-w-[1800px] mx-auto relative pb-32">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Super Admin Dashboard Header */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-200">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-600/20 group hover:scale-110 transition-transform cursor-pointer">
                <Shield size={32} className="text-white group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">Super Admin Hub</h1>
                <div className="flex items-center gap-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Master Security Infrastructure</p>
                  <div className="h-1 w-1 rounded-full bg-slate-700" />
                  <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                     Root Access Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">System Integrity</p>
                <p className="text-blue-600 text-xs font-black uppercase tracking-widest italic">99.9% SECURE</p>
             </div>
             <div className="w-px h-8 bg-slate-200" />
             <div className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm">
                <Key size={18} />
             </div>
          </div>
        </div>

        {/* Global Tactical Grid */}
        <section className="space-y-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
            <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Global Node Metrics</h2>
          </div>
          <DashboardStats />
        </section>

        {/* Pending Authentications Section */}
        <section className="space-y-8 relative z-10">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
              <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Target size={14} className="text-rose-500" /> Pending License Authentications
              </h2>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-[40px] p-8 relative overflow-hidden group shadow-xl shadow-slate-200/50">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
              <Radio size={120} className="animate-pulse" />
            </div>
            <div className="relative z-10">
              <p className="text-blue-600 font-bold text-lg tracking-tight leading-relaxed max-w-4xl mb-8 uppercase bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm transition-all group-hover:bg-white group-hover:shadow-blue-600/5">
                Sarah/Patrick will provide preparedness information and set Alerts and Communication messages with messaging for Super Admin
              </p>
              <LicenseRequestList />
            </div>
          </div>
        </section>

        {/* Active Authorized Licenses Section */}
        <section className="space-y-8 relative z-10">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                 <ShieldCheck size={14} className="text-emerald-500" /> Authorized License Nodes
              </h2>
            </div>
          </div>
          <ActiveLicenseList />
        </section>

        {/* GIS Strategic Matrix */}
        <section className="space-y-8 relative z-10">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Activity size={14} className="text-blue-500" /> Global GIS Impact Matrix
              </h2>
            </div>
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest italic">REAL-TIME DATA STREAM: SECURE</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50">
            <GISMap />
          </div>
        </section>

        {/* Footer Info */}
        <div className="pt-20 flex flex-col items-center justify-center gap-6 opacity-30 group">
           <Terminal size={32} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] text-center max-w-[800px] leading-relaxed">
              Super Admin Control Node • Cryptographic Signature Required for All License Minting Operations • System Resilience Level 5
           </p>
           <div className="flex items-center gap-4 text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
              <span>Latency: 14ms</span>
              <div className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Enc: AES-256-GCM</span>
              <div className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Session: XH-992-KIP</span>
           </div>
        </div>
      </main>
    </div>
  )
}
