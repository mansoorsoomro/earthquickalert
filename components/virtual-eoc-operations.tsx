import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Activity, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VirtualEOCOperationsProps {
  onOpenSitRep?: () => void
}

export function VirtualEOCOperations({ onOpenSitRep }: VirtualEOCOperationsProps) {
  const insights = [
    'Potential escalation if rainfall continues',
    'Hospital bed capacity nearing threshold',
    'Power grid risk in Zone C',
  ]

  const activities = [
    {
      name: 'Data ingestion',
      status: 'Running',
      color: 'bg-green-500',
    },
    {
      name: 'Interagency comms',
      status: 'Active',
      color: 'bg-green-500',
    },
    {
      name: 'Community messages',
      status: 'Open',
      color: 'bg-green-500',
    },
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Virtual EOC Operations</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-bold uppercase tracking-wider h-8 border-2 border-slate-200"
          onClick={onOpenSitRep}
        >
          <FileText className="w-3 h-3 mr-2" />
          View Live Situation Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-sm mb-4 text-slate-500 uppercase tracking-widest text-[10px]">AI-Generated Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-white transition-all cursor-pointer group">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-4 text-slate-500 uppercase tracking-widest text-[10px]">Backend Activity</h3>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Activity className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{activity.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400">{activity.status}</span>
                  <div className={`w-2 h-2 rounded-full ${activity.color} animate-pulse`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
