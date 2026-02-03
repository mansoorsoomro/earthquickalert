import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PostEventRecoveryProps {
  onOpenDamageReports?: () => void
}

export function PostEventRecovery({ onOpenDamageReports }: PostEventRecoveryProps) {
  const tasks = [
    {
      title: 'Collect Damage Reports',
      status: 'pending',
      count: '42 pending',
    },
    {
      title: 'Activate FEMA Resource Links',
      status: 'ready',
      count: 'Ready',
    },
    {
      title: 'Update Status Notifications',
      status: 'in-progress',
      count: 'In Progress',
    },
    {
      title: 'Prepare After-Action Summary',
      status: 'scheduled',
      count: 'Scheduled',
    },
  ]

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'ready':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Post-Event & Recovery Tasks</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-bold uppercase tracking-wider h-8 border-2 border-slate-200"
          onClick={onOpenDamageReports}
        >
          View All Reports
          <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-4 text-slate-500 uppercase tracking-widest text-[10px]">Pending Items</h3>
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="font-bold text-sm text-slate-700">{task.title}</span>
              </div>
              <Badge className={`${getBadgeColor(task.status)} border-0 px-3 py-1 rounded-lg text-[10px] font-black uppercase`} variant="outline">
                {task.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
