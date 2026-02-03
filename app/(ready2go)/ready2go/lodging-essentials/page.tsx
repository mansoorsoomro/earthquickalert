'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Utensils, Fuel, MapPin, Phone, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const lodgingData = [
    { name: 'Home 2 Suites, Newark', status: 'Available', type: 'Hotel', distance: '1.2 mi', address: '123 Airport Rd', phone: '(555) 012-3456' },
    { name: 'Holiday Inn Express', status: 'Limited', type: 'Hotel', distance: '2.5 mi', address: '456 Business Way', phone: '(555) 012-7890' },
    { name: 'Red Roof Inn', status: 'Full', type: 'Motel', distance: '4.1 mi', address: '789 Highway Dr', phone: '(555) 012-2222' },
]

const essentialData = [
    { name: 'Community Food Pantry', status: 'Open', type: 'Food', distance: '0.8 mi', hours: '8 AM - 8 PM' },
    { name: 'SafeWay Supermarket', status: 'Open', type: 'Grocery', distance: '1.5 mi', hours: '24 Hours' },
    { name: 'Shell Gas (Main St)', status: 'Fuel Available', type: 'Gas', distance: '0.5 mi', note: 'Regular Only' },
    { name: 'BP Gas (HWY 101)', status: 'No Fuel', type: 'Gas', distance: '3.2 mi', note: 'Store Open' },
]

export default function LodgingEssentials() {
    return (
        <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-[#34385E] mb-2 tracking-tight">Lodging & Essentials</h1>
                    <p className="text-slate-500 font-medium italic">Verified resources and live availability for your safety.</p>
                </div>
                <div className="flex gap-2 text-xs font-bold text-slate-400">
                    <span>Updated: 12:50 PM</span>
                    <span>•</span>
                    <span className="text-green-500">Live Status Active</span>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Lodging Section */}
                <div className="col-span-12 lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3 mb-2 px-1">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Home className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Verified Lodging</h2>
                    </div>

                    <div className="space-y-4">
                        {lodgingData.map((item, i) => (
                            <Card key={i} className="p-6 hover:shadow-md transition-all border-slate-200 rounded-2xl">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{item.name}</h3>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase tracking-wider">{item.type}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1 flex-wrap"><MapPin className="w-3 h-3" /> {item.address} ({item.distance})</span>
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {item.phone}</span>
                                        </div>
                                    </div>
                                    <div className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight border", {
                                        'bg-green-50 text-green-600 border-green-200': item.status === 'Available',
                                        'bg-amber-50 text-amber-600 border-amber-200': item.status === 'Limited',
                                        'bg-red-50 text-red-600 border-red-200': item.status === 'Full',
                                    })}>
                                        {item.status}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <Button className="h-9 px-4 text-xs font-bold bg-[#34385E] hover:bg-[#2A2D4A] rounded-xl flex-1">Book Room</Button>
                                    <Button variant="outline" className="h-9 w-9 p-0 border-slate-200 rounded-xl">
                                        <ExternalLink className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Essentials Section */}
                <div className="col-span-12 lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3 mb-2 px-1">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                            <Utensils className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Food & Fuel</h2>
                    </div>

                    <Card className="p-0 overflow-hidden border-slate-200 rounded-2xl shadow-sm">
                        <div className="divide-y divide-slate-100">
                            {essentialData.map((item, i) => (
                                <div key={i} className="p-5 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded", {
                                            'text-green-600 bg-green-50': item.status.includes('Available') || item.status === 'Open',
                                            'text-red-600 bg-red-50': item.status === 'No Fuel',
                                        })}>{item.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{item.type} • {item.distance}</p>
                                        <p className="text-[11px] text-slate-500 font-medium">{item.hours || item.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <Button variant="ghost" className="w-full text-xs font-black text-[#34385E] hover:bg-white transition-all uppercase tracking-widest">View Map View</Button>
                        </div>
                    </Card>

                    {/* Need Assistance Card */}
                    <Card className="p-6 bg-[#34385E] text-white border-0 rounded-2xl mt-8">
                        <h3 className="font-bold mb-2">Need Direct Assistance?</h3>
                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">If you cannot find available lodging or supplies, contact our dispatch team immediately.</p>
                        <Button className="w-full bg-[#EAB308] hover:bg-yellow-500 text-[#34385E] font-bold rounded-xl py-6">
                            Call Resource Hotline
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
