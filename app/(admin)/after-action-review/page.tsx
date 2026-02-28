'use client'

import { Card } from '@/components/ui/card'
import { Flame, Layers, Clock, Columns } from 'lucide-react'

const INCIDENT_DATA = {
  name: 'Tornado Warning 04/23',
  type: 'Tornado',
  duration: '14:10 – 15:45',
  insights: 12,
  events: [
    { id: 1, time: '08:15 AM', type: 'Alert Issued', title: 'Initial Fire Alert Detected', description: 'Automated system detected smoke and heat signatures in Sector 7-B. Emergency protocols activated.', color: 'red' },
    { id: 2, time: '08:22 AM', type: 'Responder Action', title: 'Fire Unit 3 Dispatched', description: 'Primary response team deployed with 12 personnel and 2 engines. ETA: 7 minutes.', color: 'blue' },
    { id: 3, time: '08:26 AM', type: 'Citizen Report', title: 'Multiple 911 Calls Received', description: '47 citizen reports confirming fire spread. Evacuation requests from residential areas.', color: 'green' },
    { id: 4, time: '08:35 AM', type: 'Responder Action', title: 'Evacuation Order Issued', description: 'Mandatory evacuation for 2.3 mile radius. Shelter locations broadcast via emergency alert system.', color: 'blue' },
    { id: 5, time: '09:12 AM', type: 'System Update', title: 'Resource Allocation Updated', description: 'AI system reallocated 3 additional units based on wind pattern analysis and spread prediction.', color: 'purple' },
    { id: 6, time: '11:45 AM', type: 'Responder Action', title: 'Aerial Support Deployed', description: '2 helicopters with water drops initiated. Ground crews report 40% containment achieved.', color: 'blue' },
    { id: 7, time: '10:47 PM', type: 'Citizen Report', title: 'Incident Contained - All Clear', description: '100% containment confirmed. Residents cleared to return. Post-incident assessment initiated.', color: 'green' },
  ],
  aiInsights: [
    { id: '001', category: 'Response Time', description: 'Fire Ops delayed 5 min', time: '14:45', status: 'Pending' },
    { id: '002', category: 'Resource Allocation', description: 'Additional medical team recommended', time: '14:42', status: 'Addressed' },
  ]
}

export default function AfterActionReviewPage() {
  return (
    <main className="p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen">
      {/* Header Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden p-6 md:px-8 md:py-7">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">After Action Review (AAR)</h1>
        <p className="text-slate-600 text-[15px]">Analyze incident response performance, review AI-generated insights, and monitor task execution timelines.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card className="p-5 border border-slate-200 shadow-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-blue-50 text-blue-500">
            <Flame className="w-5 h-5" />
          </div>
          <p className="text-[13px] text-slate-500 mb-1">Incident Name</p>
          <p className="text-lg font-bold text-slate-900">{INCIDENT_DATA.name}</p>
        </Card>

        {/* Card 2 */}
        <Card className="p-5 border border-slate-200 shadow-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-orange-50 text-orange-500">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-[13px] text-slate-500 mb-1">Incident Type</p>
          <p className="text-lg font-bold text-slate-900">{INCIDENT_DATA.type}</p>
        </Card>

        {/* Card 3 */}
        <Card className="p-5 border border-slate-200 shadow-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-purple-50 text-purple-600">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[13px] text-slate-500 mb-1">Duration</p>
          <p className="text-lg font-bold text-slate-900">{INCIDENT_DATA.duration}</p>
        </Card>

        {/* Card 4 */}
        <Card className="p-5 border border-slate-200 shadow-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-emerald-50 text-emerald-600">
            <Columns className="w-5 h-5" />
          </div>
          <p className="text-[13px] text-slate-500 mb-1">Total AI Insights Generated</p>
          <p className="text-lg font-bold text-slate-900">{INCIDENT_DATA.insights}</p>
        </Card>
      </div>

      {/* Timeline Section */}
      <Card className="p-6 md:p-8 border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Event Timeline</h2>
            <p className="text-[14px] text-slate-500">Chronological view of all incident events</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span>Alert Issued</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span>Responder Action</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span>Citizen Report</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
              <span>System Update</span>
            </div>
          </div>
        </div>

        <div className="relative border-l border-slate-200 ml-4 space-y-8 pb-4">
          {INCIDENT_DATA.events.map((event) => {
            const badgeColors: Record<string, string> = {
              red: 'bg-red-50 text-red-600',
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-emerald-50 text-emerald-600',
              purple: 'bg-purple-50 text-purple-600'
            };
            const dotColors: Record<string, string> = {
              red: 'bg-red-500 ring-red-50',
              blue: 'bg-blue-500 ring-blue-50',
              green: 'bg-emerald-500 ring-emerald-50',
              purple: 'bg-purple-500 ring-purple-50'
            };
            return (
              <div key={event.id} className="relative pl-8">
                <div className={`absolute -left-[4.5px] top-1 w-2 h-2 rounded-full ring-[3px] ${dotColors[event.color]}`}></div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[12px] font-bold text-slate-900">{event.time}</span>
                  <span className={`px-2 py-[2px] rounded text-[10px] font-bold tracking-wide flex items-center ${badgeColors[event.color]}`}>
                    {event.type}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">{event.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed max-w-3xl">{event.description}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Table Section */}
      <Card className="p-6 md:p-8 border border-slate-200 shadow-sm rounded-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-6">AI Insights from Incident Data</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-[14px] font-bold text-slate-900 w-24">Insight ID</th>
                <th className="pb-3 text-[14px] font-bold text-slate-900">Category</th>
                <th className="pb-3 text-[14px] font-bold text-slate-900">Description</th>
                <th className="pb-3 text-[14px] font-bold text-slate-900">Timestamp</th>
                <th className="pb-3 text-[14px] font-bold text-slate-900 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {INCIDENT_DATA.aiInsights.map((insight, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-[14px] text-slate-600">{insight.id}</td>
                  <td className="py-4 text-[14px] text-slate-900">{insight.category}</td>
                  <td className="py-4 text-[14px] text-slate-600">{insight.description}</td>
                  <td className="py-4 text-[14px] text-slate-600">{insight.time}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold
                      ${insight.status === 'Pending' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {insight.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}

