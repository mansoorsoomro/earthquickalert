'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Building2, 
  Map, 
  Home, 
  FileBarChart,
  CloudLightning,
  Navigation,
  ShieldAlert,
  Eye,
  Wind,
  Plus,
  Hotel,
  Coffee,
  Fuel,
  Heart,
  Zap,
  Users,
  AlertCircle,
  Stethoscope,
  Briefcase,
  UserCheck,
  Search,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import Image from 'next/image'

export default function VirtualEOCDashboard() {
  const [userName, setUserName] = React.useState('User Name')
  const [userEmail, setUserEmail] = React.useState('email@gmail.com')

  React.useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'User Name')
    setUserEmail(localStorage.getItem('userEmail') || 'email@gmail.com')
  }, [])

  return (
    <div className="flex-1 overflow-auto bg-white min-h-screen">
      
      {/* Main Content */}
      <main className="p-8 space-y-12 max-w-[1600px] mx-auto">
        
        {/* I. Virtual EOC Hero Banner */}
        <section className="relative rounded-[24px] overflow-hidden h-[240px] flex flex-col justify-center p-12 text-white shadow-2xl shadow-indigo-900/10 group">
          <div className="absolute inset-0 z-0">
             <Image 
                src="/Users/maria/.gemini/antigravity/brain/49071f9b-62e6-4ab3-a06a-afc26564e3d7/eoc_hero_clouds_1775152615062.png"
                alt="Stormy Clouds"
                fill
                className="object-cover brightness-75 transition-transform duration-[10s] ease-linear group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-slate-900/40" />
          </div>

          <div className="relative z-10 space-y-2">
            <h1 className="text-5xl font-black tracking-tight drop-shadow-lg">Virtual Emergency Operations Center</h1>
            <p className="text-xl text-white/90 font-medium max-w-2xl">Critical life-safety information and resources for your area — updated in real time</p>
          </div>

          <div className="absolute bottom-8 right-12 z-20 flex items-center gap-6">
            <Badge className="bg-emerald-500 text-white font-black tracking-widest text-[10px] py-2 px-6 rounded-full flex items-center gap-2 border-none shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                ACTIVE
            </Badge>
            <div className="text-right">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Last Updated</p>
                <p className="text-xs font-black text-white">12:45 PM EST</p>
            </div>
          </div>
        </section>

        {/* II. Hurricane Alert Banner (Section 2) */}
        <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex">
                <div className="w-1.5 bg-rose-600" />
                <div className="p-8 flex-1 space-y-8">
                    <div>
                        <h2 className="text-[26px] font-black text-slate-900 tracking-tight">Hurricane Erin - Category 3</h2>
                        <p className="text-[15px] font-medium text-slate-500 mt-2 leading-relaxed">
                            Major hurricane approaching coastal areas. Immediate evacuation required for zones A, B, and C. Sustained winds of 115 mph with dangerous storm surge expected.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <IncidentTile icon={<Navigation size={20} />} title="Evacuate" sub="Zones A, B, C" color="bg-rose-50 text-rose-500" />
                        <IncidentTile icon={<Home size={20} />} title="Shelter-in-Place" sub="Zone 3" color="bg-orange-50 text-orange-500" />
                        <IncidentTile icon={<ShieldAlert size={20} />} title="Avoid Travel" sub="All Roads" color="bg-amber-50 text-amber-500" />
                        <IncidentTile icon={<CloudLightning size={20} />} title="Weather Alert" sub="Active" color="bg-purple-50 text-purple-500" />
                    </div>
                </div>
            </div>
        </section>

        {/* III. Main Tactical Grid (Section 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Life-Safety Grid */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                     <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Life-Safety Action Buttons</h3>
                     <p className="text-[13px] text-slate-400 font-medium tracking-tight">Use these quick actions to stay safe during severe weather events.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TacticalButton icon={<Phone size={24} className="text-rose-600" />} title="911 Speed Dial" sub="Direct connection to local 911" />
                    <TacticalButton icon={<Building2 size={24} className="text-blue-600" />} title="Hospital Locator" sub="Nearest medical facilities" />
                    <TacticalButton icon={<Navigation size={24} className="text-emerald-600" />} title="Evacuation Routes" sub="GPS navigation to safety" />
                    <TacticalButton icon={<Map size={24} className="text-purple-600" />} title="Shelter Locations" sub="Safe shelter sites nearby" />
                    <TacticalButton icon={<FileBarChart size={24} className="text-amber-500" />} title="Report Conditions" sub="Share updates" />
                </div>

                {/* IV. Activated Emergency Resources (Section 4) */}
                <div className="space-y-6 pt-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight px-2">Activated Emergency Resources</h3>
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <ResourceItem icon={<UserCheck className="text-blue-500" />} label="Pop-up Medical Clinics" count="3 locations" />
                        <ResourceItem icon={<Briefcase className="text-amber-500" />} label="Private and Non-Profit Sector" count="4 locations" />
                        <ResourceItem icon={<Stethoscope className="text-emerald-500" />} label="FEMA Assistance Booths" count="2 locations" />
                        <ResourceItem icon={<Heart className="text-rose-500" />} label="Red Cross Stations" count="5 locations" />
                        <ResourceItem icon={<Users className="text-purple-500" />} label="Family Reunification" count="1 location" />
                    </div>
                </div>
            </div>

            {/* Weather & Traffic Widget */}
            <div className="lg:col-span-1">
                <div className="bg-[#1e293b] text-white rounded-[32px] p-8 space-y-10 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Real-Time Weather & Traffic</h3>
                    
                    <div className="space-y-2">
                        <h4 className="text-[72px] font-black leading-none tracking-tighter">72°F</h4>
                        <p className="text-[17px] font-black text-slate-400 uppercase tracking-widest ml-1">Partly Cloudy</p>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-200">Active Alerts</h5>
                            <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black text-[9px] uppercase tracking-tighter px-2 rounded-full">CRITICAL</Badge>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/5 space-y-4">
                            <ul className="space-y-5 text-[13px] font-bold text-slate-200">
                                <li className="flex gap-4 leading-relaxed">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                    I-95 South: Closed due to flooding
                                </li>
                                <li className="flex gap-4 leading-relaxed">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                    Downtown: High wind zone - avoid tall buildings
                                </li>
                                <li className="flex gap-4 leading-relaxed">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                    Storm surge @ 12 feet above normal
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/95 rounded-2xl p-5 text-center space-y-2 cursor-pointer hover:bg-white transition-all shadow-lg">
                            <Eye className="w-6 h-6 text-blue-500 mx-auto" />
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Visibility</p>
                            <p className="text-sm font-black text-slate-900 tracking-tight italic">0.5 miles</p>
                        </div>
                        <div className="bg-white/95 rounded-2xl p-5 text-center space-y-2 cursor-pointer hover:bg-white transition-all shadow-lg">
                            <Wind className="w-6 h-6 text-slate-500 mx-auto" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Wind Speed</p>
                            <p className="text-sm font-black text-slate-900 tracking-tight italic">115 mph</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* V. Lodging & Essential Resources (Section 5) */}
        <section className="bg-white rounded-[32px] border border-slate-100 p-10 space-y-12 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic px-2">Lodging & Essential Resources</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-2">
                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <Hotel className="w-5 h-5 text-slate-400" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Available Hotels</h4>
                    </div>
                    <div className="space-y-5">
                        <LogEntry label="Hampton Inn Downtown" status="Available" statusColor="text-emerald-500" />
                        <LogEntry label="Holiday Inn Express" status="Limited" statusColor="text-amber-500" />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <Coffee className="w-5 h-5 text-slate-400" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Food & Essentials</h4>
                    </div>
                    <div className="space-y-5">
                        <LogEntry label="Community Food Pantry" status="Open" statusColor="text-emerald-500" />
                        <LogEntry label="Walmart Supercenter" status="Open" statusColor="text-emerald-500" />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <Fuel className="w-5 h-5 text-slate-400" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Gas Stations</h4>
                    </div>
                    <div className="space-y-5">
                        <LogEntry label="Shell Station (Main St)" status="Fuel Available" statusColor="text-emerald-500" />
                        <LogEntry label="BP Gas (Highway 101)" status="No Fuel" statusColor="text-rose-500" />
                    </div>
                </div>
            </div>
        </section>

        {/* VI. Recovery Resources (Section 6) */}
        <section className="bg-white rounded-[32px] border border-slate-100 p-10 space-y-4 shadow-sm pb-16">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic px-2">Recovery Resources (Post-Disaster)</h3>
            <p className="text-[13px] text-slate-400 font-medium px-2 mb-10">This section will be activated once the area is declared safe for re-entry.</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <RecoveryButton icon={<Zap size={18} />} title="Donation Centers" color="bg-[#8b5cf6]" />
                <RecoveryButton icon={<RefreshCw size={18} />} title="Pharmacy Status" color="bg-[#3b82f6]" />
                <RecoveryButton icon={<Users size={18} />} title="View All Events" color="bg-[#1e293b]" />
                <RecoveryButton icon={<AlertCircle size={18} />} title="FEMA Assistance" color="bg-[#e11d48]" />
                <RecoveryButton icon={<Plus size={18} />} title="Relief Funding" color="bg-[#10b981]" />
            </div>
        </section>

      </main>
    </div>
  )
}

