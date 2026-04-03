'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bed, MapPin, Phone, Info, Star, ChevronRight } from 'lucide-react'
import Image from 'next/image'

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
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Bed size={20} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Lodging & Essentials</h1>
            </div>
            <p className="text-slate-500 font-medium">Real-time room availability and emergency shelter tracking for the affected region.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Capacity</p>
                <p className="text-xl font-black text-slate-900">562 <span className="text-sm text-slate-400">Slots</span></p>
            </div>
            <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Available</p>
                <p className="text-xl font-black text-emerald-700">128</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {LODGING_DATA.map((item, idx) => (
                <Card key={idx} className="group overflow-hidden rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all border-none">
                    <div className="relative h-48 w-full">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 right-4">
                            <Badge className={item.status === 'Available' ? "bg-emerald-500" : item.status === 'Limited' ? "bg-amber-500" : "bg-rose-500"}>
                                {item.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{item.name}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                                <MapPin size={12} /> {item.address} • {item.distance}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Contact</p>
                                <p className="text-xs font-bold text-slate-700">{item.phone}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current</p>
                                <p className={`text-xs font-black ${item.status === 'Full' ? 'text-rose-600' : 'text-slate-900'}`}>{item.capacity}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Info size={14} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.type}</span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>

        {/* Support Resources */}
        <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <Badge className="bg-white/20 text-white border-none text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full">Essential Supplies</Badge>
                    <h2 className="text-3xl font-black tracking-tight leading-none uppercase">Need water or food assistance?</h2>
                    <p className="text-indigo-100/80 font-medium">LDS and Red Cross distribution centers are now active across all safe zones. Check your map for the nearest pickup point.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button className="bg-white text-indigo-900 font-black uppercase text-[11px] tracking-widest px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl">
                        Find Food Banks
                    </button>
                    <button className="bg-emerald-500 text-white font-black uppercase text-[11px] tracking-widest px-8 py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl">
                        Water Stations
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
