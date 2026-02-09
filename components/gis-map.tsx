import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { GoogleMap } from '@/components/google-map'

export function GISMap() {
  return (
    <Card className="p-6 border border-slate-200 shadow-sm bg-white rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Emergency Impact Map
        </h2>
        <Badge className="bg-slate-100 text-slate-600 border-0 font-bold px-3 py-1">GOOGLE MAPS ACTIVE</Badge>
      </div>

      <Tabs defaultValue="citizens" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 mb-4 rounded-lg">
          <TabsTrigger value="hazards" className="font-bold text-xs uppercase tracking-tighter">Live Hazards</TabsTrigger>
          <TabsTrigger value="citizens" className="font-bold text-xs uppercase tracking-tighter">Citizen Check-ins</TabsTrigger>
          <TabsTrigger value="infrastructure" className="font-bold text-xs uppercase tracking-tighter">Infrastructure</TabsTrigger>
        </TabsList>

        <div className="relative aspect-video">
          <GoogleMap address="San Francisco, CA" />

          {/* Legend Overlay */}
          <div className="absolute bottom-12 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md z-10">
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Map Legend</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-medium">Earthquake Epicenter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-medium">Safe Zone</span>
              </div>
            </div>
          </div>
        </div>

        <TabsContent value="hazards" className="mt-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
            <h4 className="font-bold text-xs text-slate-900 uppercase mb-2">Quake Intensity Layer</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Displaying raw ground shaking data from USGS feeds. Heatmap shows magnitude distribution across the city sectors.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="citizens" className="mt-4">
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
            <h4 className="font-bold text-xs text-green-900 uppercase mb-2">Safety Check-in Status</h4>
            <p className="text-sm text-green-800 leading-relaxed">
              Green markers indicate verified safe citizens. Red markers show pending assistance requests. Data updated via live user check-ins.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="mt-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h4 className="font-bold text-xs text-blue-900 uppercase mb-2">Critical Assets Status</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Real-time monitoring of hospitals, power grids, and water supply stations. Click on icons to view detailed status reports.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
