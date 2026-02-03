import { Card } from '@/components/ui/card'
import { AlertTriangle, Radio, Users, Activity } from 'lucide-react'

export function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Active Emergencies */}
      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Active Emergencies</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-500">02</span>
              <span className="text-xs text-muted-foreground">Active Events</span>
            </div>
          </div>
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Tornado Warning - Zone A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Flash Flood - East District</span>
          </div>
        </div>
      </Card>

      {/* Emergencies */}
      <Card className="p-6 border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Emergencies</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-500">18</span>
              <span className="text-xs text-muted-foreground">Alerts Sent</span>
            </div>
          </div>
          <Radio className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground">
          Preparedness, Action Alerts, Resource Updates
        </p>
      </Card>

      {/* Ready2Go Users Impacted */}
      <Card className="p-6 border-l-4 border-l-yellow-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Ready2Go Users</p>
            <p className="text-sm text-muted-foreground mb-2">Impacted</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-yellow-600">12,457</span>
            </div>
          </div>
          <Users className="w-5 h-5 text-yellow-600" />
        </div>
        <p className="text-xs text-muted-foreground">Citizens in affected zones</p>
      </Card>

      {/* Virtual EOC Status */}
      <Card className="p-6 border-l-4 border-l-green-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Virtual EOC Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-green-600">Inactive</span>
            </div>
          </div>
          <Activity className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-xs text-muted-foreground">
          Virtual EOC is only activated for major and catastrophic events.
        </p>
      </Card>
    </div>
  )
}
