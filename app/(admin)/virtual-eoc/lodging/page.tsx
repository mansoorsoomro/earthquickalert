'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Bed, 
    MapPin, 
    Phone, 
    Info, 
    Star, 
    ChevronRight,
    Activity,
    Target,
    ArrowUpRight,
    Search,
    Plus,
    Hotel,
    Coffee,
    Fuel
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LODGING_DATA = [
  {
    name: 'Grand Horizon Resort',
    address: '122 East Harbor Dr.',
    phone: '(555) 123-4567',
    distance: '1.2 miles',
    status: 'Available',
    capacity: '44 rooms',
    type: 'Luxury / Emergency Approved',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&h=250&auto=format&fit=crop'
  },
  {
    name: 'SafeStay Emergency Shelter',
    address: '400 Community Ave.',
    phone: '(555) 987-6543',
    distance: '2.5 miles',
    status: 'Limited',
    capacity: '12 cots',
    type: 'Red Cross Shelter',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&h=250&auto=format&fit=crop'
  },
  {
    name: 'Oasis Inn & Suites',
    address: '89 West Boulevard',
    phone: '(555) 456-7890',
    distance: '3.8 miles',
    status: 'Full',
    capacity: '0 rooms',
    type: 'Corporate / Essential',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=400&h=250&auto=format&fit=crop'
  }
]

export default function LodgingPage() {
  return (
    <main className="min-h-screen bg-[#0A0B10] p-8 lg:p-12 space-y-12 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20">
                    <Bed size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Lodging Matrix</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Shelter Availability & Logistics Monitoring</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Capacity</p>
                <p className="text-xl font-black text-white tracking-tight">562 <span className="text-[10px] text-slate-500 uppercase">Slots</span></p>
            </div>
            <div className="bg-emerald-600/10 px-6 py-3 rounded-2xl border border-emerald-500/20 text-center">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Live Available</p>
                <p className="text-xl font-black text-emerald-500 tracking-tight">128</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {LODGING_DATA.map((item, idx) => (
              <Card key={idx} className="group bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] overflow-hidden shadow-2xl hover:bg-white/[0.02] transition-all flex flex-col">
                  <div className="relative h-64 w-full">
                      <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent" />
                      <div className="absolute top-6 right-6">
                          <Badge className={cn(
                              "border-none py-1.5 px-4 font-black uppercase text-[9px] tracking-widest rounded-lg shadow-2xl",
                              item.status === 'Available' ? "bg-emerald-600 text-white" : 
                              item.status === 'Limited' ? "bg-amber-600 text-white" : 
                              "bg-rose-600 text-white"
                          )}>
                              {item.status}
                          </Badge>
                      </div>
                      <div className="absolute bottom-6 left-8 right-8">
                          <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                                <MapPin size={12} className="text-blue-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.address} • {item.distance}</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-8 space-y-8 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Operational Line</p>
                              <p className="text-[11px] font-black text-white uppercase tracking-tight">{item.phone}</p>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Load</p>
                              <p className={cn(
                                  "text-[11px] font-black uppercase tracking-tight",
                                  item.status === 'Full' ? 'text-rose-500' : 'text-white'
                              )}>{item.capacity}</p>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 py-4 border-y border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                              <Info size={18} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 leading-tight italic">{item.type}</span>
                      </div>

                      <div className="pt-4 mt-auto">
                          <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all gap-3">
                               Confirm Details <ChevronRight size={16} />
                          </Button>
                      </div>
                  </div>
              </Card>
          ))}
      </div>

      {/* Support Resources Section */}
      <section className="bg-indigo-900/20 rounded-[64px] border border-indigo-500/20 p-12 lg:p-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 text-indigo-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Coffee size={280} />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                  <Badge className="bg-indigo-600/30 text-indigo-400 border-none text-[10px] uppercase font-black tracking-[0.2em] px-4 py-2 rounded-full">Essential Logistics</Badge>
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Humanitarian Support Feed</h2>
                  <p className="text-xl font-medium text-slate-400 leading-relaxed max-w-2xl italic">
                      Coordinated LDS and Red Cross distribution hubs are active across all secure quadrants. Verify map coordinates for real-time supply node status.
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-end">
                  <Button className="h-16 px-10 rounded-[28px] bg-white text-indigo-900 font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all shadow-2xl">
                       Identify Feed Nodes
                  </Button>
                  <Button className="h-16 px-10 rounded-[28px] bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/20">
                       Hydration Stations
                  </Button>
              </div>
          </div>
      </section>
    </main>
  )
}
