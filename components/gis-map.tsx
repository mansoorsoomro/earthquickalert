import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

export function GISMap() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">GIS Impact Map</h2>

      <Tabs defaultValue="citizens" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted mb-4">
          <TabsTrigger value="citizens">Citizens</TabsTrigger>
          <TabsTrigger value="responders">Responders</TabsTrigger>
          <TabsTrigger value="leaders">City Leaders</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <div className="relative bg-blue-50 rounded-lg overflow-hidden aspect-video flex items-center justify-center border border-border">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
            <Image
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=600&fit=crop"
              alt="GIS Impact Map showing emergency response zones"
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        <TabsContent value="citizens" className="mt-4">
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Citizen View:</strong> Displays real-time emergency impact zones, evacuation routes, and community hotspots. Yellow markers indicate high-risk areas.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="responders" className="mt-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Responder View:</strong> Real-time tracking of active personnel, apparatus locations, and closed/restricted routes. Green markers show resource stations.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="leaders" className="mt-4">
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
            <p className="text-sm text-purple-900">
              <strong>City Leaders View:</strong> High-level overview of resource allocation efficiency, casualty numbers, and multi-agency coordination status.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="mt-4">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
            <p className="text-sm text-orange-900">
              <strong>Infrastructure View:</strong> Status monitoring of power grids, water systems, and critical communication towers across the impacted zones.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
