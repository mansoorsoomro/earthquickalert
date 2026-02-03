import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

export function ThreatDetection() {
  const inputs = [
    { label: 'NWS Severe Weather Alerts', active: true },
    { label: 'News Incident Reports', active: true },
    { label: 'Government Emergency Declarations', active: true },
    { label: 'Social Media Signals', active: true },
    { label: 'Citizen Submitted Reports', active: true },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-6">Threat Detection & Monitoring</h2>

      {/* Live Inputs */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Live Inputs</h3>
        <div className="space-y-2">
          {inputs.map((input) => (
            <div key={input.label} className="flex items-center gap-2">
              {input.active ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-muted-foreground flex-shrink-0"></div>
              )}
              <span className="text-sm text-foreground">{input.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        {/* AI Assessment */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-3">AI Assessment</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Geo-relevance</p>
              <p className="font-semibold text-sm">High</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Severity Level</p>
              <Badge className="bg-blue-500 text-white">Intermediate Event</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Affected Areas</p>
              <p className="font-semibold text-sm">Zone A, Zone C</p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Confidence Score</p>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-11/12"></div>
          </div>
          <p className="text-sm font-semibold text-green-600 mt-1">92%</p>
        </div>
      </div>
    </Card>
  )
}