function IncidentTile({ icon, title, sub, color }: { icon: any, title: string, sub: string, color: string }) {
    return (
        <div className="p-6 bg-slate-50/50 rounded-2xl text-center space-y-4 hover:shadow-lg hover:bg-white cursor-pointer transition-all border border-slate-100 group">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h4>
                <p className="text-[11px] font-bold text-slate-400 mt-1">{sub}</p>
            </div>
        </div>
    )
}

function TacticalButton({ icon, title, sub }: { icon: any, title: string, sub: string }) {
    return (
        <div className="p-6 bg-white border border-slate-100 rounded-[28px] flex items-center gap-6 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                {icon}
            </div>
            <div>
                <h4 className="text-[17px] font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors uppercase italic">{title}</h4>
                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wide">{sub}</p>
            </div>
        </div>
    )
}

function ResourceItem({ icon, label, count }: { icon: any, label: string, count: string }) {
    return (
        <div className="flex items-center justify-between p-6 px-10 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    {React.cloneElement(icon as any, { size: 18 })}
                </div>
                <span className="text-[14px] font-black text-slate-700 uppercase tracking-tight italic">{label}</span>
            </div>
            <span className="text-[12px] font-black text-blue-500 uppercase tracking-widest italic">{count}</span>
        </div>
    )
}

function LogEntry({ label, status, statusColor }: { label: string, status: string, statusColor: string }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-[14px] font-bold text-slate-500 tracking-tight group-hover:text-slate-900 transition-colors uppercase italic">{label}</span>
            <span className={`text-[10px] font-black ${statusColor} uppercase tracking-widest italic`}>{status}</span>
        </div>
    )
}

function RecoveryButton({ icon, title, color }: { icon: any, title: string, color: string }) {
    return (
        <button className={cn(
            "flex items-center justify-center gap-3 py-4 px-4 rounded-[18px] text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95 italic",
            color
        )}>
            {icon}
            {title}
        </button>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
