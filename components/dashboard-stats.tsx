'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Radio, Users, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Emergencies (Red) */}
      <Card className="p-5 border-l-[3px] border-l-[#1E1B4B] bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Active Emergencies</h3>
          <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-bold text-[#EF4444] leading-none">02</span>
          <span className="text-sm font-medium text-slate-500">Active Events</span>
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Tornado Warning - Zone A
          </li>
          <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Flash Flood - East District
          </li>
        </ul>
      </Card>

      {/* Emergencies (Blue) */}
      <Card className="p-5 border-l-[3px] border-l-[#1E1B4B] bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Emergencies</h3>
          <Radio className="w-5 h-5 text-[#3B82F6]" />
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-bold text-[#3B82F6] leading-none">18</span>
          <span className="text-sm font-medium text-slate-500">Alerts Sent</span>
        </div>
        <p className="text-sm font-medium text-slate-500 leading-snug">
          Preparedness, Action Alerts,<br />Resource Updates
        </p>
      </Card>

      {/* Ready2Go Users Impacted (Yellow) */}
      <Card className="p-5 border-l-[3px] border-l-[#1E1B4B] bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
            Ready2Go Users<br />Impacted
          </h3>
          <Users className="w-5 h-5 text-[#EAB308]" />
        </div>
        <div className="mb-4">
          <span className="text-5xl font-bold text-[#EAB308] leading-none">12,457</span>
        </div>
        <p className="text-sm font-medium text-slate-500">
          Citizens in affected zones
        </p>
      </Card>

      {/* Virtual EOC Status (Green) */}
      <Card className="p-5 border-l-[3px] border-l-[#1E1B4B] bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
            Virtual EOC Status
          </h3>
          <Settings className="w-5 h-5 text-[#22C55E]" />
        </div>
        <div className="mb-4">
          <Badge variant="outline" className="bg-[#DCFCE7] text-[#15803D] border-none px-3 py-1 flex items-center gap-2 w-fit font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            Inactive
          </Badge>
        </div>
        <p className="text-sm font-medium text-slate-500 leading-snug">
          Virtual EOC is only activated for major and catastrophic events.
        </p>
      </Card>
    </div>
  )
}
